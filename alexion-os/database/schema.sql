-- ============================================================
-- ALEXION OS — DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
create table if not exists public.users (
  id               uuid primary key references auth.users(id) on delete cascade,
  username         text not null unique,
  display_name     text not null,
  alexion_email    text not null unique,         -- username@alexion.com (auto-generated)
  country          text not null,
  avatar_url       text,                          -- Supabase Storage path
  storage_used     bigint not null default 0,     -- bytes
  storage_limit    bigint not null default 5368709120, -- 5 GB default
  status           text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  theme            text not null default 'dark'   check (theme in ('dark', 'light')),
  wallpaper        text,
  last_login       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
create table if not exists public.settings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  accent_color     text not null default '#6366f1',
  language         text not null default 'en',
  timezone         text not null default 'UTC',
  notifications    boolean not null default true,
  animations       boolean not null default true,
  animation_speed  text not null default 'normal' check (animation_speed in ('slow', 'normal', 'fast')),
  accessibility    jsonb not null default '{}',
  privacy          jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id)
);

-- ============================================================
-- SESSIONS TABLE (activity tracking)
-- ============================================================
create table if not exists public.sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  ip_address       inet,
  user_agent       text,
  created_at       timestamptz not null default now(),
  expires_at       timestamptz
);

-- ============================================================
-- ACTIVITY LOGS TABLE
-- ============================================================
create table if not exists public.activity_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.users(id) on delete set null,
  action           text not null,
  metadata         jsonb not null default '{}',
  ip_address       inet,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_users_username      on public.users(username);
create index if not exists idx_users_alexion_email on public.users(alexion_email);
create index if not exists idx_sessions_user_id    on public.sessions(user_id);
create index if not exists idx_activity_logs_user  on public.activity_logs(user_id);
create index if not exists idx_activity_logs_time  on public.activity_logs(created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger settings_updated_at
  before update on public.settings
  for each row execute function public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- Fires after a new auth.users row is inserted by Supabase Auth
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  _username     text;
  _display_name text;
  _country      text;
  _avatar_url   text;
begin
  _username     := new.raw_user_meta_data->>'username';
  _display_name := new.raw_user_meta_data->>'display_name';
  _country      := new.raw_user_meta_data->>'country';
  _avatar_url   := new.raw_user_meta_data->>'avatar_url';

  insert into public.users (id, username, display_name, alexion_email, country, avatar_url)
  values (
    new.id,
    _username,
    _display_name,
    _username || '@alexion.com',
    _country,
    _avatar_url
  );

  -- Also create default settings row
  insert into public.settings (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- USERS
alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- SETTINGS
alter table public.settings enable row level security;

create policy "Users can view their own settings"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- SESSIONS
alter table public.sessions enable row level security;

create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

-- ACTIVITY LOGS (read-only for users)
alter table public.activity_logs enable row level security;

create policy "Users can view their own activity"
  on public.activity_logs for select
  using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET (for avatars)
-- Run this separately if needed via Supabase Dashboard → Storage
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('avatars', 'avatars', true)
-- on conflict do nothing;

-- Storage policy: users can upload/update their own avatar
-- create policy "Avatar upload"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
