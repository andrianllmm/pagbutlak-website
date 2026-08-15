import { describe, expect, it, vi } from 'vitest'

import type { CollectionBeforeValidateHook } from 'payload'

import { forceFirstUserAdmin } from './forceFirstUserAdmin'

type HookArgs = Parameters<CollectionBeforeValidateHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    req: { payload: { count: vi.fn().mockResolvedValue({ totalDocs: 0 }) } },
    ...overrides,
  }) as unknown as HookArgs

describe('forceFirstUserAdmin', () => {
  it('forces role to admin when creating the first user', async () => {
    const result = await forceFirstUserAdmin(
      args({
        data: { role: 'writer' },
        req: { payload: { count: vi.fn().mockResolvedValue({ totalDocs: 0 }) } } as never,
      }),
    )

    expect(result?.role).toBe('admin')
  })

  it('leaves role untouched when users already exist', async () => {
    const result = await forceFirstUserAdmin(
      args({
        data: { role: 'writer' },
        req: { payload: { count: vi.fn().mockResolvedValue({ totalDocs: 1 }) } } as never,
      }),
    )

    expect(result?.role).toBe('writer')
  })

  it('leaves data untouched on update', async () => {
    const data = { role: 'writer' }
    const result = await forceFirstUserAdmin(
      args({
        data,
        operation: 'update',
        req: { payload: { count: vi.fn().mockResolvedValue({ totalDocs: 0 }) } } as never,
      }),
    )

    expect(result).toBe(data)
  })
})
