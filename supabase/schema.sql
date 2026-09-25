-- Movie Watchlist schema
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run

create table if not exists public.movies (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 200),
  release_year int  check (release_year between 1888 and 2100),
  genre        text,
  status       text not null default 'to_watch' check (status in ('to_watch', 'watched')),
  rating       int  check (rating between 1 and 5),
  notes        text,
  watched_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists movies_user_id_idx on public.movies (user_id);

-- Row Level Security: each user can only see and change their own movies
alter table public.movies enable row level security;

create policy "Users can view their own movies"
  on public.movies for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own movies"
  on public.movies for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own movies"
  on public.movies for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own movies"
  on public.movies for delete
  to authenticated
  using ((select auth.uid()) = user_id);
