-- Provenic Phase 1 foundation schema
-- Tenancy: businesses -> business_members. Records belong to exactly one business.
-- Customers access records via customer_id (claimed) or verified matching email.
-- Timeline and audit tables are append-only (no update/delete policies).

create extension if not exists pgcrypto;

-- ---------- Enums ----------
create type public.member_role as enum ('owner', 'admin', 'staff');
create type public.record_type as enum ('purchase', 'booking', 'repair', 'delivery', 'warranty', 'service_agreement', 'other');
create type public.record_status as enum ('draft', 'pending', 'active', 'completed', 'cancelled', 'archived');
create type public.issue_status as enum ('open', 'acknowledged', 'in_progress', 'resolved', 'closed');
create type public.reminder_status as enum ('scheduled', 'done', 'cancelled');
create type public.visibility as enum ('shared', 'internal');
create type public.extraction_state as enum ('pending', 'review', 'confirmed', 'rejected', 'failed');

-- ---------- Tables ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  email text,
  locale text not null default 'en' check (locale in ('en', 'ur', 'ar', 'zh')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  category text check (char_length(category) <= 80),
  contact_email text check (char_length(contact_email) <= 254),
  contact_phone text check (char_length(contact_phone) <= 40),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_members_user_idx on public.business_members(user_id);

create table public.records (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('PRV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.record_type not null,
  title text not null check (char_length(title) between 2 and 160),
  summary text check (char_length(summary) <= 4000),
  terms text check (char_length(terms) <= 10000),
  business_responsibility text check (char_length(business_responsibility) <= 2000),
  customer_responsibility text check (char_length(customer_responsibility) <= 2000),
  status public.record_status not null default 'draft',
  amount numeric(14, 2) check (amount >= 0),
  currency char(3) check (currency ~ '^[A-Z]{3}$'),
  due_date date,
  customer_name text check (char_length(customer_name) <= 120),
  customer_email text check (customer_email = lower(customer_email) and char_length(customer_email) <= 254),
  customer_id uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint amount_requires_currency check (amount is null or currency is not null)
);
create index records_business_status_idx on public.records(business_id, status, updated_at desc);
create index records_customer_idx on public.records(customer_id) where customer_id is not null;
create index records_customer_email_idx on public.records(customer_email) where customer_email is not null;
create index records_due_idx on public.records(due_date) where due_date is not null;

create table public.record_notes (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index record_notes_record_idx on public.record_notes(record_id, created_at desc);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in (
    'created', 'shared', 'status_changed', 'details_updated', 'customer_joined',
    'comment', 'issue_opened', 'issue_status', 'document_added'
  )),
  body text check (char_length(body) <= 4000),
  metadata jsonb not null default '{}'::jsonb,
  visibility public.visibility not null default 'shared',
  created_at timestamptz not null default now()
);
create index timeline_record_idx on public.timeline_events(record_id, created_at desc);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  reporter_id uuid not null references auth.users(id),
  assignee_id uuid references auth.users(id) on delete set null,
  title text not null check (char_length(title) between 2 and 160),
  description text check (char_length(description) <= 4000),
  status public.issue_status not null default 'open',
  response_due date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index issues_record_idx on public.issues(record_id, status);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  remind_at timestamptz not null,
  status public.reminder_status not null default 'scheduled',
  created_at timestamptz not null default now()
);
create index reminders_owner_idx on public.reminders(owner_id, status, remind_at);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null check (char_length(file_name) <= 255),
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  uploaded_by uuid not null references auth.users(id),
  visibility public.visibility not null default 'shared',
  created_at timestamptz not null default now()
);
create index attachments_record_idx on public.attachments(record_id, created_at desc);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null default (now() + interval '30 days'),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index share_links_record_idx on public.share_links(record_id);

create table public.audit_events (
  id bigint generated always as identity primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  created_at timestamptz not null default now()
);
create index audit_business_idx on public.audit_events(business_id, created_at desc);

create table public.data_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('export', 'deletion')),
  status text not null default 'received' check (status in ('received', 'processing', 'completed', 'rejected')),
  created_at timestamptz not null default now()
);

