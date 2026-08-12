import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import { MultimediaCard, type CardDoc } from '@/components/Multimedia/MultimediaCard'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type Props = {
  className?: string
  href: string
  items: CardDoc[]
  title: string
}

export const MultimediaSectionRow: React.FC<Props> = ({ className, href, items, title }) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="mb-0">{title}</h2>
        </div>
        <Button asChild variant="link" size="clear">
          <Link href={href}>See more</Link>
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {items.map((item, index) => (
            <div className="w-44 shrink-0 sm:w-52 lg:w-60" key={index}>
              <MultimediaCard className="h-full" doc={item} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
