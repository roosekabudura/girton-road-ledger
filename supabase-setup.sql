-- Run this once in Supabase: SQL Editor > New query > paste > Run.

-- Who is allowed in. Only these people can read; only 'admin' can write.
create table if not exists public.members (
  email text primary key,
  role  text not null default 'viewer' check (role in ('admin', 'viewer'))
);

-- The shared data: one row each for ledger, contractors, quotes, settings.
create table if not exists public.blobs (
  name       text primary key,
  version    text not null,
  meta       jsonb not null default '{}'::jsonb,
  data       jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.blobs   enable row level security;

create policy "members can see their own row" on public.members
  for select to authenticated
  using (email = (auth.jwt() ->> 'email'));

create policy "members can read data" on public.blobs
  for select to authenticated
  using (exists (select 1 from public.members m where m.email = (auth.jwt() ->> 'email')));

create policy "admin can add data" on public.blobs
  for insert to authenticated
  with check (exists (select 1 from public.members m where m.email = (auth.jwt() ->> 'email') and m.role = 'admin'));

create policy "admin can change data" on public.blobs
  for update to authenticated
  using      (exists (select 1 from public.members m where m.email = (auth.jwt() ->> 'email') and m.role = 'admin'))
  with check (exists (select 1 from public.members m where m.email = (auth.jwt() ->> 'email') and m.role = 'admin'));

create policy "admin can delete data" on public.blobs
  for delete to authenticated
  using (exists (select 1 from public.members m where m.email = (auth.jwt() ->> 'email') and m.role = 'admin'));

-- The people (edit this list if you like; see CLOUD-SETUP.md to add someone later).
insert into public.members (email, role) values
  ('admin@girton-ledger.app',    'admin'),
  ('leonard@girton-ledger.app',  'viewer'),
  ('potiphar@girton-ledger.app', 'viewer'),
  ('rtm@girton-ledger.app',      'viewer')
on conflict (email) do nothing;

-- Let phones be told instantly when you publish new data.
alter publication supabase_realtime add table public.blobs;
