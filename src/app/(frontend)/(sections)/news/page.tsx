import type { Metadata } from 'next/types'
import { SectionArchive } from '@/components/SectionArchive'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return <SectionArchive section="news" sectionLabel="News" />
}

export function generateMetadata(): Metadata {
  const title = 'News | Pagbutlak'
  const description = 'Browse News articles from Pagbutlak, UPV CAS.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/news' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
