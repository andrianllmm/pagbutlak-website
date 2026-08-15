import type { CollectionBeforeChangeHook } from 'payload'

import { APIError } from 'payload'

export const preventUnauthorizedPublish: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  // Autosave/"Save draft" always pass draft=true and force data._status to
  // 'draft' as version bookkeeping; only Publish/Unpublish omit it.
  const isDraftModeSave = req.query?.draft === true || req.query?.draft === 'true'

  if (isDraftModeSave || req.user?.role !== 'writer') {
    return data
  }

  // On duplicate, originalDoc is the source doc, not the doc being modified.
  if (operation === 'create') {
    if (data._status === 'published') {
      throw new APIError('Only editors and admins can publish content.', 403)
    }
    return data
  }

  const isStatusChange = Boolean(data._status) && data._status !== originalDoc?._status
  const wasAlreadyPublished = originalDoc?._status === 'published'

  if (isStatusChange && wasAlreadyPublished) {
    throw new APIError('Only editors and admins can unpublish content.', 403)
  }

  if (isStatusChange && !wasAlreadyPublished) {
    throw new APIError('Only editors and admins can publish content.', 403)
  }

  return data
}
