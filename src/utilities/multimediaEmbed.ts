import type { MultimediaPlatform } from '@/constants/multimediaPlatforms'

type PlatformUrl = {
  platform: MultimediaPlatform
  url: string
}

export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export function getTikTokVideoId(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)
  return match ? match[1] : null
}

export function getPlatformFromUrl(url: string): MultimediaPlatform | null {
  if (/(^|\/\/)(www\.)?(youtube\.com|youtu\.be)\//.test(url)) {
    return 'youtube'
  }
  if (/(^|\/\/)(www\.)?facebook\.com\//.test(url)) {
    return 'facebook'
  }
  if (/(^|\/\/)(www\.)?tiktok\.com\//.test(url)) {
    return 'tiktok'
  }
  return null
}

// The Facebook video plugin needs the canonical post/reel URL and does not
// follow redirects, so share links must be resolved before embedding.
export async function resolveFacebookCanonicalUrl(url: string): Promise<string> {
  if (!/facebook\.com\/share\//.test(url)) {
    return url
  }

  const attempt = async (): Promise<string | null> => {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      const resolvedUrl = new URL(response.url)
      return `${resolvedUrl.origin}${resolvedUrl.pathname}`
    } catch {
      return null
    }
  }

  return (await attempt()) ?? (await attempt()) ?? url
}

export async function getAutoThumbnailUrl({ platform, url }: PlatformUrl): Promise<string | null> {
  switch (platform) {
    case 'youtube': {
      const id = getYouTubeVideoId(url)
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
    }
    case 'tiktok': {
      try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
        if (!response.ok) {
          return null
        }
        const data: { thumbnail_url?: string } = await response.json()
        return data.thumbnail_url ?? null
      } catch {
        return null
      }
    }
    case 'facebook':
    default:
      return null
  }
}
