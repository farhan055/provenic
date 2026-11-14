import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthHeading } from '@/components/auth/auth-card'
import { getI18n } from '@/lib/i18n/server'

export default async function AuthErrorPage() {
  const { t } = await getI18n()
  return (
    <div className="flex flex-col">
      <span className="mb-6 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <AuthHeading title={t('auth.errorTitle')} subtitle={t('auth.errorBody')} />
      <Button render={<Link href="/auth/login" />} nativeButton={false} className="h-11">
        {t('auth.backToSignIn')}
      </Button>
    </div>
  )
}
