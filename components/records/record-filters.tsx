import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { recordStatuses, recordTypes } from '@/lib/domain'
import type { RecordFilters as Filters } from '@/lib/data'
import type { Translator } from '@/lib/i18n/translate'

/** Plain GET form: works without client JavaScript and keeps filters in the URL. */
export function RecordFilters({ t, filters, basePath }: { t: Translator; filters: Filters; basePath: string }) {
  const active = Boolean(filters.q || filters.status || filters.type)
  return (
    <form method="get" action={basePath} role="search" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="relative flex-1 sm:min-w-64">
        <span className="sr-only">{t('common.search')}</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input name="q" defaultValue={filters.q} placeholder={t('records.searchPlaceholder')} className="h-10 ps-9" />
      </label>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <label>
          <span className="sr-only">{t('records.filterStatus')}</span>
          <NativeSelect name="status" defaultValue={filters.status ?? ''} className="w-full sm:w-44 [&_select]:h-10">
            <NativeSelectOption value="">{t('records.allStatuses')}</NativeSelectOption>
            {recordStatuses.map((s) => (
              <NativeSelectOption key={s} value={s}>
                {t(`status.${s}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
        <label>
          <span className="sr-only">{t('records.filterType')}</span>
          <NativeSelect name="type" defaultValue={filters.type ?? ''} className="w-full sm:w-44 [&_select]:h-10">
            <NativeSelectOption value="">{t('records.allTypes')}</NativeSelectOption>
            {recordTypes.map((s) => (
              <NativeSelectOption key={s} value={s}>
                {t(`recordType.${s}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="secondary" className="h-10 flex-1 px-4 sm:flex-none">
          {t('records.apply')}
        </Button>
        {active && (
          <Button render={<Link href={basePath} />} nativeButton={false} variant="ghost" className="h-10 px-3">
            {t('records.clear')}
          </Button>
        )}
      </div>
    </form>
  )
}
