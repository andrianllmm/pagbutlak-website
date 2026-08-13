import { Field } from 'payload'
import { ARTICLE_SECTIONS } from '@/constants/articleSections'

export const searchFields: Field[] = [
  {
    name: 'section',
    type: 'select',
    index: true,
    options: ARTICLE_SECTIONS as any as { label: string; value: string }[],
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    label: 'Authors',
    name: 'authors',
    type: 'relationship',
    relationTo: 'authors',
    hasMany: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'publishedAt',
    type: 'date',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'readingTimeMinutes',
    type: 'number',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: 'Categories',
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
      },
      {
        name: 'categoryID',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  },
]
