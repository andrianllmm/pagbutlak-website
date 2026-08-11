import React from 'react'

import { getYouTubeVideoId } from '@/utilities/multimediaEmbed'
import { EmbedFallback } from './EmbedFallback'
import { EmbedFrame } from './EmbedFrame'
import type { MultimediaEmbedProps } from './types'

const getEmbedUrl = (videoId: string, { autoplay, muted }: MultimediaEmbedProps) => {
  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  if (muted) params.set('mute', '1')

  const query = params.toString()
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`
}

export const YouTubeEmbed: React.FC<MultimediaEmbedProps> = (props) => {
  const { className, title, url } = props
  const videoId = getYouTubeVideoId(url)

  if (!videoId) {
    return <EmbedFallback className={className} />
  }

  return <EmbedFrame className={className} src={getEmbedUrl(videoId, props)} title={title} />
}
