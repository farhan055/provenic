'use client'

import { useEffect, useId, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/components/providers/i18n-provider'
import type { TranslationKey } from '@/lib/i18n/translate'
import type { ActionResult } from '@/lib/types'
import { cn } from '@/lib/utils'

export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => React.ReactNode
  className?: string
}) {
  const { t } = useI18n()
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">{t('common.optional')}</span>}
      </Label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive" role="alert">
          {t(error as TranslationKey)}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({
  children,
  className,
  variant,
  size,
  name,
  value,
}: {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  name?: string
  value?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className={className} variant={variant} size={size} name={name} value={value} aria-busy={pending}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </Button>
  )
}

/** Shows a toast for action results and optionally resets the form on success. */
export function useActionFeedback(state: ActionResult, opts: { successKey?: TranslationKey; resetRef?: React.RefObject<HTMLFormElement | null> } = {}) {
  const { t } = useI18n()
  const last = useRef(state)
  useEffect(() => {
    if (state === last.current) return
    last.current = state
    if (state.ok) {
      const key = (state.message as TranslationKey | undefined) ?? opts.successKey
      if (key) toast.success(t(key))
      opts.resetRef?.current?.reset()
    } else if (state.error && !state.fieldErrors) {
      toast.error(t(state.error as TranslationKey))
    } else if (state.fieldErrors) {
      toast.error(t('errors.validation'))
    }
  }, [state, t, opts.successKey, opts.resetRef])
}

export const initialActionState: ActionResult = { ok: true }

export function FormError({ state }: { state: ActionResult }) {
  const { t } = useI18n()
  if (state.ok || state.fieldErrors) return null
  return (
    <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
      {t(state.error as TranslationKey)}
    </p>
  )
}
