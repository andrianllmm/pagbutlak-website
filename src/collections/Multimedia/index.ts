import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { MULTIMEDIA_PLATFORMS } from '@/constants/multimediaPlatforms'
import { getAutoThumbnailUrl, resolveFacebookCanonicalUrl } from '@/utilities/multimediaEmbed'

export const Multimedia: CollectionConfig<'multimedia'> = {
  slug: 'multimedia',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'platform', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  labels: {
    plural: 'Multimedia',
    singular: 'Multimedia',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'platform',
      type: 'select',
      options: MULTIMEDIA_PLATFORMS as any as { label: string; value: string }[],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to the video on YouTube, Facebook, or TikTok.',
      },
      hooks: {
        beforeChange: [
          async ({ siblingData, value }) => {
            const data = siblingData as { platform?: string }
            if (data?.platform !== 'facebook' || typeof value !== 'string') {
              return value
            }
            return resolveFacebookCanonicalUrl(value)
          },
        ],
      },
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      admin: {
        description:
          'Optional for YouTube and TikTok, which pull a default thumbnail automatically. Required for Facebook, which has no automatic thumbnail.',
      },
      relationTo: 'media',
      validate: ((value: unknown, { siblingData }: { siblingData: { platform?: string } }) => {
        if (siblingData?.platform === 'facebook' && !value) {
          return 'A thumbnail is required for Facebook videos.'
        }
        return true
      }) as any,
    },
    {
      name: 'autoThumbnailUrl',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ siblingData }) => {
            const data = siblingData as { platform?: string; url?: string }
            if (!data?.platform || !data?.url) {
              return undefined
            }
            return (
              (await getAutoThumbnailUrl({
                platform: data.platform as never,
                url: data.url,
              })) ?? undefined
            )
          },
        ],
      },
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
