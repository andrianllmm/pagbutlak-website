import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import { Card, type CardDoc } from '@/components/Articles/Card'
import { Button } from '@/components/ui/button'

type Props = {
  articles: CardDoc[]
  className?: string
  columnsClassName?: string
  href: string
  title: string
}

export const HomeSectionRow: React.FC<Props> = ({
  articles,
  className,
  columnsClassName = 'sm:grid-cols-2 lg:grid-cols-3',
  href,
  title,
}) => {
  if (!articles || articles.length === 0) {
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

      <div className={cn('grid grid-cols-1 gap-4', columnsClassName)}>
        {articles.map((article, index) => (
          <Card key={index} className="h-full" doc={article} relationTo="articles" />
        ))}
      </div>
    </div>
  )
}
