import { clsx, type ClassValue } from 'clsx'

/**
 * Joins class names, skipping falsy values.
 * cn(styles.trigger, isOpen && styles.open, { [styles.active]: active })
 */
export function cn(...classes: ClassValue[]): string {
  return clsx(classes)
}
