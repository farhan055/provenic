import { Bell, CalendarClock, Check, FileText, ShieldCheck, Wrench } from 'lucide-react'
import { TonePill } from '@/components/shared/status-badge'
import { formatMoney } from '@/lib/i18n/format'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/translate'

export function RecordPreview({ t, locale }: { t: Translator; locale: Locale }) {
  const events = [
    { label: t('landing.preview.event3'), color: 'bg-brand-cyan', active: true },
    { label: t('landing.preview.event2'), color: 'bg-brand-violet' },
    { label: t('landing.preview.event1'), color: 'bg-brand-emerald' },
  ]

  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label={t('common.illustrative')}>
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-violet/10 via-transparent to-brand-cyan/10 blur-2xl dark:from-brand-violet/20 dark:to-brand-cyan/15" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
        <div className="flex items-center justify-between gap-3 border-b bg-surface px-4 py-3 md:px-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-4 text-brand-emerald" aria-hidden />
            {t('landing.preview.verified')}
          </div>
          <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">
            PRV-8F2C41A7D0
          </span>
        </div>

        <div className="flex flex-col gap-5 p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
                <Wrench className="size-5" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {t('landing.preview.recordType')} · {t('landing.preview.business')}
                </span>
                <span className="font-display font-semibold text-balance-safe">{t('landing.preview.title')}</span>
              </div>
            </div>
            <TonePill tone="cyan">{t('landing.preview.status')}</TonePill>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-surface/60 p-3">
              <div className="text-xs text-muted-foreground">{t('landing.preview.amount')}</div>
              <div className="font-display mt-1 font-semibold tabular-nums">{formatMoney(locale, 180, 'USD')}</div>
            </div>
            <div className="rounded-xl border bg-surface/60 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden />
                {t('landing.preview.due')}
              </div>
              <div className="font-display mt-1 font-semibold">{t('landing.preview.dueValue')}</div>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <FileText className="size-3.5" aria-hidden />
              {t('landing.preview.terms')}
            </div>
            <p className="mt-1.5 text-sm text-pretty">{t('landing.preview.termsValue')}</p>
          </div>

          <div>
            <div className="mb-3 text-xs font-medium text-muted-foreground">{t('landing.preview.timeline')}</div>
            <ol className="relative flex flex-col gap-3 ps-5 before:absolute before:inset-y-1.5 before:start-[5px] before:w-px before:bg-border">
              {events.map((e) => (
                <li key={e.label} className="relative text-sm">
                  <span
                    aria-hidden
                    className={`absolute -start-5 top-1.5 size-[11px] rounded-full ring-4 ring-card ${e.color}`}
                  />
                  <span className={e.active ? 'font-medium' : 'text-muted-foreground'}>{e.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-surface px-4 py-3 text-xs md:px-5">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Bell className="size-3.5 text-brand-orange" aria-hidden />
            {t('landing.preview.reminder')}
          </span>
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-emerald text-white">
            <Check className="size-3" aria-hidden />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{t('common.illustrative')}</figcaption>
    </figure>
  )
}
