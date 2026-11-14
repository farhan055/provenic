import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getMemberships, requireUser } from '@/lib/auth'
import { recordStatuses, recordTypes, type RecordStatus } from '@/lib/domain'
import type {
  Attachment,
  Issue,
  RecordListItem,
  RecordNote,
  RecordRow,
  Reminder,
  ShareLink,
  TimelineEvent,
} from '@/lib/types'

const LIST_COLUMNS =
  'id, reference, type, title, status, amount, currency, due_date, customer_name, customer_email, updated_at, business:businesses(name)'

export type RecordFilters = { q?: string; status?: string; type?: string }

/** Strip characters that carry meaning in PostgREST filter syntax. */
function sanitizeSearch(q: string) {
  return q.replace(/[,()"\\%*:.]/g, ' ').trim().slice(0, 80)
}

function applyFilters<T extends { or: (f: string) => T; eq: (c: string, v: string) => T }>(query: T, filters: RecordFilters) {
  let next = query
  const q = filters.q ? sanitizeSearch(filters.q) : ''
  if (q) next = next.or(`title.ilike.%${q}%,reference.ilike.%${q}%`)
  if (filters.status && (recordStatuses as readonly string[]).includes(filters.status)) next = next.eq('status', filters.status)
  if (filters.type && (recordTypes as readonly string[]).includes(filters.type)) next = next.eq('type', filters.type)
  return next
}

/** Customer scope: only records where the user is the customer, never their business-member records. */
function customerScope(userId: string, email: string) {
  return email ? `customer_id.eq.${userId},customer_email.eq."${email}"` : `customer_id.eq.${userId}`
}

export async function getCustomerRecords(filters: RecordFilters = {}) {
  const profile = await getProfile()
  const supabase = await createClient()
  const base = supabase
    .from('records')
    .select(LIST_COLUMNS)
    .or(customerScope(profile.id, profile.email))
    .neq('status', 'draft')
    .order('updated_at', { ascending: false })
    .limit(200)
  const { data } = await applyFilters(base, filters)
  return (data ?? []) as unknown as RecordListItem[]
}

export async function getBusinessRecords(businessId: string, filters: RecordFilters = {}) {
  const supabase = await createClient()
  const base = supabase
    .from('records')
    .select(LIST_COLUMNS)
    .eq('business_id', businessId)
    .order('updated_at', { ascending: false })
    .limit(200)
  const { data } = await applyFilters(base, filters)
  return (data ?? []) as unknown as RecordListItem[]
}

export async function getCustomerDashboard() {
  const profile = await getProfile()
  const supabase = await createClient()
  const scope = customerScope(profile.id, profile.email)

  const [recordsRes, remindersRes] = await Promise.all([
    supabase.from('records').select(LIST_COLUMNS).or(scope).neq('status', 'draft').order('updated_at', { ascending: false }).limit(200),
    supabase
      .from('reminders')
      .select('id, record_id, title, remind_at, status')
      .eq('owner_id', profile.id)
      .eq('status', 'scheduled')
      .order('remind_at', { ascending: true })
      .limit(6),
  ])

  const records = (recordsRes.data ?? []) as unknown as RecordListItem[]
  const ids = records.map((r) => r.id)
  const { count: openIssues } = ids.length
    ? await supabase.from('issues').select('id', { count: 'exact', head: true }).in('record_id', ids).in('status', ['open', 'acknowledged', 'in_progress'])
    : { count: 0 }

  const today = new Date()
  const horizon = new Date(today.getTime() + 14 * 86400000).toISOString().slice(0, 10)
  const todayStr = today.toISOString().slice(0, 10)
  const live = (s: RecordStatus) => s === 'pending' || s === 'active'

  return {
    records: records.slice(0, 6),
    stats: {
      active: records.filter((r) => r.status === 'active').length,
      pending: records.filter((r) => r.status === 'pending').length,
      dueSoon: records.filter((r) => live(r.status) && r.due_date && r.due_date >= todayStr && r.due_date <= horizon).length,
      openIssues: openIssues ?? 0,
    },
    upcomingDue: records
      .filter((r) => live(r.status) && r.due_date && r.due_date >= todayStr)
      .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
      .slice(0, 5),
    reminders: (remindersRes.data ?? []) as Reminder[],
  }
}

export async function getBusinessDashboard(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('records')
    .select(LIST_COLUMNS)
    .eq('business_id', businessId)
    .order('updated_at', { ascending: false })
    .limit(500)
  const records = (data ?? []) as unknown as RecordListItem[]
  const ids = records.map((r) => r.id)
  const { count: openIssues } = ids.length
    ? await supabase.from('issues').select('id', { count: 'exact', head: true }).in('record_id', ids).in('status', ['open', 'acknowledged', 'in_progress'])
    : { count: 0 }

  const todayStr = new Date().toISOString().slice(0, 10)
  const overdue = records.filter((r) => (r.status === 'pending' || r.status === 'active') && r.due_date && r.due_date < todayStr)

  return {
    total: records.length,
    stats: {
      active: records.filter((r) => r.status === 'active').length,
      pending: records.filter((r) => r.status === 'pending' || r.status === 'draft').length,
      overdue: overdue.length,
      completed: records.filter((r) => r.status === 'completed').length,
      openIssues: openIssues ?? 0,
    },
    overdue: overdue.slice(0, 5),
    recent: records.slice(0, 6),
  }
}

export async function getRecordDetail(recordId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(recordId)) return null
  const user = await requireUser()
  const supabase = await createClient()

  const { data: record } = await supabase
    .from('records')
    .select('*, business:businesses(id, name)')
    .eq('id', recordId)
    .maybeSingle()
  if (!record) return null

  const memberships = await getMemberships()
  const membership = memberships.find((m) => m.business.id === record.business_id) ?? null

  const [timeline, attachments, issues, reminders, notes, links] = await Promise.all([
    supabase.from('timeline_events').select('*').eq('record_id', recordId).order('created_at', { ascending: false }).limit(200),
    supabase.from('attachments').select('id, record_id, file_name, mime_type, size_bytes, visibility, uploaded_by, created_at').eq('record_id', recordId).order('created_at', { ascending: false }),
    supabase.from('issues').select('*').eq('record_id', recordId).order('created_at', { ascending: false }),
    supabase.from('reminders').select('id, record_id, title, remind_at, status').eq('record_id', recordId).eq('owner_id', user.id).order('remind_at'),
    membership
      ? supabase.from('record_notes').select('id, author_id, body, created_at').eq('record_id', recordId).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] }),
    membership
      ? supabase.from('share_links').select('id, token, expires_at, revoked_at, created_at').eq('record_id', recordId).is('revoked_at', null).gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const events = (timeline.data ?? []) as TimelineEvent[]
  const actorIds = new Set<string>()
  events.forEach((e) => e.actor_id && actorIds.add(e.actor_id))
  ;(issues.data ?? []).forEach((i) => actorIds.add(i.reporter_id))
  ;((notes.data ?? []) as RecordNote[]).forEach((n) => actorIds.add(n.author_id))
  const names = await getProfileNames([...actorIds])

  return {
    record: record as RecordRow & { business: { id: string; name: string } },
    membership,
    userId: user.id,
    timeline: events,
    attachments: (attachments.data ?? []) as Attachment[],
    issues: (issues.data ?? []) as Issue[],
    reminders: (reminders.data ?? []) as Reminder[],
    notes: (notes.data ?? []) as RecordNote[],
    links: (links.data ?? []) as ShareLink[],
    names,
  }
}

