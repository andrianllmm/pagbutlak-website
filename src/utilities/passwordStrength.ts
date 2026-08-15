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

  const result = zxcvbn.check(password, userInputs)

  if (result.score < MIN_PASSWORD_SCORE) {
    const { warning, suggestions } = result.feedback

    return [warning, ...suggestions].filter(Boolean).join(' ') || 'Password is too weak.'
  }

  return null
}
