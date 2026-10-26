import type { ReactNode } from 'react'
import styles from './DesktopHeader.module.scss'

interface Props {
  title: string
  actions?: ReactNode
}

export function DesktopHeader({ title, actions }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>{actions}</div>
    </header>
  )
}
