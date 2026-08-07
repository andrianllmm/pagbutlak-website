import { describe, expect, it } from 'vitest'

import { formatDateTime } from './formatDateTime'

describe('formatDateTime', () => {
  it('formats a timestamp as MM/DD/YYYY', () => {
    expect(formatDateTime('2024-03-05T12:00:00.000Z')).toBe('03/05/2024')
  })

  it('zero-pads single-digit months and days', () => {
    expect(formatDateTime('2024-01-09T00:00:00.000Z')).toBe('01/09/2024')
  })

  it('falls back to the current date when given an empty timestamp', () => {
    const expected = formatDateTime(new Date().toISOString())
    expect(formatDateTime('')).toBe(expected)
  })
})
