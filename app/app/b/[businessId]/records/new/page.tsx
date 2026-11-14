import { PageHeader } from '@/components/shared/page'
import { RecordForm } from '@/components/records/record-form'
import { BackLink } from '@/components/records/record-sections'
import { createRecord } from '@/lib/actions/records'
import { requireMembership } from '@/lib/auth'
import { getI18n } from '@/lib/i18n/server'

export default async function NewRecordPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const [{ t }, membership] = await Promise.all([getI18n(), requireMembership(businessId)])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <BackLink href={`/app/b/${businessId}/records`} label={t('nav.businessRecords')} />
      <PageHeader eyebrow={membership.business.name} title={t('recordForm.newTitle')} description={t('recordForm.newSubtitle')} />
      <RecordForm mode="create" action={createRecord.bind(null, businessId)} />
    </div>
  )
}
