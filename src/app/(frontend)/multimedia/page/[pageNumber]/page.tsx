import type { Metadata } from 'next/types'

import { MultimediaArchive } from '@/components/MultimediaArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

export const revalidate = 600

const MULTIMEDIA_SELECT = {
  title: true,
  slug: true,
  platform: true,
  thumbnail: true,
  autoThumbnailUrl: true,
  publishedAt: true,
} as const

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const multimedia = await payload.find({
    collection: 'multimedia',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
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
        {multimedia?.page && multimedia?.totalPages > 1 && (
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Multimedia Page ${pageNumber || ''} | Pagbutlak`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'multimedia',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
