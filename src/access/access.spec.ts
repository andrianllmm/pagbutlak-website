import { describe, expect, it } from 'vitest'

import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

import { anyone } from './anyone'
import { authenticated } from './authenticated'
import { authenticatedOrPublished } from './authenticatedOrPublished'

const withUser = (user: User | null) => ({ req: { user } }) as unknown as AccessArgs<User>

describe('anyone', () => {
  it('always allows access', () => {
    expect(anyone()).toBe(true)
  })
})

describe('authenticated', () => {
  it('denies when there is no user', () => {
    expect(authenticated(withUser(null))).toBe(false)
  })

  it('allows when a user is present', () => {
    expect(authenticated(withUser({ id: 1 } as User))).toBe(true)
  })
})

describe('authenticatedOrPublished', () => {
  it('allows unrestricted access for an authenticated user', () => {
    expect(authenticatedOrPublished(withUser({ id: 1 } as User))).toBe(true)
  })

  it('restricts unauthenticated access to published docs only', () => {
    expect(authenticatedOrPublished(withUser(null))).toEqual({
      _status: { equals: 'published' },
    })
  })
})
