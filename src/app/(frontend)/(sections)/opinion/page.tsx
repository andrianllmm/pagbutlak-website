import type { Metadata } from 'next/types'
import { SectionArchive } from '@/components/SectionArchive'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return <SectionArchive section="opinion" sectionLabel="Opinion" />
}

export function generateMetadata(): Metadata {
  const title = 'Opinion | Pagbutlak'
  const description = 'Browse Opinion articles from Pagbutlak, UPV CAS.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/opinion' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
