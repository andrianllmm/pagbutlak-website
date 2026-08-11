import type { Metadata } from 'next'

import { MultimediaEmbed } from '@/components/Multimedia/embeds'
import { MULTIMEDIA_PLATFORM_ICONS } from '@/components/Multimedia/platformIcons'
import { MULTIMEDIA_PLATFORMS } from '@/constants/multimediaPlatforms'
import { formatReadableDate } from '@/utilities/formatReadableDate'
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

  const platformLabel =
    MULTIMEDIA_PLATFORMS.find((platform) => platform.value === item.platform)?.label ||
    item.platform
  const PlatformIcon = MULTIMEDIA_PLATFORM_ICONS[item.platform]

  return (
    <article className="pt-12 pb-16">
      <div className="max-w-[56rem] mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-8 lg:items-start">
        <MultimediaEmbed
          className="mx-auto lg:sticky"
          platform={item.platform}
          title={item.title}
          url={item.url}
        />

        <div className="mt-6 lg:mt-0">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <h1>{item.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <PlatformIcon className="size-5" title={platformLabel} />
            {item.publishedAt && <div>{formatReadableDate(item.publishedAt)}</div>}
          </div>

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
      platform: true,
      url: true,
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
