import Link from 'next/link'
import type { Metadata } from 'next'
import { Inbox, Plus, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { RecordFilters } from '@/components/records/record-filters'
import { RecordsTable } from '@/components/records/records-table'
import { getBusinessRecords, type RecordFilters as Filters } from '@/lib/data'
import { requireMembership } from '@/lib/auth'
import { formatNumber } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('records.businessTitle') }
}

export default async function BusinessRecordsPage({ params, searchParams }: { params: Promise<{ businessId: string }>; searchParams: Promise<Filters> }) {
  const [{ businessId }, filters] = await Promise.all([params, searchParams])
  const membership = await requireMembership(businessId)
  const [{ t, locale }, records] = await Promise.all([getI18n(), getBusinessRecords(businessId, filters)])
  const filtered = Boolean(filters.q || filters.status || filters.type)

  return <>
    <PageHeader eyebrow={membership.business.name} title={t('records.businessTitle')} description={t('records.businessSubtitle')} actions={<Button render={<Link href={`/app/b/${businessId}/records/new`} />} nativeButton={false} className="h-9"><Plus aria-hidden />{t('nav.newRecord')}</Button>} />
    <Panel title={<RecordFilters t={t} filters={filters} basePath={`/app/b/${businessId}/records`} />} className="[&>div:first-child]:block" bodyClassName="py-1 md:py-1">
      {records.length === 0 ? <EmptyState icon={filtered ? <SearchX /> : <Inbox />} title={filtered ? t('records.emptyFiltered') : t('business.emptyTitle')} body={filtered ? undefined : t('business.emptyBody')} action={!filtered ? <Button render={<Link href={`/app/b/${businessId}/records/new`} />} nativeButton={false} variant="secondary" size="sm">{t('nav.newRecord')}</Button> : undefined} /> : <><RecordsTable records={records} t={t} locale={locale} perspective="business" /><p className="border-t py-3 text-xs text-muted-foreground">{t('records.count', { count: formatNumber(locale, records.length) })}</p></>}
    </Panel>
  </>
}
