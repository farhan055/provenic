import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarCheck,
  FileLock2,
  FolderOpen,
  Globe2,
  History,
  Layers,
  Lock,
  MessageSquareWarning,
  QrCode,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Download,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhotoCarousel } from '@/components/shared/photo-carousel'
import type { Locale } from '@/lib/i18n/config'
import type { Translator } from '@/lib/i18n/translate'
import { cn } from '@/lib/utils'

type P = { t: Translator }

const container = 'mx-auto w-full max-w-7xl px-4 md:px-6 2xl:max-w-[1440px]'

function Eyebrow({ children, color = 'bg-brand-violet' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      <span aria-hidden className={cn('size-1.5 rounded-full', color)} />
      {children}
    </span>
  )
}

function SectionHeading({ eyebrow, title, subtitle, color }: { eyebrow: string; title: string; subtitle?: string; color?: string }) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Eyebrow color={color}>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance-safe md:text-4xl">{title}</h2>
      {subtitle && <p className="text-base text-pretty text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  )
}

export function Hero({ t, locale, signedIn }: P & { locale: Locale; signedIn: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--color-accent),transparent_65%)] opacity-70" />
      <div className={cn(container, 'grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28')}>
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-elevated">
            <span aria-hidden className="brand-rainbow size-2 rounded-full" />
            {t('landing.hero.eyebrow')}
          </span>
          <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance-safe sm:text-5xl lg:text-[3.5rem]">
            {t('landing.hero.title')}
          </h1>
          <p className="max-w-xl text-base text-pretty text-muted-foreground md:text-lg">{t('landing.hero.subtitle')}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href={signedIn ? '/app' : '/auth/sign-up'} />} nativeButton={false} size="lg" className="h-12 px-5 text-base">
              {signedIn ? t('common.openApp') : t('landing.hero.primary')}
              <ArrowRight className="rtl:rotate-180" aria-hidden />
            </Button>
            <Button render={<a href="#how" />} nativeButton={false} size="lg" variant="outline" className="h-12 px-5 text-base">
              {t('landing.hero.secondary')}
            </Button>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-brand-emerald" aria-hidden />
            {t('landing.hero.note')}
          </p>
        </div>
        <PhotoCarousel
          priority
          className="aspect-[1.05/1] min-h-[360px] sm:min-h-[430px] lg:min-h-[480px]"
          showPauseControl={false}
          labels={{
            description: t('landing.hero.carouselDescription'),
            pause: t('landing.hero.pauseCarousel'),
            resume: t('landing.hero.resumeCarousel'),
            slide: t('landing.hero.carouselSlide'),
          }}
          slides={[
            { src: '/brand/landing-team.png', alt: t('landing.hero.laptopAlt') },
            { src: '/brand/landing-mobile.png', alt: t('landing.hero.mobileAlt') },
            { src: '/brand/landing-office.png', alt: t('landing.hero.businessAlt') },
          ]}
        >
          <div className="flex h-full items-end p-4 sm:p-6">
            <div className="max-w-[22rem] rounded-2xl border border-white/50 bg-background/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="size-4 text-brand-emerald" aria-hidden />
                {t('landing.preview.verified')}
              </div>
              <p className="mt-2 font-display text-sm font-semibold sm:text-base">{t('landing.preview.title')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{t('landing.preview.business')}</span>
                <span aria-hidden className="size-1 rounded-full bg-brand-cyan" />
                <span>{t('landing.preview.status')}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{t('common.illustrative')}</p>
            </div>
          </div>
        </PhotoCarousel>
      </div>
    </section>
  )
}

