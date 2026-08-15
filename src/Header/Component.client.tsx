'use client'
import { cn } from '@/utilities/ui'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderDate } from '@/components/HeaderDate'
import { Wordmark } from '@/components/Brand/Wordmark'
import { Logo } from '@/components/Brand/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [homeMastheadPassed, setHomeMastheadPassed] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomepage = pathname === '/'

  useEffect(() => {
    if (!isHomepage) return

    setHomeMastheadPassed(false)

    const masthead = document.getElementById('home-masthead')
    if (!masthead) return

    const observer = new IntersectionObserver(
      ([entry]) => setHomeMastheadPassed(!entry.isIntersecting),
      {
        threshold: 0,
      },
    )
    observer.observe(masthead)

    return () => observer.disconnect()
  }, [isHomepage])

  const showWordmark = !isHomepage || homeMastheadPassed

  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b bg-background transition-colors',
        isScrolled ? 'border-border' : 'border-transparent',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="h-14 grid grid-cols-3 items-center gap-4">
          <HeaderDate />

          <div className="flex justify-self-center">
            <Link
              href="/"
              aria-label="Pagbutlak home"
              className={cn(
                'transition-opacity duration-300',
                showWordmark ? 'opacity-100' : 'opacity-0 pointer-events-none',
              )}
              tabIndex={showWordmark ? undefined : -1}
              aria-hidden={!showWordmark}
            >
              <Logo className="h-[24px] text-foreground md:hidden" />
              <Wordmark className="hidden h-[24px] text-foreground md:block" />
            </Link>
          </div>

          <div className="justify-self-end">
            <HeaderNav data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
