import type { Metadata } from 'next'
import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

type CategoryNode = Pick<Category, 'id' | 'title' | 'parent'>

const getParentId = (category: CategoryNode) =>
  typeof category.parent === 'object' ? category.parent?.id : category.parent

const CategoryList: React.FC<{
  categories: CategoryNode[]
  childrenByParentId: Map<number, CategoryNode[]>
}> = ({ categories, childrenByParentId }) => (
  <ul className="mt-2 space-y-1 list-none border-l border-border pl-4">
    {categories.map((category) => {
      const children = childrenByParentId.get(category.id) ?? []

      return (
        <li key={category.id}>
          <span className="text-sm text-muted-foreground">{category.title}</span>
          {children.length > 0 && (
            <CategoryList categories={children} childrenByParentId={childrenByParentId} />
          )}
        </li>
      )
    })}
  </ul>
)

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: 'title',
    select: {
      title: true,
      slug: true,
      parent: true,
    },
  })

  const topLevelCategories = categories.docs.filter((category) => !category.parent)

  const childrenByParentId = new Map<number, CategoryNode[]>()
  for (const category of categories.docs) {
    const parentId = getParentId(category)
    if (parentId == null) continue
    childrenByParentId.set(parentId, [...(childrenByParentId.get(parentId) ?? []), category])
  }

  return (
    <div className="pt-24 pb-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <h1>Categories</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topLevelCategories.map((category) => {
            const children = childrenByParentId.get(category.id) ?? []

            return (
              <div key={category.id} className="rounded-lg bg-card p-4">
                <div className="prose dark:prose-invert">
                  <h3>{category.title}</h3>
                </div>

                {children.length > 0 && (
                  <CategoryList categories={children} childrenByParentId={childrenByParentId} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Pagbutlak Categories',
  }
}
