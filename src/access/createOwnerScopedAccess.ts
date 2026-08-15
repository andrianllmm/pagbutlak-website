import type { Access } from 'payload'

import type { User } from '@/payload-types'

type CreateOwnerScopedAccess = (args: {
  allowedRoles: User['role'][]
  ownerField: string
}) => Access

export const createOwnerScopedAccess: CreateOwnerScopedAccess =
  ({ allowedRoles, ownerField }) =>
  ({ req: { user } }) => {
    if (!user) {
      return false
    }

    if (allowedRoles.includes(user.role)) {
      return true
    }

    return {
      [ownerField]: {
        equals: user.id,
      },
    }
  }
