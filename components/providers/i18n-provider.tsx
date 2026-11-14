'use client'

import { createContext, useContext, useMemo } from 'react'
import { localeMeta, type Direction, type Locale } from '@/lib/i18n/config'
import { createTranslator, type Translator } from '@/lib/i18n/translate'
import type { Dictionary } from '@/lib/i18n/dictionaries/en'

type I18nContextValue = { locale: Locale; dir: Direction; t: Translator }

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({ locale, dir: localeMeta[locale].dir, t: createTranslator(dict) }),
    [locale, dict],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
