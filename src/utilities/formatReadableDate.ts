import { SITE_TIME_ZONE } from '@/constants/timeZone'

export const formatReadableDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: SITE_TIME_ZONE,
  })
}
