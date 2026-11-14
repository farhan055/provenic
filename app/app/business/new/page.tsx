import type { Metadata } from 'next'
import { Building2 } from 'lucide-react'
import { PageHeader, Panel } from '@/components/shared/page'
import { CreateBusinessForm } from '@/components/app/business-forms'
import { requireUser } from '@/lib/auth'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('business.createTitle') }
}

export default async function CreateBusinessPage() {
  await requireUser()
  const { t } = await getI18n()
  return <div className="mx-auto w-full max-w-2xl">
    <PageHeader title={t('business.createTitle')} description={t('business.createSubtitle')} />
    <Panel title={<span className="flex items-center gap-2"><Building2 className="size-4 text-brand-violet" aria-hidden />{t('business.createTitle')}</span>}><CreateBusinessForm /></Panel>
  </div>
}