-- Future AI-assisted capture. Candidates remain drafts until a member confirms.
create table public.ai_extraction_jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  source_attachment_id uuid references public.attachments(id) on delete set null,
  record_id uuid references public.records(id) on delete set null,
  requested_by uuid not null references auth.users(id),
  consent_at timestamptz not null,
  state public.extraction_state not null default 'pending',
  provider text,
  model text,
  candidates jsonb not null default '[]'::jsonb,
  confirmed_by uuid references auth.users(id),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Helper functions (security definer, pinned search_path) ----------
create or replace function public.is_member(p_business uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.business_members m where m.business_id = p_business and m.user_id = auth.uid());
$$;

create or replace function public.member_role_of(p_business uuid)
returns public.member_role language sql stable security definer set search_path = '' as $$
  select m.role from public.business_members m where m.business_id = p_business and m.user_id = auth.uid();
$$;

create or replace function public.is_record_member(p_record uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.records r join public.business_members m on m.business_id = r.business_id
    where r.id = p_record and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_record_customer(p_record uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.records r
    where r.id = p_record and r.status <> 'draft'
      and (r.customer_id = auth.uid()
        or (r.customer_email is not null and r.customer_email = lower(coalesce(auth.jwt() ->> 'email', ''))))
  );
$$;

create or replace function public.can_view_record(p_record uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_record_member(p_record) or public.is_record_customer(p_record);
$$;

create or replace function public.customer_sees_business(p_business uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.records r
    where r.business_id = p_business and r.status <> 'draft'
      and (r.customer_id = auth.uid()
        or (r.customer_email is not null and r.customer_email = lower(coalesce(auth.jwt() ->> 'email', ''))))
  );
$$;

create or replace function public.shares_business_with(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.business_members a join public.business_members b on a.business_id = b.business_id
    where a.user_id = auth.uid() and b.user_id = p_user
  );
$$;

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.records enable row level security;
alter table public.record_notes enable row level security;
alter table public.timeline_events enable row level security;
alter table public.issues enable row level security;
alter table public.reminders enable row level security;
alter table public.attachments enable row level security;
alter table public.share_links enable row level security;
alter table public.audit_events enable row level security;
alter table public.data_requests enable row level security;
alter table public.ai_extraction_jobs enable row level security;

create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.shares_business_with(id));
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create policy businesses_select on public.businesses for select
  using (public.is_member(id) or public.customer_sees_business(id));
create policy businesses_update on public.businesses for update
  using (public.member_role_of(id) in ('owner', 'admin'))
  with check (public.member_role_of(id) in ('owner', 'admin'));

create policy members_select on public.business_members for select
  using (public.is_member(business_id));
create policy members_update on public.business_members for update
  using (public.member_role_of(business_id) in ('owner', 'admin') and role <> 'owner')
  with check (role <> 'owner');
create policy members_delete on public.business_members for delete
  using (public.member_role_of(business_id) in ('owner', 'admin') and role <> 'owner');

create policy records_select on public.records for select
  using (
    public.is_member(business_id)
    or (status <> 'draft' and (customer_id = auth.uid()
      or (customer_email is not null and customer_email = lower(coalesce(auth.jwt() ->> 'email', '')))))
  );
create policy records_insert on public.records for insert
  with check (public.is_member(business_id) and created_by = auth.uid());
create policy records_update on public.records for update
  using (public.is_member(business_id)) with check (public.is_member(business_id));

create policy notes_select on public.record_notes for select using (public.is_record_member(record_id));
create policy notes_insert on public.record_notes for insert
  with check (author_id = auth.uid() and public.is_record_member(record_id));

create policy timeline_select on public.timeline_events for select
  using (public.is_record_member(record_id) or (visibility = 'shared' and public.is_record_customer(record_id)));
create policy timeline_insert on public.timeline_events for insert
  with check (
    actor_id = auth.uid() and event_type = 'comment'
    and (public.is_record_member(record_id) or (visibility = 'shared' and public.is_record_customer(record_id)))
  );

create policy issues_select on public.issues for select using (public.can_view_record(record_id));
create policy issues_insert on public.issues for insert
  with check (reporter_id = auth.uid() and public.can_view_record(record_id));
create policy issues_update on public.issues for update
  using (public.can_view_record(record_id)) with check (public.can_view_record(record_id));

create policy reminders_all on public.reminders for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and public.can_view_record(record_id));

