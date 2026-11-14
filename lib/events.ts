import type { Translator, TranslationKey } from '@/lib/i18n/translate'
import type { TimelineEvent } from '@/lib/types'
import { issueStatuses, recordStatuses } from '@/lib/domain'

type ActorContext = {
  userId: string
  names: Record<string, string>
  customerId: string | null
  customerName: string | null
  businessName: string
  isMember: boolean
}

export function actorName(actorId: string | null, ctx: ActorContext, t: Translator) {
  if (!actorId) return t('record.unknownActor')
  if (actorId === ctx.userId) return t('common.you')
  if (ctx.names[actorId]) return ctx.names[actorId]
  if (actorId === ctx.customerId) return ctx.customerName || t('record.customerLabel')
  return ctx.isMember ? t('record.unknownActor') : ctx.businessName
}

const statusLabel = (value: unknown, t: Translator) => {
  const v = String(value)
  if ((recordStatuses as readonly string[]).includes(v)) return t(`status.${v}` as TranslationKey)
  if ((issueStatuses as readonly string[]).includes(v)) return t(`issueStatus.${v}` as TranslationKey)
  return v
}

export function describeEvent(e: TimelineEvent, t: Translator) {
  const m = e.metadata ?? {}
  switch (e.event_type) {
    case 'status_changed':
      return t('events.status_changed', { from: statusLabel(m.from, t), to: statusLabel(m.to, t) })
    case 'details_updated': {
      const fields = Array.isArray(m.fields) ? (m.fields as string[]) : []
      return t('events.details_updated', {
        fields: fields.map((f) => t(`fields.${f}` as TranslationKey)).join(', '),
      })
    }
    case 'issue_opened':
      return t('events.issue_opened', { title: String(m.title ?? '') })
    case 'issue_status':
      return t('events.issue_status', { title: String(m.title ?? ''), to: statusLabel(m.to, t) })
    case 'document_added':
      return t('events.document_added', { file: String(m.file_name ?? '') })
    default:
      return t(`events.${e.event_type}` as TranslationKey)
  }
}

export const eventColor: Record<TimelineEvent['event_type'], string> = {
  created: 'bg-brand-violet',
  shared: 'bg-brand-magenta',
  status_changed: 'bg-brand-cyan',
  details_updated: 'bg-brand-orange',
  customer_joined: 'bg-brand-emerald',
  comment: 'bg-muted-foreground/50',
  issue_opened: 'bg-brand-rose',
  issue_status: 'bg-brand-amber',
  document_added: 'bg-brand-violet',
}
