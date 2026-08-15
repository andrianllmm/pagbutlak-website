'use client'
import { CalendarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const HeaderDate: React.FC = () => {
  /* Storing the value in a useState to avoid hydration errors */
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  const day = now?.toLocaleDateString('en-US', { weekday: 'long' })
  const fullDate = now?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-1.5 text-foreground">
      <CalendarIcon className="size-4 shrink-0" />
      <div className="leading-tight">
        <div className="text-xs font-semibold">{day}</div>
        <div className="text-[11px] text-muted-foreground">{fullDate}</div>
      </div>
    </div>
  )
}
