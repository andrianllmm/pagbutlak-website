import React from 'react'

import type { MultimediaPlatform } from '@/constants/multimediaPlatforms'
import { FacebookEmbed } from './FacebookEmbed'
import { TikTokEmbed } from './TikTokEmbed'
import type { MultimediaEmbedProps } from './types'
import { YouTubeEmbed } from './YouTubeEmbed'

// Add a new platform by adding it to `MULTIMEDIA_PLATFORMS`, creating a
// component here that implements `MultimediaEmbedProps`, and registering it
// below. No other file needs to know a new platform exists.
const EMBED_COMPONENTS: Record<MultimediaPlatform, React.FC<MultimediaEmbedProps>> = {
  facebook: FacebookEmbed,
  tiktok: TikTokEmbed,
  youtube: YouTubeEmbed,
}

export const MultimediaEmbed: React.FC<MultimediaEmbedProps & { platform: MultimediaPlatform }> = ({
  platform,
  ...props
}) => {
  const Embed = EMBED_COMPONENTS[platform]
  // Some platform widgets (e.g. TikTok's embed.js) mutate their container's
  // DOM directly outside of React. On client-side navigation between two
  // multimedia pages, React would otherwise try to reuse/update that same
  // DOM node, colliding with the widget's own mutations. Keying on the
  // video URL forces a full unmount/remount per video, giving the widget a
  // clean DOM node every time.
  return <Embed key={props.url} {...props} />
}
