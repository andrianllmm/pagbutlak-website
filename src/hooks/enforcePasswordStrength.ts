import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

import { getPasswordStrengthError } from '../utilities/passwordStrength'

export const enforcePasswordStrength: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const password = data?.password as string | undefined

  if (!password) {
    return data
  }

  const email = (data?.email ?? originalDoc?.email) as string | undefined
  const name = (data?.name ?? originalDoc?.name) as string | undefined
  const userInputs = [email, email?.split('@')[0], name].filter((value): value is string =>
    Boolean(value),
  )

  const error = getPasswordStrengthError({ password, userInputs })

  if (error) {
    throw new APIError(error, 400)
  }

  return data
}
