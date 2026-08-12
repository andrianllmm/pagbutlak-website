import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

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

    const author = await payload.create({
      collection: 'authors',
      data: { name: 'Test Author', role: 'Writer', slug: 'test-author' } as never,
      context: { disableRevalidate: true },
    })
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
