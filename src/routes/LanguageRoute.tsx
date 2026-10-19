import { isLanguage, preferredLanguage } from '@/locales/i18n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation, useParams } from 'react-router'

export function LanguageRoute() {
  const { lng } = useParams()
  const { pathname, search } = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (isLanguage(lng) && i18n.language !== lng) {
      i18n.changeLanguage(lng)
    }
  }, [lng, i18n])

  if (!isLanguage(lng)) {
    return (
      <Navigate to={`/${preferredLanguage()}${pathname}${search}`} replace />
    )
  }

  return <Outlet />
}
