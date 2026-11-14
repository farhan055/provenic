import 'server-only'
import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Membership } from '@/lib/types'
import type { MemberRole } from '@/lib/domain'

export const getSessionUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/login')
  return user
}

export const getProfile = cache(async () => {
  const user = await requireUser()
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, full_name, email, locale').eq('id', user.id).maybeSingle()
  return {
    id: user.id,
    email: (user.email ?? '').toLowerCase(),
    full_name: (data?.full_name as string | null) ?? (user.user_metadata?.full_name as string | undefined) ?? null,
    locale: (data?.locale as string | null) ?? null,
  }
})

export const getMemberships = cache(async (): Promise<Membership[]> => {
  const user = await requireUser()
  const supabase = await createClient()
  const { data } = await supabase
    .from('business_members')
    .select('role, business:businesses(id, name, category)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  return ((data ?? []) as unknown as Membership[]).filter((m) => m.business)
})

/** Server-side tenant gate: 404s when the user is not a member, so existence is not revealed. */
export async function requireMembership(businessId: string): Promise<Membership> {
  if (!/^[0-9a-f-]{36}$/i.test(businessId)) notFound()
  const memberships = await getMemberships()
  const membership = memberships.find((m) => m.business.id === businessId)
  if (!membership) notFound()
  return membership
}

export function canManage(role: MemberRole) {
  return role === 'owner' || role === 'admin'
}
