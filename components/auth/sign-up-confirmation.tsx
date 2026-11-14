'use client'

import { CheckCircle2, MailCheck } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { AuthHeading } from './auth-card'

export function SignUpConfirmation({ email }: { email?: string | null }) {
  const { t } = useI18n()

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border bg-card p-6 shadow-elevated sm:p-7">
      <div aria-hidden className="brand-rainbow absolute inset-x-0 top-0 h-1" />
      <span className="mb-5 flex size-12 items-center justify-center rounded-xl border border-brand-violet/20 bg-brand-violet/10 text-brand-violet">
        <MailCheck className="size-6" aria-hidden />
      </span>
      <AuthHeading title={t('auth.signUpSuccessTitle')} subtitle={t('auth.signUpSuccessBody')} />
      {email && (
        <div className="mb-4 flex flex-col gap-1 rounded-xl border bg-surface/70 p-3">
          <span className="text-xs font-medium text-muted-foreground">{t('auth.confirmationEmailLabel')}</span>
          <bdi className="break-all text-sm font-semibold text-foreground" dir="ltr">{email}</bdi>
        </div>
      )}
      <div className="flex items-start gap-3 rounded-xl border bg-surface/70 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-emerald/10 text-brand-emerald">
          <CheckCircle2 className="size-4" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">{t('auth.confirmationStepTitle')}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t('auth.confirmationStepBody')}</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">{t('auth.confirmationWaitBody')}</p>
    </section>
  )
}
