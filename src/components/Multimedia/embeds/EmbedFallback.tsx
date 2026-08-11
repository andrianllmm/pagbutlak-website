import React from 'react'

import { cn } from '@/utilities/ui'
import { EMBED_WIDTH_CLASS } from './types'

export const EmbedFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'rounded-lg mx-auto aspect-[9/16] bg-muted flex items-center justify-center text-muted-foreground',
      EMBED_WIDTH_CLASS,
      className,
    )}
  >
    This video could not be embedded.
  </div>
)
