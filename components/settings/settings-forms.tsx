'use client'

import { useActionState, useTransition } from 'react'
import { Download, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, SubmitButton, initialActionState, useActionFeedback } from '@/components/shared/form'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useI18n } from '@/components/providers/i18n-provider'
import { requestDeletion, updateProfile } from '@/lib/actions/account'
import type { TranslationKey } from '@/lib/i18n/translate'

export function ProfileForm({ fullName, email }: { fullName: string | null; email: string }) {
  const { t } = useI18n()
  const [state, action] = useActionState(updateProfile, initialActionState)
  useActionFeedback(state)
  const errors = state.ok ? {} : (state.fieldErrors ?? {})
  return (
    <form action={action} className="grid gap-4 sm:max-w-md">
      <Field label={t('auth.fullName')} error={errors.full_name}>
        {(p) => <Input {...p} name="full_name" defaultValue={fullName ?? ''} required maxLength={120} className="h-10" dir="auto" />}
      </Field>
      <Field label={t('auth.email')}>
        {(p) => <Input {...p} value={email} readOnly disabled className="h-10" dir="ltr" />}
      </Field>
      <SubmitButton className="h-9 w-fit">{t('common.save')}</SubmitButton>
    </form>
  )
}

export function PreferencesControls() {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t('common.language')}</span>
        <LanguageSwitcher showLabel />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t('common.theme')}</span>
        <ThemeToggle />
      </div>
    </div>
  )
}

export function DataControls({ deletionPending }: { deletionPending: boolean }) {
  const { t } = useI18n()
  const [pending, start] = useTransition()
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="brand-rainbow-border flex flex-col gap-3 rounded-xl border p-4">
        <h3 className="text-sm font-semibold">{t('settings.exportTitle')}</h3>
        <p className="text-sm text-pretty text-muted-foreground">{t('settings.exportBody')}</p>
        <Button render={<a href="/api/export" download />} nativeButton={false} variant="outline" className="mt-auto h-9 w-fit">
          <Download aria-hidden />
          {t('settings.exportButton')}
        </Button>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-destructive/25 p-4">
        <h3 className="text-sm font-semibold">{t('settings.deletionTitle')}</h3>
        <p className="text-sm text-pretty text-muted-foreground">{t('settings.deletionBody')}</p>
        <Button
          variant="destructive"
          className="mt-auto h-9 w-fit"
          disabled={pending || deletionPending}
          onClick={() =>
            start(async () => {
              const res = await requestDeletion()
              if (res.ok) toast.success(t('settings.deletionRequested'))
              else toast.error(t(res.error as TranslationKey))
            })
          }
        >
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Trash2 aria-hidden />}
          {deletionPending ? t('settings.deletionRequested') : t('settings.deletionButton')}
        </Button>
      </div>
    </div>
  )
}
