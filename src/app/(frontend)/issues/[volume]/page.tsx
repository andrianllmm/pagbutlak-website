import type { Metadata } from 'next/types'

import { IssuesArchive } from '@/components/IssuesArchive'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

export const revalidate = 600

type Args = {
  params: Promise<{
    volume: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { volume } = await paramsPromise
  const sanitizedVolume = Number(volume)

  if (!Number.isInteger(sanitizedVolume)) notFound()

  const payload = await getPayload({ config: configPromise })

  const issues = await payload.find({
    collection: 'issues',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-issueNumber',
    where: { volume: { equals: sanitizedVolume }, _status: { equals: 'published' } },
    select: {
      title: true,
      volume: true,
      issueNumber: true,
      coverImage: true,
      publishedAt: true,
    },
  })

  if (issues.totalDocs === 0) notFound()

  if (issues.totalDocs === 1) {
    redirect(`/issues/${sanitizedVolume}/${issues.docs[0]!.issueNumber}`)
  }

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Volume {sanitizedVolume}</h1>
        </div>
      </div>

      <IssuesArchive items={issues.docs} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { volume } = await paramsPromise
  const title = `Volume ${volume} | Pagbutlak`
  const description = `Issues from Volume ${volume} of Pagbutlak, UPV CAS.`

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: `/issues/${volume}` }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
