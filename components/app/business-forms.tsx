'use client'

import { useActionState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Field, FormError, initialActionState, SubmitButton, useActionFeedback } from '@/components/shared/form'
import { useI18n } from '@/components/providers/i18n-provider'
import { addMember, createBusiness, removeMember, updateBusiness } from '@/lib/actions/business'
import type { MemberRole } from '@/lib/domain'
import type { TranslationKey } from '@/lib/i18n/translate'
import type { ActionResult } from '@/lib/types'

export function CreateBusinessForm() {
  const { t } = useI18n()
  const [state, action] = useActionState(createBusiness, initialActionState)
  useActionFeedback(state)
  const errors = state.ok ? {} : state.fieldErrors ?? {}

  return (
    <form action={action} className="grid gap-4 sm:max-w-lg">
      <FormError state={state} />
      <Field label={t('business.name')} error={errors.name}>
        {(props) => <Input {...props} name="name" required maxLength={120} className="h-10" />}
      </Field>
      <Field label={t('business.category')} error={errors.category} optional>
        {(props) => <Input {...props} name="category" maxLength={80} placeholder={t('business.categoryPlaceholder')} className="h-10" />}
      </Field>
      <SubmitButton className="h-10 w-fit">{t('business.createButton')}</SubmitButton>
    </form>
  )
}

export function BusinessProfileForm({
  businessId,
  values,
  canEdit,
}: {
  businessId: string
  values: { name: string; category: string | null; contact_email: string | null; contact_phone: string | null }
  canEdit: boolean
}) {
  const { t } = useI18n()
  const [state, action] = useActionState(updateBusiness.bind(null, businessId), initialActionState)
  useActionFeedback(state)
  const errors = state.ok ? {} : state.fieldErrors ?? {}

  return (
    <form action={action} className="grid gap-4 sm:max-w-lg">
      <FormError state={state} />
      <Field label={t('business.name')} error={errors.name}>
        {(props) => <Input {...props} name="name" defaultValue={values.name} required maxLength={120} disabled={!canEdit} className="h-10" />}
      </Field>
      <Field label={t('business.category')} error={errors.category} optional>
        {(props) => <Input {...props} name="category" defaultValue={values.category ?? ''} maxLength={80} disabled={!canEdit} className="h-10" />}
      </Field>
      <Field label={t('business.contactEmail')} error={errors.contact_email} optional>
        {(props) => <Input {...props} name="contact_email" type="email" defaultValue={values.contact_email ?? ''} maxLength={254} disabled={!canEdit} className="h-10" dir="ltr" />}
      </Field>
      <Field label={t('business.contactPhone')} error={errors.contact_phone} optional>
        {(props) => <Input {...props} name="contact_phone" type="tel" defaultValue={values.contact_phone ?? ''} maxLength={40} disabled={!canEdit} className="h-10" dir="ltr" />}
      </Field>
      {canEdit ? <SubmitButton className="h-9 w-fit">{t('common.save')}</SubmitButton> : <p className="text-sm text-muted-foreground">{t('business.adminOnly')}</p>}
    </form>
  )
}

export function AddMemberForm({ businessId }: { businessId: string }) {
  const { t } = useI18n()
  const [state, action] = useActionState(addMember.bind(null, businessId), initialActionState)
  useActionFeedback(state)
  const errors = state.ok ? {} : state.fieldErrors ?? {}

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-end">
      <Field label={t('business.memberEmail')} error={errors.email}>
        {(props) => <Input {...props} name="email" type="email" required maxLength={254} className="h-9" dir="ltr" />}
      </Field>
      <Field label={t('business.role')} error={errors.role}>
        {(props) => (
          <NativeSelect {...props} name="role" defaultValue="staff" className="w-full [&_select]:h-9">
            <NativeSelectOption value="staff">{t('roles.staff')}</NativeSelectOption>
            <NativeSelectOption value="admin">{t('roles.admin')}</NativeSelectOption>
          </NativeSelect>
        )}
      </Field>
      <SubmitButton size="sm" className="h-9">{t('business.addMember')}</SubmitButton>
      <FormError state={state} />
    </form>
  )
}

export function RemoveMemberButton({ businessId, userId }: { businessId: string; userId: string }) {
  const { t } = useI18n()
  const [pending, startTransition] = useTransition()

  function remove() {
    startTransition(async () => {
      const result: ActionResult = await removeMember(businessId, userId)
      if (result.ok) toast.success(t('business.removed'))
      else toast.error(t(result.error as TranslationKey))
    })
  }

  return <Button type="button" variant="ghost" size="sm" className="h-8 text-destructive" disabled={pending} onClick={remove}>{t('business.remove')}</Button>
}
