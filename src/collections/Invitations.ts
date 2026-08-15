import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { generateInvitationToken } from '../hooks/generateInvitationToken'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['email', 'role', 'expiresAt'],
    hidden: ({ user }) => user?.role !== 'admin',
    useAsTitle: 'email',
  },
  hooks: {
    beforeValidate: [generateInvitationToken],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'writer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Writer', value: 'writer' },
      ],
      required: true,
    },
    {
      name: 'token',
      type: 'text',
      unique: true,
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'inviteLink',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Invitations/InviteLinkField',
        },
      },
    },
  ],
  timestamps: true,
}
