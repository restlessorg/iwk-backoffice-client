import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { DESKTOP_MEDIA_QUERY } from '@/config/breakpoints'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePageTitle } from '@/hooks/usePageTitle'
import styles from './AppLayout.module.scss'
import { DesktopHeader } from './DesktopHeader'
import { MobileHeader } from './MobileHeader'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { useSidebarCollapsed } from './useSidebarCollapsed'

/**
 * App shell.
 * Desktop (≥ 768px): collapsible sidebar + header above the content.
 * Mobile: sticky header on top, tab bar at the bottom; both respect the safe areas.
 * Only one of them is rendered, so there is always a single main navigation.
 * The page title comes from the route (usePageTitle) and is shown in the header as the
 * page's only <h1> — pages don't render their own.
 */
export function AppLayout() {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const title = usePageTitle()

  useEffect(() => {
    document.title = `${title} · ${t('app.name')}`
  }, [title, t])

  if (isDesktop) {
    return (
      <div className={styles.desktop}>
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className={styles.content}>
          <DesktopHeader title={title} />
          <main className={styles.desktopMain}>
            <Outlet />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <MobileHeader title={title} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
