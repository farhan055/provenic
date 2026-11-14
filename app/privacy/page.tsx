import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { getLegalDocument } from '@/lib/legal-content'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n()
  const document = getLegalDocument(locale, 'privacy')
  return { title: document.title, description: document.intro }
}

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />
}
