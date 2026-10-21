import { Outlet } from 'react-router'
import styles from './AppLayout.module.scss'
import { MobileHeader } from './MobileHeader'
import { MobileNav } from './MobileNav'

/**
 * App shell. Mobile: sticky header on top, tab bar at the bottom.
 * Both respect the device safe areas (notch, home indicator).
 */
export function AppLayout() {
  return (
    <div className={styles.layout}>
      <MobileHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
