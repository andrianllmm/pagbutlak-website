import Link from 'next/link'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Button } from '@/components/ui/button'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function NotFound() {
  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 3,
    sort: '-publishedAt',
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
    <div className="flex min-h-[70svh] flex-col items-center justify-center py-24">
      <div className="container flex flex-col items-center text-center">
        <span className="text-sm font-semibold tracking-widest text-muted-foreground">404</span>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          This article couldn&apos;t be found.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          It may have been moved, unpublished, or never existed. Here are some recent articles you
          might be interested in instead.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/articles">Browse all articles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">Search articles</Link>
          </Button>
        </div>
      </div>

      {articles.docs.length > 0 && (
        <div className="mt-20 w-full">
          <h2 className="mb-6 text-center text-xl font-semibold">Recent articles</h2>
          <CollectionArchive articles={articles.docs} />
        </div>
      )}
    </div>
  )
}
