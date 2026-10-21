import { useTranslation } from 'react-i18next'
import { matchPath, useLocation, type Params } from 'react-router'
import { ROUTES } from '@/config/routes'

type TitleFn = (
  t: ReturnType<typeof useTranslation>['t'],
  params: Params,
) => string

// Most specific routes first: "orders/:id" must win over "orders".
const PAGE_TITLES: { path: string; title: TitleFn }[] = [
  {
    path: ROUTES.SELECTED_ORDER,
    title: (t, { id }) => t('order.title', { order_id: id }),
  },
  { path: ROUTES.ORDERS, title: (t) => t('orders.title') },
  { path: ROUTES.MAP, title: (t) => t('map.title') },
]

/** Title of the current page, resolved from the localized path (/en/orders/11223 → "Order 11223"). */
export function usePageTitle(): string {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  for (const page of PAGE_TITLES) {
    const match = matchPath(`/:lng/${page.path}`, pathname)
    if (match) return page.title(t, match.params)
  }
  return t('app.name')
}
