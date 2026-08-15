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
  let actingUser = req.user

  if (!actingUser) {
    if (!data.input?.user) {
      throw new APIError('Unable to verify the acting user for schedule publishing.', 403)
    }

    // Fail closed: if the user lookup errors, treat it as unauthorized rather
    // than silently letting the schedule-publish job through unchecked.
    actingUser = await req.payload
      .findByID({ id: data.input.user, collection: 'users', depth: 0 })
      .catch(() => {
        throw new APIError('Unable to verify the acting user for schedule publishing.', 403)
      })
  }

  if (actingUser?.role === 'writer') {
    throw new APIError('Only editors and admins can schedule publishing.', 403)
  }

  return data
}
