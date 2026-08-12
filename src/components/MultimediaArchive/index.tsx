import { cn } from '@/utilities/ui'
import React from 'react'

import { MultimediaCard, type CardDoc } from '@/components/Multimedia/MultimediaCard'

export type Props = {
  items: CardDoc[]
}

export const MultimediaArchive: React.FC<Props> = ({ items }) => {
  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
        {items?.map((item, index) => (
          <MultimediaCard key={index} className="h-full" doc={item} />
        ))}
      </div>
    </div>
  )
}
