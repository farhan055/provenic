'use client'

import { useActionState, useRef, useState, useTransition } from 'react'
import { ArrowRightLeft, Check, ChevronDown, Copy, Link2, Loader2, Paperclip, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, SubmitButton, initialActionState, useActionFeedback } from '@/components/shared/form'
import { useI18n } from '@/components/providers/i18n-provider'
import {
  addComment,
  addNote,
  addReminder,
  completeReminder,
  createShareLink,
  openIssue,
  revokeShareLink,
  updateIssueStatus,
  updateRecordStatus,
  uploadAttachment,
} from '@/lib/actions/records'
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES, issueTransitions, recordTransitions, type IssueStatus, type RecordStatus } from '@/lib/domain'
import { formatDate } from '@/lib/i18n/format'
import type { TranslationKey } from '@/lib/i18n/translate'
import type { ActionResult } from '@/lib/types'

function useRunner() {
  const { t } = useI18n()
  const [pending, start] = useTransition()
  const run = (fn: () => Promise<ActionResult<unknown>>, successKey?: TranslationKey) =>
    start(async () => {
      const res = await fn()
      if (res.ok) {
        if (successKey) toast.success(t(successKey))
      } else toast.error(t(res.error as TranslationKey))
    })
  return { pending, run }
}

function InternalToggle({ name = 'internal' }: { name?: string }) {
  const { t } = useI18n()
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none">
      <input type="checkbox" name={name} className="size-4 rounded border-input accent-brand-violet" />
      {t('record.commentInternal')}
    </label>
  )
}

