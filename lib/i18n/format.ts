import { localeMeta, type Locale } from './config'

const intl = (locale: Locale) => localeMeta[locale].intl

export function formatDate(locale: Locale, value: string | Date | null | undefined) {
  if (!value) return null
  // Plain dates (YYYY-MM-DD) are calendar dates; render them without timezone shifting.
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00Z`) : new Date(value)
  return new Intl.DateTimeFormat(intl(locale), { dateStyle: 'medium', timeZone: typeof value === 'string' && value.length === 10 ? 'UTC' : undefined }).format(date)
}

export function formatDateTime(locale: Locale, value: string | Date) {
  return new Intl.DateTimeFormat(intl(locale), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function formatMoney(locale: Locale, amount: number | string | null, currency: string | null) {
  if (amount === null || amount === undefined || !currency) return null
  try {
    return new Intl.NumberFormat(intl(locale), { style: 'currency', currency }).format(Number(amount))
  } catch {
    return `${currency} ${amount}`
  }
}

export function formatNumber(locale: Locale, value: number) {
  return new Intl.NumberFormat(intl(locale)).format(value)
}

export function formatBytes(locale: Locale, bytes: number) {
  const units = ['byte', 'kilobyte', 'megabyte'] as const
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return new Intl.NumberFormat(intl(locale), {
    style: 'unit',
    unit: units[unit],
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatRelative(locale: Locale, value: string | Date) {
  const diffSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(intl(locale), { numeric: 'auto' })
  const abs = Math.abs(diffSeconds)
  if (abs < 60) return rtf.format(diffSeconds, 'second')
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour')
  if (abs < 86400 * 30) return rtf.format(Math.round(diffSeconds / 86400), 'day')
  return formatDate(locale, value) ?? ''
}
