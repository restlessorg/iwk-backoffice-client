import enCommon from './en/common.json'
import ukCommon from './uk/common.json'

type LocaleShape<T> = {
  [K in keyof T]: T[K] extends string ? string : LocaleShape<T[K]>
}

export const defaultNS = 'common' as const

export const resources = {
  en: {
    common: enCommon,
  },
  uk: {
    common: ukCommon satisfies LocaleShape<typeof enCommon>,
  },
} as const
