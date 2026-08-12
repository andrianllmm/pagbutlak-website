import type { Metadata } from 'next/types'

import { MultimediaArchive } from '@/components/MultimediaArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const MULTIMEDIA_SELECT = {
  title: true,
  slug: true,
  links: true,
  thumbnail: true,
  autoThumbnailUrl: true,
  publishedAt: true,
} as const

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const multimedia = await payload.find({
    collection: 'multimedia',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: MULTIMEDIA_SELECT,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Multimedia</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collectionLabels={{ plural: 'Videos', singular: 'Video' }}
          currentPage={multimedia.page}
          limit={12}
          totalDocs={multimedia.totalDocs}
        />
      </div>

      <MultimediaArchive items={multimedia.docs} />

      <div className="container">
        {multimedia.totalPages > 1 && multimedia.page && (
          <Pagination
            page={multimedia.page}
            totalPages={multimedia.totalPages}
            basePath="/multimedia"
          />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Multimedia | Pagbutlak',
  }
}
