import type { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t('common.signUp') }
}

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return <SignUpForm next={next} />
}
