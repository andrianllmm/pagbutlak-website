'use client'
import Script from 'next/script'
import React, { useEffect, useRef } from 'react'

import { getTikTokVideoId } from '@/utilities/multimediaEmbed'
import { cn } from '@/utilities/ui'
import { EmbedFallback } from './EmbedFallback'
import { EMBED_WIDTH_CLASS, type MultimediaEmbedProps } from './types'

declare global {
  interface Window {
    tiktokEmbed?: {
      lib?: {
        render: (elements?: HTMLElement[]) => void
      }
    }
  }
}

export const TikTokEmbed: React.FC<MultimediaEmbedProps> = ({ className, title, url }) => {
  // TikTok's embed.js only processes blockquote elements, so the ref must
  // point at the blockquote itself, not a wrapper.
  const blockquoteRef = useRef<HTMLQuoteElement>(null)
  const videoId = getTikTokVideoId(url)

  // The script only auto-scans the DOM once. On client-side navigation it is
  // already loaded, so we render this blockquote manually.
  useEffect(() => {
    if (videoId && window.tiktokEmbed?.lib?.render && blockquoteRef.current) {
      window.tiktokEmbed.lib.render([blockquoteRef.current])
    }
  }, [videoId])

  if (!videoId) {
    return <EmbedFallback className={className} />
  }

  return (
    <div className={cn('mx-auto', EMBED_WIDTH_CLASS, className)}>
      <blockquote
        cite={url}
        className="tiktok-embed"
        data-video-id={videoId}
        ref={blockquoteRef}
        style={{ maxWidth: '100%', minWidth: 0, width: '100%' }}
      >
        <section>
          <a href={url} rel="noreferrer" target="_blank" title={title}>
            {title}
          </a>
        </section>
      </blockquote>
      <Script
        onLoad={() => {
          window.tiktokEmbed?.lib?.render(
            blockquoteRef.current ? [blockquoteRef.current] : undefined,
          )
        }}
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
