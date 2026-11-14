import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { Audiences, Capabilities, FinalCta, Hero, HowItWorks, Problem, Trust } from '@/components/landing/sections'
import { getSessionUser } from '@/lib/auth'
import { getI18n } from '@/lib/i18n/server'

export default async function HomePage() {
  const [{ t, locale }, user] = await Promise.all([getI18n(), getSessionUser()])
  const signedIn = Boolean(user)

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t('common.skipToContent')}
      </a>
      <SiteHeader signedIn={signedIn} />
      <main id="main">
        <Hero t={t} locale={locale} signedIn={signedIn} />
        <Problem t={t} />
        <HowItWorks t={t} />
        <Audiences t={t} />
        <Capabilities t={t} />
        <Trust t={t} />
        <FinalCta t={t} signedIn={signedIn} />
      </main>
      <SiteFooter t={t} />
    </>
  )
}
