alter table public.work_tasks
add column if not exists admin_review_note text,
add column if not exists rejected_at timestamptz;

alter table public.work_tasks
drop constraint if exists work_tasks_status_check;

alter table public.work_tasks
add constraint work_tasks_status_check
check (status in ('open', 'in_progress', 'completed', 'rejected', 'cancelled'));

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
