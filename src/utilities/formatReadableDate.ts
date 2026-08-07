// Fixed to UP Visayas' timezone so server and client render the same date
// regardless of the host machine's local timezone (avoids hydration mismatches).
const READABLE_DATE_TIME_ZONE = 'Asia/Manila'

export const formatReadableDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: READABLE_DATE_TIME_ZONE,
  })
}
