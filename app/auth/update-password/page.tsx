import { redirect } from 'next/navigation'
import { UpdatePasswordForm } from '@/components/auth/password-forms'
import { getSessionUser } from '@/lib/auth'

export default async function UpdatePasswordPage() {
  // A recovery session is established by /auth/callback before arriving here.
  if (!(await getSessionUser())) redirect('/auth/login')
  return <UpdatePasswordForm />
}
