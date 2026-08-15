import { describe, expect, it } from 'vitest'

import { getPasswordStrengthError, MIN_PASSWORD_LENGTH } from './passwordStrength'

describe('getPasswordStrengthError', () => {
  it('rejects passwords shorter than the minimum length', () => {
    const error = getPasswordStrengthError({ password: 'abc123', userInputs: [] })

    expect(error).toBe(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
  })

  it('rejects common/weak passwords that meet the length floor', () => {
    const error = getPasswordStrengthError({ password: 'password123', userInputs: [] })

    expect(error).toBeTruthy()
  })

  it('rejects passwords derived from the user email or name', () => {
    const error = getPasswordStrengthError({
      password: 'johndoe1234',
      userInputs: ['johndoe@example.com', 'johndoe', 'John Doe'],
    })

    expect(error).toBeTruthy()
  })

  it('rejects passwords derived from the site name/branding', () => {
    const error = getPasswordStrengthError({ password: 'pagbutlak', userInputs: [] })

    expect(error).toBeTruthy()
  })

  it('accepts a strong, unrelated password', () => {
    const error = getPasswordStrengthError({
      password: 'xK9!mQ2wZv#Lp7Fj',
      userInputs: ['johndoe@example.com', 'johndoe', 'John Doe'],
    })

    expect(error).toBeNull()
  })
})