export function Problem({ t }: P) {
  const items = [t('landing.problem.item1'), t('landing.problem.item2'), t('landing.problem.item3'), t('landing.problem.item4')]
  return (
    <section className="border-y bg-surface">
      <div className={cn(container, 'grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16')}>
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance-safe md:text-4xl">{t('landing.problem.title')}</h2>
          <p className="text-base text-pretty text-muted-foreground md:text-lg">{t('landing.problem.body')}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <li key={item} className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm">
              <span
                aria-hidden
                className={cn('mt-1.5 size-2 shrink-0 rounded-full', ['bg-brand-rose', 'bg-brand-orange', 'bg-brand-amber', 'bg-brand-magenta'][i])}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HowItWorks({ t }: P) {
  const steps = [
    { title: t('landing.how.step1Title'), body: t('landing.how.step1Body'), icon: FileLock2, color: 'text-brand-violet bg-brand-violet/10' },
    { title: t('landing.how.step2Title'), body: t('landing.how.step2Body'), icon: QrCode, color: 'text-brand-magenta bg-brand-magenta/10' },
    { title: t('landing.how.step3Title'), body: t('landing.how.step3Body'), icon: History, color: 'text-brand-cyan bg-brand-cyan/10' },
    { title: t('landing.how.step4Title'), body: t('landing.how.step4Body'), icon: CalendarCheck, color: 'text-brand-emerald bg-brand-emerald/10' },
  ]
  return (
    <section id="how" className="scroll-mt-20">
      <div className={cn(container, 'flex flex-col gap-12 py-16 md:py-24')}>
        <SectionHeading eyebrow={t('landing.how.eyebrow')} title={t('landing.how.title')} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-elevated transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className={cn('flex size-10 items-center justify-center rounded-xl', s.color)}>
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold text-muted-foreground tabular-nums">0{i + 1}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-pretty text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function AudienceSection({
  id,
  eyebrow,
  title,
  items,
  color,
  reverse,
  visual,
}: {
  id: string
  eyebrow: string
  title: string
  items: { title: string; body: string; icon: React.ElementType }[]
  color: string
  reverse?: boolean
  visual: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className={cn(container, 'grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16')}>
        <div className={cn('flex flex-col gap-8', reverse && 'lg:order-2')}>
          <SectionHeading eyebrow={eyebrow} title={title} color={color} />
          <ul className="grid gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.title} className="flex flex-col gap-2">
                <item.icon className="size-5 text-foreground" aria-hidden />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-pretty text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(reverse && 'lg:order-1')}>{visual}</div>
      </div>
    </section>
  )
}

function CustomerVisual({ t }: P) {
  const rows = [
    { biz: t('landing.preview.business'), type: t('recordType.repair'), status: t('status.active'), dot: 'bg-brand-cyan' },
    { biz: 'Harbor Furniture Co.', type: t('recordType.delivery'), status: t('status.pending'), dot: 'bg-brand-amber' },
    { biz: 'Lumen Dental Studio', type: t('recordType.booking'), status: t('status.completed'), dot: 'bg-brand-emerald' },
    { biz: 'Atlas Appliances', type: t('recordType.warranty'), status: t('status.active'), dot: 'bg-brand-cyan' },
  ]
  return (
    <figure className="rounded-2xl border bg-card p-2 shadow-elevated" aria-label={t('common.illustrative')}>
      <ul className="divide-y">
        {rows.map((r) => (
          <li key={r.biz} className="flex items-center justify-between gap-3 px-3 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold">
                {r.biz.slice(0, 1)}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{r.biz}</span>
                <span className="text-xs text-muted-foreground">{r.type}</span>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span aria-hidden className={cn('size-1.5 rounded-full', r.dot)} />
              {r.status}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="px-3 pt-2 pb-1 text-xs text-muted-foreground">{t('common.illustrative')}</figcaption>
    </figure>
  )
}

function BusinessVisual({ t }: P) {
  const stats = [
    { label: t('business.statActive'), value: '24', color: 'bg-brand-cyan' },
    { label: t('business.statPending'), value: '7', color: 'bg-brand-amber' },
    { label: t('business.statOverdue'), value: '2', color: 'bg-brand-rose' },
    { label: t('business.statCompleted'), value: '138', color: 'bg-brand-emerald' },
  ]
  return (
    <figure className="flex flex-col gap-3" aria-label={t('common.illustrative')}>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-elevated">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span aria-hidden className={cn('size-1.5 rounded-full', s.color)} />
              {s.label}
            </span>
            <span className="font-display text-2xl font-semibold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm shadow-elevated">
        <Lock className="size-4 shrink-0 text-brand-violet" aria-hidden />
        <span className="text-muted-foreground">{t('record.internalHint')}</span>
      </div>
      <figcaption className="text-xs text-muted-foreground">{t('common.illustrative')}</figcaption>
    </figure>
  )
}

export function Audiences({ t }: P) {
  return (
    <>
      <AudienceSection
        id="customers"
        eyebrow={t('landing.customers.eyebrow')}
        title={t('landing.customers.title')}
        color="bg-brand-cyan"
        visual={<CustomerVisual t={t} />}
        items={[
          { title: t('landing.customers.item1Title'), body: t('landing.customers.item1Body'), icon: FolderOpen },
          { title: t('landing.customers.item2Title'), body: t('landing.customers.item2Body'), icon: Bell },
          { title: t('landing.customers.item3Title'), body: t('landing.customers.item3Body'), icon: MessageSquareWarning },
          { title: t('landing.customers.item4Title'), body: t('landing.customers.item4Body'), icon: Download },
        ]}
      />
      <div className={container}>
        <div aria-hidden className="h-px bg-border" />
      </div>
      <AudienceSection
        id="businesses"
        reverse
        eyebrow={t('landing.businesses.eyebrow')}
        title={t('landing.businesses.title')}
        color="bg-brand-orange"
        visual={<BusinessVisual t={t} />}
        items={[
          { title: t('landing.businesses.item1Title'), body: t('landing.businesses.item1Body'), icon: Layers },
          { title: t('landing.businesses.item2Title'), body: t('landing.businesses.item2Body'), icon: Users },
          { title: t('landing.businesses.item3Title'), body: t('landing.businesses.item3Body'), icon: Building2 },
          { title: t('landing.businesses.item4Title'), body: t('landing.businesses.item4Body'), icon: History },
        ]}
      />
    </>
  )
}

export function Capabilities({ t }: P) {
  const items = [
    { label: t('landing.capabilities.c1'), icon: Layers, color: 'text-brand-violet' },
    { label: t('landing.capabilities.c2'), icon: QrCode, color: 'text-brand-magenta' },
    { label: t('landing.capabilities.c3'), icon: History, color: 'text-brand-rose' },
    { label: t('landing.capabilities.c4'), icon: FileLock2, color: 'text-brand-orange' },
    { label: t('landing.capabilities.c5'), icon: MessageSquareWarning, color: 'text-amber-500' },
    { label: t('landing.capabilities.c6'), icon: Bell, color: 'text-brand-emerald' },
    { label: t('landing.capabilities.c7'), icon: Users, color: 'text-brand-cyan' },
    { label: t('landing.capabilities.c8'), icon: Globe2, color: 'text-brand-violet' },
  ]
  return (
    <section className="border-y bg-surface">
      <div className={cn(container, 'flex flex-col gap-10 py-16 md:py-24')}>
        <SectionHeading eyebrow={t('landing.capabilities.eyebrow')} title={t('landing.capabilities.title')} color="bg-brand-magenta" />
        <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <li key={c.label} className="flex items-center gap-3 bg-card p-5 text-sm font-medium">
              <c.icon className={cn('size-5 shrink-0', c.color)} aria-hidden />
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Trust({ t }: P) {
  const items = [
    { title: t('landing.trust.t1Title'), body: t('landing.trust.t1Body'), icon: Lock },
    { title: t('landing.trust.t2Title'), body: t('landing.trust.t2Body'), icon: ShieldCheck },
    { title: t('landing.trust.t3Title'), body: t('landing.trust.t3Body'), icon: Sparkles },
    { title: t('landing.trust.t4Title'), body: t('landing.trust.t4Body'), icon: Scale },
  ]
  return (
    <section id="trust" className="scroll-mt-20">
      <div className={cn(container, 'py-16 md:py-24')}>
        <div className="overflow-hidden rounded-3xl bg-brand-night text-white">
          <div aria-hidden className="brand-rainbow h-1 w-full" />
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:p-14">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">{t('landing.trust.eyebrow')}</span>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance-safe md:text-4xl">{t('landing.trust.title')}</h2>
              <p className="text-base text-pretty text-white/70">{t('landing.trust.subtitle')}</p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {items.map((i) => (
                <li key={i.title} className="flex flex-col gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                    <i.icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{i.title}</h3>
                  <p className="text-sm text-pretty text-white/65">{i.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FinalCta({ t, signedIn }: P & { signedIn: boolean }) {
  return (
    <section>
      <div className={cn(container, 'flex flex-col items-center gap-6 pb-20 text-center md:pb-28')}>
        <span aria-hidden className="flex size-14 items-center justify-center rounded-2xl border bg-card shadow-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="" width={36} height={36} className="dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark-dark.svg" alt="" width={36} height={36} className="hidden dark:block" />
        </span>
        <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-balance-safe md:text-4xl">{t('landing.cta.title')}</h2>
        <p className="max-w-xl text-base text-pretty text-muted-foreground md:text-lg">{t('landing.cta.subtitle')}</p>
        <Button render={<Link href={signedIn ? '/app' : '/auth/sign-up'} />} nativeButton={false} size="lg" className="h-12 px-6 text-base">
          {signedIn ? t('common.openApp') : t('landing.cta.button')}
          <ArrowRight className="rtl:rotate-180" aria-hidden />
        </Button>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {[t('landing.trust.t1Title'), t('landing.trust.t2Title'), t('landing.trust.t3Title')].map((x) => (
            <li key={x} className="flex items-center gap-1.5">
              <Check className="size-4 text-brand-emerald" aria-hidden />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
