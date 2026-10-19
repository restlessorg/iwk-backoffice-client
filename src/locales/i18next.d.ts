import 'i18next'
import type { defaultNS, resources } from '@/locales'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['en']
  }
}
