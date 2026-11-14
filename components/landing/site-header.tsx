'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useI18n } from '@/components/providers/i18n-provider'

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const { t, dir } = useI18n()
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#how', label: t('landing.nav.how') },
    { href: '#customers', label: t('landing.nav.customers') },
    { href: '#businesses', label: t('landing.nav.businesses') },
    { href: '#trust', label: t('landing.nav.trust') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div aria-hidden className="brand-rainbow h-0.5 w-full" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 2xl:max-w-[1440px]">
        <Link href="/" className="flex items-center rounded-md" aria-label="Provenic">
          <Logo variant="wordmark" className="h-7 md:h-8" />
        </Link>

        <nav aria-label={t('common.mainNav')} className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center sm:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {signedIn ? (
            <Button render={<Link href="/app" />} nativeButton={false} className="h-9 px-3.5">
              {t('common.openApp')}
            </Button>
          ) : (
            <>
              <Button render={<Link href="/auth/login" />} nativeButton={false} variant="ghost" className="hidden h-9 px-3 sm:inline-flex">
                {t('common.signIn')}
              </Button>
              <Button render={<Link href="/auth/sign-up" />} nativeButton={false} className="h-9 px-3.5">
                {t('common.getStarted')}
              </Button>
            </>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="size-9 lg:hidden" aria-label={t('common.openMenu')}>
                  <Menu aria-hidden />
                </Button>
              }
            />
            <SheetContent side={dir === 'rtl' ? 'left' : 'right'} className="w-80 max-w-[85vw] p-0">
              <SheetTitle className="sr-only">{t('common.mainNav')}</SheetTitle>
              <div className="flex flex-col gap-6 p-6 pt-14">
                <nav aria-label={t('common.mainNav')} className="flex flex-col gap-1">
                  {links.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted">
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="flex items-center gap-2 border-t pt-4">
                  <LanguageSwitcher showLabel />
                  <ThemeToggle />
                </div>
                {!signedIn && (
                  <Button render={<Link href="/auth/login" />} nativeButton={false} variant="outline" className="h-11">
                    {t('common.signIn')}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
