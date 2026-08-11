import React from 'react'

import { cn } from '@/utilities/ui'
import { EMBED_WIDTH_CLASS } from './types'

type Props = {
  className?: string
  src: string
  title: string
}

export const EmbedFrame: React.FC<Props> = ({ className, src, title }) => (
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
      src={src}
      title={title}
    />
  </div>
)
