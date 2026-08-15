import type { Metadata } from 'next/types'
import { SectionArchive } from '@/components/SectionArchive'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return <SectionArchive section="kultura" sectionLabel="Kultura" />
}

export function generateMetadata(): Metadata {
  const title = 'Kultura | Pagbutlak'
  const description = 'Browse Kultura articles from Pagbutlak, UPV CAS.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/kultura' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
