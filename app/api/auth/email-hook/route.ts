import { NextResponse, type NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { Webhook } from 'standardwebhooks'
import { getAuthEmailCopy, type AuthEmailKind } from '@/lib/auth-email-copy'
import type { Locale } from '@/lib/i18n/config'

export const runtime = 'nodejs'

const sender = 'provenicofficial@gmail.com'
const maxPayloadBytes = 20 * 1024
const actionKinds: Record<string, AuthEmailKind> = {
  signup: 'confirm',
  invite: 'confirm',
  email: 'confirm',
  recovery: 'recovery',
  magiclink: 'signin',
  reauthentication: 'signin',
  email_change: 'emailChange',
}
const linkActionTypes = new Set(['signup', 'invite', 'email', 'recovery', 'magiclink', 'reauthentication', 'email_change'])

type EmailHookEvent = {
  user?: {
    email?: string
    new_email?: string
    user_metadata?: { locale?: string }
  }
  email_data?: {
    email_action_type?: string
    token_hash?: string
    token_hash_new?: string
    redirect_to?: string
    site_url?: string
  }
}

type Delivery = { recipient: string; tokenHash?: string }

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined

function getTransporter() {
  const password = process.env.PROVENIC_GMAIL_APP_PASSWORD?.replaceAll(/\s/g, '')
  if (!password) return null

  transporter ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: sender, pass: password },
    connectionTimeout: 2500,
    greetingTimeout: 2500,
    socketTimeout: 4500,
  })
  return transporter
}

function getWebhookSecret(secretList: string) {
  const firstSecret = secretList.split(',').slice(0, 2).join(',').trim()
  return firstSecret.replace(/^v\d+,whsec_/, '')
}

function getLocale(value: unknown): Locale {
  return value === 'ur' || value === 'ar' || value === 'zh' ? value : 'en'
}

function buildVerificationUrl(tokenHash: string, actionType: string, redirectTo: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) throw new Error('Missing Supabase URL')

  const redirect = new URL(redirectTo)
  if (redirect.protocol !== 'https:' && redirect.protocol !== 'http:') throw new Error('Invalid redirect URL')

  const verificationUrl = new URL('/auth/v1/verify', supabaseUrl)
  verificationUrl.searchParams.set('token', tokenHash)
  verificationUrl.searchParams.set('type', actionType)
  verificationUrl.searchParams.set('redirect_to', redirect.toString())
  return verificationUrl.toString()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function renderEmail(locale: Locale, kind: AuthEmailKind, link?: string) {
  const copy = getAuthEmailCopy(locale, kind)
  const direction = locale === 'ur' || locale === 'ar' ? 'rtl' : 'ltr'
  const safeLink = link ? escapeHtml(link) : null
  const button = safeLink
    ? `<tr><td align="${direction === 'rtl' ? 'right' : 'left'}" style="padding:0 32px 28px"><a href="${safeLink}" style="display:inline-block;padding:14px 22px;border-radius:10px;background:#171b2d;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;line-height:1;text-decoration:none">${escapeHtml(copy.action)}</a></td></tr>`
    : ''
  const align = direction === 'rtl' ? 'right' : 'left'
  const text = [copy.title, '', copy.body, link ? `${copy.action}: ${link}` : '', '', copy.footer, '', 'Provenic — Every promise, proven.']
    .filter((line) => line !== undefined)
    .join('\n')

  return {
    subject: copy.subject,
    text,
    html: `<!doctype html>
<html lang="${locale}" dir="${direction}">
  <body style="margin:0;background:#f4f5f9;padding:32px 12px;color:#1b2030;font-family:Arial,Helvetica,sans-serif">
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden">${escapeHtml(copy.preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;border:1px solid #e4e6ed;border-radius:18px;background:#ffffff;overflow:hidden">
      <tr><td style="height:5px;background:linear-gradient(90deg,#06b6d4,#7c3aed 18%,#db2777 36%,#f43f5e 54%,#f97316 72%,#fbbf24 86%,#10b981)"></td></tr>
      <tr><td dir="ltr" style="padding:28px 32px 0;text-align:left">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.4px;color:#171b2d">Provenic</div>
        <div style="padding-top:5px;font-size:11px;letter-spacing:0.3px;color:#727789">Every promise, proven.</div>
      </td></tr>
      <tr><td dir="${direction}" style="padding:28px 32px 14px;text-align:${align}">
        <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;letter-spacing:-0.35px;color:#171b2d">${escapeHtml(copy.title)}</h1>
        <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#51576a">${escapeHtml(copy.body)}</p>
      </td></tr>
      ${button}
      <tr><td dir="${direction}" style="padding:0 32px 24px;text-align:${align}">
        <p style="margin:0;border-top:1px solid #eceef3;padding-top:18px;font-size:12px;line-height:1.6;color:#777d8f">${escapeHtml(copy.footer)}</p>
      </td></tr>
    </table>
    <p dir="${direction}" style="margin:16px auto 0;max-width:600px;text-align:center;font-size:11px;line-height:1.5;color:#9297a5">Provenic · ${escapeHtml(sender)}</p>
  </body>
</html>`,
  }
}

