import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { queryCategoryBySlug, queryCategoryChildren } from './queries'

export const revalidate = 600

const ARTICLE_LIMIT = 12

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const category = await queryCategoryBySlug({ slug })

  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })
  const children = await queryCategoryChildren({ categoryId: category.id })
  const categoryIds = [category.id, ...children.map((child) => child.id)]

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: ARTICLE_LIMIT,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      categories: { in: categoryIds },
      _status: { equals: 'published' },
    },
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
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{category.title}</h1>
        </div>

        {children.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 list-none p-0">
            {children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/categories/${child.slug}`}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="container mb-8">
        <PageRange
          collection="articles"
          currentPage={articles.page}
          limit={ARTICLE_LIMIT}
          totalDocs={articles.totalDocs}
        />
      </div>

      <CollectionArchive articles={articles.docs} />

      <div className="container">
        {articles.totalPages > 1 && articles.page && (
          <Pagination
            page={articles.page}
            totalPages={articles.totalPages}
            basePath={`/categories/${category.slug}`}
          />
        )}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const category = await queryCategoryBySlug({ slug })

  return {
    title: category ? `${category.title} | Pagbutlak` : 'Pagbutlak Categories',
  }
}
