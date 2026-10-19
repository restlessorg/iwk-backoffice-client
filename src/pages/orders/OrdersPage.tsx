import { useTranslation } from 'react-i18next'

export function OrdersPage() {
  const { t } = useTranslation('common', { keyPrefix: 'orders' })

  return (
    <>
      <h1>{t('title')}</h1>
    </>
  )
}
