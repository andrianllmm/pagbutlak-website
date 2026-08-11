import React from 'react'

import { getTikTokVideoId } from '@/utilities/multimediaEmbed'
import { cn } from '@/utilities/ui'
import { EmbedFallback } from './EmbedFallback'
import { EMBED_WIDTH_CLASS, type MultimediaEmbedProps } from './types'

export const TikTokEmbed: React.FC<MultimediaEmbedProps> = ({ className, title, url }) => {
  const videoId = getTikTokVideoId(url)

  if (!videoId) {
    return <EmbedFallback className={className} />
  }

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden mx-auto aspect-[9/16] bg-muted',
        EMBED_WIDTH_CLASS,
        className,
      )}
    >
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        src={`https://www.tiktok.com/player/v1/${videoId}`}
        title={title}
      />
    </div>
  )
}
