import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

export function OrderPage() {
  const { id } = useParams()
  const { t } = useTranslation('common', { keyPrefix: 'order' })

  const normalizedId = id || 'placeholder'

  return <h1>{t('title', { order_id: normalizedId })}</h1>
}
