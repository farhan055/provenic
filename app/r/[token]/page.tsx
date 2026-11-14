import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel } from '@/components/shared/page'
import { BrandLockup } from '@/components/brand/brand-lockup'
import { ShareClaimButton } from '@/components/records/share-claim-button'
import { getSessionUser } from '@/lib/auth'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('share.title'), robots: { index: false, follow: false } }
}

export default async function SharedRecordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [{ t }, user] = await Promise.all([getI18n(), getSessionUser()])
  const validFormat = /^[0-9a-f]{48}$/.test(token)
  const next = `/r/${encodeURIComponent(token)}`

  return <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-8 px-4 py-12 sm:px-6">
    <Link href="/" aria-label="Provenic" className="w-fit rounded-md"><BrandLockup size="sidebar" /></Link>
    <Panel className="overflow-hidden" bodyClassName="flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet"><ShieldCheck aria-hidden /></div>
      <PageHeader title={t('share.title')} description={validFormat ? t('share.body') : t('share.invalid')} />
      {validFormat && (user ? <ShareClaimButton token={token} /> : <div className="flex flex-col gap-3 sm:flex-row">
        <Button render={<Link href={`/auth/login?next=${encodeURIComponent(next)}`} />} nativeButton={false} className="h-10">{t('share.signInToContinue')}<ArrowRight className="rtl:rotate-180" aria-hidden /></Button>
        <Button render={<Link href={`/auth/sign-up?next=${encodeURIComponent(next)}`} />} nativeButton={false} variant="outline" className="h-10">{t('common.signUp')}</Button>
      </div>)}
    </Panel>
  </main>
}
