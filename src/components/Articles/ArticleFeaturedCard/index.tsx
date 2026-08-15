'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { CardMeta } from '../CardMeta'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatReadableDate } from '@/utilities/formatReadableDate'
import { formatReadingTime } from '@/utilities/readingTime'
import type { CardDoc } from '../ArticleCard'

export const ArticleFeaturedCard: React.FC<{
  className?: string
  doc?: CardDoc
  relationTo?: 'articles'
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo = 'articles' } = props

  const { slug, meta, title, authors, publishedAt, readingTimeMinutes } = doc || {}

  const { description, image: metaImage } = meta || {}

  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const authorLabel = authors ? formatAuthors(authors) : ''
  const readingTimeLabel = formatReadingTime(readingTimeMinutes)
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 p-4 rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="flex flex-col justify-center order-2 md:order-1 md:col-span-2">
        {title && (
          <div className="prose dark:prose-invert max-w-none">
            <h2>
              <Link className="not-prose" href={href} ref={link.ref}>
                {title}
              </Link>
            </h2>
          </div>
        )}

        <CardMeta
          className="text-sm text-muted-foreground my-3"
          items={[
            authorLabel && <span className="font-medium">{authorLabel}</span>,
            publishedAt && formatReadableDate(publishedAt),
            readingTimeLabel,
          ]}
        />

        {sanitizedDescription && (
          <div className="line-clamp-4">
            <p>{sanitizedDescription}</p>
          </div>
        )}
      </div>

      {metaImage && typeof metaImage !== 'string' && (
        <div className="order-1 md:order-2 md:col-span-3 rounded-lg w-full aspect-[16/9] md:aspect-auto md:h-full overflow-hidden">
          <Media
            resource={metaImage}
            size="50vw"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
    </article>
  )
}
