'use client'
import Link from 'next/link'
import React from 'react'

import { CardMeta } from '@/components/CardMeta'
import { Media } from '@/components/Media'
import { formatReadableDate } from '@/utilities/formatReadableDate'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import type { Issue } from '@/payload-types'

export type CardDoc = Pick<Issue, 'volume' | 'issueNumber' | 'title' | 'coverImage' | 'publishedAt'>

export const IssueCard: React.FC<{
  className?: string
  doc: CardDoc
}> = ({ className, doc }) => {
  const { card, link } = useClickableCard({})
  const { volume, issueNumber, title, coverImage, publishedAt } = doc

  const href = `/issues/${volume}/${issueNumber}`

  return (
    <article
      className={cn(
        'group p-3 rounded-lg overflow-hidden bg-card transition-colors duration-300 hover:bg-accent hover:text-accent-foreground hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative mb-2 rounded-lg w-full aspect-[3/4] overflow-hidden bg-muted">
        {coverImage && typeof coverImage === 'object' && (
          <Media
            resource={coverImage}
            fill
            size="25vw"
            imgClassName="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        )}
      </div>

      <div>
        <div className="prose mb-1">
          <h3 className="line-clamp-2 text-base">
            <Link className="not-prose" href={href} ref={link.ref}>
              {title}
            </Link>
          </h3>
        </div>

        <CardMeta
          className="text-xs text-muted-foreground"
          items={[
            `Vol. ${volume}, No. ${issueNumber}`,
            publishedAt && formatReadableDate(publishedAt),
          ]}
        />
      </div>
    </article>
  )
}
