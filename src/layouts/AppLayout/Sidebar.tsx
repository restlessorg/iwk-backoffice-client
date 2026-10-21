import { Separator } from '@base-ui/react/separator'
import { Tooltip } from '@base-ui/react/tooltip'
import { Package, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useParams } from 'react-router'
import { NAV_ITEMS } from '@/config/navigation'
import styles from './Sidebar.module.scss'

interface Props {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const SIDEBAR_ID = 'app-sidebar'

/**
 * Desktop navigation. Expanded (240px) shows labels; collapsed (76px) shows icons,
 * with the label in a tooltip on hover / keyboard focus.
 */
export function Sidebar({ collapsed, onCollapsedChange }: Props) {
  const { t } = useTranslation()
  const { lng } = useParams()
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <aside
      id={SIDEBAR_ID}
      className={styles.sidebar}
      data-collapsed={collapsed || undefined}
    >
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden>
          <Package />
        </span>
        {!collapsed && (
          <span className={styles.identity}>
            <span className={styles.name}>{t('app.name')}</span>
            <span className={styles.workspace}>{t('app.workspace')}</span>
          </span>
        )}
        <button
          type='button'
          className={styles.toggle}
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          aria-expanded={!collapsed}
          aria-controls={SIDEBAR_ID}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <ToggleIcon aria-hidden />
        </button>
      </div>

      {collapsed ? (
        <Separator className={styles.separator} />
      ) : (
        <p className={styles.section} aria-hidden>
          {t('nav.section')}
        </p>
      )}

      <nav className={styles.nav} aria-label={t('nav.label')}>
        <Tooltip.Provider delay={300}>
          <ul className={styles.list}>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const text = t(`nav.${label}`)
              const href = `/${lng}/${to}`

              return (
                <li key={to}>
                  {collapsed ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger
                        render={<NavLink to={href} aria-label={text} />}
                        className={styles.item}
                      >
                        <Icon aria-hidden />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Positioner side='right' sideOffset={10}>
                          <Tooltip.Popup className={styles.tooltip}>
                            {text}
                          </Tooltip.Popup>
                        </Tooltip.Positioner>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ) : (
                    <NavLink to={href} className={styles.item}>
                      <Icon aria-hidden />
                      <span className={styles.label}>{text}</span>
                    </NavLink>
                  )}
                </li>
              )
            })}
          </ul>
        </Tooltip.Provider>
      </nav>
    </aside>
  )
}
