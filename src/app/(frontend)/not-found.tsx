import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex min-h-[70svh] flex-col items-center justify-center text-center">
      <span className="text-sm font-semibold tracking-widest text-muted-foreground">404</span>

      <h1 className="mt-2 text-3xl font-bold md:text-4xl">This page has gone off the record.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for. It may have been moved, renamed, or
        never existed.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="default">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">Search articles</Link>
        </Button>
      </div>
    </div>
  )
}
