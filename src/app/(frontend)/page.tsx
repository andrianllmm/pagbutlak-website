import type { Metadata } from 'next'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ARTICLE_SECTIONS } from '@/constants/articleSections'
import { CompactCard } from '@/components/Articles/CompactCard'
import { FeaturedCard } from '@/components/Articles/FeaturedCard'
import { HomeMasthead } from '@/components/HomeMasthead'
import { HomeSectionRow } from '@/components/HomeSectionRow'
import { SectionsNav } from '@/components/SectionsNav'
import type { CardDoc } from '@/components/Articles/Card'

const ARTICLE_SELECT = {
  title: true,
  slug: true,
  categories: true,
  readingTimeMinutes: true,
  meta: true,
  publishedAt: true,
  authors: true,
} as const

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const featuredResult = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    select: ARTICLE_SELECT,
  })

  const featured = featuredResult.docs[0]

  const sidebarWhere: Where = featured
    ? { and: [{ _status: { equals: 'published' } }, { id: { not_equals: featured.id } }] }
    : { _status: { equals: 'published' } }

  const [sidebarResult, ...sectionResults] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 6,
      overrideAccess: false,
      sort: '-publishedAt',
      where: sidebarWhere,
      select: ARTICLE_SELECT,
    }),
    ...ARTICLE_SECTIONS.map(({ value }) =>
      payload.find({
        collection: 'articles',
        depth: 1,
        limit: value === 'kultura' ? 4 : 3,
        overrideAccess: false,
        sort: '-publishedAt',
        where: { section: { equals: value }, _status: { equals: 'published' } },
        select: ARTICLE_SELECT,
      }),
    ),
  ])

  const sectionArticles = Object.fromEntries(
    ARTICLE_SECTIONS.map(({ value }, index) => [value, sectionResults[index]?.docs ?? []]),
  ) as unknown as Record<(typeof ARTICLE_SECTIONS)[number]['value'], CardDoc[]>

  const kulturaSection = ARTICLE_SECTIONS.find((section) => section.value === 'kultura')
  const columnSections = ARTICLE_SECTIONS.filter((section) => section.value !== 'kultura')

  return (
    <article className="pb-24">
      <HomeMasthead />
      <SectionsNav />

      <div className="container pt-8">
        {featured && <FeaturedCard doc={featured} relationTo="articles" />}
      </div>

      <div className="container mt-8">
        <div className="border-t border-border" />
      </div>

      <div className="container mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">
          {columnSections.map((section, index) => (
            <React.Fragment key={section.value}>
              {index > 0 && <div className="border-t border-border" />}
              <HomeSectionRow
                articles={sectionArticles[section.value]}
                href={`/${section.value === 'feature' ? 'features' : section.value}`}
                title={section.label}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="lg:col-span-1 lg:border-l lg:border-border lg:pl-8">
          <div className="prose dark:prose-invert max-w-none mb-4">
            <h2 className="mb-0">Latest</h2>
          </div>
          <div className="flex flex-col gap-2">
            {sidebarResult.docs.map((article, index) => (
              <CompactCard key={index} doc={article} relationTo="articles" />
            ))}
          </div>
        </div>
      </div>

      {kulturaSection && sectionArticles.kultura.length > 0 && (
        <div className="container mt-8">
          <div className="border-t border-border mb-8" />
          <HomeSectionRow
            articles={sectionArticles.kultura}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-4"
            href={`/${kulturaSection.value}`}
            title={kulturaSection.label}
          />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'UP Visayas Pagbutlak',
  }
}
