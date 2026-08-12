import React from 'react'

import { EmbedFrame } from './EmbedFrame'
import type { MultimediaEmbedProps } from './types'

const getEmbedUrl = (url: string, { autoplay, muted }: MultimediaEmbedProps) => {
  const params = new URLSearchParams({ href: url, mute: muted ? '1' : '0' })
  if (autoplay) params.set('autoplay', 'true')

  return `https://www.facebook.com/plugins/video.php?${params.toString()}`
}

export const FacebookEmbed: React.FC<MultimediaEmbedProps> = (props) => {
  const { className, title, url } = props

  return <EmbedFrame className={className} src={getEmbedUrl(url, props)} title={title} />
}
