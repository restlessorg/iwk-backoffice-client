import { cn } from '@/utils/cn'
import styles from './styles.module.scss'
import type { ButtonProps, DataAttributes } from './Button.types'
import { mergeProps, useRender } from '@base-ui/react'
import type { ReactNode } from 'react'

function Icon({ icon, testId }: { icon: ReactNode; testId?: string }) {
  return (
    <span className={styles.icon} data-testid={testId} aria-hidden>
      {icon}
    </span>
  )
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  iconOnly,
  icon,
  leadingIcon,
  trailingIcon,
  children,
  render,
  ref,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const content = iconOnly ? (
    <Icon icon={icon} />
  ) : (
    <>
      {leadingIcon && <Icon testId='leading-icon' icon={leadingIcon} />}
      {children}
      {trailingIcon && <Icon testId='trailing-icon' icon={trailingIcon} />}
    </>
  )

  const defaultProps: useRender.ElementProps<'button'> & DataAttributes = {
    ...(render
      ? {}
      : {
          type: 'button',
        }),
    ...(render && disabled
      ? {
          'aria-disabled': disabled,
        }
      : {
          disabled,
        }),

    className: cn(styles.root, className),
    'data-variant': variant,
    'data-size': size,
    'data-icon-only': iconOnly || undefined,
    children: content,
    onClick: render && disabled ? (event) => event.preventDefault() : onClick,
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    ref,
    render,
  })
}
