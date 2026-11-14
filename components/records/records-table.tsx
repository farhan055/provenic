import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { RecordStatusBadge } from '@/components/shared/status-badge'
import { formatDate, formatMoney, formatRelative } from '@/lib/i18n/format'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/translate'
import type { RecordListItem } from '@/lib/types'

type Props = { records: RecordListItem[]; t: Translator; locale: Locale; perspective: 'customer' | 'business' }

export function RecordsTable({ records, t, locale, perspective }: Props) {
  const partyLabel = perspective === 'customer' ? t('records.colBusiness') : t('records.colCustomer')
  const party = (r: RecordListItem) =>
    perspective === 'customer' ? (r.business?.name ?? '—') : (r.customer_name ?? r.customer_email ?? '—')

  return (
    <>
      {/* Card list for small screens */}
      <ul className="flex flex-col divide-y md:hidden">
        {records.map((r) => (
          <li key={r.id}>
            <Link href={`/app/records/${r.id}`} className="flex items-center gap-3 py-3.5 active:bg-muted/50">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium break-words">{r.title}</span>
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {party(r)} · {t(`recordType.${r.type}`)}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <RecordStatusBadge status={r.status} t={t} />
                  {r.due_date && <span className="text-xs text-muted-foreground">{formatDate(locale, r.due_date)}</span>}
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {/* Table for medium screens and up */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-xs text-muted-foreground">
              <th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('records.colRecord')}</th>
              <th scope="col" className="py-2.5 pe-4 text-start font-medium">{partyLabel}</th>
              <th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('records.colStatus')}</th>
              <th scope="col" className="hidden py-2.5 pe-4 text-start font-medium lg:table-cell">{t('records.colAmount')}</th>
              <th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('records.colDue')}</th>
              <th scope="col" className="hidden py-2.5 text-end font-medium xl:table-cell">{t('records.colUpdated')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((r) => (
              <tr key={r.id} className="group relative transition-colors hover:bg-muted/40">
                <td className="max-w-[22rem] py-3 pe-4">
                  <Link href={`/app/records/${r.id}`} className="flex flex-col gap-0.5 after:absolute after:inset-0">
                    <span className="truncate font-medium group-hover:underline group-hover:underline-offset-4">{r.title}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono" dir="ltr">{r.reference}</span>
                      <span aria-hidden>·</span>
                      {t(`recordType.${r.type}`)}
                    </span>
                  </Link>
                </td>
                <td className="max-w-[14rem] truncate py-3 pe-4 text-muted-foreground">{party(r)}</td>
                <td className="py-3 pe-4">
                  <RecordStatusBadge status={r.status} t={t} />
                </td>
                <td className="hidden py-3 pe-4 tabular-nums lg:table-cell">{formatMoney(locale, r.amount, r.currency) ?? '—'}</td>
                <td className="py-3 pe-4 whitespace-nowrap text-muted-foreground">{formatDate(locale, r.due_date) ?? '—'}</td>
                <td className="hidden py-3 text-end whitespace-nowrap text-muted-foreground xl:table-cell">{formatRelative(locale, r.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
