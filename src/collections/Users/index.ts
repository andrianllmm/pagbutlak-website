import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'
import { isAdminOrEditor } from '../../access/isAdminOrEditor'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: (args) => {
      if (!args.req.user) {
        return false
      }

      if (isAdminOrEditor(args)) {
        return true
      }

      return {
        id: {
          equals: args.req.user.id,
        },
      }
    },
    update: (args) => {
      if (!args.req.user) {
        return false
      }

      if (isAdmin(args)) {
        return true
      }

      return {
        id: {
          equals: args.req.user.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      access: {
        update: isAdmin,
      },
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'writer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Writer', value: 'writer' },
      ],
      required: true,
      saveToJWT: true,
    },
    {
      name: 'author',
      type: 'relationship',
      admin: {
        description: 'Link to a byline Author profile for credit purposes (optional).',
        position: 'sidebar',
      },
      hasMany: false,
      relationTo: 'authors',
    },
  ],
  timestamps: true,
}
