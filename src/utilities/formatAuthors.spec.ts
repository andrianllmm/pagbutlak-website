import { describe, expect, it } from 'vitest'

import type { Article, Author } from '@/payload-types'

import { formatAuthors } from './formatAuthors'

const author = (name: string) => ({ name }) as Author

describe('formatAuthors', () => {
  it('returns an empty string for no authors', () => {
    expect(formatAuthors([] as NonNullable<Article['authors']>)).toBe('')
  })

  it('returns the name as-is for a single author', () => {
    expect(formatAuthors([author('Alice')])).toBe('Alice')
  })

  it('joins two authors with "and"', () => {
    expect(formatAuthors([author('Alice'), author('Bob')])).toBe('Alice and Bob')
  })

  it('joins three or more authors with commas and a trailing "and"', () => {
    expect(formatAuthors([author('Alice'), author('Bob'), author('Carol')])).toBe(
      'Alice, Bob and Carol',
    )
  })

  it('ignores unpopulated authors referenced only by id', () => {
    expect(formatAuthors([1 as unknown as Author, author('Alice')])).toBe('Alice')
  })
})
