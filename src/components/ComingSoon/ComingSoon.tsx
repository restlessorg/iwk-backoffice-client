import { useTranslation } from 'react-i18next'
import styles from './ComingSoon.module.scss'

/** Placeholder for a page whose content isn't built yet. */
export function ComingSoon() {
  const { t } = useTranslation()

  return <p className={styles.comingSoon}>{t('comingSoon')}</p>
}
