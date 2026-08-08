import Link from 'next/link'
import React from 'react'

import { AuthorCard } from '@/components/Authors/AuthorCard'
import { Button } from '@/components/ui/button'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function NotFound() {
  const payload = await getPayload({ config: configPromise })

  const authors = await payload.find({
    collection: 'authors',
    depth: 1,
    limit: 3,
    sort: '-createdAt',
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      role: true,
      bio: true,
      avatar: true,
    },
  })

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center py-24">
      <div className="container flex flex-col items-center text-center">
        <span className="text-sm font-semibold tracking-widest text-muted-foreground">404</span>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">This author couldn&apos;t be found.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          It may have been moved, unpublished, or never existed. Here are some authors you might be
          interested in instead.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/authors">Browse all authors</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">Search articles</Link>
          </Button>
        </div>
      </div>

      {authors.docs.length > 0 && (
        <div className="container mt-20">
          <h2 className="mb-6 text-center text-xl font-semibold">Authors you might know</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.docs.map((author) => (
              <AuthorCard key={author.id} doc={author} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
