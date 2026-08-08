import { describe, expect, it } from 'vitest'

import { toKebabCase } from './toKebabCase'

describe('toKebabCase', () => {
  it('converts camelCase to kebab-case', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world')
  })

  it('converts spaced words to kebab-case', () => {
    expect(toKebabCase('Hello World')).toBe('hello-world')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(toKebabCase('Hello   World')).toBe('hello-world')
  })

  it('handles already-kebab-case input unchanged', () => {
    expect(toKebabCase('already-kebab')).toBe('already-kebab')
  })

  it('returns undefined for undefined input', () => {
    expect(toKebabCase(undefined as unknown as string)).toBeUndefined()
  })
})
