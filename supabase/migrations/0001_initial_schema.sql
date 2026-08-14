-- ByMean — Initial Schema
-- Migration: 0001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles: one per auth user
create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  display_name  text,
  email         text,
  role          text not null default 'couple' check (role in ('couple', 'admin')),
  created_at    timestamptz not null default now()
);

-- templates: managed by admin
create table public.templates (
  id            text primary key,            -- e.g. 'classic-islami'
  name          text not null,
  category      text not null,              -- 'Islami' | 'Jawa' | 'Modern' | 'Floral' | etc.
  tier          text not null default 'free' check (tier in ('free', 'paid', 'premium')),
  preview_url   text,
  default_theme jsonb not null default '{}',
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- weddings: one per couple (MVP)
create table public.weddings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles on delete cascade,
  slug            text not null unique,
  template_id     text not null references public.templates,
  tier            text not null default 'free' check (tier in ('free', 'paid', 'premium')),
  content         jsonb not null default '{}',
  theme           jsonb not null default '{}',
  status          text not null default 'draft' check (status in ('draft', 'pending_payment', 'published')),
  couple_names    text,
  wedding_date    date,
  custom_domain   text unique,               -- Phase 5+
  domain_verified boolean not null default false, -- Phase 5+
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- guests: per wedding
create table public.guests (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid not null references public.weddings on delete cascade,
  name        text not null,
  phone       text,
  link_token  text unique default encode(gen_random_bytes(8), 'hex'),
  checked_in  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- rsvps: submitted by guests
create table public.rsvps (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid not null references public.weddings on delete cascade,
  guest_name  text not null,
  attendance  text not null check (attendance in ('hadir', 'tidak', 'ragu')),
  guest_count int not null default 1,
  created_at  timestamptz not null default now()
);

-- messages: ucapan & doa from guests
create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid not null references public.weddings on delete cascade,
  name        text not null,
  message     text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- gift_accounts: amplop digital config per wedding
create table public.gift_accounts (
  id              uuid primary key default uuid_generate_v4(),
  wedding_id      uuid not null references public.weddings on delete cascade,
  type            text not null check (type in ('bank', 'ewallet', 'qris')),
  label           text not null,        -- e.g. 'BCA', 'GoPay'
  account_number  text,
  qris_url        text,
  created_at      timestamptz not null default now()
);

-- payments: one per published wedding (MVP: manual proof upload)
create table public.payments (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid not null references public.weddings on delete cascade,
  amount      int not null,             -- IDR
  channel     text not null default 'manual',
  status      text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  proof_url   text,                     -- MVP: bukti transfer image in Supabase Storage
  tripay_ref  text,                     -- Phase 4+
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────

create index on public.weddings (user_id);
create index on public.weddings (slug);
create index on public.weddings (custom_domain);
create index on public.guests (wedding_id);
create index on public.guests (link_token);
create index on public.rsvps (wedding_id);
create index on public.messages (wedding_id);
create index on public.gift_accounts (wedding_id);
create index on public.payments (wedding_id);

-- ─── updated_at trigger ─────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger weddings_updated_at
  before update on public.weddings
  for each row execute function public.handle_updated_at();

-- ─── Auto-create profile on signup ──────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ──────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.weddings     enable row level security;
alter table public.guests       enable row level security;
alter table public.rsvps        enable row level security;
alter table public.messages     enable row level security;
alter table public.gift_accounts enable row level security;
alter table public.payments     enable row level security;
alter table public.templates    enable row level security;

-- profiles: own row only
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- templates: anyone can read active templates
create policy "templates: read active" on public.templates
  for select using (active = true);

-- templates: admin full access
create policy "templates: admin write" on public.templates
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- weddings: couple owns their wedding
create policy "weddings: own" on public.weddings
  for all using (auth.uid() = user_id);

-- weddings: guests can read published weddings (for public invitation page)
create policy "weddings: read published" on public.weddings
  for select using (status = 'published');

-- weddings: admin full access
create policy "weddings: admin" on public.weddings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- guests: couple manages their guests
create policy "guests: couple owns" on public.guests
  for all using (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- rsvps: anyone can insert (guests submit RSVP without auth)
create policy "rsvps: anyone insert" on public.rsvps
  for insert with check (true);

create policy "rsvps: couple reads own" on public.rsvps
  for select using (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- messages: anyone can insert
create policy "messages: anyone insert" on public.messages
  for insert with check (true);

create policy "messages: couple manages" on public.messages
  for all using (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- messages: guests can read approved messages
create policy "messages: read approved" on public.messages
  for select using (approved = true);

-- gift_accounts: couple manages
create policy "gift_accounts: couple owns" on public.gift_accounts
  for all using (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- gift_accounts: guests can read (to send gifts)
create policy "gift_accounts: read published wedding" on public.gift_accounts
  for select using (
    exists (select 1 from public.weddings where id = wedding_id and status = 'published')
  );

-- payments: couple reads own
create policy "payments: couple reads own" on public.payments
  for select using (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- payments: couple inserts (uploading proof)
create policy "payments: couple inserts" on public.payments
  for insert with check (
    exists (select 1 from public.weddings where id = wedding_id and user_id = auth.uid())
  );

-- payments: admin full access
create policy "payments: admin" on public.payments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── Seed: starter templates ─────────────────────────────────────────────────

insert into public.templates (id, name, category, tier, preview_url, default_theme) values
  ('classic-islami', 'Classic Islami', 'Islami', 'free',    '/templates/classic-islami/preview.png',  '{"primaryColor":"#2d6a4f","fontHeading":"Playfair Display","fontBody":"Lato"}'),
  ('modern-minimal', 'Modern Minimal', 'Modern', 'paid',    '/templates/modern-minimal/preview.png',   '{"primaryColor":"#1a1a2e","fontHeading":"Inter","fontBody":"Inter"}'),
  ('floral-sunda',   'Floral Sunda',   'Sunda',  'premium', '/templates/floral-sunda/preview.png',    '{"primaryColor":"#c77dff","fontHeading":"Cormorant Garamond","fontBody":"Nunito"}');