create policy attachments_select on public.attachments for select
  using (public.is_record_member(record_id) or (visibility = 'shared' and public.is_record_customer(record_id)));
create policy attachments_insert on public.attachments for insert
  with check (
    uploaded_by = auth.uid()
    and (public.is_record_member(record_id) or (visibility = 'shared' and public.is_record_customer(record_id)))
  );
create policy attachments_delete on public.attachments for delete
  using (uploaded_by = auth.uid());

create policy share_links_select on public.share_links for select using (public.is_record_member(record_id));
create policy share_links_insert on public.share_links for insert
  with check (created_by = auth.uid() and public.is_record_member(record_id));
create policy share_links_update on public.share_links for update
  using (public.is_record_member(record_id)) with check (public.is_record_member(record_id));

create policy audit_select on public.audit_events for select
  using (public.member_role_of(business_id) in ('owner', 'admin'));

create policy data_requests_select on public.data_requests for select using (user_id = auth.uid());
create policy data_requests_insert on public.data_requests for insert with check (user_id = auth.uid());

create policy ai_jobs_all on public.ai_extraction_jobs for all
  using (public.is_member(business_id))
  with check (public.is_member(business_id) and requested_by = auth.uid());

-- ---------- Triggers ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger businesses_touch before update on public.businesses for each row execute function public.touch_updated_at();
create trigger records_touch before update on public.records for each row execute function public.touch_updated_at();
create trigger issues_touch before update on public.issues for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, email, locale)
  values (
    new.id,
    nullif(left(new.raw_user_meta_data ->> 'full_name', 120), ''),
    lower(new.email),
    case when new.raw_user_meta_data ->> 'locale' in ('en', 'ur', 'ar', 'zh') then new.raw_user_meta_data ->> 'locale' else 'en' end
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent members from moving records between tenants or rewriting authorship.
create or replace function public.guard_record_update()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.business_id <> old.business_id or new.created_by <> old.created_by
     or new.reference <> old.reference or new.created_at <> old.created_at then
    raise exception 'immutable_record_fields';
  end if;
  return new;
end; $$;
create trigger records_guard before update on public.records for each row execute function public.guard_record_update();

create or replace function public.record_events()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  changed text[] := '{}';
begin
  if tg_op = 'INSERT' then
    insert into public.timeline_events (record_id, actor_id, event_type, metadata)
    values (new.id, auth.uid(), 'created', jsonb_build_object('status', new.status));
    insert into public.audit_events (business_id, actor_id, action, target_type, target_id)
    values (new.business_id, auth.uid(), 'record.created', 'record', new.id);
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.timeline_events (record_id, actor_id, event_type, metadata)
    values (new.id, auth.uid(), 'status_changed', jsonb_build_object('from', old.status, 'to', new.status));
  end if;

  if new.title is distinct from old.title then changed := changed || 'title'; end if;
  if new.summary is distinct from old.summary then changed := changed || 'summary'; end if;
  if new.terms is distinct from old.terms then changed := changed || 'terms'; end if;
  if new.amount is distinct from old.amount or new.currency is distinct from old.currency then changed := changed || 'amount'; end if;
  if new.due_date is distinct from old.due_date then changed := changed || 'due_date'; end if;
  if new.business_responsibility is distinct from old.business_responsibility
     or new.customer_responsibility is distinct from old.customer_responsibility then changed := changed || 'responsibilities'; end if;

  if array_length(changed, 1) > 0 then
    insert into public.timeline_events (record_id, actor_id, event_type, metadata)
    values (new.id, auth.uid(), 'details_updated', jsonb_build_object('fields', to_jsonb(changed)));
  end if;

  if old.customer_id is null and new.customer_id is not null then
    insert into public.timeline_events (record_id, actor_id, event_type) values (new.id, new.customer_id, 'customer_joined');
  end if;

  insert into public.audit_events (business_id, actor_id, action, target_type, target_id)
  values (new.business_id, auth.uid(), 'record.updated', 'record', new.id);
  return new;
end; $$;
create trigger records_events after insert or update on public.records for each row execute function public.record_events();

create or replace function public.issue_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.timeline_events (record_id, actor_id, event_type, metadata)
    values (new.record_id, auth.uid(), 'issue_opened', jsonb_build_object('issue_id', new.id, 'title', new.title));
  elsif new.status is distinct from old.status then
    insert into public.timeline_events (record_id, actor_id, event_type, metadata)
    values (new.record_id, auth.uid(), 'issue_status', jsonb_build_object('issue_id', new.id, 'title', new.title, 'from', old.status, 'to', new.status));
  end if;
  return new;
end; $$;
create trigger issues_events after insert or update on public.issues for each row execute function public.issue_events();

create or replace function public.attachment_events()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.timeline_events (record_id, actor_id, event_type, metadata, visibility)
  values (new.record_id, auth.uid(), 'document_added', jsonb_build_object('file_name', new.file_name), new.visibility);
  return new;
end; $$;
create trigger attachments_events after insert on public.attachments for each row execute function public.attachment_events();

create or replace function public.member_audit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_events (business_id, actor_id, action, target_type, target_id)
  values (coalesce(new.business_id, old.business_id), auth.uid(), 'member.' || lower(tg_op), 'user', coalesce(new.user_id, old.user_id));
  return coalesce(new, old);
end; $$;
create trigger members_audit after insert or update or delete on public.business_members for each row execute function public.member_audit();

-- ---------- RPCs ----------
create or replace function public.create_business(p_name text, p_category text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  insert into public.businesses (name, category, created_by)
  values (trim(p_name), nullif(trim(p_category), ''), auth.uid()) returning id into v_id;
  insert into public.business_members (business_id, user_id, role) values (v_id, auth.uid(), 'owner');
  return v_id;
end; $$;

create or replace function public.add_business_member(p_business uuid, p_email text, p_role public.member_role)
returns text language plpgsql security definer set search_path = '' as $$
declare v_user uuid;
begin
  if public.member_role_of(p_business) not in ('owner', 'admin') then raise exception 'forbidden'; end if;
  if p_role = 'owner' then raise exception 'forbidden'; end if;
  select u.id into v_user from auth.users u where lower(u.email) = lower(trim(p_email)) and u.email_confirmed_at is not null;
  if v_user is null then return 'not_found'; end if;
  insert into public.business_members (business_id, user_id, role) values (p_business, v_user, p_role)
  on conflict (business_id, user_id) do nothing;
  return 'added';
end; $$;

create or replace function public.claim_shared_record(p_token text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_link public.share_links%rowtype;
  v_record public.records%rowtype;
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into v_link from public.share_links where token = p_token;
  if v_link.id is null or v_link.revoked_at is not null or v_link.expires_at < now() then
    raise exception 'invalid_link';
  end if;
  select * into v_record from public.records where id = v_link.record_id;
  if v_record.status = 'draft' then raise exception 'invalid_link'; end if;
  if v_record.customer_id = auth.uid() then return v_record.id; end if;
  if v_record.customer_id is not null then raise exception 'already_claimed'; end if;
  if v_record.customer_email is not null and v_record.customer_email <> v_email then raise exception 'email_mismatch'; end if;
  update public.records set customer_id = auth.uid() where id = v_record.id;
  return v_record.id;
end; $$;

revoke execute on function public.create_business(text, text) from anon;
revoke execute on function public.add_business_member(uuid, text, public.member_role) from anon;
revoke execute on function public.claim_shared_record(text) from anon;

-- ---------- Private storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('record-files', 'record-files', false, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain'])
on conflict (id) do nothing;

create policy record_files_select on storage.objects for select to authenticated
  using (bucket_id = 'record-files' and exists (select 1 from public.attachments a where a.storage_path = storage.objects.name));
create policy record_files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'record-files' and owner = auth.uid() and public.can_view_record(((storage.foldername(name))[1])::uuid));
create policy record_files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'record-files' and owner = auth.uid());
