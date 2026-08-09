import type { Where } from 'payload'
import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { ARTICLE_SECTIONS } from '@/constants/articleSections'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import { SearchFilters } from '@/search/SearchFilters'
import PageClient from './page.client'
import { CardDoc } from '@/components/Articles/ArticleCard'

type Args = {
  searchParams: Promise<{
    q?: string
    section?: string
    author?: string
    from?: string
    to?: string
    readingTime?: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query, section, author, from, to, readingTime } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const authorOptions = await payload.find({
    collection: 'authors',
    limit: 1000,
    pagination: false,
    sort: 'name',
    select: { name: true },
  })

  const conditions: Where[] = []

  if (query) {
    conditions.push({
      or: [
        { title: { like: query } },
        { 'meta.description': { like: query } },
        { 'meta.title': { like: query } },
        { slug: { like: query } },
      ],
    })
  }

  if (section) {
    conditions.push({ section: { equals: section } })
  }

  if (author) {
    conditions.push({ authors: { equals: author } })
  }

  if (from) {   
    const fromDate = new Date(from)   
    //Guardrail for non NaN inputs
    if (!Number.isNaN(fromDate.getTime())) {
      conditions.push({ publishedAt: { greater_than_equal: fromDate.toISOString() } })
    }
  }

  if (to) {
    const toDate = new Date(`${to}T23:59:59`)
    if (!Number.isNaN(toDate.getTime())) {
      conditions.push({ publishedAt: { less_than_equal: toDate.toISOString() } })
    }
  }

  if (readingTime === 'under5') {
    conditions.push({ readingTimeMinutes: { less_than: 5 } })
  } else if (readingTime === '5to10') {
    conditions.push({ readingTimeMinutes: { greater_than_equal: 5 } })
    conditions.push({ readingTimeMinutes: { less_than: 10 } })
  } else if (readingTime === '10plus') {
    conditions.push({ readingTimeMinutes: { greater_than_equal: 10 } })
  }

  const articles = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
      authors: true,
      readingTimeMinutes: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(conditions.length > 0 ? { where: { and: conditions } } : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <SearchFilters
              sections={ARTICLE_SECTIONS}
              authors={authorOptions.docs.map((doc) => ({
                label: doc.name,
                value: String(doc.id),
              }))}
            >
              <Search />
            </SearchFilters>
          </div>
        </div>
      </div>

      {articles.totalDocs > 0 ? (
        <CollectionArchive articles={articles.docs as CardDoc[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Pagbutlak Search`,
  }
}
