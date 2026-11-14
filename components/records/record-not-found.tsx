import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/page'
import type { Translator } from '@/lib/i18n/translate'

export function RecordNotFound({ t }: { t: Translator }) {
  return (
    <div className="rounded-2xl border bg-card shadow-elevated">
      <EmptyState
        icon={<FileQuestion />}
        title={t('record.notFoundTitle')}
        body={t('record.notFoundBody')}
        action={
          <Button render={<Link href="/app" />} nativeButton={false} variant="outline">
            {t('errors.goHome')}
          </Button>
        }
      />
    </div>
  )
}
