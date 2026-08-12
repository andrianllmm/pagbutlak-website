import React from 'react'

import { MultimediaCard, type CardDoc } from '@/components/Multimedia/MultimediaCard'
import { cn } from '@/utilities/ui'

export type RelatedMultimediaProps = {
  className?: string
  docs?: CardDoc[]
}

export const RelatedMultimedia: React.FC<RelatedMultimediaProps> = ({ className, docs }) => {
  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
        {docs?.map((doc, index) => (
          <MultimediaCard className="h-full" doc={doc} key={index} />
        ))}
      </div>
    </div>
  )
}
