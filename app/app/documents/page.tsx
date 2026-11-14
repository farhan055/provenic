import Link from 'next/link'
import type { Metadata } from 'next'
import { Download, FileText, FolderClosed, ImageIcon, Lock } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { getDocuments } from '@/lib/data'
import { formatBytes, formatDate } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('documents.title') }
}

export default async function DocumentsPage() {
  const [{ t, locale }, docs] = await Promise.all([getI18n(), getDocuments()])

  return (
    <>
      <PageHeader title={t('documents.title')} description={t('documents.subtitle')} />
      <Panel bodyClassName="p-2 md:p-2">
        {docs.length === 0 ? (
          <EmptyState icon={<FolderClosed />} title={t('documents.empty')} />
        ) : (
          <ul className="divide-y">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-2 py-3 md:px-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground">
                  {d.mime_type.startsWith('image/') ? <ImageIcon className="size-4" aria-hidden /> : <FileText className="size-4" aria-hidden />}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium" dir="auto">{d.file_name}</span>
                    {d.visibility === 'internal' && <Lock className="size-3.5 shrink-0 text-brand-violet" aria-label={t('record.visibilityInternal')} />}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {d.record ? (
                      <Link href={`/app/records/${d.record_id}`} className="hover:text-foreground hover:underline">
                        {d.record.title}
                      </Link>
                    ) : null}
                    {' · '}
                    {formatBytes(locale, d.size_bytes)} · {formatDate(locale, d.created_at)}
                  </span>
                </div>
                <a
                  href={`/api/attachments/${d.id}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`${t('common.download')} ${d.file_name}`}
                >
                  <Download className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}
