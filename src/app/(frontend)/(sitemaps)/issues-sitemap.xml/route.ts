import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getIssuesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'issues',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        volume: true,
        issueNumber: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((issue) => issue?.volume != null && issue?.issueNumber != null)
          .map((issue) => ({
            loc: `${SITE_URL}/issues/${issue.volume}/${issue.issueNumber}`,
            lastmod: issue.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['issues-sitemap'],
  {
    tags: ['issues-sitemap'],
    revalidate: 600,
  },
)

export async function GET() {
  const sitemap = await getIssuesSitemap()

  return getServerSideSitemap(sitemap)
}
