import { SiFacebook, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Wordmark } from '@/components/Brand/Wordmark'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const { description, socialLinks, navGroups } = footerData || {}
  const year = new Date().getFullYear()

  const socialItems = [
    { href: socialLinks?.facebook, label: 'Facebook', icon: SiFacebook },
    { href: socialLinks?.x, label: 'X', icon: SiX },
    { href: socialLinks?.instagram, label: 'Instagram', icon: SiInstagram },
    { href: socialLinks?.youtube, label: 'YouTube', icon: SiYoutube },
  ].filter(
    (item): item is { href: string; label: string; icon: typeof SiFacebook } =>
      typeof item.href === 'string' && item.href.length > 0,
  )

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container py-12 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="flex flex-col items-start gap-4">
          <Link href="/">
            <Wordmark className="h-8 text-foreground" />
          </Link>

          {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}

          {socialItems.length > 0 && (
            <div className="flex items-center gap-4">
              {socialItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {(navGroups || []).map((group, i) => (
            <div key={i}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                {group.title}
              </h3>
              <nav className="flex flex-col gap-2">
                {(group.navItems || []).map(({ link }, j) => (
                  <CMSLink
                    key={j}
                    {...link}
                    appearance="inline"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container grid grid-cols-1 items-center gap-4 py-6 md:grid-cols-3">
          <div className="hidden md:block" />
          <p className="text-center text-xs text-muted-foreground">
            <span className="whitespace-nowrap">&copy; {year} UPV Pagbutlak.</span>{' '}
            <span className="whitespace-nowrap">All rights reserved.</span>
          </p>
          <div className="justify-self-center md:justify-self-end">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
