-- Create quiz sessions table for remote play feature
create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  share_code text unique not null,
  player1_name text not null,
  player2_name text,
  selected_categories text[] not null default '{}',
  player1_answers integer[] not null default '{}',
  player2_answers integer[],
  status text not null default 'waiting' check (status in ('waiting', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists quiz_sessions_share_code_idx on public.quiz_sessions (share_code);
create index if not exists quiz_sessions_created_at_idx on public.quiz_sessions (created_at desc);

alter table public.quiz_sessions enable row level security;

-- Allow anyone to read sessions by share code (needed for joining)
create policy "Anyone can read quiz sessions by share code"
on public.quiz_sessions
for select
using (true);

-- Allow anyone to insert new sessions (no auth required for this game)
create policy "Anyone can create quiz sessions"
on public.quiz_sessions
for insert
with check (true);

-- Allow anyone to update sessions (for joining and completing)
create policy "Anyone can update quiz sessions"
on public.quiz_sessions
for update
using (true);