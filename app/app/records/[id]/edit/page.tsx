import { PageHeader } from '@/components/shared/page'
import { RecordForm } from '@/components/records/record-form'
import { RecordNotFound } from '@/components/records/record-not-found'
import { BackLink } from '@/components/records/record-sections'
import { updateRecord } from '@/lib/actions/records'
import { getRecordDetail } from '@/lib/data'
import { getI18n } from '@/lib/i18n/server'

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ t }, d] = await Promise.all([getI18n(), getRecordDetail(id)])
  // Only business members may edit; customers get the same not-found response.
  if (!d || !d.membership) return <RecordNotFound t={t} />

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <BackLink href={`/app/records/${id}`} label={d.record.title} />
      <PageHeader eyebrow={d.record.reference} title={t('recordForm.editTitle')} description={t('recordForm.editSubtitle')} />
      <RecordForm mode="edit" record={d.record} action={updateRecord.bind(null, id)} />
    </div>
  )
}
