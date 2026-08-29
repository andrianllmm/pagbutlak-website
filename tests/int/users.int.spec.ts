import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { createTestUser, seedAdmin } from './helpers'

let payload: Payload
let seededAdminId: number | string
const createdUserEmails: string[] = []

describe('Users password strength', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })

    const seededAdmin = await seedAdmin(payload, 'seed-admin-password-spec@example.com')
    seededAdminId = seededAdmin.id
  }, 30000)

  afterAll(async () => {
    await payload.delete({ collection: 'users', id: seededAdminId, overrideAccess: true })
  })

  afterEach(async () => {
    for (const email of createdUserEmails.splice(0)) {
      const { docs } = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
      })
      for (const doc of docs) {
        await payload.delete({ collection: 'users', id: doc.id })
      }
    }
  })

  it('rejects creating a user with a too-short password', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: {
          name: 'Weak Pass',
          email: 'weak-pass@example.com',
          password: 'abc123',
          role: 'writer',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow(/at least/i)
  })

  it('rejects creating a user with a common/weak password', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: {
          name: 'Common Pass',
          email: 'common-pass@example.com',
          password: 'password123',
          role: 'writer',
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('creates a user with a strong password', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Strong Pass',
        email: 'strong-pass@example.com',
        password: 'xK9!mQ2wZv#Lp7Fj',
        role: 'writer',
      },
      overrideAccess: true,
    })
    createdUserEmails.push('strong-pass@example.com')

    expect(user.email).toBe('strong-pass@example.com')
  })

  it('allows updating a user without touching the password', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Update Me',
        email: 'update-me@example.com',
        password: 'xK9!mQ2wZv#Lp7Fj',
        role: 'writer',
      },
      overrideAccess: true,
    })
    createdUserEmails.push('update-me@example.com')

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: { name: 'Updated Name' },
      overrideAccess: true,
    })

    expect(updated.name).toBe('Updated Name')
  })

  it('rejects updating a user with a weak password using the existing email/name', async () => {
    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Jamie Cruz',
        email: 'jamiecruz@example.com',
        password: 'xK9!mQ2wZv#Lp7Fj',
        role: 'writer',
      },
      overrideAccess: true,
    })
    createdUserEmails.push('jamiecruz@example.com')

    await expect(
      payload.update({
        collection: 'users',
        id: user.id,
        data: { password: 'jamiecruz1234' },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })
})

describe('Users role field access', () => {
  let seededAdminId: number | string
  let adminUser: Awaited<ReturnType<typeof payload.create>>
  let writerUser: Awaited<ReturnType<typeof payload.create>>

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Must resolve before the other creates.
    const seededAdmin = await seedAdmin(payload, 'seed-admin-role-spec@example.com')
    seededAdminId = seededAdmin.id

    const [admin, writer] = await Promise.all([
      createTestUser(payload, {
        name: 'Role Admin',
        email: 'role-admin@example.com',
        role: 'admin',
      }),
      createTestUser(payload, {
        name: 'Role Writer',
        email: 'role-writer@example.com',
        role: 'writer',
      }),
    ])
    adminUser = admin
    writerUser = writer
  }, 30000)

  afterAll(async () => {
    await payload.delete({ collection: 'users', id: seededAdminId, overrideAccess: true })
    await payload.delete({ collection: 'users', id: adminUser.id, overrideAccess: true })
    await payload.delete({ collection: 'users', id: writerUser.id, overrideAccess: true })
  })

  it('silently drops a role change attempted by a writer on their own account', async () => {
    // Field-level access failures don't throw - Payload silently omits the
    // disallowed field from the update instead of rejecting the request.
    const updated = await payload.update({
      collection: 'users',
      id: writerUser.id,
      data: { role: 'admin' },
      overrideAccess: false,
      user: writerUser as never,
    })

    expect(updated.role).toBe('writer')

    const reread = await payload.findByID({
      collection: 'users',
      id: writerUser.id,
      overrideAccess: true,
    })
    expect(reread.role).toBe('writer')
  })

  it('allows an admin to change another user role', async () => {
    const updated = await payload.update({
      collection: 'users',
      id: writerUser.id,
      data: { role: 'editor' },
      overrideAccess: false,
      user: adminUser as never,
    })

    expect(updated.role).toBe('editor')
  })
})
