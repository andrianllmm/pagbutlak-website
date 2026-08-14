import { cn } from '@/utilities/ui'
import React from 'react'

import { IssueCard, type CardDoc } from '@/components/Issues/IssueCard'

export type Props = {
  items: CardDoc[]
}

export const IssuesArchive: React.FC<Props> = ({ items }) => {
  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
        {items?.map((item, index) => (
          <IssueCard key={index} className="h-full" doc={item} />
        ))}
      </div>
    </div>
  )
}
