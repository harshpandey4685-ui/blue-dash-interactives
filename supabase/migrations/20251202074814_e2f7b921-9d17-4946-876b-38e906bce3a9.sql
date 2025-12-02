-- Create profiles table for user info
create table if not exists public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null unique,
  full_name text,
  bio text,
  avatar_url text,
  skills text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create posts table for blog posts
create table if not exists public.posts (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  title text not null,
  content text,
  tags text[] not null default '{}'::text[],
  cover_image text,
  published boolean not null default false,
  likes integer not null default 0,
  comments integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on posts
drop policy if exists "Public can view published posts" on public.posts;
drop policy if exists "Users can manage their own posts" on public.posts;
alter table public.posts enable row level security;

create policy "Public can view published posts"
  on public.posts
  for select
  using (published = true);

create policy "Users can manage their own posts"
  on public.posts
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Shared updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public;

-- Attach triggers to keep updated_at fresh
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
  before update on public.posts
  for each row
  execute procedure public.handle_updated_at();
