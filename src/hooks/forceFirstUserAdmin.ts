import type { CollectionBeforeValidateHook } from 'payload'

export const forceFirstUserAdmin: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) {
    return data
  }

  const { totalDocs } = await req.payload.count({ collection: 'users' })

  if (totalDocs === 0) {
    data.role = 'admin'
  }

  return data
}
