import type { CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Issues: CollectionConfig<'issues'> = {
  slug: 'issues',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'volume', 'issueNumber', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'volume',
      type: 'number',
      required: true,
    },
    {
      name: 'issueNumber',
      label: 'Issue Number',
      type: 'number',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'pdf',
      label: 'PDF',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
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
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        const volume = data?.volume ?? originalDoc?.volume
        const issueNumber = data?.issueNumber ?? originalDoc?.issueNumber

        if (volume == null || issueNumber == null) {
          return data
        }

        const existing = await req.payload.find({
          collection: 'issues',
          limit: 1,
          overrideAccess: true,
          draft: true,
          req,
          where: {
            and: [
              { volume: { equals: volume } },
              { issueNumber: { equals: issueNumber } },
              ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
            ],
          },
        })

        if (existing.docs.length > 0) {
          throw new APIError(
            `An issue with volume ${volume}, issue number ${issueNumber} already exists.`,
            400,
          )
        }

        return data
      },
    ],
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
