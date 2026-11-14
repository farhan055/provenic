import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { BusinessProfileForm } from '@/components/app/business-forms'
import { getAuditLog, getBusiness } from '@/lib/data'
import { canManage, requireMembership } from '@/lib/auth'
import { formatDateTime } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('business.settingsTitle') }
}

export default async function BusinessSettingsPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const membership = await requireMembership(businessId)
  const [{ t, locale }, business, audit] = await Promise.all([
    getI18n(),
    getBusiness(businessId),
    canManage(membership.role) ? getAuditLog(businessId) : Promise.resolve({ events: [], names: {} as Record<string, string> }),
  ])

  if (!business) notFound()
  return <>
    <PageHeader eyebrow={business.name} title={t('business.settingsTitle')} description={t('business.settingsSubtitle')} />
    <Panel title={t('business.profile')}><BusinessProfileForm businessId={businessId} values={business} canEdit={canManage(membership.role)} /></Panel>
    {canManage(membership.role) && <Panel title={t('business.auditTitle')} description={t('business.auditBody')}>
      {audit.events.length === 0 ? <EmptyState icon={<ClipboardList />} title={t('business.auditEmpty')} compact /> : <ol className="divide-y">{audit.events.map((event) => <li key={event.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"><span className="text-sm"><span className="font-medium">{audit.names[event.actor_id ?? ''] ?? t('record.unknownActor')}</span><span className="text-muted-foreground"> · {event.action.replaceAll('.', ' ')}</span></span><time dateTime={event.created_at} className="shrink-0 text-xs text-muted-foreground">{formatDateTime(locale, event.created_at)}</time></li>)}</ol>}
    </Panel>}
  </>
}
