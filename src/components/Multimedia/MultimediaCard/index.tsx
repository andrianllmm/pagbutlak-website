'use client'
import Link from 'next/link'
import { Link as LinkIcon, Play } from 'lucide-react'
import React from 'react'

import { formatReadableDate } from '@/utilities/formatReadableDate'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { getPlatformFromUrl } from '@/utilities/multimediaEmbed'
import { MULTIMEDIA_PLATFORM_ICONS } from '@/components/Multimedia/platformIcons'
import type { Multimedia } from '@/payload-types'

export type CardDoc = Pick<
  Multimedia,
  'slug' | 'title' | 'links' | 'thumbnail' | 'autoThumbnailUrl' | 'publishedAt'
>

function getThumbnailSrc(doc: CardDoc): string | null {
  const { thumbnail, autoThumbnailUrl } = doc

  if (thumbnail && typeof thumbnail === 'object' && thumbnail.url) {
    return thumbnail.url
  }

  if (autoThumbnailUrl) {
    return autoThumbnailUrl
  }

  return null
}

export const MultimediaCard: React.FC<{
  className?: string
  doc: CardDoc
}> = ({ className, doc }) => {
  const { card, link } = useClickableCard({})
  const { slug, title, links, publishedAt } = doc

  const href = `/multimedia/${slug}`
  const thumbnailSrc = getThumbnailSrc(doc)

  return (
    <article
      className={cn(
        'group p-3 rounded-lg overflow-hidden bg-card transition-colors duration-300 hover:bg-accent hover:text-accent-foreground hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative mb-2 rounded-lg w-full aspect-[9/16] overflow-hidden bg-muted">
        {thumbnailSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- thumbnails come from arbitrary external platform domains
          <img
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            src={thumbnailSrc}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground">
            <Play className="size-6 fill-current" />
          </div>
        </div>
      </div>

      <div>
        <div className="prose mb-1">
          <h3 className="line-clamp-2 text-base">
            <Link className="not-prose" href={href} ref={link.ref}>
              {title}
            </Link>
          </h3>
        </div>

        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          {links?.map((item, index) => {
            const platform = getPlatformFromUrl(item.url)
            const Icon = platform ? MULTIMEDIA_PLATFORM_ICONS[platform] : LinkIcon
            return <Icon className="size-4" key={index} title={platform ?? 'Link'} />
          })}
          {publishedAt && <div>{formatReadableDate(publishedAt)}</div>}
        </div>
      </div>
    </article>
  )
}
