import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getAutoThumbnailUrl,
  getPlatformFromUrl,
  getTikTokVideoId,
  getYouTubeVideoId,
  resolveFacebookCanonicalUrl,
} from './multimediaEmbed'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getYouTubeVideoId', () => {
  it('extracts the id from a youtu.be short link', () => {
    expect(getYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts the id from a standard watch url', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts the id from a shorts url', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts the id from an already-embed url', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for a non-YouTube url', () => {
    expect(getYouTubeVideoId('https://www.tiktok.com/@pagbutlakupv/video/123')).toBeNull()
  })
})

describe('getTikTokVideoId', () => {
  it('extracts the id from a standard video url', () => {
    expect(getTikTokVideoId('https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424')).toBe(
      '7558099711979228424',
    )
  })

  it('returns null for a photo-post url', () => {
    expect(
      getTikTokVideoId('https://www.tiktok.com/@pagbutlakupv/photo/7658239432402980116'),
    ).toBeNull()
  })

  it('returns null for a non-TikTok url', () => {
    expect(getTikTokVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBeNull()
  })
})

describe('getPlatformFromUrl', () => {
  it('detects youtube.com urls', () => {
    expect(getPlatformFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube')
  })

  it('detects youtu.be urls', () => {
    expect(getPlatformFromUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube')
  })

  it('detects facebook.com urls', () => {
    expect(getPlatformFromUrl('https://www.facebook.com/reel/1360970262830862')).toBe('facebook')
  })

  it('detects tiktok.com urls', () => {
    expect(
      getPlatformFromUrl('https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424'),
    ).toBe('tiktok')
  })

  it('returns null for an unrecognized platform', () => {
    expect(getPlatformFromUrl('https://www.instagram.com/reel/abc123')).toBeNull()
  })
})

describe('resolveFacebookCanonicalUrl', () => {
  it('returns non-share urls unchanged without making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const url = 'https://www.facebook.com/reel/1360970262830862'
    await expect(resolveFacebookCanonicalUrl(url)).resolves.toBe(url)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('resolves a share link to its canonical origin + pathname, dropping tracking params', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      url: 'https://www.facebook.com/reel/1360970262830862?rdid=abc&share_url=xyz',
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      resolveFacebookCanonicalUrl('https://www.facebook.com/share/v/1C4BiqjP5o/'),
    ).resolves.toBe('https://www.facebook.com/reel/1360970262830862')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries once on failure before succeeding', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ url: 'https://www.facebook.com/reel/1360970262830862' })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      resolveFacebookCanonicalUrl('https://www.facebook.com/share/v/1C4BiqjP5o/'),
    ).resolves.toBe('https://www.facebook.com/reel/1360970262830862')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('falls back to the original url if both attempts fail', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'))
    vi.stubGlobal('fetch', fetchMock)

    const url = 'https://www.facebook.com/share/v/1C4BiqjP5o/'
    await expect(resolveFacebookCanonicalUrl(url)).resolves.toBe(url)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

describe('getAutoThumbnailUrl', () => {
  it('builds a thumbnail url from a YouTube video id', async () => {
    await expect(
      getAutoThumbnailUrl({ platform: 'youtube', url: 'https://youtu.be/dQw4w9WgXcQ' }),
    ).resolves.toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
  })

  it('returns null for a YouTube url with no extractable id', async () => {
    await expect(
      getAutoThumbnailUrl({ platform: 'youtube', url: 'https://www.youtube.com/' }),
    ).resolves.toBeNull()
  })

  it('fetches the thumbnail from TikTok oEmbed', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ thumbnail_url: 'https://example.com/thumb.jpg' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      getAutoThumbnailUrl({
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424',
      }),
    ).resolves.toBe('https://example.com/thumb.jpg')
  })

  it('returns null when the TikTok oEmbed request is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      getAutoThumbnailUrl({
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424',
      }),
    ).resolves.toBeNull()
  })

  it('returns null when the TikTok oEmbed request throws', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      getAutoThumbnailUrl({
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@pagbutlakupv/video/7558099711979228424',
      }),
    ).resolves.toBeNull()
  })

  it('returns null for facebook, which has no auto-thumbnail source', async () => {
    await expect(
      getAutoThumbnailUrl({ platform: 'facebook', url: 'https://www.facebook.com/reel/123' }),
    ).resolves.toBeNull()
  })
})
