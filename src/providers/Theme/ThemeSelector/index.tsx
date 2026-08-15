'use client'

import { Moon, Sun, SunMoon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import type { Theme } from './types'

import { useTheme } from '..'
import { defaultTheme, themeLocalStorageKey } from './types'

type ThemePreference = Theme | 'auto'

const THEME_CYCLE: ThemePreference[] = ['light', 'dark', 'auto']

const THEME_ICONS: Record<ThemePreference, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  auto: SunMoon,
}

const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  auto: 'Auto theme',
}

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState<ThemePreference>(defaultTheme)

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue((preference as ThemePreference | null) ?? defaultTheme)
  }, [])

  const onThemeChange = (themeToSet: ThemePreference) => {
    setTheme(themeToSet === 'auto' ? null : themeToSet)
    setValue(themeToSet)
  }

  const handleClick = () => {
    const currentIndex = THEME_CYCLE.indexOf(value)
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length]
    onThemeChange(nextTheme)
  }

  const Icon = THEME_ICONS[value]

  return (
    <Button
      aria-label={`Theme: ${THEME_LABELS[value]}`}
      onClick={handleClick}
      size="icon"
      title={THEME_LABELS[value]}
      type="button"
      variant="ghost"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{THEME_LABELS[value]}</span>
    </Button>
  )
}
