'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/shared/form'
import { useI18n } from '@/components/providers/i18n-provider'
import { createClient } from '@/lib/supabase/client'
import type { TranslationKey } from '@/lib/i18n/translate'
import { AuthAlert, AuthHeading } from './auth-card'
import { EMAIL_RE, authErrorKey, redirectBase } from './auth-utils'

export function ForgotPasswordForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<TranslationKey | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return setError('auth.errors.emailInvalid')
    setLoading(true)
    setError(null)
    const callback = new URL(redirectBase())
    callback.searchParams.set('next', '/auth/update-password')
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: callback.toString() })
    setLoading(false)
    // Rate limits are actionable; every other outcome shows the same message to avoid enumeration.
    if (error && (error.status === 429 || error.code?.startsWith('over_'))) return setError('auth.errors.rateLimited')
    setSent(true)
  }

  return (
    <>
      <AuthHeading title={t('auth.forgotTitle')} subtitle={t('auth.forgotSubtitle')} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {error && <AuthAlert tone="error">{t(error)}</AuthAlert>}
        {sent && <AuthAlert tone="success">{t('auth.resetSent')}</AuthAlert>}
        <Field label={t('auth.email')}>
          {(p) => <Input {...p} type="email" autoComplete="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />}
        </Field>
        <Button type="submit" disabled={loading} className="h-11">
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {t('auth.sendReset')}
        </Button>
        <Link href="/auth/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
          {t('auth.backToSignIn')}
        </Link>
      </form>
    </>
  )
}

export function UpdatePasswordForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<TranslationKey | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) return setError('auth.errors.passwordShort')
    setLoading(true)
    setError(null)
    const { error } = await createClient().auth.updateUser({ password })
    if (error) {
      setError(authErrorKey(error))
      setLoading(false)
      return
    }
    router.replace('/app')
    router.refresh()
  }

  return (
    <>
      <AuthHeading title={t('auth.updateTitle')} subtitle={t('auth.updateSubtitle')} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {error && <AuthAlert tone="error">{t(error)}</AuthAlert>}
        <Field label={t('auth.newPassword')}>
          {(p) => <Input {...p} type="password" autoComplete="new-password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />}
        </Field>
        <Button type="submit" disabled={loading} className="h-11">
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {t('auth.updatePassword')}
        </Button>
      </form>
    </>
  )
}
