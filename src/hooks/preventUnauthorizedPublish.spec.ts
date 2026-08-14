import { describe, expect, it } from 'vitest'

import type { CollectionBeforeChangeHook } from 'payload'

import { preventUnauthorizedPublish } from './preventUnauthorizedPublish'

type HookArgs = Parameters<CollectionBeforeChangeHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'update',
    req: {},
    ...overrides,
  }) as unknown as HookArgs

describe('preventUnauthorizedPublish', () => {
  it('throws when a writer attempts to publish a draft', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'draft' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).toThrow()
  })

  it('does not throw when re-saving an already-published doc as a writer', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'published' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('does not throw when a writer saves a draft', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'draft' },
          originalDoc: { _status: 'draft' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('does not throw when an editor or admin publishes a draft', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'draft' },
          req: { user: { role: 'editor' } } as never,
        }),
      ),
    ).not.toThrow()

    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'draft' },
          req: { user: { role: 'admin' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('does not throw when there is no user on the request (system/internal operations)', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'draft' },
          req: {} as never,
        }),
      ),
    ).not.toThrow()
  })

  it('throws when a writer attempts to unpublish an already-published doc', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'draft' },
          originalDoc: { _status: 'published' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).toThrow()
  })

  it('does not throw when an editor or admin unpublishes a doc', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'draft' },
          originalDoc: { _status: 'published' },
          req: { user: { role: 'editor' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('does not throw for a draft-mode save (draft=true), even though Payload sets data._status to draft on an already-published doc', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'draft' },
          originalDoc: { _status: 'published' },
          req: { user: { role: 'writer' }, query: { draft: true } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('skips the check entirely for draft-mode saves, regardless of status data (matches Payload UI, which never sends draft=true for real publish/unpublish)', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          originalDoc: { _status: 'draft' },
          req: { user: { role: 'writer' }, query: { draft: 'true' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('does not throw when a writer duplicates a published article into a draft copy (Payload passes the source doc as originalDoc on create, not the doc "being modified")', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'draft' },
          operation: 'create',
          originalDoc: { _status: 'published' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).not.toThrow()
  })

  it('throws when a writer creates (or duplicates into) an already-published document', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          operation: 'create',
          originalDoc: { _status: 'published' },
          req: { user: { role: 'writer' } } as never,
        }),
      ),
    ).toThrow()
  })

  it('does not throw when an editor duplicates a published article as published', () => {
    expect(() =>
      preventUnauthorizedPublish(
        args({
          data: { _status: 'published' },
          operation: 'create',
          originalDoc: { _status: 'published' },
          req: { user: { role: 'editor' } } as never,
        }),
      ),
    ).not.toThrow()
  })
})
