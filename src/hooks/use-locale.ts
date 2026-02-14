import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Locale, TranslationKey } from '../i18n/translations'
import { getTranslation } from '../i18n/translations'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggle: () => void
  t: (key: TranslationKey) => string
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('locale')
  if (stored === 'ko' || stored === 'en') return stored
  // Check browser language
  return 'en'
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocaleState() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const toggle = useCallback(() => {
    setLocale(locale === 'en' ? 'ko' : 'en')
  }, [locale, setLocale])

  // Sync document lang attribute on mount and locale change
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback(
    (key: TranslationKey) => getTranslation(key, locale),
    [locale],
  )

  return { locale, setLocale, toggle, t }
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
