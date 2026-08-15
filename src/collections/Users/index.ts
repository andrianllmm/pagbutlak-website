import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { createOwnerScopedAccess } from '../../access/createOwnerScopedAccess'
import { isAdmin } from '../../access/isAdmin'
import { enforcePasswordStrength } from '../../hooks/enforcePasswordStrength'
import { forceFirstUserAdmin } from '../../hooks/forceFirstUserAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: createOwnerScopedAccess({ allowedRoles: ['admin', 'editor'], ownerField: 'id' }),
    update: createOwnerScopedAccess({ allowedRoles: ['admin'], ownerField: 'id' }),
  },
  hooks: {
    beforeValidate: [forceFirstUserAdmin, enforcePasswordStrength],
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
        condition: (_data, _siblingData, { user }) => Boolean(user),
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
        condition: (_data, _siblingData, { user }) => Boolean(user),
        description: 'Link to a byline Author profile for credit purposes (optional).',
        position: 'sidebar',
      },
      hasMany: false,
      relationTo: 'authors',
    },
  ],
  timestamps: true,
}
