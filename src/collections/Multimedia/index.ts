import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditorOrOwner } from '@/access/isAdminOrEditorOrOwner'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { preventUnauthorizedPublish } from '@/hooks/preventUnauthorizedPublish'
import {
  getAutoThumbnailUrl,
  getPlatformFromUrl,
  resolveFacebookCanonicalUrl,
} from '@/utilities/multimediaEmbed'

export const Multimedia: CollectionConfig<'multimedia'> = {
  slug: 'multimedia',
  access: {
    create: authenticated,
    delete: isAdminOrEditorOrOwner,
    read: authenticatedOrPublished,
    update: isAdminOrEditorOrOwner,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      name: 'links',
      type: 'array',
      admin: {
        description:
          'Link(s) to this video on YouTube, Facebook, and/or TikTok. Add one per platform it was posted to. The platform is detected automatically from each URL.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          hooks: {
            beforeChange: [
              async ({ value }) => {
                if (typeof value !== 'string' || getPlatformFromUrl(value) !== 'facebook') {
                  return value
                }
                return resolveFacebookCanonicalUrl(value)
              },
            ],
          },
        },
      ],
      minRows: 1,
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      admin: {
        description:
          'Optional if any linked platform is YouTube or TikTok, which pull a default thumbnail automatically. Required otherwise (e.g. Facebook-only), since it has no automatic thumbnail.',
      },
      relationTo: 'media',
      validate: ((
        value: unknown,
        { siblingData }: { siblingData: { links?: { url?: string }[] } },
      ) => {
        const hasAutoThumbnailSource = (siblingData?.links ?? []).some((link) => {
          const platform = link?.url ? getPlatformFromUrl(link.url) : null
          return platform === 'youtube' || platform === 'tiktok'
        })
        if (!hasAutoThumbnailSource && !value) {
          return 'A thumbnail is required unless at least one linked URL is YouTube or TikTok.'
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
          async ({ siblingData, value }) => {
            const links = (siblingData as { links?: { url?: string }[] })?.links ?? []
            for (const link of links) {
              const platform = link?.url ? getPlatformFromUrl(link.url) : null
              if (!platform || !link?.url) {
                continue
              }
              const thumbnailUrl = await getAutoThumbnailUrl({ platform, url: link.url })
              if (thumbnailUrl) {
                return thumbnailUrl
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'relatedMultimedia',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'multimedia',
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
    {
      name: 'createdBy',
      type: 'relationship',
      access: {
        update: isAdmin,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hasMany: false,
      relationTo: 'users',
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [setCreatedBy, preventUnauthorizedPublish],
  },
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
