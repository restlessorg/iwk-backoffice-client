import { List, Map as MapIcon, type LucideIcon } from 'lucide-react'
import { ROUTES } from './routes'

export interface NavItem {
  /** Route relative to the language prefix, e.g. "orders" → /en/orders */
  to: string
  /** Key in the "nav" section of the translations */
  label: 'orders' | 'map'
  icon: LucideIcon
}

/** Main sections — the mobile tab bar and (later) the desktop sidebar. */
export const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.ORDERS, label: 'orders', icon: List },
  { to: ROUTES.MAP, label: 'map', icon: MapIcon },
]
