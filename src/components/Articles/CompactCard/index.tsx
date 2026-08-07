'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { formatReadableDate } from '@/utilities/formatReadableDate'
import type { CardDoc } from '../Card'

export const CompactCard: React.FC<{
  className?: string
  doc?: CardDoc
  relationTo?: 'articles'
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo = 'articles' } = props

  const { slug, meta, title, publishedAt } = doc || {}

  const { image: metaImage } = meta || {}

  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group flex flex-col gap-2 p-2 rounded-lg overflow-hidden bg-card transition-colors duration-300 hover:bg-accent hover:text-accent-foreground hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {metaImage && typeof metaImage !== 'string' && (
        <div className="rounded-lg w-full aspect-[16/9] overflow-hidden">
          <Media
            resource={metaImage}
            size="25vw"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>
      )}

      <div className="min-w-0">
        {title && (
          <div className="prose dark:prose-invert max-w-none">
            <h4 className="line-clamp-2 text-sm font-medium">
              <Link className="not-prose" href={href} ref={link.ref}>
                {title}
              </Link>
            </h4>
          </div>
        )}

        {publishedAt && (
          <div className="text-xs text-muted-foreground mt-1">
            {formatReadableDate(publishedAt)}
          </div>
        )}
      </div>
    </article>
  )
}
