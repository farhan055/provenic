export const recordTypes = ['purchase', 'booking', 'repair', 'delivery', 'warranty', 'service_agreement', 'other'] as const
export const recordStatuses = ['draft', 'pending', 'active', 'completed', 'cancelled', 'archived'] as const
export const issueStatuses = ['open', 'acknowledged', 'in_progress', 'resolved', 'closed'] as const
export const memberRoles = ['owner', 'admin', 'staff'] as const
export const currencies = ['USD', 'EUR', 'GBP', 'PKR', 'AED', 'SAR', 'CNY', 'INR'] as const

export type RecordType = (typeof recordTypes)[number]
export type RecordStatus = (typeof recordStatuses)[number]
export type IssueStatus = (typeof issueStatuses)[number]
export type MemberRole = (typeof memberRoles)[number]
export type Visibility = 'shared' | 'internal'

// Lifecycle: Draft → Pending confirmation → Active → Completed; Cancelled/Archived as exits.
export const recordTransitions: Record<RecordStatus, RecordStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: ['active', 'archived'],
  cancelled: ['archived'],
  archived: [],
}

// Issue lifecycle: Open → Acknowledged → In progress → Resolved → Closed, with reopening.
export const issueTransitions: Record<IssueStatus, IssueStatus[]> = {
  open: ['acknowledged', 'in_progress', 'resolved'],
  acknowledged: ['in_progress', 'resolved'],
  in_progress: ['resolved'],
  resolved: ['closed', 'open'],
  closed: ['open'],
}

export type Tone = 'neutral' | 'amber' | 'cyan' | 'emerald' | 'rose' | 'violet' | 'orange'

export const recordStatusTone: Record<RecordStatus, Tone> = {
  draft: 'neutral',
  pending: 'amber',
  active: 'cyan',
  completed: 'emerald',
  cancelled: 'rose',
  archived: 'neutral',
}

export const issueStatusTone: Record<IssueStatus, Tone> = {
  open: 'rose',
  acknowledged: 'orange',
  in_progress: 'violet',
  resolved: 'emerald',
  closed: 'neutral',
}

export const ALLOWED_UPLOAD_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain'] as const
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
