export const locales = ['en', 'ur', 'ar', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'prv_locale'

export type Direction = 'ltr' | 'rtl'

export const localeMeta: Record<Locale, { label: string; english: string; dir: Direction; intl: string }> = {
  en: { label: 'English', english: 'English', dir: 'ltr', intl: 'en-US' },
  ur: { label: 'اردو', english: 'Urdu', dir: 'rtl', intl: 'ur-PK' },
  ar: { label: 'العربية', english: 'Arabic', dir: 'rtl', intl: 'ar' },
  zh: { label: '简体中文', english: 'Simplified Chinese', dir: 'ltr', intl: 'zh-CN' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function matchAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale
  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of preferred) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }
  return defaultLocale
}
