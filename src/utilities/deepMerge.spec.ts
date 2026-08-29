import { describe, expect, it } from 'vitest'

import deepMerge, { isObject } from './deepMerge'

describe('isObject', () => {
  it('treats plain objects as objects', () => {
    expect(isObject({})).toBe(true)
  })

  it('does not treat arrays as objects', () => {
    expect(isObject([])).toBe(false)
  })

  it('does not treat primitives as objects', () => {
    expect(isObject('string')).toBe(false)
    expect(isObject(1)).toBe(false)
  })
})

describe('deepMerge', () => {
  it('overwrites a target primitive with a source primitive', () => {
    expect(deepMerge({ title: 'Target' }, { title: 'Source' })).toEqual({ title: 'Source' })
  })

  it('recursively merges nested objects instead of replacing them', () => {
    const target = { meta: { title: 'Target', description: 'Target description' } }
    const source = { meta: { title: 'Source' } }

    expect(deepMerge(target, source)).toEqual({
      meta: { title: 'Source', description: 'Target description' },
    })
  })

  it('adds keys present only in the source', () => {
    expect(deepMerge({ title: 'Target' }, { description: 'Source description' })).toEqual({
      title: 'Target',
      description: 'Source description',
    })
  })

  it('replaces arrays wholesale rather than merging elements', () => {
    const target = { images: [{ url: 'a.png' }, { url: 'b.png' }] }
    const source = { images: [{ url: 'c.png' }] }

    expect(deepMerge(target, source)).toEqual({ images: [{ url: 'c.png' }] })
  })

  it('leaves the target untouched when the source is a primitive', () => {
    expect(deepMerge({ title: 'Target' }, 'not-an-object' as never)).toEqual({ title: 'Target' })
  })
})
