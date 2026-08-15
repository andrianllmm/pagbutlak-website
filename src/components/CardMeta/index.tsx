import React from 'react'

import { cn } from '@/utilities/ui'

export const CardMeta: React.FC<{
  className?: string
  items: React.ReactNode[]
}> = ({ className, items }) => {
  const visibleItems = items.filter(Boolean)

  if (visibleItems.length === 0) return null

  return (
    <div className={cn('overflow-hidden text-ellipsis whitespace-nowrap', className)}>
      {visibleItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span aria-hidden="true"> &middot; </span>}
          {item}
        </React.Fragment>
      ))}
    </div>
  )
}
