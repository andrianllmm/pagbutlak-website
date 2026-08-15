import type { Payload } from 'payload'

import { APIError } from 'payload'

import { findInvitationByToken } from '@/utilities/findInvitationByToken'
import { isInvitationValid } from '@/utilities/isInvitationValid'

export const acceptInvitation = async ({
  name,
  password,
  payload,
  token,
}: {
  name: string
  password: string
  payload: Payload
  token: string
}) => {
  const invitation = await findInvitationByToken({ payload, token })

  if (!isInvitationValid(invitation)) {
    throw new APIError('This invite link is invalid or has expired.', 400)
  }

  const transactionID = (await payload.db.beginTransaction()) ?? undefined

  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        name,
        email: invitation.email,
        password,
        role: invitation.role,
      },
      overrideAccess: true,
      req: { transactionID },
    })

    await payload.delete({
      collection: 'invitations',
      id: invitation.id,
      overrideAccess: true,
      req: { transactionID },
    })

    if (transactionID !== undefined) {
      await payload.db.commitTransaction(transactionID)
    }

    return { id: user.id, email: user.email }
  } catch (error) {
    if (transactionID !== undefined) {
      await payload.db.rollbackTransaction(transactionID)
    }
    throw error
  }
}
