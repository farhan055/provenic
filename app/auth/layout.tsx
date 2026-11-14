import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { getI18n } from '@/lib/i18n/server'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n()
  const points = [t('landing.capabilities.c2'), t('landing.capabilities.c3'), t('landing.capabilities.c4')]

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" aria-label="Provenic" className="rounded-md">
            <Logo variant="wordmark" className="h-7" />
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

      <aside className="relative hidden overflow-hidden bg-brand-night text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div aria-hidden className="brand-rainbow absolute inset-x-0 top-0 h-1" />
        <div aria-hidden className="absolute -end-32 -bottom-32 size-[520px] rounded-full border-[48px] border-white/[0.03]" />
        <Logo variant="full" onDark className="h-16 w-auto self-start" />
        <div className="relative flex max-w-md flex-col gap-6">
          <h2 className="font-display text-3xl leading-tight font-semibold text-balance-safe xl:text-4xl">{t('auth.sidePanelTitle')}</h2>
          <p className="text-white/70">{t('auth.sidePanelBody')}</p>
          <ul className="flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/85">
                <CheckCircle2 className="size-4 shrink-0 text-brand-emerald" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/50">{t('landing.footer.note')}</p>
      </aside>
    </div>
  )
}
