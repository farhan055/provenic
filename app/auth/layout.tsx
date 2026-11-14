import Link from 'next/link'
import { BrandLockup } from '@/components/brand/brand-lockup'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { getI18n } from '@/lib/i18n/server'
import { PhotoCarousel } from '@/components/shared/photo-carousel'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n()

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
          showPauseControl={false}
          captionVariant="overlay"
          labels={{
            description: t('auth.carouselDescription'),
            pause: t('landing.hero.pauseCarousel'),
            resume: t('landing.hero.resumeCarousel'),
            slide: t('landing.hero.carouselSlide'),
          }}
          slides={[
            {
              src: '/brand/auth-team.png',
              alt: t('auth.teamAlt'),
              eyebrow: t('auth.slideTeamEyebrow'),
              title: t('auth.slideTeamTitle'),
              description: t('auth.slideTeamBody'),
            },
            {
              src: '/brand/auth-customer.png',
              alt: t('auth.customerAlt'),
              eyebrow: t('auth.slideCustomerEyebrow'),
              title: t('auth.slideCustomerTitle'),
              description: t('auth.slideCustomerBody'),
            },
            {
              src: '/brand/auth-mobile.png',
              alt: t('auth.mobileAlt'),
              eyebrow: t('auth.slideMobileEyebrow'),
              title: t('auth.slideMobileTitle'),
              description: t('auth.slideMobileBody'),
            },
            {
              src: '/brand/auth-office.png',
              alt: t('auth.officeAlt'),
              eyebrow: t('auth.slideOfficeEyebrow'),
              title: t('auth.slideOfficeTitle'),
              description: t('auth.slideOfficeBody'),
            },
          ]}
        >
          <div className="flex h-full items-start p-5 md:p-8 lg:p-12 xl:p-16">
            <BrandLockup size="panel" onDark />
          </div>
        </PhotoCarousel>
      </aside>
    </div>
  )
}
