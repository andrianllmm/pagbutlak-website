import type { Metadata } from 'next/types'

import { IssuesArchive } from '@/components/IssuesArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const ISSUES_SELECT = {
  title: true,
  volume: true,
  issueNumber: true,
  coverImage: true,
  publishedAt: true,
} as const

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const issues = await payload.find({
    collection: 'issues',
    depth: 1,
    limit: 12,
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
        {issues.totalPages > 1 && issues.page && (
          <Pagination page={issues.page} totalPages={issues.totalPages} basePath="/issues" />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Issues | Pagbutlak',
  }
}
