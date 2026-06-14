-- Immi — Supabase schema. Run this in the Supabase SQL editor for a fresh project.

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  country_of_origin text,
  visa_type text,
  current_stage text,
  primary_goal text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Conversations table
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text default 'New Conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.conversations enable row level security;
create policy "Users can manage own conversations" on public.conversations for all using (auth.uid() = user_id);

-- Messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy "Users can manage own messages" on public.messages for all
  using (auth.uid() = (select user_id from public.conversations where id = conversation_id));

-- Deadlines table
create table public.deadlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  due_date date,
  status text default 'pending' check (status in ('pending', 'completed', 'overdue')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.deadlines enable row level security;
create policy "Users can manage own deadlines" on public.deadlines for all using (auth.uid() = user_id);

-- Documents checklist table
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  status text default 'needed' check (status in ('needed', 'in_progress', 'complete')),
  category text check (category in ('identity', 'financial', 'employment', 'education', 'legal', 'other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.documents enable row level security;
create policy "Users can manage own documents" on public.documents for all using (auth.uid() = user_id);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at fresh
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.conversations
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.deadlines
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.documents
  for each row execute procedure public.handle_updated_at();

-- Rate limiting / abuse protection (chat endpoint). Mirrors supabase/rate_limits.sql.
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  identity text not null,          -- "user:<uuid>" | "ip:<hash>" | "global:all"
  window_start timestamptz not null,
  count int not null default 0,
  created_at timestamptz default now()
);

create unique index if not exists rate_limits_identity_window_idx
  on public.rate_limits (identity, window_start);

alter table public.rate_limits enable row level security;
-- No policies: only the chat edge function (service role) touches this table.

create or replace function public.increment_rate_limit(
  p_identity text,
  p_window_start timestamptz
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  insert into public.rate_limits (identity, window_start, count)
  values (p_identity, p_window_start, 1)
  on conflict (identity, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

revoke all on function public.increment_rate_limit(text, timestamptz) from public;
grant execute on function public.increment_rate_limit(text, timestamptz) to service_role;
