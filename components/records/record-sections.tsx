import Link from 'next/link'
import { Bell, Download, FileText, ImageIcon, Lock, MessageSquareWarning, StickyNote } from 'lucide-react'
import { DefinitionItem, EmptyState, Panel } from '@/components/shared/page'
import { IssueStatusBadge, RecordStatusBadge } from '@/components/shared/status-badge'
import {
  CommentForm,
  CompleteReminderButton,
  IssueDialog,
  IssueStatusMenu,
  NoteForm,
  ReminderForm,
  UploadForm,
} from './record-controls'
import { actorName, describeEvent, eventColor } from '@/lib/events'
import { formatBytes, formatDate, formatDateTime, formatMoney, formatRelative } from '@/lib/i18n/format'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/translate'
import type { getRecordDetail } from '@/lib/data'
import { cn } from '@/lib/utils'

type Detail = NonNullable<Awaited<ReturnType<typeof getRecordDetail>>>
type Ctx = { d: Detail; t: Translator; locale: Locale }

function actorCtx(d: Detail) {
  return {
    userId: d.userId,
    names: d.names,
    customerId: d.record.customer_id,
    customerName: d.record.customer_name,
    businessName: d.record.business.name,
    isMember: Boolean(d.membership),
  }
}

function Prose({ children }: { children: string }) {
  return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-pretty">{children}</p>
}

