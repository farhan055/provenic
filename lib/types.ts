import type { IssueStatus, MemberRole, RecordStatus, RecordType, Visibility } from './domain'

export type Business = {
  id: string
  name: string
  category: string | null
  contact_email: string | null
  contact_phone: string | null
  created_at: string
}

export type Membership = { role: MemberRole; business: Pick<Business, 'id' | 'name' | 'category'> }

export type RecordRow = {
  id: string
  reference: string
  business_id: string
  type: RecordType
  title: string
  summary: string | null
  terms: string | null
  business_responsibility: string | null
  customer_responsibility: string | null
  status: RecordStatus
  amount: string | null
  currency: string | null
  due_date: string | null
  customer_name: string | null
  customer_email: string | null
  customer_id: string | null
  assigned_to: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type RecordListItem = Pick<
  RecordRow,
  'id' | 'reference' | 'type' | 'title' | 'status' | 'amount' | 'currency' | 'due_date' | 'customer_name' | 'customer_email' | 'updated_at'
> & { business: { name: string } | null }

export type TimelineEvent = {
  id: string
  record_id: string
  actor_id: string | null
  event_type:
    | 'created'
    | 'shared'
    | 'status_changed'
    | 'details_updated'
    | 'customer_joined'
    | 'comment'
    | 'issue_opened'
    | 'issue_status'
    | 'document_added'
  body: string | null
  metadata: Record<string, unknown>
  visibility: Visibility
  created_at: string
}

export type Issue = {
  id: string
  record_id: string
  reporter_id: string
  title: string
  description: string | null
  status: IssueStatus
  created_at: string
  updated_at: string
}

export type Reminder = {
  id: string
  record_id: string
  title: string
  remind_at: string
  status: 'scheduled' | 'done' | 'cancelled'
}

export type Attachment = {
  id: string
  record_id: string
  file_name: string
  mime_type: string
  size_bytes: number
  visibility: Visibility
  uploaded_by: string
  created_at: string
}

export type ShareLink = { id: string; token: string; expires_at: string; revoked_at: string | null; created_at: string }

export type RecordNote = { id: string; author_id: string; body: string; created_at: string }

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
