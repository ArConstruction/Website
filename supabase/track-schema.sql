-- AR Construction contractor tracking portal
-- Run this in the Supabase SQL editor, then create Auth users for the admin
-- and contractors. Insert one row in track_profiles for each Auth user.

create extension if not exists "pgcrypto";

create table if not exists public.track_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'contractor')),
  trade text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  task_type text not null,
  site_name text not null,
  location text,
  description text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'rejected', 'cancelled')),
  assigned_to uuid not null references public.track_profiles(id),
  created_by uuid not null references public.track_profiles(id),
  due_date date,
  completion_name text,
  completion_type text,
  completion_details text,
  admin_review_note text,
  rejected_at timestamptz,
  proof_photo_paths text[] not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_tasks_assigned_to_idx on public.work_tasks(assigned_to);
create index if not exists work_tasks_status_idx on public.work_tasks(status);
create index if not exists work_tasks_due_date_idx on public.work_tasks(due_date);

create or replace function public.is_track_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.track_profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_task_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at = now();
  elsif new.status is distinct from 'completed' then
    new.completed_at = null;
  end if;

  return new;
end;
$$;

create or replace function public.protect_contractor_task_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_track_admin() then
    return new;
  end if;

  if auth.uid() is null or old.assigned_to is distinct from auth.uid() then
    raise exception 'Not authorized';
  end if;

  if new.id is distinct from old.id
    or new.title is distinct from old.title
    or new.task_type is distinct from old.task_type
    or new.site_name is distinct from old.site_name
    or new.location is distinct from old.location
    or new.description is distinct from old.description
    or new.priority is distinct from old.priority
    or new.assigned_to is distinct from old.assigned_to
    or new.created_by is distinct from old.created_by
    or new.due_date is distinct from old.due_date
    or new.admin_review_note is distinct from old.admin_review_note
    or new.rejected_at is distinct from old.rejected_at
    or new.created_at is distinct from old.created_at then
    raise exception 'Contractors can only update completion fields';
  end if;

  if new.status not in ('in_progress', 'completed') then
    raise exception 'Invalid contractor status';
  end if;

  if new.status = 'completed' and (
    coalesce(trim(new.completion_name), '') = ''
    or coalesce(trim(new.completion_type), '') = ''
    or coalesce(trim(new.completion_details), '') = ''
    or coalesce(array_length(new.proof_photo_paths, 1), 0) = 0
  ) then
    raise exception 'Completion name, type, details, and proof photos are required';
  end if;

  return new;
end;
$$;

drop trigger if exists track_profiles_set_updated_at on public.track_profiles;
create trigger track_profiles_set_updated_at
before update on public.track_profiles
for each row execute function public.set_updated_at();

drop trigger if exists work_tasks_set_updated_at on public.work_tasks;
create trigger work_tasks_set_updated_at
before update on public.work_tasks
for each row execute function public.set_updated_at();

drop trigger if exists work_tasks_set_completed_at on public.work_tasks;
create trigger work_tasks_set_completed_at
before update on public.work_tasks
for each row execute function public.set_task_completed_at();

drop trigger if exists work_tasks_protect_contractor_updates on public.work_tasks;
create trigger work_tasks_protect_contractor_updates
before update on public.work_tasks
for each row execute function public.protect_contractor_task_updates();

alter table public.track_profiles enable row level security;
alter table public.work_tasks enable row level security;

drop policy if exists "Authenticated users can read active tracking profiles" on public.track_profiles;
create policy "Authenticated users can read active tracking profiles"
on public.track_profiles for select
to authenticated
using (is_active = true);

drop policy if exists "Admins manage tracking profiles" on public.track_profiles;
create policy "Admins manage tracking profiles"
on public.track_profiles for all
to authenticated
using (public.is_track_admin())
with check (public.is_track_admin());

drop policy if exists "Users can update own contact profile" on public.track_profiles;
create policy "Users can update own contact profile"
on public.track_profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can read all tasks" on public.work_tasks;
create policy "Admins can read all tasks"
on public.work_tasks for select
to authenticated
using (public.is_track_admin());

drop policy if exists "Contractors can read assigned tasks" on public.work_tasks;
create policy "Contractors can read assigned tasks"
on public.work_tasks for select
to authenticated
using (assigned_to = auth.uid());

drop policy if exists "Admins can create tasks" on public.work_tasks;
create policy "Admins can create tasks"
on public.work_tasks for insert
to authenticated
with check (public.is_track_admin() and created_by = auth.uid());

drop policy if exists "Admins can update tasks" on public.work_tasks;
create policy "Admins can update tasks"
on public.work_tasks for update
to authenticated
using (public.is_track_admin())
with check (public.is_track_admin());

drop policy if exists "Contractors can update assigned completion fields" on public.work_tasks;
create policy "Contractors can update assigned completion fields"
on public.work_tasks for update
to authenticated
using (assigned_to = auth.uid() and status <> 'cancelled')
with check (assigned_to = auth.uid() and status in ('in_progress', 'completed'));

insert into storage.buckets (id, name, public)
values ('task-proof-photos', 'task-proof-photos', false)
on conflict (id) do nothing;

drop policy if exists "Track users upload own proof photos" on storage.objects;
create policy "Track users upload own proof photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'task-proof-photos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Track users read permitted proof photos" on storage.objects;
create policy "Track users read permitted proof photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'task-proof-photos'
  and (
    public.is_track_admin()
    or split_part(name, '/', 1) = auth.uid()::text
  )
);
