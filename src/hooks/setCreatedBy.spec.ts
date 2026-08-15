import { describe, expect, it } from 'vitest'

import type { CollectionBeforeChangeHook } from 'payload'

import { setCreatedBy } from './setCreatedBy'

type HookArgs = Parameters<CollectionBeforeChangeHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    req: {},
    ...overrides,
  }) as unknown as HookArgs

describe('setCreatedBy', () => {
  it('sets createdBy to the requesting user on create', () => {
    const result = setCreatedBy(args({ operation: 'create', req: { user: { id: 1 } } as never }))

    expect(result.createdBy).toBe(1)
  })

  it('does not set createdBy when there is no user on the request', () => {
    const result = setCreatedBy(args({ operation: 'create', req: {} as never }))

    expect(result.createdBy).toBeUndefined()
  })

  it('leaves data untouched on update', () => {
    const data = { title: 'unchanged' }
    const result = setCreatedBy(
      args({ operation: 'update', data, req: { user: { id: 1 } } as never }),
    )

    expect(result).toBe(data)
  })
})
