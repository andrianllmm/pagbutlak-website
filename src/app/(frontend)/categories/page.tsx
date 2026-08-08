import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

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

  const getParentId = (category: Pick<Category, 'parent'>) =>
    typeof category.parent === 'object' ? category.parent?.id : category.parent

  const topLevelCategories = categories.docs.filter((category) => !category.parent)

  return (
    <div className="pt-24 pb-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <h1>Categories</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topLevelCategories.map((category) => {
            const children = categories.docs.filter((child) => getParentId(child) === category.id)

            return (
              <div key={category.id} className="rounded-lg bg-card p-4">
                <div className="prose dark:prose-invert">
                  <h3>{category.title}</h3>
                </div>

                {children.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2 list-none p-0">
                    {children.map((child) => (
                      <li
                        key={child.id}
                        className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                      >
                        {child.title}
                      </li>
                    ))}
                  </ul>
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
