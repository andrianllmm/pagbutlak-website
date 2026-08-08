import { describe, expect, it } from 'vitest'

import type { CollectionBeforeChangeHook } from 'payload'

import { populatePublishedAt } from './populatePublishedAt'

type HookArgs = Parameters<CollectionBeforeChangeHook>[0]

const args = (overrides: Partial<HookArgs>) =>
  ({
    data: {},
    operation: 'create',
    req: { data: {} },
    ...overrides,
  }) as unknown as HookArgs

describe('populatePublishedAt', () => {
  it('sets publishedAt on create when not provided', () => {
    const result = populatePublishedAt(args({ operation: 'create', req: { data: {} } as never }))

    expect(result.publishedAt).toBeInstanceOf(Date)
  })

  it('does not override an explicitly provided publishedAt', () => {
    const explicitDate = new Date('2020-01-01')
    const result = populatePublishedAt(
      args({
        data: { publishedAt: explicitDate },
        req: { data: { publishedAt: explicitDate } } as never,
      }),
    )

    expect(result.publishedAt).toBe(explicitDate)
  })

  it('leaves data untouched on delete', () => {
    const data = { title: 'unchanged' }
    const result = populatePublishedAt(args({ operation: 'delete' as never, data }))

    expect(result).toBe(data)
  })
})
