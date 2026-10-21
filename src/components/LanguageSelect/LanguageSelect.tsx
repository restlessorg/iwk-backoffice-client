import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Select, type SelectItem, type SelectProps } from '@/components/Select'
import { isLanguage, LANGUAGES, type Language } from '@/locales/i18n'

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  uk: 'Українська',
}

const items: SelectItem<Language>[] = LANGUAGES.map((lng) => ({
  value: lng,
  label: LANGUAGE_NAMES[lng],
  meta: lng.toUpperCase(),
}))

type Props = Omit<
  SelectProps<Language>,
  'items' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  /** Show only the code ("EN") in the trigger — for the mobile header */
  compact?: boolean
}

/**
 * Switches the UI language by changing the language prefix in the URL
 * (/en/orders → /uk/orders); LanguageRoute then updates i18next.
 */
export function LanguageSelect({ compact, ...props }: Props) {
  const { t, i18n } = useTranslation()
  const { lng } = useParams()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  const current: Language = isLanguage(lng)
    ? lng
    : isLanguage(i18n.language)
      ? i18n.language
      : 'en'

  const change = (next: Language | null) => {
    if (!next || next === current) return
    const rest = pathname.split('/').slice(2).join('/')
    navigate(`/${next}/${rest}${search}${hash}`)
  }

  return (
    <Select
      items={items}
      value={current}
      onValueChange={change}
      icon={<Globe />}
      aria-label={t('language.label')}
      menuLabel={t('language.label')}
      renderValue={compact ? (item) => item.value.toUpperCase() : undefined}
      {...props}
    />
  )
}
