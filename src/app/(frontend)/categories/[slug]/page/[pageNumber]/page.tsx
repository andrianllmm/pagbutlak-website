import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'

import { CategoryBadge } from '@/components/Categories/CategoryBadge'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { queryCategoryAndChildIds, queryCategoryBySlug, queryCategoryChildren } from '../../queries'

export const revalidate = 600

const ARTICLE_LIMIT = 12

type Args = {
  params: Promise<{
    slug?: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '', pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const category = await queryCategoryBySlug({ slug })

  if (!category) notFound()

  const payload = await getPayload({ config: configPromise })
  const children = await queryCategoryChildren({ categoryId: category.id })
  const categoryIds = [category.id, ...children.map((child) => child.id)]

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: ARTICLE_LIMIT,
    page: sanitizedPageNumber,
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
                <CategoryBadge category={child} />
              </li>
            ))}
          </ul>
        )}
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

    const categoryIds = await queryCategoryAndChildIds({ categoryId: id })

    const { totalDocs } = await payload.count({
      collection: 'articles',
      overrideAccess: false,
      where: {
        categories: { in: categoryIds },
        _status: { equals: 'published' },
      },
    })

    const totalPages = Math.ceil(totalDocs / ARTICLE_LIMIT)

    for (let i = 1; i <= totalPages; i++) {
      params.push({ slug, pageNumber: String(i) })
    }
  }

  return params
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', pageNumber } = await paramsPromise
  const category = await queryCategoryBySlug({ slug })

  if (!category) {
    return { title: 'Categories | Pagbutlak' }
  }

  const title = `${category.title} Page ${pageNumber || ''} | Pagbutlak`
  const description = `Articles and multimedia from Pagbutlak in the ${category.title} category.`

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      title,
      url: `/categories/${category.slug}/page/${pageNumber}`,
    }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
