import Link from 'next/link'
import { BrandLockup } from '@/components/brand/brand-lockup'
import type { Translator } from '@/lib/i18n/translate'

export function SiteFooter({ t }: { t: Translator }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-6 2xl:max-w-[1440px]">
        <div className="flex flex-col gap-4">
          <BrandLockup size="footer" />
          <p className="max-w-sm text-sm text-pretty text-muted-foreground">{t('landing.footer.note')}</p>
        </div>
        <nav aria-label={t('landing.footer.product')} className="flex flex-col gap-3 text-sm">
          <span className="font-semibold">{t('landing.footer.product')}</span>
          <a href="/#how" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('landing.nav.how')}</a>
          <a href="/#customers" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('landing.nav.customers')}</a>
          <a href="/#businesses" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('landing.nav.businesses')}</a>
          <a href="/#trust" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('landing.nav.trust')}</a>
        </nav>
        <nav aria-label={t('landing.footer.account')} className="flex flex-col gap-3 text-sm">
          <span className="font-semibold">{t('landing.footer.account')}</span>
          <Link href="/auth/sign-up" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('common.signUp')}</Link>
          <Link href="/auth/login" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('common.signIn')}</Link>
          <Link href="/auth/forgot-password" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('auth.forgot')}</Link>
          <Link href="/privacy" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('legal.privacy')}</Link>
          <Link href="/terms" className="brand-link w-fit text-muted-foreground hover:text-foreground">{t('legal.terms')}</Link>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground md:px-6 2xl:max-w-[1440px]">
          © {year} {t('landing.footer.rights')}
        </p>
      </div>
    </footer>
  )
}
