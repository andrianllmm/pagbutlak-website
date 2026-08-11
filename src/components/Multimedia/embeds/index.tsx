import React from 'react'

import type { MultimediaPlatform } from '@/constants/multimediaPlatforms'
import { getPlatformFromUrl } from '@/utilities/multimediaEmbed'
import { EmbedFallback } from './EmbedFallback'
import { FacebookEmbed } from './FacebookEmbed'
import { TikTokEmbed } from './TikTokEmbed'
import type { MultimediaEmbedProps } from './types'
import { YouTubeEmbed } from './YouTubeEmbed'

// To add a platform: add it to MULTIMEDIA_PLATFORMS, teach getPlatformFromUrl
// its URL pattern, add a component implementing MultimediaEmbedProps, and
// register it below.
const EMBED_COMPONENTS: Record<MultimediaPlatform, React.FC<MultimediaEmbedProps>> = {
  facebook: FacebookEmbed,
  tiktok: TikTokEmbed,
  youtube: YouTubeEmbed,
}

export const MultimediaEmbed: React.FC<MultimediaEmbedProps> = (props) => {
  const platform = getPlatformFromUrl(props.url)

  if (!platform) {
    return <EmbedFallback className={props.className} />
  }

  const Embed = EMBED_COMPONENTS[platform]
  return <Embed {...props} />
}
