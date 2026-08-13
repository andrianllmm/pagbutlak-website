import type { Metadata } from 'next/types'

import { IssuesArchive } from '@/components/IssuesArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

export const revalidate = 600

const ISSUES_SELECT = {
  title: true,
  volume: true,
  issueNumber: true,
  coverImage: true,
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

  const issues = await payload.find({
    collection: 'issues',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: ISSUES_SELECT,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Issues</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collectionLabels={{ plural: 'Issues', singular: 'Issue' }}
          currentPage={issues.page}
          limit={12}
          totalDocs={issues.totalDocs}
        />
      </div>

      <IssuesArchive items={issues.docs} />

      <div className="container">
        {issues?.page && issues?.totalPages > 1 && (
          <Pagination page={issues.page} totalPages={issues.totalPages} basePath="/issues" />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Issues Page ${pageNumber || ''} | Pagbutlak`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'issues',
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
