import type { CollectionBeforeChangeHook } from 'payload'

import { APIError } from 'payload'

const RESTRICTED_COLLECTIONS = new Set(['articles', 'issues', 'multimedia', 'pages'])

export const preventUnauthorizedSchedulePublish: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data.taskSlug !== 'schedulePublish') {
    return data
  }

  const relationTo = data.input?.doc?.relationTo

  if (typeof relationTo !== 'string' || !RESTRICTED_COLLECTIONS.has(relationTo)) {
    return data
  }

  // Schedule Publish calls jobs.queue() without req, so req.user is empty;
  // fall back to the user id recorded in data.input.user.
  const actingUser =
    req.user ??
    (data.input?.user
      ? await req.payload
          .findByID({ id: data.input.user, collection: 'users', depth: 0 })
          .catch(() => null)
      : null)

  if (actingUser?.role === 'writer') {
    throw new APIError('Only editors and admins can schedule publishing.', 403)
  }

  return data
}
