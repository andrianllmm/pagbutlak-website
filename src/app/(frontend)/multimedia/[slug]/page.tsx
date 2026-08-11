import type { Metadata } from 'next'

import { Link as LinkIcon } from 'lucide-react'
import { MultimediaEmbedTabs } from '@/components/Multimedia/MultimediaEmbedTabs'
import { MULTIMEDIA_PLATFORM_ICONS } from '@/components/Multimedia/platformIcons'
import { formatReadableDate } from '@/utilities/formatReadableDate'
import { getPlatformFromUrl } from '@/utilities/multimediaEmbed'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const multimedia = await payload.find({
    collection: 'multimedia',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })
  return multimedia.docs.map(({ slug }) => ({ slug }))
}

export default async function MultimediaPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const item = await queryMultimediaBySlug({ slug: decodedSlug })

  if (!item) {
    notFound()
  }

  return (
    <article className="pt-12 pb-16">
      <div className="max-w-[56rem] mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-8 lg:items-start">
        <MultimediaEmbedTabs
          className="mx-auto lg:sticky"
          links={item.links ?? []}
          title={item.title}
        />

        <div className="mt-6 lg:mt-0">
          <div className="prose dark:prose-invert max-w-none mb-4">
            <h1>{item.title}</h1>
          </div>

          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {item.links.map((linkItem, index) => {
                const platform = getPlatformFromUrl(linkItem.url)
                const Icon = platform ? MULTIMEDIA_PLATFORM_ICONS[platform] : LinkIcon
                return (
                  <a
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    href={linkItem.url}
                    key={index}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="size-5" title={platform ?? 'Link'} />
                  </a>
                )
              })}
            </div>
          )}

          {item.publishedAt && (
            <div className="text-sm text-muted-foreground mb-6">
              {formatReadableDate(item.publishedAt)}
            </div>
          )}

          {item.caption && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{item.caption}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const item = await queryMultimediaBySlug({ slug: decodedSlug })

  return {
    title: item ? `${item.title} | Pagbutlak` : 'Multimedia | Pagbutlak',
  }
}

const queryMultimediaBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'multimedia',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    select: {
      title: true,
      slug: true,
      links: true,
      caption: true,
      publishedAt: true,
    },
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
})
