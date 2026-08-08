import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { queryCategoryBySlug } from '../../page'

export const revalidate = 600

type Args = {
  params: Promise<{
    slug?: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '', pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const category = await queryCategoryBySlug({ slug })

  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    where: {
      categories: { in: [category.id] },
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
      </div>

      <div className="container mb-8">
        <PageRange
          collection="articles"
          currentPage={articles.page}
          limit={12}
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

  const params: { slug: string; pageNumber: string }[] = []

  for (const { id, slug } of categories.docs) {
    if (!slug) continue

    const { totalDocs } = await payload.count({
      collection: 'articles',
      overrideAccess: false,
      where: {
        categories: { in: [id] },
        _status: { equals: 'published' },
      },
    })

    const totalPages = Math.ceil(totalDocs / 12)

    for (let i = 1; i <= totalPages; i++) {
      params.push({ slug, pageNumber: String(i) })
    }
  }

  return params
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', pageNumber } = await paramsPromise
  const category = await queryCategoryBySlug({ slug })

  return {
    title: category
      ? `${category.title} Page ${pageNumber || ''} | Pagbutlak`
      : 'Pagbutlak Categories',
  }
}
