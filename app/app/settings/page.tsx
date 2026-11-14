import type { Metadata } from 'next'
import { PageHeader, Panel } from '@/components/shared/page'
import { DataControls, PreferencesControls, ProfileForm } from '@/components/settings/settings-forms'
import { getProfile } from '@/lib/auth'
import { getDataRequests } from '@/lib/data'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('settings.title') }
}

export default async function SettingsPage() {
  const [{ t }, profile, requests] = await Promise.all([getI18n(), getProfile(), getDataRequests()])
  const deletionPending = requests.some((r) => r.kind === 'deletion' && (r.status === 'received' || r.status === 'processing'))

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <PageHeader title={t('settings.title')} description={t('settings.subtitle')} />
      <Panel title={t('settings.profile')} description={t('settings.profileBody')}>
        <ProfileForm fullName={profile.full_name} email={profile.email} />
      </Panel>
      <Panel title={t('settings.preferences')} description={t('settings.preferencesBody')}>
        <PreferencesControls />
      </Panel>
      <Panel title={t('settings.privacy')}>
        <DataControls deletionPending={deletionPending} />
      </Panel>
    </div>
  )
}
