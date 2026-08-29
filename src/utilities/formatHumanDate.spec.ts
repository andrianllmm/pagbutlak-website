import { describe, expect, it } from 'vitest'

import { formatHumanDate } from './formatHumanDate'

// now = 2026-01-15T10:00:00Z = 2026-01-15 18:00 in Asia/Manila (UTC+8)
const now = new Date('2026-01-15T10:00:00.000Z')

describe('formatHumanDate', () => {
  it('returns "Just now" for timestamps less than a minute old', () => {
    const date = new Date(now.getTime() - 30 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('Just now')
  })

  it('singularizes "1 min ago"', () => {
    const date = new Date(now.getTime() - 1 * 60 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('1 min ago')
  })

  it('pluralizes minutes for anything under an hour', () => {
    const date = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('5 mins ago')
  })

  it('shows "Today at <time>" for the same Manila calendar day', () => {
    // 3 hours before now, still 2026-01-15 in Manila
    const date = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('Today at 3:00 PM')
  })

  it('shows "Yesterday at <time>" for the previous Manila calendar day', () => {
    // 27 hours before now crosses into 2026-01-14 in Manila
    const date = new Date(now.getTime() - 27 * 60 * 60 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('Yesterday at 3:00 PM')
  })

  it('falls back to an absolute date beyond yesterday', () => {
    const date = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatHumanDate(date, now)).toBe('Jan 12, 2026')
  })
})
