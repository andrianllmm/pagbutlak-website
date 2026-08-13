import type { Metadata } from 'next'

import { Download } from 'lucide-react'
import { Media } from '@/components/Media'
import { PDFViewer } from '@/components/PDFViewer'
import { Button } from '@/components/ui/button'
import { formatReadableDate } from '@/utilities/formatReadableDate'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

type Args = {
  params: Promise<{
    volume?: string
    issueNumber?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const issues = await payload.find({
    collection: 'issues',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      volume: true,
      issueNumber: true,
    },
  })
  return issues.docs.map(({ volume, issueNumber }) => ({
    volume: String(volume),
    issueNumber: String(issueNumber),
  }))
}

export default async function IssuePage({ params: paramsPromise }: Args) {
  const { volume, issueNumber } = await paramsPromise
  const item = await queryIssueByVolumeAndNumber({ volume, issueNumber })

  if (!item) {
    notFound()
  }

  const pdfUrl = item.pdf && typeof item.pdf === 'object' ? getMediaUrl(item.pdf.url) : null

  return (
    <article className="pt-12 pb-16">
      <div className="container max-w-[56rem]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,16rem)_1fr] gap-8 items-start mb-12">
          {item.coverImage && typeof item.coverImage === 'object' && (
            <div className="relative rounded-lg overflow-hidden w-full max-w-[16rem] mx-auto lg:mx-0 aspect-[3/4] bg-muted">
              <Media resource={item.coverImage} fill imgClassName="object-cover" />
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Vol. {item.volume}, No. {item.issueNumber}
            </div>

            <div className="prose dark:prose-invert max-w-none mb-4">
              <h1>{item.title}</h1>
            </div>

            {item.publishedAt && (
              <div className="text-sm text-muted-foreground mb-4">
                {formatReadableDate(item.publishedAt)}
              </div>
            )}

            {item.description && (
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p>{item.description}</p>
              </div>
            )}

            {pdfUrl && (
              <Button asChild>
                <a download href={pdfUrl} className="flex items-center justify-center gap-1">
                  <Download className="size-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>

        {pdfUrl && <PDFViewer src={pdfUrl} title={`${item.title} PDF`} />}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { volume, issueNumber } = await paramsPromise
  const item = await queryIssueByVolumeAndNumber({ volume, issueNumber })

  return {
    title: item ? `${item.title} | Pagbutlak` : 'Issues | Pagbutlak',
  }
}

const queryIssueByVolumeAndNumber = cache(
  async ({ volume, issueNumber }: { volume?: string; issueNumber?: string }) => {
    const sanitizedVolume = Number(volume)
    const sanitizedIssueNumber = Number(issueNumber)

    if (!Number.isInteger(sanitizedVolume) || !Number.isInteger(sanitizedIssueNumber)) {
      return null
    }

    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'issues',
      depth: 2,
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        volume: { equals: sanitizedVolume },
        issueNumber: { equals: sanitizedIssueNumber },
      },
    })
    return result.docs?.[0] || null
  },
)
