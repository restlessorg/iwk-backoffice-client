import type { ReactNode } from 'react'

export type SelectValue = string | number

export interface SelectItem<Value extends SelectValue = SelectValue> {
  label: string
  value: Value
  /** Leading icon in the menu row, e.g. `<MapPin />` */
  icon?: ReactNode
  /** Secondary text on the right of the menu row, e.g. "County" */
  meta?: ReactNode
  disabled?: boolean
}

/** sm 32px — dense desktop toolbars only; md 40px — default; lg 44px — forms and mobile */
export type SelectSize = 'sm' | 'md' | 'lg'
/** outline — toolbars and forms; filled — inside white cards; ghost — inline (sort label, map toolbar) */
export type SelectVariant = 'outline' | 'filled' | 'ghost'
/** pill — toolbar filters; rounded — form fields and the sidebar */
export type SelectRoundness = 'pill' | 'rounded'
