import { describe, expect, it } from 'vitest'

import type { Invitation } from '@/payload-types'

import { isInvitationValid } from './isInvitationValid'

const invitation = (overrides: Partial<Invitation>) =>
  ({
    id: 1,
    email: 'a@example.com',
    role: 'writer',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ...overrides,
  }) as Invitation

describe('isInvitationValid', () => {
  it('returns false when the invitation is missing', () => {
    expect(isInvitationValid(null)).toBe(false)
    expect(isInvitationValid(undefined)).toBe(false)
  })

  it('returns true for an unexpired invitation', () => {
    expect(isInvitationValid(invitation({}))).toBe(true)
  })

  it('returns false for an expired invitation', () => {
    expect(
      isInvitationValid(invitation({ expiresAt: new Date(Date.now() - 1000).toISOString() })),
    ).toBe(false)
  })

  it('returns false when expiresAt is missing', () => {
    expect(isInvitationValid(invitation({ expiresAt: undefined }))).toBe(false)
  })
})
