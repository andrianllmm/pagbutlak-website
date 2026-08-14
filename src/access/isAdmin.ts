import type { PayloadRequest } from 'payload'

type isAdmin = (args: { req: Pick<PayloadRequest, 'user'> }) => boolean

export const isAdmin: isAdmin = ({ req: { user } }) => {
  return user?.role === 'admin'
}
