import { describe, expect, it } from 'vitest'

import type { CollectionBeforeChangeHook } from 'payload'

import { preventUnauthorizedSchedulePublish } from './preventUnauthorizedSchedulePublish'

type HookArgs = Parameters<CollectionBeforeChangeHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    req: { payload: { findByID: async () => null } },
    ...overrides,
  }) as unknown as HookArgs

describe('preventUnauthorizedSchedulePublish', () => {
  it('throws when a writer schedules a publish for a restricted collection (req.user present)', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'schedulePublish', input: { doc: { relationTo: 'articles' } } },
          req: { user: { role: 'writer' }, payload: { findByID: async () => null } } as never,
        }),
      ),
    ).rejects.toThrow()
  })

  it('throws when the writer is only identifiable via data.input.user (Local API queue() calls without req.user)', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: {
            taskSlug: 'schedulePublish',
            input: { doc: { relationTo: 'articles' }, user: 5 },
          },
          req: {
            payload: {
              findByID: async ({ id }: { id: number }) =>
                id === 5 ? { id: 5, role: 'writer' } : null,
            },
          } as never,
        }),
      ),
    ).rejects.toThrow()
  })

  it('fails closed when the user lookup errors (does not let the job through)', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: {
            taskSlug: 'schedulePublish',
            input: { doc: { relationTo: 'articles' }, user: 5 },
          },
          req: {
            payload: {
              findByID: async () => {
                throw new Error('lookup failed')
              },
            },
          } as never,
        }),
      ),
    ).rejects.toThrow()
  })

  it('fails closed when neither req.user nor data.input.user is available', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'schedulePublish', input: { doc: { relationTo: 'articles' } } },
          req: { payload: { findByID: async () => null } } as never,
        }),
      ),
    ).rejects.toThrow()
  })

  it('does not throw when an editor or admin schedules a publish', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'schedulePublish', input: { doc: { relationTo: 'articles' } } },
          req: { user: { role: 'editor' }, payload: { findByID: async () => null } } as never,
        }),
      ),
    ).resolves.toBeDefined()
  })

  it('does not throw for jobs unrelated to schedulePublish', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'inline', input: {} },
          req: { user: { role: 'writer' }, payload: { findByID: async () => null } } as never,
        }),
      ),
    ).resolves.toBeDefined()
  })

  it('does not throw for schedulePublish targeting an unrestricted collection', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'schedulePublish', input: { doc: { relationTo: 'media' } } },
          req: { user: { role: 'writer' }, payload: { findByID: async () => null } } as never,
        }),
      ),
    ).resolves.toBeDefined()
  })

  it('does not throw on update operations', async () => {
    await expect(
      preventUnauthorizedSchedulePublish(
        args({
          data: { taskSlug: 'schedulePublish', input: { doc: { relationTo: 'articles' } } },
          operation: 'update',
          req: { user: { role: 'writer' }, payload: { findByID: async () => null } } as never,
        }),
      ),
    ).resolves.toBeDefined()
  })
})
