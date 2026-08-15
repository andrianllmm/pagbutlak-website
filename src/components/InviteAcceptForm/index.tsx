'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, FieldLabel, TextInput } from '@payloadcms/ui'

import { FieldError } from '@/components/ui/field'

const PasswordInput: React.FC<{
  id: string
  label: string
  onChange: (value: string) => void
  value: string
}> = ({ id, label, onChange, value }) => (
  <div className="field-type password">
    <FieldLabel htmlFor={`field-${id}`} label={label} required />
    <div className="field-type__wrap">
      <input
        id={`field-${id}`}
        name={id}
        onChange={(e) => onChange(e.target.value)}
        required
        type="password"
        value={value}
      />
    </div>
  </div>
)

export const InviteAcceptForm: React.FC<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, token }),
      })

      const body = (await res.json()) as { error?: string }

      if (!res.ok) {
        throw new Error(body.error ?? 'Unable to accept this invite.')
      }

      router.push('/admin/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to accept this invite.')
      setLoading(false)
    }
  }

  return (
    <div className="create-first-user">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          path="name"
          required
          value={name}
        />
        <PasswordInput id="password" label="Password" onChange={setPassword} value={password} />
        <PasswordInput
          id="confirm-password"
          label="Confirm password"
          onChange={setConfirmPassword}
          value={confirmPassword}
        />
        {error && <FieldError>{error}</FieldError>}
        <div className="form-submit">
          <Button disabled={loading} size="large" type="submit">
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InviteAcceptForm
