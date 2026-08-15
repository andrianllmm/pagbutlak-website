import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      centered?: boolean
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ centered, children, richText }) => {
  return (
    <div className="container mt-16">
      <div className={cn('max-w-[48rem]', centered && 'mx-auto text-center')}>
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
