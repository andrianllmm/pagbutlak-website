import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})

// A category's articles are those tagged with the category itself or one of its direct
// children (not deeper descendants), sorted naturally by publish date.
export const queryCategoryAndChildIds = cache(async ({ categoryId }: { categoryId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const children = await payload.find({
    collection: 'categories',
    where: { parent: { equals: categoryId } },
    limit: 100,
    overrideAccess: false,
    pagination: false,
  })

  return [categoryId, ...children.docs.map((child) => child.id)]
})
