import Link from 'next/link'
import type { Metadata } from 'next'
import { Bell, BellOff, CheckCircle2 } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { CompleteReminderButton } from '@/components/records/record-controls'
import { getMyReminders } from '@/lib/data'
import { formatDate } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('reminders.title') }
}

export default async function RemindersPage() {
  const [{ t, locale }, reminders] = await Promise.all([getI18n(), getMyReminders()])
  const now = new Date().toISOString()
  const groups = [
    { key: 'overdue', label: t('reminders.overdue'), items: reminders.filter((r) => r.status === 'scheduled' && r.remind_at < now), tone: 'text-brand-rose bg-brand-rose/10' },
    { key: 'upcoming', label: t('reminders.upcoming'), items: reminders.filter((r) => r.status === 'scheduled' && r.remind_at >= now), tone: 'text-brand-orange bg-brand-orange/10' },
    { key: 'done', label: t('reminders.done'), items: reminders.filter((r) => r.status === 'done').reverse().slice(0, 20), tone: 'text-brand-emerald bg-brand-emerald/10' },
  ].filter((g) => g.items.length)

  return (
    <>
      <PageHeader title={t('reminders.title')} description={t('reminders.subtitle')} />
      {groups.length === 0 ? (
        <Panel>
          <EmptyState icon={<BellOff />} title={t('reminders.empty')} />
        </Panel>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <Panel key={g.key} title={`${g.label} · ${g.items.length}`} bodyClassName="p-2 md:p-2">
              <ul className="divide-y">
                {g.items.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 px-2 py-3 md:px-3">
                    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', g.tone)}>
                      {r.status === 'done' ? <CheckCircle2 className="size-4" aria-hidden /> : <Bell className="size-4" aria-hidden />}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className={cn('truncate text-sm font-medium', r.status === 'done' && 'text-muted-foreground line-through')}>{r.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {formatDate(locale, r.remind_at)}
                        {r.record && (
                          <>
                            {' · '}
                            <Link href={`/app/records/${r.record_id}`} className="hover:text-foreground hover:underline">
                              {r.record.title}
                            </Link>
                          </>
                        )}
                      </span>
                    </div>
                    {r.status === 'scheduled' && <CompleteReminderButton reminderId={r.id} />}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </>
  )
}
