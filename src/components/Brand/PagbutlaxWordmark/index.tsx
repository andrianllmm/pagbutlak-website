'use client'

import { Lobster } from 'next/font/google'
import { useState } from 'react'

import { cn } from '@/utilities/ui'

const lobster = Lobster({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const LETTERS: { char: string; color: string; font: 'lobster' | 'sans' }[] = [
  { char: 'P', color: '#E2664F', font: 'lobster' },
  { char: 'A', color: '#F0A458', font: 'sans' },
  { char: 'G', color: '#F0CA5C', font: 'sans' },
  { char: 'B', color: '#B7D46B', font: 'lobster' },
  { char: 'U', color: '#6FBF73', font: 'sans' },
  { char: 'T', color: '#4FB6A8', font: 'sans' },
  { char: 'L', color: '#5B8FD9', font: 'lobster' },
  { char: 'A', color: '#7C7FE0', font: 'sans' },
  { char: 'X', color: '#9B72C4', font: 'sans' },
]

interface Props {
  className?: string
  // When true, letters start in the normal foreground color and
  // only reveal their rainbow colors on hover.
  interactive?: boolean
}

export const PagbutlaxWordmark = ({ className, interactive = false }: Props) => {
  const [hovered, setHovered] = useState(false)
  const showRainbow = !interactive || hovered

  return (
    <span
      className={cn('normal-case', className)}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
    >
      {LETTERS.map(({ char, color, font }, index) => (
        <span
          key={index}
          className={cn(
            'transition-colors duration-300',
            font === 'lobster' ? lobster.className : 'font-sans font-bold',
          )}
          style={{ color: showRainbow ? color : undefined }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
