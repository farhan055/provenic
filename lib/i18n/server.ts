import 'server-only'
import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import { LOCALE_COOKIE, isLocale, localeMeta, matchAcceptLanguage, type Locale } from './config'
import { createTranslator } from './translate'
import type { Dictionary } from './dictionaries/en'

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en').then((m) => m.default),
  ur: () => import('./dictionaries/ur').then((m) => m.default),
  ar: () => import('./dictionaries/ar').then((m) => m.default),
  zh: () => import('./dictionaries/zh').then((m) => m.default),
}

export const getLocale = cache(async (): Promise<Locale> => {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value
  if (isLocale(stored)) return stored
  return matchAcceptLanguage((await headers()).get('accept-language'))
})

export const getI18n = cache(async () => {
  const locale = await getLocale()
  const dict = await loaders[locale]()
  return { locale, dir: localeMeta[locale].dir, dict, t: createTranslator(dict) }
})
