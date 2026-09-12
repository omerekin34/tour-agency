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

alter table tour_applications enable row level security;
alter table contact_messages enable row level security;

-- API service role key ile erişir; public erişim kapalı.
