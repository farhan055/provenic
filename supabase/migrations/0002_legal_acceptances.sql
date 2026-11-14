create table public.legal_acceptances (
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text not null check (char_length(terms_version) between 1 and 40),
  privacy_version text not null check (char_length(privacy_version) between 1 and 40),
  accepted_at timestamptz not null default now(),
  primary key (user_id, terms_version, privacy_version)
);

alter table public.legal_acceptances enable row level security;
create policy legal_acceptances_select_own on public.legal_acceptances
  for select to authenticated using (user_id = auth.uid());
revoke all on table public.legal_acceptances from anon, authenticated;
grant select on table public.legal_acceptances to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_terms_version text := new.raw_user_meta_data ->> 'terms_version';
  v_privacy_version text := new.raw_user_meta_data ->> 'privacy_version';
begin
  if v_terms_version is distinct from '2026-11-14-v1'
    or v_privacy_version is distinct from '2026-11-14-v1' then
    raise exception 'legal_consent_required';
  end if;

  insert into public.profiles (id, full_name, email, locale)
  values (
    new.id,
    nullif(left(new.raw_user_meta_data ->> 'full_name', 120), ''),
    lower(new.email),
    case when new.raw_user_meta_data ->> 'locale' in ('en', 'ur', 'ar', 'zh') then new.raw_user_meta_data ->> 'locale' else 'en' end
  )
  on conflict (id) do nothing;

  insert into public.legal_acceptances (user_id, terms_version, privacy_version)
  values (new.id, v_terms_version, v_privacy_version)
  on conflict (user_id, terms_version, privacy_version) do nothing;

  return new;
end;
$$;
