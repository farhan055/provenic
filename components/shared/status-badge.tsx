import { cn } from '@/lib/utils'
import { issueStatusTone, recordStatusTone, type IssueStatus, type RecordStatus, type Tone } from '@/lib/domain'
import type { Translator } from '@/lib/i18n/translate'

const toneClasses: Record<Tone, { pill: string; dot: string }> = {
  neutral: { pill: 'bg-muted text-muted-foreground ring-border', dot: 'bg-muted-foreground/60' },
  amber: { pill: 'bg-amber-500/10 text-amber-800 ring-amber-500/25 dark:text-amber-300', dot: 'bg-brand-amber' },
  cyan: { pill: 'bg-cyan-500/10 text-cyan-800 ring-cyan-500/25 dark:text-cyan-300', dot: 'bg-brand-cyan' },
  emerald: { pill: 'bg-emerald-500/10 text-emerald-800 ring-emerald-500/25 dark:text-emerald-300', dot: 'bg-brand-emerald' },
  rose: { pill: 'bg-rose-500/10 text-rose-800 ring-rose-500/25 dark:text-rose-300', dot: 'bg-brand-rose' },
  violet: { pill: 'bg-violet-500/10 text-violet-800 ring-violet-500/25 dark:text-violet-300', dot: 'bg-brand-violet' },
  orange: { pill: 'bg-orange-500/10 text-orange-800 ring-orange-500/25 dark:text-orange-300', dot: 'bg-brand-orange' },
}

export function TonePill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  const c = toneClasses[tone]
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        c.pill,
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', c.dot)} />
      {children}
    </span>
  )
}

export function RecordStatusBadge({ status, t, className }: { status: RecordStatus; t: Translator; className?: string }) {
  return (
    <TonePill tone={recordStatusTone[status]} className={className}>
      {t(`status.${status}`)}
    </TonePill>
  )
}

export function IssueStatusBadge({ status, t }: { status: IssueStatus; t: Translator }) {
  return <TonePill tone={issueStatusTone[status]}>{t(`issueStatus.${status}`)}</TonePill>
}
