import { z } from 'zod'
import { currencies, issueStatuses, memberRoles, recordStatuses, recordTypes } from './domain'

// Error messages are translation keys resolved in the UI.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, 'validation.tooLong')
    .transform((v) => (v === '' ? null : v))
    .nullable()
    .optional()

export const uuid = z.string().uuid()

export const recordSchema = z
  .object({
    title: z.string().trim().min(2, 'validation.tooShort').max(160, 'validation.tooLong'),
    type: z.enum(recordTypes),
    summary: optionalText(4000),
    terms: optionalText(10000),
    business_responsibility: optionalText(2000),
    customer_responsibility: optionalText(2000),
    customer_name: optionalText(120),
    customer_email: z
      .string()
      .trim()
      .toLowerCase()
      .transform((v) => (v === '' ? null : v))
      .pipe(z.string().email('validation.email').max(254).nullable()),
    amount: z
      .string()
      .trim()
      .transform((v) => (v === '' ? null : v))
      .pipe(z.string().regex(/^\d{1,12}(\.\d{1,2})?$/, 'validation.amount').nullable()),
    currency: z
      .string()
      .trim()
      .transform((v) => (v === '' ? null : v))
      .pipe(z.enum(currencies, { message: 'validation.currency' }).nullable()),
    due_date: z
      .string()
      .trim()
      .transform((v) => (v === '' ? null : v))
      .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.date').nullable()),
  })
  .refine((v) => v.amount === null || v.currency !== null, {
    path: ['currency'],
    message: 'validation.currencyRequired',
  })

export const statusSchema = z.enum(recordStatuses)
export const issueStatusSchema = z.enum(issueStatuses)

export const commentSchema = z.object({
  body: z.string().trim().min(1, 'validation.required').max(4000, 'validation.tooLong'),
  visibility: z.enum(['shared', 'internal']).default('shared'),
})

export const noteSchema = z.object({
  body: z.string().trim().min(1, 'validation.required').max(4000, 'validation.tooLong'),
})

export const issueSchema = z.object({
  title: z.string().trim().min(2, 'validation.tooShort').max(160, 'validation.tooLong'),
  description: optionalText(4000),
})

export const reminderSchema = z.object({
  title: z.string().trim().min(2, 'validation.tooShort').max(160, 'validation.tooLong'),
  remind_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.date'),
})

export const businessSchema = z.object({
  name: z.string().trim().min(2, 'validation.tooShort').max(120, 'validation.tooLong'),
  category: optionalText(80),
})

export const businessProfileSchema = businessSchema.extend({
  contact_email: z
    .string()
    .trim()
    .transform((v) => (v === '' ? null : v))
    .pipe(z.string().email('validation.email').max(254).nullable()),
  contact_phone: optionalText(40),
})

export const memberSchema = z.object({
  email: z.string().trim().toLowerCase().email('validation.email'),
  role: z.enum(memberRoles).refine((r) => r !== 'owner', 'validation.required'),
})

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'validation.required').max(120, 'validation.tooLong'),
})

export function fieldErrorsFrom(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