export function StatusMenu({ recordId, status }: { recordId: string; status: RecordStatus }) {
  const { t } = useI18n()
  const { pending, run } = useRunner()
  const options = recordTransitions[status]
  if (!options.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-9 gap-2" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <ArrowRightLeft aria-hidden />}
            {t('record.changeStatus')}
            <ChevronDown className="opacity-60" aria-hidden />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('record.changeStatus')}</DropdownMenuLabel>
          {options.map((s) => (
            <DropdownMenuItem key={s} onClick={() => run(() => updateRecordStatus(recordId, s), 'record.statusUpdated')}>
              {t(`status.${s}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CommentForm({ recordId, isMember }: { recordId: string; isMember: boolean }) {
  const { t } = useI18n()
  const ref = useRef<HTMLFormElement>(null)
  const [state, action] = useActionState(addComment.bind(null, recordId), initialActionState)
  useActionFeedback(state, { resetRef: ref })
  return (
    <form ref={ref} action={action} className="flex flex-col gap-2 rounded-xl border bg-surface/50 p-3">
      <label htmlFor="comment-body" className="sr-only">
        {t('record.addComment')}
      </label>
      <Textarea id="comment-body" name="body" required maxLength={4000} rows={2} placeholder={t('record.commentPlaceholder')} className="min-h-16 resize-y bg-card" />
      <div className="flex items-center justify-between gap-2">
        {isMember ? <InternalToggle /> : <span />}
        <SubmitButton size="sm" className="h-8">
          {t('record.post')}
        </SubmitButton>
      </div>
    </form>
  )
}

export function NoteForm({ recordId }: { recordId: string }) {
  const { t } = useI18n()
  const ref = useRef<HTMLFormElement>(null)
  const [state, action] = useActionState(addNote.bind(null, recordId), initialActionState)
  useActionFeedback(state, { resetRef: ref })
  return (
    <form ref={ref} action={action} className="flex flex-col gap-2">
      <label htmlFor="note-body" className="sr-only">
        {t('record.addNote')}
      </label>
      <Textarea id="note-body" name="body" required maxLength={4000} rows={2} placeholder={t('record.notePlaceholder')} className="min-h-16" />
      <SubmitButton size="sm" variant="secondary" className="h-8 self-end">
        {t('record.addNote')}
      </SubmitButton>
    </form>
  )
}

export function UploadForm({ recordId, isMember }: { recordId: string; isMember: boolean }) {
  const { t } = useI18n()
  const ref = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [localError, setLocalError] = useState<TranslationKey | null>(null)
  const [state, action] = useActionState(uploadAttachment.bind(null, recordId), initialActionState)
  useActionFeedback(state, { successKey: 'record.uploaded', resetRef: ref })

  return (
    <form
      ref={ref}
      action={action}
      onSubmit={(e) => {
        const file = (e.currentTarget.elements.namedItem('file') as HTMLInputElement).files?.[0]
        if (!file) return e.preventDefault()
        if (file.size > MAX_UPLOAD_BYTES) {
          e.preventDefault()
          setLocalError('errors.fileTooLarge')
        } else if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
          e.preventDefault()
          setLocalError('errors.fileType')
        }
      }}
      onReset={() => setFileName(null)}
      className="flex flex-col gap-2"
    >
      <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed bg-surface/50 px-4 py-5 text-center transition-colors hover:bg-muted/60 focus-within:ring-2 focus-within:ring-ring">
        <Paperclip className="size-5 text-muted-foreground" aria-hidden />
        <span className="text-sm font-medium break-all">{fileName ?? t('record.upload')}</span>
        <span className="text-xs text-muted-foreground">{t('record.uploadHint')}</span>
        <input
          type="file"
          name="file"
          required
          accept={ALLOWED_UPLOAD_TYPES.join(',')}
          className="sr-only"
          onChange={(e) => {
            setLocalError(null)
            setFileName(e.target.files?.[0]?.name ?? null)
          }}
        />
      </label>
      {localError && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {t(localError)}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        {isMember ? <InternalToggle /> : <span />}
        <SubmitButton size="sm" variant="secondary" className="h-8">
          <Upload aria-hidden />
          {t('record.upload')}
        </SubmitButton>
      </div>
    </form>
  )
}

export function IssueDialog({ recordId }: { recordId: string }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [state, action] = useActionState(async (prev: ActionResult, fd: FormData) => {
    const res = await openIssue(recordId, prev, fd)
    if (res.ok) setOpen(false)
    return res
  }, initialActionState)
  useActionFeedback(state, { successKey: 'record.issueOpened' })
  const errors = state.ok ? {} : (state.fieldErrors ?? {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="h-8">
            <Plus aria-hidden />
            {t('record.raiseIssue')}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('record.raiseIssue')}</DialogTitle>
          <DialogDescription>{t('record.issueNeutral')}</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          <Field label={t('record.issueTitle')} error={errors.title}>
            {(p) => <Input {...p} name="title" required maxLength={160} className="h-10" />}
          </Field>
          <Field label={t('record.issueDescription')} error={errors.description} optional>
            {(p) => <Textarea {...p} name="description" maxLength={4000} rows={4} />}
          </Field>
          <SubmitButton className="h-10">{t('record.issueSubmit')}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function IssueStatusMenu({ recordId, issueId, status }: { recordId: string; issueId: string; status: IssueStatus }) {
  const { t } = useI18n()
  const { pending, run } = useRunner()
  const options = issueTransitions[status]
  if (!options.length) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" disabled={pending} aria-label={t('record.changeStatus')}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <ArrowRightLeft aria-hidden />}
            <ChevronDown className="opacity-60" aria-hidden />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('record.changeStatus')}</DropdownMenuLabel>
          {options.map((s) => (
            <DropdownMenuItem key={s} onClick={() => run(() => updateIssueStatus(recordId, issueId, s), 'record.statusUpdated')}>
              {t(`issueStatus.${s}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ReminderForm({ recordId, defaultTitle }: { recordId: string; defaultTitle: string }) {
  const { t } = useI18n()
  const ref = useRef<HTMLFormElement>(null)
  const [state, action] = useActionState(addReminder.bind(null, recordId), initialActionState)
  useActionFeedback(state, { successKey: 'record.reminderAdded', resetRef: ref })
  const today = new Date().toISOString().slice(0, 10)
  const errors = state.ok ? {} : (state.fieldErrors ?? {})
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end lg:grid-cols-1 xl:grid-cols-1">
      <Field label={t('record.reminderTitle')} error={errors.title}>
        {(p) => <Input {...p} name="title" defaultValue={defaultTitle} required maxLength={160} className="h-9" />}
      </Field>
      <div className="flex items-end gap-2">
        <Field label={t('record.remindAt')} error={errors.remind_at} className="flex-1">
          {(p) => <Input {...p} type="date" name="remind_at" min={today} required className="h-9" />}
        </Field>
        <SubmitButton size="sm" variant="secondary" className="h-9">
          <Plus aria-hidden />
          <span className="sr-only sm:not-sr-only">{t('record.addReminder')}</span>
        </SubmitButton>
      </div>
    </form>
  )
}

export function CompleteReminderButton({ reminderId }: { reminderId: string }) {
  const { t } = useI18n()
  const { pending, run } = useRunner()
  return (
    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={pending} onClick={() => run(() => completeReminder(reminderId))}>
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
      {t('record.markDone')}
    </Button>
  )
}

export type ShareLinkView = { id: string; url: string; qrSvg: string; expires_at: string }

export function SharePanel({ recordId, links, isDraft }: { recordId: string; links: ShareLinkView[]; isDraft: boolean }) {
  const { t, locale } = useI18n()
  const { pending, run } = useRunner()
  const [copied, setCopied] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-pretty text-muted-foreground">{t('record.shareBody')}</p>
      {isDraft && <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">{t('record.shareDraftNote')}</p>}
      <Button onClick={() => run(() => createShareLink(recordId))} disabled={pending} className="h-9">
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Link2 aria-hidden />}
        {t('record.generateLink')}
      </Button>
      {links.length > 0 && (
        <ul className="flex flex-col gap-3">
          {links.map((l) => (
            <li key={l.id} className="flex flex-col gap-3 rounded-xl border p-3">
              <div className="flex items-start gap-3">
                <div
                  className="size-24 shrink-0 overflow-hidden rounded-lg border bg-white p-1.5 [&_svg]:size-full"
                  role="img"
                  aria-label={t('record.qrAlt')}
                  dangerouslySetInnerHTML={{ __html: l.qrSvg }}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <code className="line-clamp-2 rounded-md bg-muted px-2 py-1 text-[11px] break-all" dir="ltr">
                    {l.url}
                  </code>
                  <span className="text-xs text-muted-foreground">{t('record.expires', { date: formatDate(locale, l.expires_at) ?? '' })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 flex-1"
                  onClick={async () => {
                    await navigator.clipboard.writeText(l.url)
                    setCopied(l.id)
                    toast.success(t('common.copied'))
                    setTimeout(() => setCopied(null), 2000)
                  }}
                >
                  {copied === l.id ? <Check aria-hidden /> : <Copy aria-hidden />}
                  {copied === l.id ? t('common.copied') : t('common.copy')}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-destructive" disabled={pending} onClick={() => run(() => revokeShareLink(recordId, l.id), 'record.revoked')}>
                  {t('record.revoke')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
