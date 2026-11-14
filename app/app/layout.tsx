import type { Metadata } from 'next'
import { AppShell } from '@/components/app/app-shell'
import { getMemberships, getProfile } from '@/lib/auth'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [profile, memberships] = await Promise.all([getProfile(), getMemberships()])
  return (
    <AppShell
      profile={{ name: profile.full_name, email: profile.email }}
      workspaces={memberships.map((m) => ({ id: m.business.id, name: m.business.name, role: m.role }))}
    >
      {children}
    </AppShell>
  )
}
