import type { Payload } from 'payload'

export const findInvitationByToken = async ({
  payload,
  token,
}: {
  payload: Payload
  token: string
}) => {
  const { docs } = await payload.find({
    collection: 'invitations',
    where: { token: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })

  return docs[0]
}
