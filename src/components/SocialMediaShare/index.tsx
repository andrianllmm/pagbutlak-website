'use client'

import React, { useEffect, useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { SiFacebook, SiX } from '@icons-pack/react-simple-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  title: string
  url: string
}

type ShareLink = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

export const SocialMediaShare = ({ title, url }: Props) => {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedURL = encodeURIComponent(url)

  const shareLinks: ShareLink[] = [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
      icon: SiFacebook,
      label: 'Share on Facebook',
    },
    {
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`,
      icon: SiX,
      label: 'Share on X',
    },
  ]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
  }

  useEffect(() => {
    if (!copied) return

    const timeout = window.setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [copied])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Share" size="icon" title="Share" type="button" variant="ghost">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            handleCopy()
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Link copied' : 'Copy link'}
        </DropdownMenuItem>

        {shareLinks.map((link) => {
          const Icon = link.icon

          return (
            <DropdownMenuItem asChild key={link.label}>
              <a href={link.href} rel="noreferrer" target="_blank">
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
