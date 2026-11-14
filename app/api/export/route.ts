import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

type ExportRow = Record<string, unknown>
type PageResult = { data: ExportRow[] | null; error: { message: string } | null }

async function collectRows(fetchPage: (from: number, to: number) => PromiseLike<PageResult>) {
  const rows: ExportRow[] = []
  for (let from = 0; ; from += 500) {
    const { data, error } = await fetchPage(from, from + 499)
    if (error) throw new Error('export_query_failed')
    const page = data ?? []
    rows.push(...page)
    if (page.length < 500) return rows
  }
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })

  try {
    const supabase = await createClient()
    const [records, timeline, issues, reminders, attachments, notes, businesses, memberships, requests] = await Promise.all([
      collectRows((from, to) => supabase.from('records').select('id, reference, business_id, type, title, summary, terms, business_responsibility, customer_responsibility, status, amount, currency, due_date, customer_name, customer_email, customer_id, created_by, created_at, updated_at').range(from, to)),
      collectRows((from, to) => supabase.from('timeline_events').select('id, record_id, actor_id, event_type, body, metadata, visibility, created_at').range(from, to)),
      collectRows((from, to) => supabase.from('issues').select('id, record_id, reporter_id, assignee_id, title, description, status, response_due, created_at, updated_at').range(from, to)),
      collectRows((from, to) => supabase.from('reminders').select('id, record_id, owner_id, title, remind_at, status, created_at').range(from, to)),
      collectRows((from, to) => supabase.from('attachments').select('id, record_id, file_name, mime_type, size_bytes, uploaded_by, visibility, created_at').range(from, to)),
      collectRows((from, to) => supabase.from('record_notes').select('id, record_id, author_id, body, created_at').range(from, to)),
      collectRows((from, to) => supabase.from('businesses').select('id, name, category, contact_email, contact_phone, created_at, updated_at').range(from, to)),
      collectRows((from, to) => supabase.from('business_members').select('business_id, user_id, role, created_at').range(from, to)),
      collectRows((from, to) => supabase.from('data_requests').select('id, kind, status, created_at').eq('user_id', user.id).range(from, to)),
    ])

    const body = JSON.stringify({
      exportedAt: new Date().toISOString(),
      profile: { id: user.id, email: user.email ?? null },
      records,
      timeline,
      issues,
      reminders,
      attachments,
      notes,
      businesses,
      memberships,
      requests,
    }, null, 2)

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="provenic-export-${new Date().toISOString().slice(0, 10)}.json"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ error: 'export_unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
