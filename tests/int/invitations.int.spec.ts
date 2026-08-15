import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterEach, expect } from 'vitest'

import { acceptInvitation } from '@/endpoints/acceptInvitation'
import { findInvitationByToken } from '@/utilities/findInvitationByToken'

let payload: Payload
const createdUserEmails: string[] = []

describe('Invitations', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  }, 30000)

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

    const { docs: invitations } = await payload.find({ collection: 'invitations', limit: 100 })
    for (const doc of invitations) {
      await payload.delete({ collection: 'invitations', id: doc.id })
    }
  })

  it('denies non-admins from creating an invitation', async () => {
    await expect(
      payload.create({
        collection: 'invitations',
        data: { email: 'blocked@example.com', role: 'writer' },
        overrideAccess: false,
        user: { role: 'editor' } as never,
      }),
    ).rejects.toThrow()
  })

  it('generates a token and expiry when an admin creates an invitation', async () => {
    const invitation = await payload.create({
      collection: 'invitations',
      data: { email: 'invitee@example.com', role: 'editor' },
      overrideAccess: false,
      user: { role: 'admin' } as never,
    })

    expect(invitation.token).toBeDefined()
    expect(new Date(invitation.expiresAt ?? 0).getTime()).toBeGreaterThan(Date.now())
  })

  it('accepting a valid token creates the user with the invited role and deletes the invitation', async () => {
    const invitation = await payload.create({
      collection: 'invitations',
      data: { email: 'accept-me@example.com', role: 'editor' },
    })

    const result = await acceptInvitation({
      payload,
      token: invitation.token as string,
      name: 'New Editor',
      password: 'a-real-password-123',
    })
    createdUserEmails.push('accept-me@example.com')

    const user = await payload.findByID({ id: result.id, collection: 'users' })
    expect(user.role).toBe('editor')
    expect(user.email).toBe('accept-me@example.com')

    const remaining = await payload.find({
      collection: 'invitations',
      where: { id: { equals: invitation.id } },
    })
    expect(remaining.docs).toHaveLength(0)
  })

  it('rejects an expired token', async () => {
    const invitation = await payload.create({
      collection: 'invitations',
      data: { email: 'expired@example.com', role: 'writer' },
    })
    await payload.update({
      collection: 'invitations',
      id: invitation.id,
      data: { expiresAt: new Date(Date.now() - 1000).toISOString() },
    })

    await expect(
      acceptInvitation({
        payload,
        token: invitation.token as string,
        name: 'Too Late',
        password: 'a-real-password-123',
      }),
    ).rejects.toThrow()
  })

  it('findInvitationByToken finds by token and returns undefined for an unknown token', async () => {
    const invitation = await payload.create({
      collection: 'invitations',
      data: { email: 'lookup-me@example.com', role: 'writer' },
    })

    const found = await findInvitationByToken({ payload, token: invitation.token as string })
    expect(found?.id).toBe(invitation.id)

    const notFound = await findInvitationByToken({ payload, token: 'does-not-exist' })
    expect(notFound).toBeUndefined()
  })

  it('rejects a token that has already been consumed', async () => {
    const invitation = await payload.create({
      collection: 'invitations',
      data: { email: 'reused@example.com', role: 'writer' },
    })

    await acceptInvitation({
      payload,
      token: invitation.token as string,
      name: 'First Use',
      password: 'a-real-password-123',
    })
    createdUserEmails.push('reused@example.com')

    await expect(
      acceptInvitation({
        payload,
        token: invitation.token as string,
        name: 'Second Use',
        password: 'another-password-456',
      }),
    ).rejects.toThrow()
  })
})
