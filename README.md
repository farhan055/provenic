# Provenic

Provenic is a private, shared record system for customer–business transactions and commitments. Phase 1 currently includes the public site, Supabase-backed authentication and record workflows, customer and business workspaces, four interface languages (English, Urdu, Arabic, Simplified Chinese), RTL support, and light/dark themes.

## Vercel v0 and Supabase setup

Attach the Supabase integration to the Vercel project. The application uses the integration-provided environment values; never commit their values or expose server-only keys in browser code.

Required runtime configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` for authentication links in v0 previews

`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, database credentials, and JWT secrets are server-only. Do not use them in client components or public environment variables.

## Database setup

The connected Supabase project must have the migrations in `supabase/migrations/` applied in numeric order:

1. `0001_foundation.sql` — profiles, businesses, records, activity, private record-file storage, RLS, and core RPCs.
2. `0002_legal_acceptances.sql` — versioned signup consent.
3. `0003_security_hardening.sql` — immutable tenant membership scope and server-enforced record/issue lifecycle rules.

An integration can be connected while its database is still uninitialized. Confirm these migrations are applied before enabling authenticated record, document, export, or business-workspace flows. Do not use a service-role key to bypass RLS in application requests.

## Product scope and limitations

- Active interface locales are limited to `en`, `ur`, `ar`, and `zh`; Urdu and Arabic use RTL layout.
- AI-assisted extraction is a future capability only. No extraction is presented as implemented or confirmed.
- Legal copy is a launch review item and should be reviewed for the jurisdictions and retention policy that apply before production use.
- The app is a record-keeping platform; it does not process payments, escrow funds, or make dispute decisions.
