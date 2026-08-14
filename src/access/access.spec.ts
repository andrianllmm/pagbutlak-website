import { describe, expect, it } from 'vitest'

import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

import { anyone } from './anyone'
import { authenticated } from './authenticated'
import { authenticatedOrPublished } from './authenticatedOrPublished'
import { isAdmin } from './isAdmin'
import { isAdminOrEditor } from './isAdminOrEditor'
import { isAdminOrEditorOrOwner } from './isAdminOrEditorOrOwner'

const withUser = (user: User | null) => ({ req: { user } }) as unknown as AccessArgs<User>

const asUser = (role: User['role'], id = 1) => ({ id, role }) as User

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

describe('isAdmin', () => {
  it('denies when there is no user', () => {
    expect(isAdmin(withUser(null))).toBe(false)
  })

  it('allows an admin', () => {
    expect(isAdmin(withUser(asUser('admin')))).toBe(true)
  })

  it('denies an editor or writer', () => {
    expect(isAdmin(withUser(asUser('editor')))).toBe(false)
    expect(isAdmin(withUser(asUser('writer')))).toBe(false)
  })
})

describe('isAdminOrEditor', () => {
  it('denies when there is no user', () => {
    expect(isAdminOrEditor(withUser(null))).toBe(false)
  })

  it('allows an admin or editor', () => {
    expect(isAdminOrEditor(withUser(asUser('admin')))).toBe(true)
    expect(isAdminOrEditor(withUser(asUser('editor')))).toBe(true)
  })

  it('denies a writer', () => {
    expect(isAdminOrEditor(withUser(asUser('writer')))).toBe(false)
  })
})

describe('isAdminOrEditorOrOwner', () => {
  it('denies when there is no user', () => {
    expect(isAdminOrEditorOrOwner(withUser(null))).toBe(false)
  })

  it('allows an admin or editor full access', () => {
    expect(isAdminOrEditorOrOwner(withUser(asUser('admin')))).toBe(true)
    expect(isAdminOrEditorOrOwner(withUser(asUser('editor')))).toBe(true)
  })

  it('restricts a writer to their own documents', () => {
    expect(isAdminOrEditorOrOwner(withUser(asUser('writer', 42)))).toEqual({
      createdBy: { equals: 42 },
    })
  })
})
