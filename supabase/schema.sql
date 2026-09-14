-- Supabase SQL Editor'da çalıştırın (Dashboard → SQL → New query)

create table if not exists tour_applications (
  id text primary key,
  created_at timestamptz not null default now(),
  tour_id text not null,
  tour_title text not null,
  tour_date text not null,
  tour_price text not null,
  name text not null,
  phone text not null,
  email text not null,
  travelers text not null,
  room_type text not null,
  notes text not null default '',
  status text not null default 'yeni'
    check (status in ('yeni', 'incelendi', 'tamamlandi'))
);

create table if not exists contact_messages (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default 'Tur Bilgi Talebi',
  message text not null,
  status text not null default 'yeni'
    check (status in ('yeni', 'okundu', 'yanitlandi'))
);

create index if not exists tour_applications_created_at_idx
  on tour_applications (created_at desc);

create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

create table if not exists tours (
  id text primary key,
  title text not null,
  destination text not null,
  category text not null,
  date text not null,
  price numeric not null,
  currency text not null check (currency in ('USD', 'EUR', 'TRY')),
  days int not null,
  image text not null,
  capacity int not null,
  transport text not null,
  accommodation text not null,
  featured boolean not null default false,
  published boolean not null default true,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  video_url text not null default '',
  includes jsonb not null default '[]'::jsonb,
  excludes jsonb not null default '[]'::jsonb,
  departures jsonb not null default '["istanbul"]'::jsonb,
  visa_types jsonb not null default '["vizeli"]'::jsonb
);

-- Mevcut tours tablosu için (bir kez çalıştırın):
-- alter table tours add column if not exists departures jsonb not null default '["istanbul"]'::jsonb;
-- alter table tours add column if not exists visa_types jsonb not null default '["vizeli"]'::jsonb;

create index if not exists tours_date_idx on tours (date);
create index if not exists tours_category_idx on tours (category);

create table if not exists regions (
  id text primary key,
  name text not null,
  card_label text not null,
  home_title text not null default '',
  home_variant text not null default 'light'
    check (home_variant in ('light', 'dark')),
  sort_order int not null default 0,
  published boolean not null default true,
  show_on_home boolean not null default true,
  show_in_search boolean not null default true,
  show_in_hero boolean not null default false,
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_price text not null default '',
  hero_period text not null default '',
  hero_image text not null default '',
  icon text not null default 'map-pinned'
);

create index if not exists regions_sort_order_idx on regions (sort_order);

create table if not exists gallery_items (
  id text primary key,
  created_at timestamptz not null default now(),
  tour_id text not null,
  tour_title text not null,
  category text not null,
  type text not null check (type in ('photo', 'video')),
  url text not null,
  title text not null
);

create index if not exists gallery_items_created_at_idx
  on gallery_items (created_at desc);

create index if not exists gallery_items_tour_id_idx
  on gallery_items (tour_id);

-- Medya yükleme (admin Dosya Seç) için Storage bucket:
-- Dashboard → Storage → New bucket → ad: media → Public bucket: ON
-- veya SQL:
-- insert into storage.buckets (id, name, public) values ('media', 'media', true)
-- on conflict (id) do update set public = true;

alter table tour_applications enable row level security;
alter table contact_messages enable row level security;
alter table gallery_items enable row level security;
alter table tours enable row level security;
alter table regions enable row level security;

-- API service role key ile erişir; public erişim kapalı.
