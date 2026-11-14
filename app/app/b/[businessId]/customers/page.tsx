import type { Metadata } from 'next'
import { UsersRound } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { getBusinessCustomers } from '@/lib/data'
import { requireMembership } from '@/lib/auth'
import { formatNumber } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('business.customersTitle') }
}

export default async function BusinessCustomersPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const membership = await requireMembership(businessId)
  const [{ t, locale }, customers] = await Promise.all([getI18n(), getBusinessCustomers(businessId)])

  return <>
    <PageHeader eyebrow={membership.business.name} title={t('business.customersTitle')} description={t('business.customersSubtitle')} />
    <Panel title={t('business.customersTitle')}>
      {customers.length === 0 ? <EmptyState icon={<UsersRound />} title={t('business.customersEmpty')} /> : <div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colName')}</th><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colEmail')}</th><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colRecords')}</th><th scope="col" className="py-2.5 text-start font-medium">{t('business.colJoined')}</th></tr></thead><tbody className="divide-y">{customers.map((customer) => <tr key={customer.email}><td className="py-3 pe-4 font-medium" dir="auto">{customer.name || t('common.notSet')}</td><td className="py-3 pe-4 text-muted-foreground" dir="ltr">{customer.email}</td><td className="py-3 pe-4 tabular-nums">{formatNumber(locale, customer.records)}</td><td className="py-3 text-muted-foreground">{customer.connected ? t('business.joined') : t('business.invited')}</td></tr>)}</tbody></table></div>}
    </Panel>
  </>
}
