'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireMembership, requireUser } from '@/lib/auth'
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES, issueTransitions, recordTransitions } from '@/lib/domain'
import {
  commentSchema,
  fieldErrorsFrom,
  issueSchema,
  issueStatusSchema,
  noteSchema,
  recordSchema,
  reminderSchema,
  statusSchema,
  uuid,
} from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

function formObject(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, (formData.get(k) as string | null) ?? '']))
}

const RECORD_FIELDS = [
  'title',
  'type',
  'summary',
  'terms',
  'business_responsibility',
  'customer_responsibility',
  'customer_name',
  'customer_email',
  'amount',
  'currency',
  'due_date',
]

export async function createRecord(businessId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  await requireMembership(businessId)

  const parsed = recordSchema.safeParse(formObject(formData, RECORD_FIELDS))
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const status = formData.get('intent') === 'pending' ? 'pending' : 'draft'
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('records')
    .insert({ ...parsed.data, business_id: businessId, created_by: user.id, status })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'errors.generic' }
  revalidatePath(`/app/b/${businessId}`, 'layout')
  redirect(`/app/records/${data.id}`)
}

export async function updateRecord(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser()
  if (!uuid.safeParse(recordId).success) return { ok: false, error: 'errors.generic' }

  const parsed = recordSchema.safeParse(formObject(formData, RECORD_FIELDS))
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { data, error } = await supabase.from('records').update(parsed.data).eq('id', recordId).select('id').maybeSingle()
  if (error) return { ok: false, error: 'errors.generic' }
  if (!data) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  redirect(`/app/records/${recordId}`)
}

export async function updateRecordStatus(recordId: string, nextStatus: string): Promise<ActionResult> {
  await requireUser()
  const status = statusSchema.safeParse(nextStatus)
  if (!uuid.safeParse(recordId).success || !status.success) return { ok: false, error: 'errors.generic' }

  const supabase = await createClient()
  const { data: current } = await supabase.from('records').select('status').eq('id', recordId).maybeSingle()
  if (!current) return { ok: false, error: 'errors.forbidden' }
  if (!recordTransitions[current.status as keyof typeof recordTransitions].includes(status.data)) {
    return { ok: false, error: 'errors.forbidden' }
  }

  // RLS only permits members of the owning business to update.
  const { data, error } = await supabase.from('records').update({ status: status.data }).eq('id', recordId).select('id').maybeSingle()
  if (error || !data) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function addComment(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = commentSchema.safeParse({
    body: formData.get('body') ?? '',
    visibility: formData.get('internal') === 'on' ? 'internal' : 'shared',
  })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('timeline_events').insert({
    record_id: recordId,
    actor_id: user.id,
    event_type: 'comment',
    body: parsed.data.body,
    visibility: parsed.data.visibility,
  })
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function addNote(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = noteSchema.safeParse({ body: formData.get('body') ?? '' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('record_notes').insert({ record_id: recordId, author_id: user.id, body: parsed.data.body })
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function createShareLink(recordId: string): Promise<ActionResult> {
  const user = await requireUser()
  if (!uuid.safeParse(recordId).success) return { ok: false, error: 'errors.generic' }
  const supabase = await createClient()

  const { error } = await supabase.from('share_links').insert({ record_id: recordId, created_by: user.id })
  if (error) return { ok: false, error: 'errors.forbidden' }

  const { data: record } = await supabase.from('records').select('status').eq('id', recordId).maybeSingle()
  if (record?.status === 'draft') {
    await supabase.from('records').update({ status: 'pending' }).eq('id', recordId)
  }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function revokeShareLink(recordId: string, linkId: string): Promise<ActionResult> {
  await requireUser()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('share_links')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', linkId)
    .eq('record_id', recordId)
    .select('id')
    .maybeSingle()
  if (error || !data) return { ok: false, error: 'errors.forbidden' }
  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

function safeFileName(name: string) {
  const cleaned = name.normalize('NFKC').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/-+/g, '-').slice(-120)
  return cleaned || 'file'
}

export async function uploadAttachment(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  if (!uuid.safeParse(recordId).success) return { ok: false, error: 'errors.generic' }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'validation.required' }
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: 'errors.fileTooLarge' }
  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) return { ok: false, error: 'errors.fileType' }
  const visibility = formData.get('internal') === 'on' ? 'internal' : 'shared'

  const supabase = await createClient()
  const path = `${recordId}/${crypto.randomUUID()}-${safeFileName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from('record-files')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) return { ok: false, error: 'errors.forbidden' }

  const { error } = await supabase.from('attachments').insert({
    record_id: recordId,
    storage_path: path,
    file_name: file.name.slice(0, 255),
    mime_type: file.type,
    size_bytes: file.size,
    uploaded_by: user.id,
    visibility,
  })
  if (error) {
    await supabase.storage.from('record-files').remove([path])
    return { ok: false, error: 'errors.forbidden' }
  }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function openIssue(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = issueSchema.safeParse({ title: formData.get('title') ?? '', description: formData.get('description') ?? '' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('issues').insert({ ...parsed.data, record_id: recordId, reporter_id: user.id })
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function updateIssueStatus(recordId: string, issueId: string, nextStatus: string): Promise<ActionResult> {
  await requireUser()
  const status = issueStatusSchema.safeParse(nextStatus)
  if (!status.success) return { ok: false, error: 'errors.generic' }

  const supabase = await createClient()
  const { data: issue } = await supabase.from('issues').select('status').eq('id', issueId).eq('record_id', recordId).maybeSingle()
  if (!issue) return { ok: false, error: 'errors.forbidden' }
  if (!issueTransitions[issue.status as keyof typeof issueTransitions].includes(status.data)) {
    return { ok: false, error: 'errors.forbidden' }
  }

  const { error } = await supabase.from('issues').update({ status: status.data }).eq('id', issueId)
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  return { ok: true }
}

export async function addReminder(recordId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = reminderSchema.safeParse({ title: formData.get('title') ?? '', remind_at: formData.get('remind_at') ?? '' })
  if (!parsed.success) return { ok: false, error: 'errors.validation', fieldErrors: fieldErrorsFrom(parsed.error) }

  const supabase = await createClient()
  const { error } = await supabase.from('reminders').insert({
    record_id: recordId,
    owner_id: user.id,
    title: parsed.data.title,
    remind_at: new Date(`${parsed.data.remind_at}T09:00:00`).toISOString(),
  })
  if (error) return { ok: false, error: 'errors.forbidden' }

  revalidatePath(`/app/records/${recordId}`)
  revalidatePath('/app/reminders')
  return { ok: true }
}

export async function completeReminder(reminderId: string): Promise<ActionResult> {
  await requireUser()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reminders')
    .update({ status: 'done' })
    .eq('id', reminderId)
    .select('record_id')
    .maybeSingle()
  if (error || !data) return { ok: false, error: 'errors.forbidden' }
  revalidatePath(`/app/records/${data.record_id}`)
  revalidatePath('/app/reminders')
  revalidatePath('/app')
  return { ok: true }
}

export async function claimSharedRecord(token: string): Promise<ActionResult<{ recordId: string }>> {
  await requireUser()
  if (!/^[0-9a-f]{48}$/.test(token)) return { ok: false, error: 'share.invalid' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('claim_shared_record', { p_token: token })
  if (error) {
    const map: Record<string, string> = {
      already_claimed: 'share.alreadyClaimed',
      email_mismatch: 'share.emailMismatch',
    }
    return { ok: false, error: map[error.message] ?? 'share.invalid' }
  }
  return { ok: true, data: { recordId: data as string } }
}