export function RecordOverview({ d, t, locale }: Ctx) {
  const r = d.record
  return (
    <Panel bodyClassName="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        <DefinitionItem label={t('record.type')}>{t(`recordType.${r.type}`)}</DefinitionItem>
        <DefinitionItem label={t('record.status')}>
          <RecordStatusBadge status={r.status} t={t} />
        </DefinitionItem>
        <DefinitionItem label={t('record.amount')}>
          <span className="tabular-nums">{formatMoney(locale, r.amount, r.currency) ?? t('common.notSet')}</span>
        </DefinitionItem>
        <DefinitionItem label={t('record.dueDate')}>{formatDate(locale, r.due_date) ?? t('common.notSet')}</DefinitionItem>
        <DefinitionItem label={d.membership ? t('record.customer') : t('record.business')}>
          {d.membership ? (r.customer_name ?? r.customer_email ?? t('common.notSet')) : r.business.name}
        </DefinitionItem>
        <DefinitionItem label={t('record.updated')}>{formatRelative(locale, r.updated_at)}</DefinitionItem>
      </dl>

      {r.summary && (
        <div className="flex flex-col gap-2 border-t pt-5">
          <h3 className="text-xs font-medium text-muted-foreground">{t('record.summary')}</h3>
          <Prose>{r.summary}</Prose>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t pt-5">
        <h3 className="text-xs font-medium text-muted-foreground">{t('record.terms')}</h3>
        {r.terms ? <Prose>{r.terms}</Prose> : <p className="text-sm text-muted-foreground">{t('record.noTerms')}</p>}
      </div>

      {(r.business_responsibility || r.customer_responsibility) && (
        <div className="grid gap-3 border-t pt-5 sm:grid-cols-2">
          {r.business_responsibility && (
            <div className="rounded-xl border bg-surface/50 p-3.5">
              <h3 className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-brand-orange" />
                {t('record.businessResp')}
              </h3>
              <Prose>{r.business_responsibility}</Prose>
            </div>
          )}
          {r.customer_responsibility && (
            <div className="rounded-xl border bg-surface/50 p-3.5">
              <h3 className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-brand-cyan" />
                {t('record.customerResp')}
              </h3>
              <Prose>{r.customer_responsibility}</Prose>
            </div>
          )}
        </div>
      )}
    </Panel>
  )
}

export function RecordTimeline({ d, t, locale }: Ctx) {
  const ctx = actorCtx(d)
  return (
    <Panel title={t('record.timeline')} bodyClassName="flex flex-col gap-6">
      <CommentForm recordId={d.record.id} isMember={Boolean(d.membership)} />
      {d.timeline.length === 0 ? (
        <EmptyState compact title={t('record.noTimeline')} />
      ) : (
        <ol className="relative flex flex-col gap-5 ps-6 before:absolute before:inset-y-2 before:start-[5px] before:w-px before:bg-border">
          {d.timeline.map((e) => (
            <li key={e.id} className="relative flex flex-col gap-1.5">
              <span aria-hidden className={cn('absolute -start-6 top-1.5 size-[11px] rounded-full ring-4 ring-card', eventColor[e.event_type])} />
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm">
                <span className="font-medium">{actorName(e.actor_id, ctx, t)}</span>
                <span className="text-muted-foreground">{describeEvent(e, t)}</span>
                {e.visibility === 'internal' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-violet/10 px-1.5 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
                    <Lock className="size-3" aria-hidden />
                    {t('record.visibilityInternal')}
                  </span>
                )}
              </div>
              {e.body && <div className="rounded-lg border bg-surface/50 px-3 py-2"><Prose>{e.body}</Prose></div>}
              <time dateTime={e.created_at} className="text-xs text-muted-foreground" title={formatDateTime(locale, e.created_at)}>
                {formatRelative(locale, e.created_at)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}

export function RecordDocuments({ d, t, locale }: Ctx) {
  return (
    <Panel title={t('record.documents')} bodyClassName="flex flex-col gap-4">
      {d.attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('record.noDocuments')}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {d.attachments.map((a) => (
            <li key={a.id}>
              <a
                href={`/api/attachments/${a.id}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground">
                  {a.mime_type.startsWith('image/') ? <ImageIcon className="size-4" aria-hidden /> : <FileText className="size-4" aria-hidden />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium" dir="auto">{a.file_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(locale, a.size_bytes)} · {formatDate(locale, a.created_at)}
                    {a.visibility === 'internal' && ` · ${t('record.visibilityInternal')}`}
                  </span>
                </span>
                <Download className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="sr-only">{t('common.download')}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <UploadForm recordId={d.record.id} isMember={Boolean(d.membership)} />
    </Panel>
  )
}

export function RecordIssues({ d, t, locale }: Ctx) {
  const ctx = actorCtx(d)
  return (
    <Panel title={t('record.issues')} actions={<IssueDialog recordId={d.record.id} />}>
      {d.issues.length === 0 ? (
        <EmptyState compact icon={<MessageSquareWarning />} title={t('record.noIssues')} />
      ) : (
        <ul className="flex flex-col gap-3">
          {d.issues.map((i) => (
            <li key={i.id} className="flex flex-col gap-2 rounded-xl border p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium break-words">{i.title}</span>
                <IssueStatusMenu recordId={d.record.id} issueId={i.id} status={i.status} />
              </div>
              {i.description && <p className="line-clamp-4 text-sm whitespace-pre-wrap text-muted-foreground">{i.description}</p>}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <IssueStatusBadge status={i.status} t={t} />
                <span>{t('record.reportedBy', { name: actorName(i.reporter_id, ctx, t) })}</span>
                <span aria-hidden>·</span>
                <span>{formatRelative(locale, i.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

export function RecordReminders({ d, t, locale }: Ctx) {
  const scheduled = d.reminders.filter((r) => r.status === 'scheduled')
  return (
    <Panel title={t('record.reminders')} bodyClassName="flex flex-col gap-4">
      {scheduled.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('record.noReminders')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {scheduled.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
              <span className="flex min-w-0 items-center gap-2.5">
                <Bell className="size-4 shrink-0 text-brand-orange" aria-hidden />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(locale, r.remind_at)}</span>
                </span>
              </span>
              <CompleteReminderButton reminderId={r.id} />
            </li>
          ))}
        </ul>
      )}
      <ReminderForm recordId={d.record.id} defaultTitle={d.record.title} />
    </Panel>
  )
}

export function RecordNotes({ d, t, locale }: Ctx) {
  const ctx = actorCtx(d)
  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          <StickyNote className="size-4 text-brand-violet" aria-hidden />
          {t('record.internalNotes')}
        </span>
      }
      description={t('record.internalHint')}
      className="border-brand-violet/25"
      bodyClassName="flex flex-col gap-4"
    >
      {d.notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('record.noNotes')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {d.notes.map((n) => (
            <li key={n.id} className="flex flex-col gap-1 rounded-lg bg-surface/60 p-3">
              <Prose>{n.body}</Prose>
              <span className="text-xs text-muted-foreground">
                {actorName(n.author_id, ctx, t)} · {formatRelative(locale, n.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <NoteForm recordId={d.record.id} />
    </Panel>
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <span aria-hidden className="rtl:rotate-180">←</span>
      {label}
    </Link>
  )
}
