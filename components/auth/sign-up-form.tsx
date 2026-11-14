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
import { EMAIL_RE, authErrorKey, redirectBase, safeNext } from './auth-utils'

type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm', TranslationKey>>

export function SignUpForm({ next }: { next?: string }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<TranslationKey | null>(null)
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (!values.name.trim()) nextErrors.name = 'auth.errors.nameRequired'
    if (!EMAIL_RE.test(values.email.trim())) nextErrors.email = 'auth.errors.emailInvalid'
    if (values.password.length < 8) nextErrors.password = 'auth.errors.passwordShort'
    if (values.confirm !== values.password) nextErrors.confirm = 'auth.errors.passwordMismatch'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    setFormError(null)
    const callback = new URL(redirectBase())
    callback.searchParams.set('next', safeNext(next))
    const { error } = await createClient().auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        emailRedirectTo: callback.toString(),
        data: { full_name: values.name.trim(), locale },
      },
    })
    if (error) {
      setFormError(authErrorKey(error))
      setLoading(false)
      return
    }
    router.push('/auth/sign-up-success')
  }

  return (
    <>
      <AuthHeading title={t('auth.signUpTitle')} subtitle={t('auth.signUpSubtitle')} />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <AuthAlert tone="error">{t(formError)}</AuthAlert>}
        <Field label={t('auth.fullName')} error={errors.name}>
          {(p) => <Input {...p} autoComplete="name" value={values.name} onChange={set('name')} className="h-11" />}
        </Field>
        <Field label={t('auth.email')} error={errors.email}>
          {(p) => <Input {...p} type="email" autoComplete="email" inputMode="email" dir="ltr" value={values.email} onChange={set('email')} className="h-11" />}
        </Field>
        <Field label={t('auth.password')} error={errors.password} hint={t('auth.updateSubtitle')}>
          {(p) => <Input {...p} type="password" autoComplete="new-password" dir="ltr" value={values.password} onChange={set('password')} className="h-11" />}
        </Field>
        <Field label={t('auth.confirmPassword')} error={errors.confirm}>
          {(p) => <Input {...p} type="password" autoComplete="new-password" dir="ltr" value={values.confirm} onChange={set('confirm')} className="h-11" />}
        </Field>
        <Button type="submit" disabled={loading} className="mt-1 h-11 text-sm">
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {t('common.signUp')}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.haveAccount')}{' '}
          <Link href={next ? `/auth/login?next=${encodeURIComponent(next)}` : '/auth/login'} className="font-medium text-foreground underline-offset-4 hover:underline">
            {t('common.signIn')}
          </Link>
        </p>
      </form>
    </>
  )
}
