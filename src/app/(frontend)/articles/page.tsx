import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      readingTimeMinutes: true,
      meta: true,
      publishedAt: true,
      authors: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Articles</h1>
        </div>
      </div>

      <CollectionArchive articles={articles.docs} />

      <div className="container">
        {articles.totalPages > 1 && articles.page && (
          <Pagination page={articles.page} totalPages={articles.totalPages} basePath="/articles" />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  const title = `Articles | Pagbutlak`
  const description = 'Browse all articles from Pagbutlak, UPV CAS.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/articles' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
