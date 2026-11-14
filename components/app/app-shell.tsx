'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Activity,
  Bell,
  Building2,
  Check,
  ChevronsUpDown,
  FileStack,
  FolderClosed,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  Users,
  UsersRound,
} from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useI18n } from '@/components/providers/i18n-provider'
import { createClient } from '@/lib/supabase/client'
import type { MemberRole } from '@/lib/domain'
import { cn } from '@/lib/utils'

export type ShellWorkspace = { id: string; name: string; role: MemberRole }
type ShellProps = {
  profile: { name: string | null; email: string }
  workspaces: ShellWorkspace[]
  children: React.ReactNode
}

function useWorkspaceContext(workspaces: ShellWorkspace[]) {
  const pathname = usePathname()
  const match = pathname.match(/^\/app\/b\/([0-9a-f-]{36})/i)
  const current = match ? (workspaces.find((w) => w.id === match[1]) ?? null) : null
  return { pathname, current }
}

function initials(name: string | null, email: string) {
  const source = (name || email).trim()
  const parts = source.split(/\s+/).filter(Boolean)
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase()
}

function NavLinks({ workspaces, onNavigate }: { workspaces: ShellWorkspace[]; onNavigate?: () => void }) {
  const { t } = useI18n()
  const { pathname, current } = useWorkspaceContext(workspaces)

  const items = current
    ? [
        { href: `/app/b/${current.id}`, label: t('nav.businessOverview'), icon: LayoutDashboard, exact: true },
        { href: `/app/b/${current.id}/records`, label: t('nav.businessRecords'), icon: FileStack },
        { href: `/app/b/${current.id}/customers`, label: t('nav.customers'), icon: UsersRound },
        { href: `/app/b/${current.id}/team`, label: t('nav.team'), icon: Users },
        { href: `/app/b/${current.id}/settings`, label: t('nav.businessSettings'), icon: Settings },
      ]
    : [
        { href: '/app', label: t('nav.overview'), icon: LayoutDashboard, exact: true },
        { href: '/app/records', label: t('nav.records'), icon: FileStack },
        { href: '/app/documents', label: t('nav.documents'), icon: FolderClosed },
        { href: '/app/reminders', label: t('nav.reminders'), icon: Bell },
        { href: '/app/activity', label: t('nav.activity'), icon: Activity },
        { href: '/app/settings', label: t('nav.settings'), icon: Settings },
      ]

  return (
    <nav aria-label={t('common.mainNav')} className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors lg:h-9',
              active
                ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            {active && <span aria-hidden className="brand-rainbow-v absolute inset-y-1.5 start-0 w-[3px] rounded-full" />}
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function WorkspaceSwitcher({ workspaces, onNavigate }: { workspaces: ShellWorkspace[]; onNavigate?: () => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const { current } = useWorkspaceContext(workspaces)
  const go = (href: string) => {
    onNavigate?.()
    router.push(href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border bg-card p-2.5 text-start shadow-elevated transition-colors hover:bg-muted/60"
            aria-label={t('nav.switchWorkspace')}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
                current ? 'bg-brand-orange/12 text-brand-orange' : 'bg-brand-violet/10 text-brand-violet',
              )}
            >
              {current ? <Building2 className="size-4" aria-hidden /> : <User className="size-4" aria-hidden />}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{current ? current.name : t('nav.personal')}</span>
              <span className="truncate text-xs text-muted-foreground">{current ? t(`roles.${current.role}`) : t('nav.workspaces')}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        }
      />
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('nav.workspaces')}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => go('/app')}>
            <User aria-hidden />
            <span className="flex-1 truncate">{t('nav.personal')}</span>
            {!current && <Check className="text-brand-violet" aria-hidden />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {workspaces.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t('nav.businesses')}</DropdownMenuLabel>
              {workspaces.map((w) => (
                <DropdownMenuItem key={w.id} onClick={() => go(`/app/b/${w.id}`)}>
                  <Building2 aria-hidden />
                  <span className="flex-1 truncate">{w.name}</span>
                  {current?.id === w.id && <Check className="text-brand-violet" aria-hidden />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => go('/app/business/new')}>
          <Plus aria-hidden />
          {t('nav.createBusiness')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ profile }: { profile: ShellProps['profile'] }) {
  const { t } = useI18n()
  const router = useRouter()

  async function signOut() {
    await createClient().auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t('nav.account')}
            className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-background transition-opacity hover:opacity-90"
          >
            <span dir="ltr">{initials(profile.name, profile.email)}</span>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="truncate text-sm font-medium text-foreground">{profile.name ?? t('common.you')}</span>
            <span className="truncate text-xs font-normal" dir="ltr">
              {profile.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/app/settings')}>
          <Settings aria-hidden />
          {t('nav.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} variant="destructive">
          <LogOut aria-hidden />
          {t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarBody({ workspaces, onNavigate }: { workspaces: ShellWorkspace[]; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <Link href="/app" onClick={onNavigate} className="flex items-center px-1 pt-1" aria-label="Provenic">
        <Logo variant="wordmark" className="h-7" />
      </Link>
      <WorkspaceSwitcher workspaces={workspaces} onNavigate={onNavigate} />
      <NavLinks workspaces={workspaces} onNavigate={onNavigate} />
    </div>
  )
}

export function AppShell({ profile, workspaces, children }: ShellProps) {
  const { t, dir } = useI18n()
  const [open, setOpen] = useState(false)
  const { current } = useWorkspaceContext(workspaces)

  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t('common.skipToContent')}
      </a>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-e bg-sidebar lg:block xl:w-72">
        <SidebarBody workspaces={workspaces} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md md:h-16 md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="size-10 lg:hidden" aria-label={t('common.openMenu')}>
                  <Menu aria-hidden />
                </Button>
              }
            />
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-72 max-w-[85vw] bg-sidebar p-0" showCloseButton>
              <SheetTitle className="sr-only">{t('common.mainNav')}</SheetTitle>
              <SidebarBody workspaces={workspaces} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link href="/app" className="lg:hidden" aria-label="Provenic">
            <Logo variant="mark" className="h-8" />
          </Link>

          <div className="ms-auto flex items-center gap-1">
            {current && (
              <Button render={<Link href={`/app/b/${current.id}/records/new`} />} nativeButton={false} className="me-1 h-9 px-3">
                <Plus aria-hidden />
                <span className="hidden sm:inline">{t('nav.newRecord')}</span>
              </Button>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="ms-1">
              <UserMenu profile={profile} />
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
