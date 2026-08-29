import { describe, expect, it, vi } from 'vitest'

import type { PayloadRequest } from 'payload'

import { generatePreviewPath } from './generatePreviewPath'

const req = {} as PayloadRequest

describe('generatePreviewPath', () => {
  it('returns null when the slug is undefined or null', () => {
    expect(
      generatePreviewPath({ collection: 'articles', slug: undefined as never, req }),
    ).toBeNull()
    expect(generatePreviewPath({ collection: 'articles', slug: null as never, req })).toBeNull()
  })

  it('builds a path prefixed by the collection', () => {
    const url = generatePreviewPath({ collection: 'articles', slug: 'my-article', req })
    const params = new URLSearchParams(url!.split('?')[1])

    expect(params.get('collection')).toBe('articles')
    expect(params.get('path')).toBe('/articles/my-article')
  })

  it('allows an empty slug for the homepage', () => {
    const url = generatePreviewPath({ collection: 'pages', slug: '', req })
    const params = new URLSearchParams(url!.split('?')[1])

    expect(params.get('path')).toBe('/')
  })

  it('encodes special characters in the slug', () => {
    const url = generatePreviewPath({ collection: 'articles', slug: 'a/b c', req })
    const params = new URLSearchParams(url!.split('?')[1])

    expect(params.get('slug')).toBe(encodeURIComponent('a/b c'))
    expect(params.get('path')).toBe(`/articles/${encodeURIComponent('a/b c')}`)
  })

  it('includes the preview secret from the environment', () => {
    vi.stubEnv('PREVIEW_SECRET', 'super-secret')

    const url = generatePreviewPath({ collection: 'articles', slug: 'my-article', req })
    const params = new URLSearchParams(url!.split('?')[1])

    expect(params.get('previewSecret')).toBe('super-secret')

    vi.unstubAllEnvs()
  })
})
