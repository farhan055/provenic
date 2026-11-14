'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canManage, requireMembership, requireUser } from '@/lib/auth'
import { businessProfileSchema, businessSchema, fieldErrorsFrom, memberSchema, uuid } from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

export async function createBusiness(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser()
  const parsed = businessSchema.safeParse({ name: formData.get('name') ?? '', category: formData.get('category') ?? '' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('create_business', {
    p_name: parsed.data.name,
    p_category: parsed.data.category ?? null,
  })
  if (error || !data) return { ok: false, error: 'errors.generic' }

  revalidatePath('/app', 'layout')
  redirect(`/app/b/${data}`)
}

export async function updateBusiness(businessId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const membership = await requireMembership(businessId)
  if (!canManage(membership.role)) return { ok: false, error: 'errors.forbidden' }

  const parsed = businessProfileSchema.safeParse({
    name: formData.get('name') ?? '',
    category: formData.get('category') ?? '',
    contact_email: formData.get('contact_email') ?? '',
    contact_phone: formData.get('contact_phone') ?? '',
  })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('businesses').update(parsed.data).eq('id', businessId)
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/b/${businessId}`, 'layout')
  return { ok: true, message: 'settings.saved' }
}

export async function addMember(businessId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const membership = await requireMembership(businessId)
  if (!canManage(membership.role)) return { ok: false, error: 'errors.forbidden' }

  const parsed = memberSchema.safeParse({ email: formData.get('email') ?? '', role: formData.get('role') ?? 'staff' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('add_business_member', {
    p_business: businessId,
    p_email: parsed.data.email,
    p_role: parsed.data.role,
  })
  if (error) return { ok: false, error: 'errors.forbidden' }
  // Same message for unknown emails to avoid account enumeration beyond confirmed accounts.
  if (data === 'not_found') return { ok: false, error: 'business.memberNotFound' }

  revalidatePath(`/app/b/${businessId}/team`)
  return { ok: true, message: 'business.memberAdded' }
}

export async function removeMember(businessId: string, userId: string): Promise<ActionResult> {
  const membership = await requireMembership(businessId)
  if (!canManage(membership.role) || !uuid.safeParse(userId).success) return { ok: false, error: 'errors.forbidden' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('business_members')
    .delete()
    .eq('business_id', businessId)
    .eq('user_id', userId)
    .select('user_id')
  if (error || !data?.length) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/b/${businessId}/team`)
  return { ok: true }
}
