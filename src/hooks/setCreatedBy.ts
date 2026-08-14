import type { CollectionBeforeChangeHook } from 'payload'

export const setCreatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && req.user) {
    return {
      ...data,
      createdBy: req.user.id,
    }
  }

  return data
}
