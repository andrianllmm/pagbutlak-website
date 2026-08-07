'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type FooterNavItem = NonNullable<NonNullable<Footer['navGroups']>[number]['navItems']>[number]

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<FooterNavItem>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}
