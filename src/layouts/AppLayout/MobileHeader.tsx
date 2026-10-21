import { Package } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from '@/components/LanguageSelect'
import styles from './MobileHeader.module.scss'

interface Props {
  /** Extra buttons before the language picker, e.g. Import / New order */
  actions?: ReactNode
}

export function MobileHeader({ actions }: Props) {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <span className={styles.logo} aria-hidden>
          <Package />
        </span>
        <span className={styles.name}>{t('app.name')}</span>
      </div>
      <div className={styles.actions}>
        {actions}
        <LanguageSelect compact />
      </div>
    </header>
  )
}
