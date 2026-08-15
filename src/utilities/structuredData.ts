import type { Article, Author, Footer, Issue, Media, Multimedia, Page } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'
import { getServerSideURL } from './getURL'

const SITE_NAME = 'Pagbutlak'

const absoluteMediaUrl = (media?: Media | number | null): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  return getMediaUrl(media.url)
}

const absoluteUrl = (path: string) => `${getServerSideURL()}${path}`

export const getOrganizationSchema = (footer?: Footer | null) => {
  const sameAs = [
    footer?.socialLinks?.facebook,
    footer?.socialLinks?.x,
    footer?.socialLinks?.instagram,
    footer?.socialLinks?.youtube,
  ].filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: getServerSideURL(),
    logo: absoluteUrl('/og.webp'),
    ...(footer?.description ? { description: footer.description } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export const getWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getServerSideURL(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export const getArticleSchema = (article: Partial<Article>) => {
  const imageUrl = absoluteMediaUrl(article.heroImage)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    dateModified: article.updatedAt || article.publishedAt,
    ...(article.meta?.description ? { description: article.meta.description } : {}),
    author: (article.authors ?? [])
      .filter((author): author is Author => typeof author === 'object')
      .map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: absoluteUrl(`/authors/${author.slug}`),
      })),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/og.webp'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/articles/${article.slug}`),
    },
  }
}

export const getPageSchema = (page: Partial<Page>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: absoluteUrl(`/${Array.isArray(page.slug) ? page.slug.join('/') : (page.slug ?? '')}`),
    ...(page.meta?.description ? { description: page.meta.description } : {}),
  }
}

export const getPersonSchema = (author: Partial<Author>) => {
  const imageUrl = absoluteMediaUrl(author.avatar)

  const sameAs = [
    author.socialLinks?.website,
    author.socialLinks?.facebook,
    author.socialLinks?.x,
    author.socialLinks?.instagram,
    author.socialLinks?.linkedin,
  ].filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: absoluteUrl(`/authors/${author.slug}`),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export const getIssueSchema = (issue: Partial<Issue>) => {
  const coverImageUrl = absoluteMediaUrl(issue.coverImage)
  const pdfUrl = absoluteMediaUrl(issue.pdf)

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: issue.title,
    ...(issue.description ? { description: issue.description } : {}),
    ...(coverImageUrl ? { image: coverImageUrl } : {}),
    ...(issue.publishedAt ? { datePublished: issue.publishedAt } : {}),
    isPartOf: {
      '@type': 'Periodical',
      name: SITE_NAME,
    },
    ...(pdfUrl
      ? {
          associatedMedia: {
            '@type': 'MediaObject',
            contentUrl: pdfUrl,
            encodingFormat: 'application/pdf',
          },
        }
      : {}),
    url: absoluteUrl(`/issues/${issue.volume}/${issue.issueNumber}`),
  }
}

export const getVideoObjectSchema = (item: Partial<Multimedia>) => {
  const thumbnailUrl =
    absoluteMediaUrl(item.thumbnail) ||
    (item.autoThumbnailUrl ? getMediaUrl(item.autoThumbnailUrl) : undefined)
  const videoUrl = item.links?.[0]?.url

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: item.title,
    ...(item.caption ? { description: item.caption } : { description: item.title }),
    ...(thumbnailUrl ? { thumbnailUrl: [thumbnailUrl] } : {}),
    ...(item.publishedAt ? { uploadDate: item.publishedAt } : {}),
    ...(videoUrl ? { contentUrl: videoUrl, embedUrl: videoUrl } : {}),
  }
}
