import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { MinimalTemplate } from '@payloadcms/next/templates'

import { InviteAcceptForm } from '@/components/InviteAcceptForm'
import { findInvitationByToken } from '@/utilities/findInvitationByToken'
import { isInvitationValid } from '@/utilities/isInvitationValid'

type Args = {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Args) {
  const { token } = await params
  const payload = await getPayload({ config: configPromise })

  const invitation = await findInvitationByToken({ payload, token })

  return (
    <MinimalTemplate>
      {isInvitationValid(invitation) ? (
        <>
          <div className="form-header">
            <h1>Set up your account</h1>
          </div>
          <InviteAcceptForm token={token} />
        </>
      ) : (
        <div className="form-header">
          <h1>Invite link invalid</h1>
          <p>This invite link is invalid or has expired. Ask an admin to send you a new one.</p>
        </div>
      )}
    </MinimalTemplate>
  )
}
