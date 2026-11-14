-- Prevent privileged users from moving membership rows across tenant boundaries.
drop policy if exists members_update on public.business_members;

-- Customers may update the status of issues they reported; business members may
-- update issues in their workspace. Identity and issue content remain immutable.
drop policy if exists issues_update on public.issues;
create policy issues_update on public.issues for update
  using (public.is_record_member(record_id) or reporter_id = auth.uid())
  with check (public.is_record_member(record_id) or reporter_id = auth.uid());

create or replace function public.guard_record_update()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.business_id is distinct from old.business_id
     or new.created_by is distinct from old.created_by
     or new.reference is distinct from old.reference
     or new.created_at is distinct from old.created_at then
    raise exception 'immutable_record_fields';
  end if;

  if new.status is distinct from old.status and not (
    (old.status = 'draft' and new.status in ('pending', 'cancelled'))
    or (old.status = 'pending' and new.status in ('active', 'cancelled'))
    or (old.status = 'active' and new.status in ('completed', 'cancelled'))
    or (old.status = 'completed' and new.status in ('active', 'archived'))
    or (old.status = 'cancelled' and new.status = 'archived')
  ) then
    raise exception 'invalid_record_transition';
  end if;

  return new;
end;
$$;

create or replace function public.guard_issue_update()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id
     or new.record_id is distinct from old.record_id
     or new.reporter_id is distinct from old.reporter_id
     or new.assignee_id is distinct from old.assignee_id
     or new.title is distinct from old.title
     or new.description is distinct from old.description
     or new.response_due is distinct from old.response_due
     or new.created_at is distinct from old.created_at then
    raise exception 'immutable_issue_fields';
  end if;

  if new.status is distinct from old.status and not (
    (old.status = 'open' and new.status in ('acknowledged', 'in_progress', 'resolved'))
    or (old.status = 'acknowledged' and new.status in ('in_progress', 'resolved'))
    or (old.status = 'in_progress' and new.status = 'resolved')
    or (old.status = 'resolved' and new.status in ('closed', 'open'))
    or (old.status = 'closed' and new.status = 'open')
  ) then
    raise exception 'invalid_issue_transition';
  end if;

  return new;
end;
$$;

drop trigger if exists issues_guard_update on public.issues;
create trigger issues_guard_update before update on public.issues
  for each row execute function public.guard_issue_update();

-- Membership helpers are only needed by signed-in policies and actions.
revoke execute on function public.is_member(uuid) from public, anon;
revoke execute on function public.member_role_of(uuid) from public, anon;
revoke execute on function public.is_record_member(uuid) from public, anon;
revoke execute on function public.is_record_customer(uuid) from public, anon;
revoke execute on function public.can_view_record(uuid) from public, anon;
revoke execute on function public.customer_sees_business(uuid) from public, anon;
revoke execute on function public.shares_business_with(uuid) from public, anon;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.member_role_of(uuid) to authenticated;
grant execute on function public.is_record_member(uuid) to authenticated;
grant execute on function public.is_record_customer(uuid) to authenticated;
grant execute on function public.can_view_record(uuid) to authenticated;
grant execute on function public.customer_sees_business(uuid) to authenticated;
grant execute on function public.shares_business_with(uuid) to authenticated;
