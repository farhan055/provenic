import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertTriangle, ArrowRight, CircleCheck, CircleDot, Clock3, FileStack, MessageSquareWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, PageHeader, Panel, StatCard } from '@/components/shared/page'
import { RecordsTable } from '@/components/records/records-table'
import { RecordStatusBadge } from '@/components/shared/status-badge'
import { getBusinessDashboard } from '@/lib/data'
import { requireMembership } from '@/lib/auth'
import { formatDate, formatNumber } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('nav.businessOverview') }
}

export default async function BusinessOverviewPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const membership = await requireMembership(businessId)
  const [{ t, locale }, data] = await Promise.all([getI18n(), getBusinessDashboard(businessId)])

  return (
    <>
      <PageHeader
        eyebrow={membership.business.name}
        title={t('nav.businessOverview')}
        description={t('business.overviewSubtitle')}
        actions={<Button render={<Link href={`/app/b/${businessId}/records/new`} />} nativeButton={false} className="h-9"><FileStack aria-hidden />{t('nav.newRecord')}</Button>}
      />
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-5">
        <StatCard label={t('business.statActive')} value={formatNumber(locale, data.stats.active)} icon={<CircleDot />} accent="cyan" />
        <StatCard label={t('business.statPending')} value={formatNumber(locale, data.stats.pending)} icon={<Clock3 />} accent="amber" />
        <StatCard label={t('business.statOverdue')} value={formatNumber(locale, data.stats.overdue)} icon={<AlertTriangle />} accent="rose" />
        <StatCard label={t('business.statCompleted')} value={formatNumber(locale, data.stats.completed)} icon={<CircleCheck />} accent="emerald" />
        <StatCard label={t('business.statIssues')} value={formatNumber(locale, data.stats.openIssues)} icon={<MessageSquareWarning />} accent="violet" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel title={t('business.recentActivity')} actions={data.recent.length > 0 ? <Link href={`/app/b/${businessId}/records`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">{t('common.viewAll')}<ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden /></Link> : undefined} bodyClassName="py-1 md:py-1">
          {data.recent.length ? <RecordsTable records={data.recent} t={t} locale={locale} perspective="business" /> : <EmptyState title={t('business.emptyTitle')} body={t('business.emptyBody')} action={<Button render={<Link href={`/app/b/${businessId}/records/new`} />} nativeButton={false} variant="secondary" size="sm">{t('nav.newRecord')}</Button>} />}
        </Panel>
        <Panel title={t('business.needsAttention')}>
          {data.overdue.length ? <ul className="flex flex-col gap-1">{data.overdue.map((record) => <li key={record.id}><Link href={`/app/records/${record.id}`} className="flex flex-col gap-1 rounded-lg p-2 hover:bg-muted/60"><span className="truncate text-sm font-medium">{record.title}</span><span className="flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{formatDate(locale, record.due_date)}</span><RecordStatusBadge status={record.status} t={t} /></span></Link></li>)}</ul> : <p className="text-sm text-muted-foreground">{t('business.noAttention')}</p>}
        </Panel>
      </div>
    </>
  )
}
