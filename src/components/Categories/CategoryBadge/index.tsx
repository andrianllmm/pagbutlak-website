import Link from 'next/link'
import React from 'react'
import type { VariantProps } from 'class-variance-authority'

import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

export type CategoryBadgeDoc = {
  id: string | number
  title: string
  slug?: string | null
}

export const CategoryBadge: React.FC<{
  category: CategoryBadgeDoc
  className?: string
  variant?: VariantProps<typeof badgeVariants>['variant']
}> = ({ category, className, variant = 'outline' }) => {
  const { title, slug } = category

  if (!slug) return null

  return (
    <Link href={`/categories/${slug}`} className={cn(badgeVariants({ variant }), className)}>
      {title}
    </Link>
  )
}
