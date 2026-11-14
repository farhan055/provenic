import Link from 'next/link'
import { ArrowLeft, Download, Eye, History, Scale, ShieldCheck, UsersRound } from 'lucide-react'
import { BrandLockup } from '@/components/brand/brand-lockup'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { Button } from '@/components/ui/button'
import { getSessionUser } from '@/lib/auth'
import { getI18n } from '@/lib/i18n/server'
import { getLegalDocument, type LegalKind } from '@/lib/legal-content'
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal'

export async function LegalPage({ kind }: { kind: LegalKind }) {
  const [{ locale, t }, user] = await Promise.all([getI18n(), getSessionUser()])
  const document = getLegalDocument(locale, kind)
  const highlights = kind === 'privacy'
    ? [document.sections[2], document.sections[6], document.sections[7]]
    : [document.sections[3], document.sections[6], document.sections[9]]
  const icons = kind === 'privacy' ? [Eye, Download, ShieldCheck] : [UsersRound, History, Scale]
  const iconColors = ['text-brand-violet bg-brand-violet/10', 'text-brand-cyan bg-brand-cyan/10', 'text-brand-rose bg-brand-rose/10']

  return (
    <>
      <SiteHeader signedIn={Boolean(user)} />
      <main id="main" className="min-h-[60vh]">
        <article className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
          <Button render={<Link href="/" />} nativeButton={false} variant="ghost" className="w-fit gap-2 px-2 text-muted-foreground">
            <ArrowLeft className="rtl:rotate-180" aria-hidden />
            {t('common.back')}
          </Button>

          <header className="flex flex-col gap-4">
            <BrandLockup size="header" />
            <div aria-hidden className="brand-rainbow h-1 w-20 rounded-full" />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance-safe md:text-5xl">{document.title}</h1>
            <p className="text-sm text-muted-foreground">{document.effective}</p>
            <p className="max-w-3xl text-base leading-7 text-pretty text-muted-foreground">{document.intro}</p>
          </header>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((section, index) => {
              const Icon = icons[index]
              return (
                <section key={section.title} className="brand-hover flex min-h-44 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-elevated transition-transform hover:-translate-y-0.5">
                  <span className={`flex size-10 items-center justify-center rounded-xl ${iconColors[index]}`}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="font-display text-sm font-semibold leading-snug">{section.title}</h2>
                  <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">{section.body}</p>
                </section>
              )
            })}
          </div>

          <aside role="note" className="rounded-2xl border border-brand-amber/40 bg-brand-amber/10 p-4 text-sm leading-6 text-foreground">
            <span className="mb-1 block font-semibold">{t('legal.reviewNotice')}</span>
            {document.draftNotice}
          </aside>

          <div className="flex flex-col gap-6">
            {document.sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`legal-section-${index + 1}`} className="flex flex-col gap-2 border-s-2 border-brand-violet/20 ps-4 md:ps-5">
                <h2 id={`legal-section-${index + 1}`} className="font-display text-lg font-semibold tracking-tight">{section.title}</h2>
                <p className="text-sm leading-7 text-pretty text-muted-foreground md:text-base">{section.body}</p>
              </section>
            ))}
          </div>

          <footer className="rounded-2xl border bg-card p-5 shadow-elevated">
            <h2 className="font-display font-semibold">{document.contactHeading}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {document.contactBody}{' '}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="brand-link font-medium text-foreground underline underline-offset-4" dir="ltr">
                {LEGAL_CONTACT_EMAIL}
              </a>
              .
            </p>
          </footer>
        </article>
      </main>
      <SiteFooter t={t} />
    </>
  )
}
