import type { Access } from 'payload'

export const isAdminOrEditorOrOwner: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.role === 'admin' || user.role === 'editor') {
    return true
  }

  return {
    createdBy: {
      equals: user.id,
    },
  }
}
