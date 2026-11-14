import Link from 'next/link'
import { ArrowRight, Bell, Building2, CalendarClock, CircleDot, Clock, FileStack, Inbox, MessageSquareWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, PageHeader, Panel, StatCard } from '@/components/shared/page'
import { RecordStatusBadge } from '@/components/shared/status-badge'
import { RecordsTable } from '@/components/records/records-table'
import { getMemberships, getProfile } from '@/lib/auth'
import { getCustomerDashboard } from '@/lib/data'
import { formatDate, formatNumber } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export default async function CustomerOverviewPage() {
  const [{ t, locale }, profile, data, memberships] = await Promise.all([getI18n(), getProfile(), getCustomerDashboard(), getMemberships()])
  const firstName = profile.full_name?.split(' ')[0]

  return (
    <>
      <PageHeader
        title={firstName ? t('dashboard.greeting', { name: firstName }) : t('dashboard.greetingAnon')}
        description={t('dashboard.subtitle')}
        actions={
          <Button render={<Link href="/app/records" />} nativeButton={false} variant="outline" className="h-9">
            <FileStack aria-hidden />
            {t('nav.records')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label={t('dashboard.statActive')} value={formatNumber(locale, data.stats.active)} icon={<CircleDot />} accent="cyan" />
        <StatCard label={t('dashboard.statPending')} value={formatNumber(locale, data.stats.pending)} icon={<Clock />} accent="amber" />
        <StatCard label={t('dashboard.statDueSoon')} value={formatNumber(locale, data.stats.dueSoon)} icon={<CalendarClock />} accent="violet" />
        <StatCard label={t('dashboard.statIssues')} value={formatNumber(locale, data.stats.openIssues)} icon={<MessageSquareWarning />} accent="rose" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel
          title={t('dashboard.recent')}
          actions={
            data.records.length > 0 && (
              <Link href="/app/records" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                {t('common.viewAll')}
                <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
              </Link>
            )
          }
          bodyClassName="py-1 md:py-1"
        >
          {data.records.length === 0 ? (
            <EmptyState icon={<Inbox />} title={t('dashboard.emptyTitle')} body={t('dashboard.emptyBody')} />
          ) : (
            <RecordsTable records={data.records} t={t} locale={locale} perspective="customer" />
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title={t('dashboard.upcoming')}>
            {data.upcomingDue.length === 0 && data.reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('dashboard.emptyUpcoming')}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {data.upcomingDue.map((r) => (
                  <li key={r.id}>
                    <Link href={`/app/records/${r.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60">
                      <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                        <CalendarClock className="size-4" aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{r.title}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(locale, r.due_date)}</span>
                      </span>
                      <RecordStatusBadge status={r.status} t={t} className="hidden sm:inline-flex" />
                    </Link>
                  </li>
                ))}
                {data.reminders.map((r) => (
                  <li key={r.id}>
                    <Link href={`/app/records/${r.record_id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                        <Bell className="size-4" aria-hidden />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{r.title}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(locale, r.remind_at)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {memberships.length === 0 && (
            <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-elevated">
              <div aria-hidden className="brand-rainbow absolute inset-x-0 top-0 h-0.5" />
              <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Building2 className="size-4" aria-hidden />
              </span>
              <h2 className="font-semibold">{t('dashboard.businessCtaTitle')}</h2>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{t('dashboard.businessCtaBody')}</p>
              <Button render={<Link href="/app/business/new" />} nativeButton={false} variant="secondary" className="mt-4 h-9">
                {t('dashboard.businessCtaButton')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
