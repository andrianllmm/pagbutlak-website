import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAdminOrEditor = (args: AccessArgs<User>) => boolean

export const isAdminOrEditor: isAdminOrEditor = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor'
}
