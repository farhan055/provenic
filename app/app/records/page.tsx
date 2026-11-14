import type { Metadata } from 'next'
import { Inbox, SearchX } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { RecordFilters } from '@/components/records/record-filters'
import { RecordsTable } from '@/components/records/records-table'
import { getCustomerRecords, type RecordFilters as Filters } from '@/lib/data'
import { formatNumber } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('records.title') }
}

export default async function CustomerRecordsPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const filters = await searchParams
  const [{ t, locale }, records] = await Promise.all([getI18n(), getCustomerRecords(filters)])
  const filtered = Boolean(filters.q || filters.status || filters.type)

  return (
    <>
      <PageHeader title={t('records.title')} description={t('records.subtitle')} />
      <Panel
        title={<RecordFilters t={t} filters={filters} basePath="/app/records" />}
        className="[&>div:first-child]:block"
        bodyClassName="py-1 md:py-1"
      >
        {records.length === 0 ? (
          <EmptyState
            icon={filtered ? <SearchX /> : <Inbox />}
            title={filtered ? t('records.emptyFiltered') : t('dashboard.emptyTitle')}
            body={filtered ? undefined : t('dashboard.emptyBody')}
          />
        ) : (
          <>
            <RecordsTable records={records} t={t} locale={locale} perspective="customer" />
            <p className="border-t py-3 text-xs text-muted-foreground">{t('records.count', { count: formatNumber(locale, records.length) })}</p>
          </>
        )}
      </Panel>
    </>
  )
}
