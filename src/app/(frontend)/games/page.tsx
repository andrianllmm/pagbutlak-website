import type { Metadata } from 'next/types'

import { Dice5 } from 'lucide-react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return (
    <div className="container flex min-h-[70svh] flex-col items-center justify-center text-center">
      <Dice5 className="size-10 text-muted-foreground" />

      <span className="mt-4 text-sm font-semibold tracking-widest text-muted-foreground">
        COMING SOON
      </span>

      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Games</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We&apos;re working on something fun. Check back later for games from Pagbutlak.
      </p>
    </div>
  )
}

export function generateMetadata(): Metadata {
  const title = 'Games | Pagbutlak'
  const description = 'Games from Pagbutlak, UPV CAS — coming soon.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/games' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
