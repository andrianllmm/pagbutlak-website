import { describe, expect, it } from 'vitest'

import type { CollectionBeforeValidateHook } from 'payload'

import { enforcePasswordStrength } from './enforcePasswordStrength'

type HookArgs = Parameters<CollectionBeforeValidateHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    originalDoc: undefined,
    req: {},
    ...overrides,
  }) as unknown as HookArgs

describe('enforcePasswordStrength', () => {
  it('leaves data untouched when no password is being set', () => {
    const data = { name: 'Jane Doe' }

    const result = enforcePasswordStrength(args({ data }))

    expect(result).toBe(data)
  })

  it('throws when the password is too short', () => {
    expect(() =>
      enforcePasswordStrength(args({ data: { email: 'jane@example.com', password: 'abc123' } })),
    ).toThrow(/at least/i)
  })

  it('throws when the password is weak/common', () => {
    expect(() =>
      enforcePasswordStrength(
        args({ data: { email: 'jane@example.com', password: 'password123' } }),
      ),
    ).toThrow()
  })

  it('throws when the password is derived from the email/name being set', () => {
    expect(() =>
      enforcePasswordStrength(
        args({
          data: { email: 'janedoe@example.com', name: 'Jane Doe', password: 'janedoe1234' },
        }),
      ),
    ).toThrow()
  })

  it('checks against the existing user email/name on a password-only update', () => {
    expect(() =>
      enforcePasswordStrength(
        args({
          data: { password: 'janedoe1234' },
          operation: 'update',
          originalDoc: { email: 'janedoe@example.com', name: 'Jane Doe' },
        }),
      ),
    ).toThrow()
  })

  it('accepts a strong password', () => {
    const data = { email: 'jane@example.com', password: 'xK9!mQ2wZv#Lp7Fj' }

    const result = enforcePasswordStrength(args({ data }))

    expect(result).toBe(data)
  })
})
