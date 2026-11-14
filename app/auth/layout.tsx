import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { BrandLockup } from '@/components/brand/brand-lockup'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { getI18n } from '@/lib/i18n/server'
import { PhotoCarousel } from '@/components/shared/photo-carousel'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n()
  const points = [t('landing.capabilities.c2'), t('landing.capabilities.c3'), t('landing.capabilities.c4')]

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="order-2 flex flex-col lg:order-2">
        <header className="flex items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" aria-label="Provenic" className="rounded-md">
            <BrandLockup size="header" />
          </Link>
          <div className="flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>

      <aside className="relative order-1 flex h-[220px] overflow-hidden text-white lg:order-1 lg:h-auto lg:min-h-dvh">
        <PhotoCarousel
          className="absolute inset-0 rounded-none border-0"
          overlayClassName="from-brand-night/95 via-brand-night/60 to-brand-night/40"
          labels={{
            description: t('auth.carouselDescription'),
            pause: t('landing.hero.pauseCarousel'),
            resume: t('landing.hero.resumeCarousel'),
            slide: t('landing.hero.carouselSlide'),
          }}
          slides={[
            { src: '/brand/auth-team.png', alt: t('auth.teamAlt') },
            { src: '/brand/auth-customer.png', alt: t('auth.customerAlt') },
            { src: '/brand/auth-mobile.png', alt: t('auth.mobileAlt') },
          ]}
        >
          <div className="flex h-full flex-col justify-between gap-8 p-5 pb-16 md:p-8 md:pb-20 lg:p-12 lg:pb-20 xl:p-16 xl:pb-24">
            <BrandLockup size="panel" onDark className="hidden self-start lg:inline-flex" />
            <div className="hidden max-w-md flex-col gap-6 lg:flex">
              <h2 className="font-display text-3xl leading-tight font-semibold text-balance-safe xl:text-4xl">{t('auth.sidePanelTitle')}</h2>
              <p className="text-white/85">{t('auth.sidePanelBody')}</p>
              <ul className="flex flex-col gap-3">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle2 className="size-4 shrink-0 text-brand-emerald" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <p className="hidden text-xs text-white/75 lg:block">{t('landing.footer.note')}</p>
          </div>
        </PhotoCarousel>
      </aside>
    </div>
  )
}
