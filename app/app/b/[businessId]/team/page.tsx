import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { EmptyState, PageHeader, Panel } from '@/components/shared/page'
import { AddMemberForm, RemoveMemberButton } from '@/components/app/business-forms'
import { getTeam } from '@/lib/data'
import { canManage, requireMembership, requireUser } from '@/lib/auth'
import { formatDate, formatDateTime } from '@/lib/i18n/format'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('business.teamTitle') }
}

export default async function BusinessTeamPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const [membership, user] = await Promise.all([requireMembership(businessId), requireUser()])
  const [{ t, locale }, team] = await Promise.all([getI18n(), getTeam(businessId)])
  const manager = canManage(membership.role)

  return <>
    <PageHeader eyebrow={membership.business.name} title={t('business.teamTitle')} description={t('business.teamSubtitle')} />
    {manager && <Panel title={t('business.addMember')} description={t('business.addMemberBody')}><AddMemberForm businessId={businessId} /></Panel>}
    <Panel title={t('business.teamTitle')}>
      {team.length === 0 ? <EmptyState icon={<Users />} title={t('business.teamTitle')} /> : <div className="overflow-x-auto"><table className="w-full min-w-[34rem] text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colName')}</th><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colEmail')}</th><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.role')}</th><th scope="col" className="py-2.5 pe-4 text-start font-medium">{t('business.colJoined')}</th>{manager && <th scope="col" className="py-2.5 text-end font-medium"><span className="sr-only">{t('business.remove')}</span></th>}</tr></thead><tbody className="divide-y">{team.map((member) => <tr key={member.userId}><td className="py-3 pe-4 font-medium" dir="auto">{member.name || t('common.notSet')}</td><td className="py-3 pe-4 text-muted-foreground" dir="ltr">{member.email ?? '—'}</td><td className="py-3 pe-4">{t(`roles.${member.role}`)}</td><td className="py-3 pe-4 text-muted-foreground" title={formatDateTime(locale, member.since)}>{formatDate(locale, member.since)}</td>{manager && <td className="py-2 text-end">{member.role !== 'owner' && member.userId !== user.id && <RemoveMemberButton businessId={businessId} userId={member.userId} />}</td>}</tr>)}</tbody></table></div>}
    </Panel>
  </>
}
