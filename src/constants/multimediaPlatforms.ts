export const MULTIMEDIA_PLATFORMS = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'TikTok', value: 'tiktok' },
] as const

export type MultimediaPlatform = (typeof MULTIMEDIA_PLATFORMS)[number]['value']
