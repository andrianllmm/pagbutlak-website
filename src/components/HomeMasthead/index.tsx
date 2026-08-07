import Link from 'next/link'
import React from 'react'

import { Wordmark } from '@/components/brand/Wordmark'

export const HomeMasthead: React.FC = () => {
  return (
    <div id="home-masthead" className="container flex justify-center py-8">
      <Link href="/" aria-label="Pagbutlak home">
        <Wordmark className="h-16 md:h-20 text-foreground" />
      </Link>
    </div>
  )
}
