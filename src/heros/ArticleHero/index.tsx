import React from 'react'
import type { Article } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatHumanDate } from '@/utilities/formatHumanDate'
import { CategoryBadge } from '@/components/Categories/CategoryBadge'
import { formatReadingTime } from '@/utilities/readingTime'
import { SocialMediaShare } from '@/components/SocialMediaShare'
import { getServerSideURL } from '@/utilities/getURL'

export const ArticleHero: React.FC<{
  article: Article
}> = ({ article }) => {
  const { categories, heroImage, publishedAt, slug, updatedAt, title } = article

  const publishedDate = publishedAt ? formatHumanDate(publishedAt) : null
  const updatedDate = updatedAt ? formatHumanDate(updatedAt) : null
  const readingTimeLabel = formatReadingTime(article.readingTimeMinutes)
  const showUpdated = updatedDate && updatedDate !== publishedDate
  const shareURL = `${getServerSideURL()}/articles/${slug}`

  return (
    <div className="w-full border-b border-border pb-8 mb-8 flex flex-col gap-6">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            if (typeof category !== 'object' || category === null) return null

            return <CategoryBadge key={category.id} category={category} />
          })}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
        {title}
      </h1>

      <div className="flex flex-col gap-2">
        {/* Date */}
        {(publishedDate || showUpdated) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
            {publishedDate && <time dateTime={publishedAt!}>{publishedDate}</time>}
            {showUpdated && (
              <time dateTime={updatedAt} className="text-muted-foreground/50">
                Updated {updatedDate}
              </time>
            )}
          </div>
        )}

        {/* Reading time + share */}
        <div className="flex items-center gap-4">
          {readingTimeLabel && (
            <div className="text-sm text-muted-foreground">{readingTimeLabel}</div>
          )}
          <SocialMediaShare title={title} url={shareURL} />
        </div>
      </div>

      {/* Hero image */}
      {heroImage && typeof heroImage !== 'string' && (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-muted">
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        </div>
      )}
    </div>
  )
}