/** Names are only visible where RLS allows (self, or colleagues in a shared business). */
export async function getProfileNames(ids: string[]) {
  if (!ids.length) return {} as Record<string, string>
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, full_name, email').in('id', ids)
  return Object.fromEntries((data ?? []).map((p) => [p.id, (p.full_name as string | null) || (p.email as string)])) as Record<string, string>
}

export async function getDocuments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('attachments')
    .select('id, record_id, file_name, mime_type, size_bytes, visibility, uploaded_by, created_at, record:records(title, reference)')
    .order('created_at', { ascending: false })
    .limit(200)
  return (data ?? []) as unknown as (Attachment & { record: { title: string; reference: string } | null })[]
}

export async function getMyReminders() {
  const user = await requireUser()
  const supabase = await createClient()
  const { data } = await supabase
    .from('reminders')
    .select('id, record_id, title, remind_at, status, record:records(title, reference)')
    .eq('owner_id', user.id)
    .neq('status', 'cancelled')
    .order('remind_at', { ascending: true })
    .limit(200)
  return (data ?? []) as unknown as (Reminder & { record: { title: string; reference: string } | null })[]
}

export async function getActivity() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('timeline_events')
    .select('*, record:records(title, reference, customer_id, customer_name)')
    .order('created_at', { ascending: false })
    .limit(60)
  const events = (data ?? []) as unknown as (TimelineEvent & {
    record: { title: string; reference: string; customer_id: string | null; customer_name: string | null } | null
  })[]
  const names = await getProfileNames([...new Set(events.map((e) => e.actor_id).filter(Boolean) as string[])])
  return { events, names }
}

export async function getBusinessCustomers(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('records')
    .select('customer_name, customer_email, customer_id, updated_at')
    .eq('business_id', businessId)
    .not('customer_email', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(1000)

  const map = new Map<string, { name: string | null; email: string; records: number; connected: boolean; last: string }>()
  for (const row of data ?? []) {
    const email = row.customer_email as string
    const existing = map.get(email)
    if (existing) {
      existing.records++
      existing.connected ||= Boolean(row.customer_id)
      existing.name ||= row.customer_name
    } else {
      map.set(email, { name: row.customer_name, email, records: 1, connected: Boolean(row.customer_id), last: row.updated_at })
    }
  }
  return [...map.values()]
}

export async function getTeam(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('business_members').select('user_id, role, created_at').eq('business_id', businessId).order('created_at')
  const members = data ?? []
  const { data: profiles } = members.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', members.map((m) => m.user_id))
    : { data: [] }
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]))
  return members.map((m) => ({
    userId: m.user_id as string,
    role: m.role as 'owner' | 'admin' | 'staff',
    since: m.created_at as string,
    name: (byId.get(m.user_id)?.full_name as string | null) ?? null,
    email: (byId.get(m.user_id)?.email as string | null) ?? null,
  }))
}

export async function getAuditLog(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('audit_events')
    .select('id, actor_id, action, target_type, created_at')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(40)
  const events = data ?? []
  const names = await getProfileNames([...new Set(events.map((e) => e.actor_id).filter(Boolean) as string[])])
  return { events, names }
}

export async function getBusiness(businessId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('businesses').select('id, name, category, contact_email, contact_phone, created_at').eq('id', businessId).maybeSingle()
  return data
}

export async function getDataRequests() {
  const user = await requireUser()
  const supabase = await createClient()
  const { data } = await supabase.from('data_requests').select('id, kind, status, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
  return data ?? []
}
