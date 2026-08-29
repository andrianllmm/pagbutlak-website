import { describe, expect, it } from 'vitest'

import type { Article, Author, Multimedia } from '@/payload-types'

import { getArticleSchema, getVideoObjectSchema } from './structuredData'

const author = { id: 1, name: 'Juan Dela Cruz', slug: 'juan-dela-cruz' } as Author

describe('getArticleSchema', () => {
  it('omits the image when heroImage is not a populated object', () => {
    const schema = getArticleSchema({ title: 'Untitled', heroImage: 1 } as Partial<Article>)
    expect(schema.image).toBeUndefined()
  })

  it('includes the image when heroImage is populated', () => {
    const schema = getArticleSchema({
      title: 'With Image',
      heroImage: { url: '/media/hero.jpg' } as Article['heroImage'],
    } as Partial<Article>)

    expect(schema.image).toEqual(['http://localhost:3000/media/hero.jpg'])
  })

  it('falls back to publishedAt when updatedAt is missing', () => {
    const schema = getArticleSchema({
      title: 'No Updates',
      publishedAt: '2026-01-01T00:00:00.000Z',
    } as Partial<Article>)

    expect(schema.dateModified).toBe('2026-01-01T00:00:00.000Z')
  })

  it('only includes authors that are populated objects, mapped to Person nodes', () => {
    const schema = getArticleSchema({
      title: 'Multi Author',
      authors: [author, 2],
    } as unknown as Partial<Article>)

    expect(schema.author).toEqual([
      {
        '@type': 'Person',
        name: 'Juan Dela Cruz',
        url: 'http://localhost:3000/authors/juan-dela-cruz',
      },
    ])
  })
})

describe('getVideoObjectSchema', () => {
  it('falls back to the auto-generated thumbnail when none is uploaded', () => {
    const schema = getVideoObjectSchema({
      title: 'Video',
      thumbnail: undefined,
      autoThumbnailUrl: '/auto-thumb.jpg',
    } as Partial<Multimedia>)

    expect(schema.thumbnailUrl).toEqual(['http://localhost:3000/auto-thumb.jpg'])
  })

  it('falls back to the title as the description when caption is missing', () => {
    const schema = getVideoObjectSchema({ title: 'Video Title' } as Partial<Multimedia>)
    expect(schema.description).toBe('Video Title')
  })

  it('uses the first link as both contentUrl and embedUrl', () => {
    const schema = getVideoObjectSchema({
      title: 'Video',
      links: [{ url: 'https://youtube.com/watch?v=abc', id: '1' }],
    } as unknown as Partial<Multimedia>)

    expect(schema.contentUrl).toBe('https://youtube.com/watch?v=abc')
    expect(schema.embedUrl).toBe('https://youtube.com/watch?v=abc')
  })

  it('omits contentUrl and embedUrl when there are no links', () => {
    const schema = getVideoObjectSchema({
      title: 'Video',
      links: [],
    } as unknown as Partial<Multimedia>)
    expect(schema.contentUrl).toBeUndefined()
    expect(schema.embedUrl).toBeUndefined()
  })
})
