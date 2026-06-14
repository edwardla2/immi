-- Immi — rate limiting / abuse protection.
-- Run this in the Supabase SQL editor (it's also folded into schema.sql for fresh setups).
-- Safe to run on an existing project: everything is "if not exists" / "or replace".

-- Per-identity, per-window request counters. "identity" is "user:<uuid>",
-- "ip:<hash>", or "global:all". Only the chat edge function (service role)
-- ever touches this table — no public RLS policies, so it's invisible to clients.
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
-- Intentionally no policies: RLS-on with zero policies denies all anon/authenticated
-- access. The edge function uses the service role, which bypasses RLS.

-- Atomic "increment this counter and tell me the new value". Doing this in one
-- statement (rather than select-then-update from the function) avoids races when
-- requests land concurrently. Returns the post-increment count.
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

-- Lock the RPC down: only the service role (the edge function) may call it, so a
-- signed-in user can't inflate another identity's counter from the client.
revoke all on function public.increment_rate_limit(text, timestamptz) from public;
grant execute on function public.increment_rate_limit(text, timestamptz) to service_role;

-- Optional housekeeping: old windows are harmless but accumulate. To prune, run
-- periodically (or via a scheduled job):
--   delete from public.rate_limits where window_start < now() - interval '2 days';