function getDeliveries(event: EmailHookEvent): { actionType: string; kind: AuthEmailKind; deliveries: Delivery[] } | null {
  const user = event.user
  const emailData = event.email_data
  const actionType = emailData?.email_action_type
  const userEmail = user?.email
  if (!actionType || !userEmail) return null

  const kind = actionKinds[actionType] ?? 'notice'
  if (actionType === 'email_change' && user?.new_email && emailData.token_hash_new && emailData.token_hash) {
    return {
      actionType,
      kind,
      deliveries: [
        { recipient: userEmail, tokenHash: emailData.token_hash_new },
        { recipient: user.new_email, tokenHash: emailData.token_hash },
      ],
    }
  }

  if (linkActionTypes.has(actionType)) {
    if (!emailData.token_hash) return null
    return { actionType, kind, deliveries: [{ recipient: userEmail, tokenHash: emailData.token_hash }] }
  }

  return { actionType, kind, deliveries: [{ recipient: userEmail }] }
}

export async function POST(request: NextRequest) {
  const secretList = process.env.SUPABASE_SEND_EMAIL_HOOK_SECRETS
  if (!secretList || !process.env.PROVENIC_GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'email_delivery_unavailable' }, { status: 503, headers: { 'retry-after': 'true' } })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > maxPayloadBytes) return NextResponse.json({ error: 'invalid_payload' }, { status: 413 })

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > maxPayloadBytes) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 413 })
  }

  const webhook = new Webhook(getWebhookSecret(secretList))
  const webhookHeaders = {
    'webhook-id': request.headers.get('webhook-id') ?? '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
    'webhook-signature': request.headers.get('webhook-signature') ?? '',
  }

  let event: EmailHookEvent
  try {
    event = webhook.verify(rawBody, webhookHeaders) as EmailHookEvent
  } catch {
    return NextResponse.json({ error: 'invalid_hook_signature' }, { status: 401 })
  }

  const emailData = event.email_data
  const delivery = getDeliveries(event)
  if (!delivery || !emailData) return NextResponse.json({ error: 'invalid_email_event' }, { status: 400 })
  if (delivery.deliveries.some(({ recipient }) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient))) {
    return NextResponse.json({ error: 'invalid_email_recipient' }, { status: 400 })
  }

  const transport = getTransporter()
  if (!transport) return NextResponse.json({ error: 'email_delivery_unavailable' }, { status: 503, headers: { 'retry-after': 'true' } })

  try {
    await Promise.all(delivery.deliveries.map(async ({ recipient, tokenHash }) => {
      const link = tokenHash && linkActionTypes.has(delivery.actionType)
        ? buildVerificationUrl(tokenHash, delivery.actionType, emailData.redirect_to || emailData.site_url || '')
        : undefined
      const email = renderEmail(getLocale(event.user?.user_metadata?.locale), delivery.kind, link)
      await transport.sendMail({
        from: `Provenic <${sender}>`,
        to: recipient,
        subject: email.subject,
        text: email.text,
        html: email.html,
      })
    }))
  } catch {
    return NextResponse.json({ error: 'email_delivery_failed' }, { status: 503, headers: { 'retry-after': 'true' } })
  }

  return new Response(null, { status: 200 })
}
