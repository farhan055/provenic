'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/providers/i18n-provider'
import { claimSharedRecord } from '@/lib/actions/records'
import type { TranslationKey } from '@/lib/i18n/translate'

export function ShareClaimButton({ token }: { token: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [claimed, setClaimed] = useState(false)

  function claim() {
    startTransition(async () => {
      const result = await claimSharedRecord(token)
      if (!result.ok) {
        toast.error(t(result.error as TranslationKey))
        return
      }
      const recordId = result.data?.recordId
      if (!recordId) {
        toast.error(t('errors.generic'))
        return
      }
      setClaimed(true)
      router.replace(`/app/records/${recordId}`)
      router.refresh()
    })
  }

  return <Button type="button" onClick={claim} disabled={pending || claimed} className="h-10">
    {pending ? <Loader2 className="animate-spin" aria-hidden /> : <ShieldCheck aria-hidden />}
    {t('share.claimButton')}
  </Button>
}
