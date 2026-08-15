import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const zxcvbn = new ZxcvbnFactory({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
})

export const MIN_PASSWORD_LENGTH = 8
export const MIN_PASSWORD_SCORE = 3

// zxcvbn's dictionaries are generic English word lists and have no notion of
// this app's own branding, so a password like "pagbutlak" scores as if it
// were arbitrary unguessable text. Feed these in as userInputs on every
// check so the org's own name/acronyms are always penalized, the same way a
// site shouldn't let "facebook" pass as a Facebook password.
const SITE_TERMS = [
  'pagbutlak',
  'upv',
  'cas',
  'university',
  'philippines',
  'visayas',
  'college',
  'arts',
  'sciences',
]

export const getPasswordStrengthError = ({
  password,
  userInputs,
}: {
  password: string
  userInputs: string[]
}): string | null => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
  }

  const result = zxcvbn.check(password, [...userInputs, ...SITE_TERMS])

  if (result.score < MIN_PASSWORD_SCORE) {
    const { warning, suggestions } = result.feedback

    return [warning, ...suggestions].filter(Boolean).join(' ') || 'Password is too weak.'
  }

  return null
}
