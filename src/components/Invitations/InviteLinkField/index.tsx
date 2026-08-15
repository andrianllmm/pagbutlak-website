'use client'

import React from 'react'
import { CopyToClipboard, FieldLabel, useFormFields } from '@payloadcms/ui'

export const InviteLinkField: React.FC = () => {
  const token = useFormFields(([fields]) => fields?.token?.value as string | undefined)

  if (!token) {
    return null
  }

  const link = `${process.env.NEXT_PUBLIC_SERVER_URL}/invite/${token}`

  return (
    <div className="field-type">
      <FieldLabel label="Invite link" />
      <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--base)' }}>
        <span style={{ wordBreak: 'break-all' }}>{link}</span>
        <CopyToClipboard value={link} />
      </div>
    </div>
  )
}

export default InviteLinkField
