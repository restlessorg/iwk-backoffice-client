import { useTranslation } from 'react-i18next'
import { NavLink, useParams } from 'react-router'
import { NAV_ITEMS } from '@/config/navigation'
import styles from './MobileNav.module.scss'

/** Bottom tab bar — the mobile replacement for the sidebar. */
export function MobileNav() {
  const { t } = useTranslation()
  const { lng } = useParams()

  return (
    <nav className={styles.nav} aria-label={t('nav.label')}>
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={`/${lng}/${to}`} className={styles.tab}>
              <span className={styles.indicator} aria-hidden>
                <Icon />
              </span>
              <span className={styles.label}>{t(`nav.${label}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
