import { Package } from 'lucide-react'
import type { ReactNode } from 'react'
import { LanguageSelect } from '@/components/LanguageSelect'
import styles from './MobileHeader.module.scss'

interface Props {
  /** Page title — the only <h1> of the page */
  title: string
  /** Extra buttons before the language picker, e.g. Import / New order */
  actions?: ReactNode
}

export function MobileHeader({ title, actions }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <span className={styles.logo} aria-hidden>
          <Package />
        </span>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.actions}>
        {actions}
        <LanguageSelect compact />
      </div>
    </header>
  )
}
