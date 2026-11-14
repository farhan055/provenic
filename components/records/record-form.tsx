'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Field, FormError, SubmitButton, initialActionState, useActionFeedback } from '@/components/shared/form'
import { useI18n } from '@/components/providers/i18n-provider'
import { currencies, recordTypes } from '@/lib/domain'
import type { ActionResult, RecordRow } from '@/lib/types'

type Props = {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>
  mode: 'create' | 'edit'
  record?: Partial<RecordRow>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t pt-6 first:border-t-0 first:pt-0 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden className="text-sm font-semibold">{title}</p>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  )
}

export function RecordForm({ action, mode, record }: Props) {
  const { t } = useI18n()
  const [state, formAction] = useActionState(action, initialActionState)
  useActionFeedback(state)
  const e = state.ok ? {} : (state.fieldErrors ?? {})

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6 rounded-2xl border bg-card p-4 shadow-elevated sm:p-6 md:p-8">
      <FormError state={state} />
      <Section title={t('recordForm.sectionBasics')}>
        <Field label={t('recordForm.title')} error={e.title}>
          {(p) => <Input {...p} name="title" required maxLength={160} defaultValue={record?.title} placeholder={t('recordForm.titlePlaceholder')} className="h-10" dir="auto" />}
        </Field>
        <Field label={t('recordForm.type')} error={e.type}>
          {(p) => (
            <NativeSelect {...p} name="type" defaultValue={record?.type ?? 'purchase'} className="w-full [&_select]:h-10">
              {recordTypes.map((rt) => (
                <NativeSelectOption key={rt} value={rt}>
                  {t(`recordType.${rt}`)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field label={t('recordForm.summary')} error={e.summary} optional>
          {(p) => <Textarea {...p} name="summary" rows={2} maxLength={4000} defaultValue={record?.summary ?? ''} placeholder={t('recordForm.summaryPlaceholder')} dir="auto" />}
        </Field>
      </Section>

      <Section title={t('recordForm.sectionCustomer')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('recordForm.customerName')} error={e.customer_name} optional>
            {(p) => <Input {...p} name="customer_name" maxLength={120} defaultValue={record?.customer_name ?? ''} autoComplete="off" className="h-10" dir="auto" />}
          </Field>
          <Field label={t('recordForm.customerEmail')} error={e.customer_email} optional hint={t('recordForm.customerEmailHint')}>
            {(p) => <Input {...p} name="customer_email" type="email" defaultValue={record?.customer_email ?? ''} autoComplete="off" className="h-10" dir="ltr" />}
          </Field>
        </div>
      </Section>

      <Section title={t('recordForm.sectionTerms')}>
        <Field label={t('recordForm.terms')} error={e.terms} optional>
          {(p) => <Textarea {...p} name="terms" rows={4} maxLength={10000} defaultValue={record?.terms ?? ''} placeholder={t('recordForm.termsPlaceholder')} dir="auto" />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('recordForm.businessResp')} error={e.business_responsibility} optional>
            {(p) => <Textarea {...p} name="business_responsibility" rows={3} maxLength={2000} defaultValue={record?.business_responsibility ?? ''} dir="auto" />}
          </Field>
          <Field label={t('recordForm.customerResp')} error={e.customer_responsibility} optional>
            {(p) => <Textarea {...p} name="customer_responsibility" rows={3} maxLength={2000} defaultValue={record?.customer_responsibility ?? ''} dir="auto" />}
          </Field>
        </div>
      </Section>

      <Section title={t('recordForm.sectionValue')}>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)]">
          <Field label={t('recordForm.amount')} error={e.amount} optional>
            {(p) => <Input {...p} name="amount" inputMode="decimal" defaultValue={record?.amount ?? ''} placeholder="0.00" className="h-10 tabular-nums" dir="ltr" />}
          </Field>
          <Field label={t('recordForm.currency')} error={e.currency}>
            {(p) => (
              <NativeSelect {...p} name="currency" defaultValue={record?.currency ?? ''} className="w-full [&_select]:h-10">
                <NativeSelectOption value="">—</NativeSelectOption>
                {currencies.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {c}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            )}
          </Field>
          <Field label={t('recordForm.dueDate')} error={e.due_date} optional>
            {(p) => <Input {...p} name="due_date" type="date" defaultValue={record?.due_date ?? ''} className="h-10" />}
          </Field>
        </div>
      </Section>

      <div className="flex flex-col-reverse gap-2 border-t pt-6 sm:flex-row sm:justify-end">
        {mode === 'create' ? (
          <>
            <SubmitButton variant="outline" name="intent" value="draft" className="h-10">
              {t('recordForm.submitDraft')}
            </SubmitButton>
            <SubmitButton name="intent" value="pending" className="h-10">
              {t('recordForm.submitPending')}
            </SubmitButton>
          </>
        ) : (
          <SubmitButton className="h-10">{t('recordForm.submitEdit')}</SubmitButton>
        )}
      </div>
    </form>
  )
}
