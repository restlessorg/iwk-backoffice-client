import { useTranslation } from 'react-i18next'
import styles from './ComingSoon.module.scss'

export function ComingSoon() {
  const { t } = useTranslation()

  return <p className={styles.comingSoon}>{t('comingSoon')}</p>
}
