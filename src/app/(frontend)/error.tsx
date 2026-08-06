'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center py-24">
      <div className="container flex flex-col items-center text-center">
        <span className="text-sm font-semibold tracking-widest text-muted-foreground">Error</span>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Something went wrong.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again or head back home.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="default" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
