import type { AuthError } from '@supabase/supabase-js'
import type { TranslationKey } from '@/lib/i18n/translate'

/** Generic credential messaging; actionable states (unconfirmed, weak, rate-limited) pass through. */
export function authErrorKey(error: AuthError): TranslationKey {
  const code = error.code ?? ''
  if (code === 'invalid_credentials' || code === 'user_not_found') return 'auth.errors.invalidCredentials'
  if (code === 'email_not_confirmed') return 'auth.errors.emailNotConfirmed'
  if (code === 'weak_password') return 'auth.errors.weakPassword'
  if (error.status === 429 || code.startsWith('over_')) return 'auth.errors.rateLimited'
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'auth.errors.emailInvalid'
  return 'auth.errors.unexpected'
}

export function safeNext(next: string | null | undefined, fallback = '/app') {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

export function redirectBase() {
  const developmentRedirect = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
  if (process.env.NODE_ENV !== 'production' && developmentRedirect) return developmentRedirect
  return `${window.location.origin}/auth/callback`
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
