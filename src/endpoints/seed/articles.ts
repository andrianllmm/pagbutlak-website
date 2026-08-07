import type { Author, Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

import type { ArticleSection } from '@/constants/articleSections'

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_SHORT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const richText = (
  text: string,
): NonNullable<RequiredDataFromCollectionSlug<'articles'>['content']> => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const ARTICLE_TITLES: Record<ArticleSection, string[]> = {
  news: [
    'University Announces New Scholarship Program',
    'Student Council Elections Set for Next Month',
    'Campus Wifi Upgrade Completed Ahead of Schedule',
    'Library Extends Hours During Finals Week',
  ],
  opinion: [
    'Why Mental Health Support Should Be a Priority',
    'The Case for More Green Spaces on Campus',
    'Rethinking Grading Systems in Higher Education',
    'Student Voices Matter in University Decisions',
  ],
  feature: [
    'Meet the Students Behind the Campus Garden Project',
    'A Day in the Life of a Working Student',
    'Alumni Spotlight: From Campus to Career',
    'Exploring Local Food Spots Near Campus',
  ],
  kultura: [
    'Traditional Dance Troupe Wins National Competition',
    'Preserving Local Folklore Through Student Films',
    'Campus Celebrates Cultural Diversity Week',
    'Student Artists Showcase Work at Annual Exhibit',
  ],
}

export const generateSeedArticles = ({
  heroImage,
  authors,
}: {
  heroImage: Media
  authors: Author[]
}): RequiredDataFromCollectionSlug<'articles'>[] => {
  const sections = Object.keys(ARTICLE_TITLES) as ArticleSection[]
  const articlesPerSection = ARTICLE_TITLES[sections[0]].length

  const articles: RequiredDataFromCollectionSlug<'articles'>[] = []

  // interleave sections so consecutive articles vary in section, giving the
  // homepage's "latest" queries a natural mix instead of one section dominating
  for (let round = 0; round < articlesPerSection; round++) {
    for (const section of sections) {
      const title = ARTICLE_TITLES[section][round]
      const author = authors[articles.length % authors.length]
      const publishedAt = new Date(Date.now() - articles.length * 13 * 60 * 1000).toISOString()

      articles.push({
        slug: slugify(title),
        _status: 'published',
        authors: [author.id],
        section,
        title,
        publishedAt,
        heroImage: heroImage.id,
        content: richText(LOREM),
        meta: {
          title,
          description: LOREM_SHORT,
          image: heroImage.id,
        },
      })
    }
  }

  return articles
}
