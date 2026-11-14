'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser, requireUser } from '@/lib/auth'
import { LOCALE_COOKIE, isLocale } from '@/lib/i18n/config'
import { fieldErrorsFrom, profileSchema } from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

export async function setLocale(locale: string): Promise<ActionResult> {
  if (!isLocale(locale)) return { ok: false, error: 'errors.generic' }
  ;(await cookies()).set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = await getSessionUser()
  if (user) {
    const supabase = await createClient()
    await supabase.from('profiles').update({ locale }).eq('id', user.id)
  }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateProfile(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = profileSchema.safeParse({ full_name: formData.get('full_name') ?? '' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', user.id)
  if (error) return { ok: false, error: 'errors.generic' }

  revalidatePath('/app', 'layout')
  return { ok: true, message: 'settings.saved' }
}

export async function requestDeletion(): Promise<ActionResult> {
  const user = await requireUser()
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('data_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('kind', 'deletion')
    .in('status', ['received', 'processing'])
    .maybeSingle()
  if (!existing) {
    const { error } = await supabase.from('data_requests').insert({ user_id: user.id, kind: 'deletion' })
    if (error) return { ok: false, error: 'errors.generic' }
  }
  revalidatePath('/app/settings')
  return { ok: true, message: 'settings.deletionRequested' }
}
