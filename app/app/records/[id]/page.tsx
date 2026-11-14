import Link from 'next/link'
import type { Metadata } from 'next'
import QRCode from 'qrcode'
import { Building2, Eye, PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/shared/page'
import { RecordStatusBadge } from '@/components/shared/status-badge'
import { SharePanel, StatusMenu, type ShareLinkView } from '@/components/records/record-controls'
import {
  BackLink,
  RecordDocuments,
  RecordIssues,
  RecordNotes,
  RecordOverview,
  RecordReminders,
  RecordTimeline,
} from '@/components/records/record-sections'
import { RecordNotFound } from '@/components/records/record-not-found'
import { getRecordDetail } from '@/lib/data'
import { getI18n } from '@/lib/i18n/server'
import { getOrigin } from '@/lib/origin'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const d = await getRecordDetail(id)
  return { title: d?.record.title ?? 'Record' }
}

export default async function RecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ t, locale }, d] = await Promise.all([getI18n(), getRecordDetail(id)])
  if (!d) return <RecordNotFound t={t} />

  const r = d.record
  const isMember = Boolean(d.membership)
  const origin = isMember ? await getOrigin() : ''
  const links: ShareLinkView[] = await Promise.all(
    d.links.map(async (l) => {
      const url = `${origin}/r/${l.token}`
      const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#ffffff' } })
      return { id: l.id, url, qrSvg, expires_at: l.expires_at }
    }),
  )
  const ctx = { d, t, locale }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href={isMember ? `/app/b/${r.business_id}/records` : '/app/records'} label={isMember ? t('nav.businessRecords') : t('nav.records')} />

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Building2 className="size-3.5" aria-hidden />
              {r.business.name}
            </span>
            <span aria-hidden>·</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]" dir="ltr">
              {r.reference}
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight break-words text-balance-safe md:text-3xl" dir="auto">
            {r.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <RecordStatusBadge status={r.status} t={t} />
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="size-3.5" aria-hidden />
              {isMember ? t('record.memberView') : t('record.customerView')}
            </span>
          </div>
        </div>
        {isMember && (
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={`/app/records/${r.id}/edit`} />} nativeButton={false} variant="outline" className="h-9">
              <PencilLine aria-hidden />
              {t('record.editDetails')}
            </Button>
            <StatusMenu recordId={r.id} status={r.status} />
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <RecordOverview {...ctx} />
          <RecordTimeline {...ctx} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          {isMember && (
            <Panel title={t('record.share')}>
              <SharePanel recordId={r.id} links={links} isDraft={r.status === 'draft'} />
            </Panel>
          )}
          <RecordIssues {...ctx} />
          <RecordDocuments {...ctx} />
          <RecordReminders {...ctx} />
          {isMember && <RecordNotes {...ctx} />}
        </div>
      </div>
    </div>
  )
}
