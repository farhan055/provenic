import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthHeading } from '@/components/auth/auth-card'
import { getI18n } from '@/lib/i18n/server'

export default async function SignUpSuccessPage() {
  const { t } = await getI18n()
  return (
    <div className="flex flex-col">
      <span className="mb-6 flex size-12 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
        <MailCheck className="size-6" aria-hidden />
      </span>
      <AuthHeading title={t('auth.signUpSuccessTitle')} subtitle={t('auth.signUpSuccessBody')} />
      <Button render={<Link href="/auth/login" />} nativeButton={false} variant="outline" className="h-11">
        {t('auth.backToSignIn')}
      </Button>
    </div>
  )
}
