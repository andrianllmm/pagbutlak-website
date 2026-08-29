import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, afterEach, expect } from 'vitest'

import { createTestAuthor, createTestUser, seedAdmin } from './helpers'

const emptyLexicalContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Test content',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '' as const,
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

let payload: Payload
let authorId: number

describe('Articles collection access control', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })

    const author = await createTestAuthor(payload, { name: 'Test Author', slug: 'test-author' })
    authorId = author.id
  }, 30000)

  afterAll(async () => {
    await payload.delete({
      collection: 'authors',
      id: authorId,
      context: { disableRevalidate: true },
    })
  })

  it('denies unauthenticated create', async () => {
    await expect(
      payload.create({
        collection: 'articles',
        data: {
          title: 'Unauthorized article',
          section: 'news',
          authors: [authorId],
        } as never,
        overrideAccess: false,
        user: null,
      }),
    ).rejects.toThrow()
  })

  it('hides drafts from unauthenticated reads', async () => {
    const draft = await payload.create({
      collection: 'articles',
      data: {
        title: 'Draft article',
        section: 'news',
        authors: [authorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      context: { disableRevalidate: true },
    })

    const result = await payload.find({
      collection: 'articles',
      where: { id: { equals: draft.id } },
      overrideAccess: false,
      user: null,
    })

    expect(result.docs).toHaveLength(0)

    await payload.delete({
      collection: 'articles',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })
})

describe('Articles publish workflow', () => {
  let seededAdminId: number | string
  let writer: Awaited<ReturnType<typeof payload.create>>
  let editor: Awaited<ReturnType<typeof payload.create>>
  let articleAuthorId: number

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Must resolve before the other creates - see seedAdmin's comment.
    const seededAdmin = await seedAdmin(payload, 'seed-admin-publish-spec@example.com')
    seededAdminId = seededAdmin.id

    const [author, writerUser, editorUser] = await Promise.all([
      createTestAuthor(payload, { name: 'Workflow Author', slug: 'workflow-author' }),
      createTestUser(payload, {
        name: 'Workflow Writer',
        email: 'workflow-writer@example.com',
        role: 'writer',
      }),
      createTestUser(payload, {
        name: 'Workflow Editor',
        email: 'workflow-editor@example.com',
        role: 'editor',
      }),
    ])
    articleAuthorId = author.id
    writer = writerUser
    editor = editorUser
  }, 30000)

  afterAll(async () => {
    await payload.delete({
      collection: 'authors',
      id: articleAuthorId,
      context: { disableRevalidate: true },
    })
    await payload.delete({ collection: 'users', id: seededAdminId, overrideAccess: true })
    await payload.delete({ collection: 'users', id: writer.id, overrideAccess: true })
    await payload.delete({ collection: 'users', id: editor.id, overrideAccess: true })
  })

  it('denies a writer publishing an article via direct update', async () => {
    const draft = await payload.create({
      collection: 'articles',
      data: {
        title: 'Writer Draft',
        section: 'news',
        authors: [articleAuthorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      // Owned by the writer so the ownership check passes and the publish
      // gate in preventUnauthorizedPublish is what actually denies this.
      user: writer as never,
      overrideAccess: false,
      context: { disableRevalidate: true },
    })

    await expect(
      payload.update({
        collection: 'articles',
        id: draft.id,
        data: { _status: 'published' },
        overrideAccess: false,
        user: writer as never,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow(/only editors and admins can publish/i)

    await payload.delete({
      collection: 'articles',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })

  it('allows an editor to publish an article via direct update', async () => {
    const draft = await payload.create({
      collection: 'articles',
      data: {
        title: 'Editor Draft',
        section: 'news',
        authors: [articleAuthorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const published = await payload.update({
      collection: 'articles',
      id: draft.id,
      data: { _status: 'published' },
      overrideAccess: false,
      user: editor as never,
      context: { disableRevalidate: true },
    })

    expect(published._status).toBe('published')

    await payload.delete({
      collection: 'articles',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })

  it('denies a writer from scheduling a publish job', async () => {
    const draft = await payload.create({
      collection: 'articles',
      data: {
        title: 'Writer Schedule Draft',
        section: 'news',
        authors: [articleAuthorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    await expect(
      payload.jobs.queue({
        task: 'schedulePublish',
        input: {
          type: 'publish',
          doc: { value: draft.id, relationTo: 'articles' },
          user: writer.id,
        },
      } as never),
    ).rejects.toThrow(/only editors and admins can schedule publishing/i)

    await payload.delete({
      collection: 'articles',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })

  it('allows an editor to schedule a publish job', async () => {
    const draft = await payload.create({
      collection: 'articles',
      data: {
        title: 'Editor Schedule Draft',
        section: 'news',
        authors: [articleAuthorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const job = await payload.jobs.queue({
      task: 'schedulePublish',
      input: {
        type: 'publish',
        doc: { value: draft.id, relationTo: 'articles' },
        user: editor.id,
      },
    } as never)

    expect(job).toBeTruthy()

    await payload.delete({
      collection: 'articles',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })
})

describe('Articles ownership-scoped access', () => {
  let seededAdminId: number | string
  let writerA: Awaited<ReturnType<typeof payload.create>>
  let writerB: Awaited<ReturnType<typeof payload.create>>
  let editor: Awaited<ReturnType<typeof payload.create>>
  let ownerAuthorId: number
  let writerAArticleId: number

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Must resolve before the other creates.
    const seededAdmin = await seedAdmin(payload, 'seed-admin-ownership-spec@example.com')
    seededAdminId = seededAdmin.id

    const [author, writerAUser, writerBUser, editorUser] = await Promise.all([
      createTestAuthor(payload, { name: 'Ownership Author', slug: 'ownership-author' }),
      createTestUser(payload, {
        name: 'Owner Writer A',
        email: 'owner-writer-a@example.com',
        role: 'writer',
      }),
      createTestUser(payload, {
        name: 'Owner Writer B',
        email: 'owner-writer-b@example.com',
        role: 'writer',
      }),
      createTestUser(payload, {
        name: 'Owner Editor',
        email: 'owner-editor@example.com',
        role: 'editor',
      }),
    ])
    ownerAuthorId = author.id
    writerA = writerAUser
    writerB = writerBUser
    editor = editorUser

    const article = await payload.create({
      collection: 'articles',
      data: {
        title: "Writer A's Article",
        section: 'news',
        authors: [ownerAuthorId],
        content: emptyLexicalContent,
        _status: 'draft',
      } as never,
      user: writerA as never,
      overrideAccess: false,
      context: { disableRevalidate: true },
    })
    writerAArticleId = article.id
  }, 30000)

  afterAll(async () => {
    await payload.delete({
      collection: 'articles',
      id: writerAArticleId,
      context: { disableRevalidate: true },
    })
    await payload.delete({
      collection: 'authors',
      id: ownerAuthorId,
      context: { disableRevalidate: true },
    })
    await payload.delete({ collection: 'users', id: seededAdminId, overrideAccess: true })
    await payload.delete({ collection: 'users', id: writerA.id, overrideAccess: true })
    await payload.delete({ collection: 'users', id: writerB.id, overrideAccess: true })
    await payload.delete({ collection: 'users', id: editor.id, overrideAccess: true })
  })

  afterEach(async () => {
    const stillExists = await payload
      .findByID({ collection: 'articles', id: writerAArticleId, overrideAccess: true })
      .catch(() => null)

    if (!stillExists) {
      const recreated = await payload.create({
        collection: 'articles',
        data: {
          title: "Writer A's Article",
          section: 'news',
          authors: [ownerAuthorId],
          content: emptyLexicalContent,
          _status: 'draft',
        } as never,
        user: writerA as never,
        overrideAccess: false,
        context: { disableRevalidate: true },
      })
      writerAArticleId = recreated.id
    }
  })

  it('allows the owning writer to update their own article', async () => {
    const updated = await payload.update({
      collection: 'articles',
      id: writerAArticleId,
      data: { title: 'Updated by Owner' },
      overrideAccess: false,
      user: writerA as never,
      context: { disableRevalidate: true },
    })

    expect(updated.title).toBe('Updated by Owner')
  })

  it("denies a different writer from updating another writer's article", async () => {
    await expect(
      payload.update({
        collection: 'articles',
        id: writerAArticleId,
        data: { title: 'Hijacked' },
        overrideAccess: false,
        user: writerB as never,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
  })

  it("denies a different writer from deleting another writer's article", async () => {
    await expect(
      payload.delete({
        collection: 'articles',
        id: writerAArticleId,
        overrideAccess: false,
        user: writerB as never,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()
  })

  it("allows an editor to update any writer's article regardless of ownership", async () => {
    const updated = await payload.update({
      collection: 'articles',
      id: writerAArticleId,
      data: { title: 'Updated by Editor' },
      overrideAccess: false,
      user: editor as never,
      context: { disableRevalidate: true },
    })

    expect(updated.title).toBe('Updated by Editor')
  })
})
