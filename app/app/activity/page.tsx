import Link from 'next/link'
import type { Metadata } from 'next'
import { Activity, Lock } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { getProfile } from '@/lib/auth'
import { getActivity } from '@/lib/data'
import { describeEvent, eventColor } from '@/lib/events'
import { formatRelative } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('activity.title') }
}

export default async function ActivityPage() {
  const [{ t, locale }, profile, { events, names }] = await Promise.all([getI18n(), getProfile(), getActivity()])

  const actor = (e: (typeof events)[number]) => {
    if (e.actor_id === profile.id) return t('common.you')
    if (e.actor_id && names[e.actor_id]) return names[e.actor_id]
    if (e.actor_id && e.actor_id === e.record?.customer_id) return e.record?.customer_name || t('record.customerLabel')
    return t('record.unknownActor')
  }

  return (
    <>
      <PageHeader title={t('activity.title')} description={t('activity.subtitle')} />
      <Panel>
        {events.length === 0 ? (
          <EmptyState icon={<Activity />} title={t('activity.empty')} />
        ) : (
          <ol className="flex flex-col">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3 border-b py-3.5 last:border-0">
                <span aria-hidden className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', eventColor[e.event_type])} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm">
                    <span className="font-medium">{actor(e)}</span> <span className="text-muted-foreground">{describeEvent(e, t)}</span>
                    {e.visibility === 'internal' && <Lock className="ms-1.5 inline size-3.5 text-brand-violet" aria-label={t('record.visibilityInternal')} />}
                  </p>
                  {e.body && <p className="line-clamp-2 text-sm text-muted-foreground" dir="auto">{e.body}</p>}
                  <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    {e.record && (
                      <Link href={`/app/records/${e.record_id}`} className="font-medium text-foreground/80 hover:underline">
                        {e.record.title}
                      </Link>
                    )}
                    <time dateTime={e.created_at}>{formatRelative(locale, e.created_at)}</time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </>
  )
}
