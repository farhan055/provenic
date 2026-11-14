'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/components/providers/i18n-provider'
import { setLocale } from '@/lib/actions/account'
import { localeMeta, locales } from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ showLabel = false }: { showLabel?: boolean }) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={showLabel ? 'default' : 'icon'}
            aria-label={t('common.language')}
            className={cn(showLabel ? 'h-9 gap-2 px-2.5' : 'size-9', pending && 'opacity-60')}
          >
            <Languages aria-hidden />
            {showLabel && <span className="text-sm">{localeMeta[locale].label}</span>}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) =>
              startTransition(async () => {
                await setLocale(value as string)
                router.refresh()
              })
            }
          >
            {locales.map((l) => (
              <DropdownMenuRadioItem key={l} value={l} lang={l} dir={localeMeta[l].dir}>
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span>{localeMeta[l].label}</span>
                  <span className="text-xs text-muted-foreground" lang="en" dir="ltr">
                    {localeMeta[l].english}
                  </span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
