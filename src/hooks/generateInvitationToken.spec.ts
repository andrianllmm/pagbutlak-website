import { describe, expect, it } from 'vitest'

import type { CollectionBeforeValidateHook } from 'payload'

import { generateInvitationToken } from './generateInvitationToken'

type HookArgs = Parameters<CollectionBeforeValidateHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    ...overrides,
  }) as unknown as HookArgs

describe('generateInvitationToken', () => {
  it('sets a token and a future expiresAt on create', async () => {
    const result = await generateInvitationToken(args({ data: { email: 'a@example.com' } }))

    expect(result.token).toBeDefined()
    expect(new Date(result.expiresAt as string).getTime()).toBeGreaterThan(Date.now())
  })

  it('generates a different token on each call', async () => {
    const first = await generateInvitationToken(args({ data: {} }))
    const second = await generateInvitationToken(args({ data: {} }))

    expect(first.token).not.toBe(second.token)
  })

  it('leaves other fields untouched', async () => {
    const result = await generateInvitationToken(
      args({ data: { email: 'a@example.com', role: 'editor' } }),
    )

    expect(result.email).toBe('a@example.com')
    expect(result.role).toBe('editor')
  })

  it('does not touch token/expiresAt on update', async () => {
    const result = await generateInvitationToken(
      args({ data: { token: 'unchanged' }, operation: 'update' }),
    )

    expect(result.token).toBe('unchanged')
    expect(result.expiresAt).toBeUndefined()
  })
})
