import React from 'react'

import { cn } from '@/utilities/ui'
import { EMBED_WIDTH_CLASS, type MultimediaEmbedProps } from './types'

export const FacebookEmbed: React.FC<MultimediaEmbedProps> = ({ className, title, url }) => {
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&mute=0`

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
        src={embedUrl}
        title={title}
      />
    </div>
  )
}
