import type { Invitation } from '@/payload-types'

export const isInvitationValid = (invitation: Invitation | null | undefined): boolean => {
  if (!invitation) {
    return false
  }

  return new Date(invitation.expiresAt ?? 0).getTime() > Date.now()
}
