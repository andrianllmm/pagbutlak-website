import crypto from 'crypto'

import type { CollectionBeforeValidateHook } from 'payload'

const INVITATION_EXPIRATION_MS = 24 * 60 * 60 * 1000

export const generateInvitationToken: CollectionBeforeValidateHook = async ({
  data,
  operation,
}) => {
  if (operation !== 'create') {
    return data
  }

  return {
    ...data,
    token: crypto.randomBytes(20).toString('hex'),
    expiresAt: new Date(Date.now() + INVITATION_EXPIRATION_MS).toISOString(),
  }
}
