import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultNS, resources } from '.'

export const LANGUAGES = ['en', 'uk'] as const
export type Language = (typeof LANGUAGES)[number]
export const isLanguage = (v?: string): v is Language =>
  LANGUAGES.includes(v as Language)

const fromPath = location.pathname.split('/')[1]
export const preferredLanguage = (): Language => {
  const saved = localStorage.getItem('lang') ?? undefined
  return isLanguage(saved) ? saved : 'en'
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: true,
  resources,
  defaultNS,
  supportedLngs: LANGUAGES,
  interpolation: { escapeValue: false },
  lng: isLanguage(fromPath) ? fromPath : preferredLanguage(),
})

export default i18n
