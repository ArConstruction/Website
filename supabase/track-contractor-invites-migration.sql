-- Optional legacy migration for contractor invites stored in Postgres.
-- The app now stores pending invites in the private Supabase Storage bucket
-- `track-contractor-invites` (`pending-invites.json`), which is created automatically.
-- Only run this if you prefer database-backed invites instead of storage.

create table if not exists public.track_contractor_invites (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  trade text not null,
  email text,
  phone text,
  claimed_at timestamptz,
  claimed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint track_contractor_invites_contact_check check (
    nullif(trim(coalesce(email, '')), '') is not null
    or nullif(trim(coalesce(phone, '')), '') is not null
  )
);

create index if not exists track_contractor_invites_unclaimed_email_idx
  on public.track_contractor_invites (lower(email))
  where claimed_at is null and email is not null;

alter table public.track_contractor_invites enable row level security;

create policy "Admins can manage contractor invites"
  on public.track_contractor_invites
  for all
  using (public.is_track_admin())
  with check (public.is_track_admin());
