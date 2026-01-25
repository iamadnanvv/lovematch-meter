-- Create anonymized supporter events table (used only via backend function)
create table if not exists public.supporter_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip_hash text not null,
  ua_hash text not null
);

create index if not exists supporter_events_created_at_idx on public.supporter_events (created_at desc);
create index if not exists supporter_events_ip_hash_idx on public.supporter_events (ip_hash);

alter table public.supporter_events enable row level security;

-- Deny all direct access from clients; backend function will use service privileges.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'supporter_events' and policyname = 'No direct select on supporter_events'
  ) then
    create policy "No direct select on supporter_events"
    on public.supporter_events
    for select
    using (false);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'supporter_events' and policyname = 'No direct insert on supporter_events'
  ) then
    create policy "No direct insert on supporter_events"
    on public.supporter_events
    for insert
    with check (false);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'supporter_events' and policyname = 'No direct update on supporter_events'
  ) then
    create policy "No direct update on supporter_events"
    on public.supporter_events
    for update
    using (false);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'supporter_events' and policyname = 'No direct delete on supporter_events'
  ) then
    create policy "No direct delete on supporter_events"
    on public.supporter_events
    for delete
    using (false);
  end if;
end $$;