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
