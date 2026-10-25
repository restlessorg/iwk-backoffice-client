import type { ReactNode } from 'react'
import styles from './DesktopHeader.module.scss'

interface Props {
  /** Page title — the only <h1> of the page */
  title: string
  /** Page buttons before the language picker, e.g. Import CSV / New order */
  actions?: ReactNode
}

/** Top bar of the content column: page title on the left, actions on the right. */
export function DesktopHeader({ title, actions }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>{actions}</div>
    </header>
  )
}
