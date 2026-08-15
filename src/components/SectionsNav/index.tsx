import { Dice5 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SECTIONS_NAV_ITEMS = [
  { label: 'News', href: '/news' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Features', href: '/features' },
  { label: 'Kultura', href: '/kultura' },
  { label: 'Sports', href: '/sports' },
  { label: 'Multimedia', href: '/multimedia' },
  { label: 'Issues', href: '/issues' },
  {
    label: (
      <span className="inline-flex items-center gap-1">
        <Dice5 className="size-4" />
        Games
      </span>
    ),
    href: '/games',
  },
]

export const SectionsNav: React.FC = () => {
  return (
    <div className="container">
      <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border py-3 px-12">
        {SECTIONS_NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-primary"
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
