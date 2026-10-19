import { useTranslation } from 'react-i18next'

export function MapPage() {
  const { t } = useTranslation('common', { keyPrefix: 'map' })

  return <h1>{t('title')}</h1>
}
