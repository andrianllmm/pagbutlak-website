import { differenceInMinutes } from 'date-fns'

import { formatReadableDate } from '@/utilities/formatReadableDate'

// Fixed to UP Visayas' timezone so server and client render the same date
// regardless of the host machine's local timezone (avoids hydration mismatches).
const HUMAN_DATE_TIME_ZONE = 'Asia/Manila'

const getManilaDayKey = (date: Date): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HUMAN_DATE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return Date.UTC(Number(lookup.year), Number(lookup.month) - 1, Number(lookup.day))
}

const formatManilaTime = (date: Date): string =>
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: HUMAN_DATE_TIME_ZONE,
  })

// Humanizes a date relative to `now`: "Just now", "10 mins ago",
// "Today at 3:45 PM", "Yesterday at 3:45 PM", falling back to an
// absolute date (e.g. "Jan 1, 2026") for anything older.
export const formatHumanDate = (dateString: string, now: Date = new Date()): string => {
  const date = new Date(dateString)
  const minutesAgo = differenceInMinutes(now, date)

  if (minutesAgo < 1) return 'Just now'
  if (minutesAgo < 60) return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`

  const dayDiff = (getManilaDayKey(now) - getManilaDayKey(date)) / 86_400_000

  if (dayDiff === 0) return `Today at ${formatManilaTime(date)}`
  if (dayDiff === 1) return `Yesterday at ${formatManilaTime(date)}`

  return formatReadableDate(dateString)
}
