import type { Metadata } from 'next/types'

import { PartyPopper } from 'lucide-react'

import { PagbutlaxWordmark } from '@/components/Brand/PagbutlaxWordmark'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return (
    <div className="container flex min-h-[70svh] flex-col items-center justify-center text-center">
      <PartyPopper className="size-10 text-muted-foreground" />

      <span className="mt-4 text-sm font-semibold tracking-widest text-muted-foreground">
        COMING SOON
      </span>

      <h1 className="mt-2 text-4xl md:text-5xl">
        <PagbutlaxWordmark />
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Sports, entertainment, and everything else Pagbutlak covers on the lighter side.
      </p>
    </div>
  )
}

export function generateMetadata(): Metadata {
  const title = 'Pagbutlax | Pagbutlak'
  const description = 'Pagbutlax, the sports and entertainment arm of Pagbutlak. Coming soon.'

  return {
    description,
    openGraph: mergeOpenGraph({ description, title, url: '/pagbutlax' }),
    title,
    twitter: mergeTwitter({ description, title }),
  }
}
