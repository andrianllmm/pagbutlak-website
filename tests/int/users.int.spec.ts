import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
let seededAdminId: number | string
const createdUserEmails: string[] = []

describe('Users password strength', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })

    // Seed an admin so the users collection isn't empty (which would make
    // the next created user the "first" user and force it to admin).
    const seededAdmin = await payload.create({
      collection: 'users',
      data: {
        name: 'Seed Admin',
        email: 'seed-admin-password-spec@example.com',
        password: 'a-real-password-123',
        role: 'admin',
      },
      overrideAccess: true,
    })
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
