import { describe, expect, it } from 'vitest'

import { getMediaUrl } from './getMediaUrl'

describe('getMediaUrl', () => {
  it('returns an empty string for a missing url', () => {
    expect(getMediaUrl(null)).toBe('')
    expect(getMediaUrl(undefined)).toBe('')
  })

  it('leaves an absolute url unchanged when no cache tag is given', () => {
    expect(getMediaUrl('https://cdn.example.com/image.jpg')).toBe(
      'https://cdn.example.com/image.jpg',
    )
  })

  it('appends the cache tag to an absolute url with the correct separator', () => {
    expect(getMediaUrl('https://cdn.example.com/image.jpg', 'abc123')).toBe(
      'https://cdn.example.com/image.jpg?abc123',
    )
    expect(getMediaUrl('https://cdn.example.com/image.jpg?v=1', 'abc123')).toBe(
      'https://cdn.example.com/image.jpg?v=1&abc123',
    )
  })

  it('url-encodes the cache tag', () => {
    expect(getMediaUrl('https://cdn.example.com/image.jpg', 'a b/c')).toBe(
      'https://cdn.example.com/image.jpg?a%20b%2Fc',
    )
  })

  it('prepends the client-side base url to a relative path', () => {
    expect(getMediaUrl('/media/image.jpg')).toMatch(/^https?:\/\/.+\/media\/image\.jpg$/)
  })
})
