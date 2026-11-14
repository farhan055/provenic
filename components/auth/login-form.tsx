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
import { EMAIL_RE, authErrorKey, safeNext } from './auth-utils'

export function LoginForm({ next }: { next?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<TranslationKey | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = 'auth.errors.emailInvalid'
    if (!password) nextErrors.password = 'validation.required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    setFormError(null)
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        setFormError(authErrorKey(error))
        return
      }
      router.replace(safeNext(next))
      router.refresh()
    } catch {
      setFormError('auth.errors.unexpected')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeading title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <AuthAlert tone="error">{t(formError)}</AuthAlert>}
        <Field label={t('auth.email')} error={errors.email}>
          {(p) => (
            <Input {...p} type="email" autoComplete="email" inputMode="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          )}
        </Field>
        <Field label={t('auth.password')} error={errors.password}>
          {(p) => (
            <Input {...p} type="password" autoComplete="current-password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
          )}
        </Field>
        <div className="-mt-1 flex justify-end">
          <Link href="/auth/forgot-password" className="brand-link text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {t('auth.forgot')}
          </Link>
        </div>
        <Button type="submit" disabled={loading} className="h-11 text-sm">
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {t('common.signIn')}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link href={next ? `/auth/sign-up?next=${encodeURIComponent(next)}` : '/auth/sign-up'} className="font-medium text-foreground underline-offset-4 hover:underline">
            {t('common.signUp')}
          </Link>
        </p>
      </form>
    </>
  )
}
