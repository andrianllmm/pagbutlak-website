export const ARTICLE_SECTIONS = [
  { label: 'News', value: 'news' },
  { label: 'Opinion', value: 'opinion' },
  { label: 'Feature', value: 'feature' },
  { label: 'Kultura', value: 'kultura' },
  { label: 'Sports', value: 'sports' },
  { label: 'Multimedia', value: 'multimedia' },
  { label: 'Issues', value: 'issues' },
] as const

export type ArticleSection = (typeof ARTICLE_SECTIONS)[number]['value']
