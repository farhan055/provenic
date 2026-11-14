'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'
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

const subscribe = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t('common.theme')} className="size-9">
            <Sun className="dark:hidden" aria-hidden />
            <Moon className="hidden dark:block" aria-hidden />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('common.theme')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={mounted ? (theme ?? 'system') : 'system'} onValueChange={(v) => setTheme(v as string)}>
            <DropdownMenuRadioItem value="light">
              <Sun aria-hidden /> {t('common.light')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon aria-hidden /> {t('common.dark')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor aria-hidden /> {t('common.system')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
