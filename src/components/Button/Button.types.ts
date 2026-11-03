import type { ReactNode } from 'react'
import type { useRender } from '@base-ui/react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'md' | 'lg'

type IconOnlyProps = {
  iconOnly: true
  icon: ReactNode
  'aria-label': string
  leadingIcon?: never
  trailingIcon?: never
  children?: never
}

type BaseProps = {
  iconOnly?: false
  children: ReactNode
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  icon?: never
}

export type ButtonProps = Omit<
  useRender.ComponentProps<'button'>,
  'className' | 'children' | 'disabled'
> & {
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
} & (IconOnlyProps | BaseProps)

export type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}
