-- =====================================================
-- CuscoTours v2 — Initial Schema
-- Pegar este archivo en: Supabase Dashboard → SQL Editor → New Query → Run
-- =====================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- Clean slate (so this file can be re-run safely)
drop table if exists public.subscribers     cascade;
drop table if exists public.inquiries       cascade;
drop table if exists public.reviews         cascade;
drop table if exists public.bookings        cascade;
drop table if exists public.tour_availability cascade;
drop table if exists public.tour_itinerary  cascade;
drop table if exists public.tours           cascade;
drop table if exists public.categories      cascade;
drop table if exists public.settings        cascade;
drop table if exists public.profiles        cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user()       cascade;
drop function if exists public.touch_updated_at()      cascade;
drop function if exists public.recompute_tour_rating() cascade;

-- =====================================================
-- 1. PROFILES (extiende auth.users)
-- =====================================================
create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  full_name    text,
  phone        text,
  avatar_url   text,
  locale       text default 'es',
  is_admin     boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- 2. CATEGORIES (Cusco, Valle Sagrado, Camino Inca, etc.)
-- =====================================================
create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         jsonb not null,            -- {"es":"Cusco", "en":"Cusco"}
  description  jsonb,
  cover_image  text,
  icon         text,
  sort_order   int default 0,
  is_published boolean default true,
  created_at   timestamptz default now()
);

-- =====================================================
-- 3. TOURS (entidad principal)
-- =====================================================
create table public.tours (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category_id     uuid references public.categories on delete set null,

  -- Multi-idioma
  title           jsonb not null,         -- {"es":"...", "en":"..."}
  subtitle        jsonb,
  short_desc      jsonb,
  description     jsonb,

  -- Media
  cover_image     text,
  gallery         jsonb default '[]'::jsonb,   -- [{"url":"...", "alt":"..."}]
  video_url       text,

  -- Logistics
  duration_days   int default 1,
  duration_label  jsonb,                  -- {"es":"5 días/4 noches"}
  difficulty      text check (difficulty in ('easy','moderate','challenging','expert')),
  max_group_size  int default 12,
  min_age         int default 0,
  altitude_max    int,                    -- metros sobre el nivel del mar
  starting_point  jsonb,                  -- {"es":"Cusco","coords":{"lat":-13.5,"lng":-71.97}}

  -- Pricing
  price_usd       numeric(10,2) not null,
  price_pen       numeric(10,2),
  discount_pct    int default 0 check (discount_pct between 0 and 100),

  -- Lists (multi-idioma)
  highlights      jsonb default '[]'::jsonb,
  includes        jsonb default '[]'::jsonb,
  excludes        jsonb default '[]'::jsonb,
  what_to_bring   jsonb default '[]'::jsonb,

  -- Stats
  rating          numeric(2,1) default 5.0,
  reviews_count   int default 0,
  bookings_count  int default 0,

  -- Flags
  is_featured     boolean default false,
  is_published    boolean default false,

  -- SEO
  meta_title      jsonb,
  meta_description jsonb,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index tours_slug_idx       on public.tours(slug);
create index tours_category_idx   on public.tours(category_id);
create index tours_published_idx  on public.tours(is_published) where is_published = true;
create index tours_featured_idx   on public.tours(is_featured)  where is_featured  = true;

-- =====================================================
-- 4. TOUR ITINERARY (día por día)
-- =====================================================
create table public.tour_itinerary (
  id            uuid primary key default gen_random_uuid(),
  tour_id       uuid not null references public.tours on delete cascade,
  day_number    int  not null,
  title         jsonb not null,
  description   jsonb,
  meals         jsonb default '[]'::jsonb,        -- ["breakfast","lunch","dinner"]
  accommodation jsonb,
  activities    jsonb default '[]'::jsonb,
  image         text,
  unique(tour_id, day_number)
);

-- =====================================================
-- 5. AVAILABILITY (calendario de cupos)
-- =====================================================
create table public.tour_availability (
  id             uuid primary key default gen_random_uuid(),
  tour_id        uuid not null references public.tours on delete cascade,
  date           date not null,
  total_spots    int  not null,
  booked_spots   int  default 0,
  price_override numeric(10,2),
  status         text default 'open' check (status in ('open','closed','sold_out')),
  unique(tour_id, date)
);

create index avail_tour_date_idx on public.tour_availability(tour_id, date);

-- =====================================================
-- 6. BOOKINGS (reservas)
-- =====================================================
create table public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  booking_code          text unique not null default upper(substr(md5(random()::text), 1, 8)),
  tour_id               uuid references public.tours on delete restrict,
  user_id               uuid references auth.users on delete set null,

  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text,
  customer_country      text,

  travel_date           date not null,
  travelers             int  default 1 check (travelers > 0),

  subtotal              numeric(10,2) not null,
  discount              numeric(10,2) default 0,
  total_amount          numeric(10,2) not null,
  currency              text default 'USD',

  status                text default 'pending'
                          check (status in ('pending','confirmed','cancelled','completed','refunded')),
  payment_status        text default 'unpaid'
                          check (payment_status in ('unpaid','paid','refunded','failed')),
  stripe_payment_intent text,
  stripe_session_id     text,

  special_requests      text,
  internal_notes        text,

  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index bookings_tour_idx   on public.bookings(tour_id);
create index bookings_user_idx   on public.bookings(user_id);
create index bookings_code_idx   on public.bookings(booking_code);
create index bookings_date_idx   on public.bookings(travel_date);

-- =====================================================
-- 7. REVIEWS
-- =====================================================
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  tour_id      uuid not null references public.tours on delete cascade,
  booking_id   uuid references public.bookings on delete set null,
  user_id      uuid references auth.users on delete set null,

  author_name  text not null,
  author_country text,
  rating       int check (rating between 1 and 5),
  title        text,
  body         text,
  photos       jsonb default '[]'::jsonb,

  is_verified  boolean default false,
  is_published boolean default true,

  created_at   timestamptz default now()
);

create index reviews_tour_idx on public.reviews(tour_id);

-- =====================================================
-- 8. INQUIRIES (formulario contacto / cotización)
-- =====================================================
create table public.inquiries (
  id        uuid primary key default gen_random_uuid(),
  tour_id   uuid references public.tours on delete set null,
  name      text not null,
  email     text not null,
  phone     text,
  message   text,
  status    text default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz default now()
);

-- =====================================================
-- 9. SUBSCRIBERS (newsletter)
-- =====================================================
create table public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  locale     text default 'es',
  source     text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- =====================================================
-- 10. SETTINGS (site-wide config)
-- =====================================================
create table public.settings (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz default now()
);

-- =====================================================
-- TRIGGERS: keep updated_at fresh
-- =====================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger tours_touch    before update on public.tours    for each row execute function public.touch_updated_at();
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- =====================================================
-- TRIGGER: recompute tour rating when review added
-- =====================================================
create or replace function public.recompute_tour_rating()
returns trigger language plpgsql as $$
declare
  tid uuid := coalesce(new.tour_id, old.tour_id);
begin
  update public.tours t
    set rating = coalesce((select avg(rating)::numeric(2,1)
                           from public.reviews where tour_id = tid and is_published), 5.0),
        reviews_count = (select count(*) from public.reviews where tour_id = tid and is_published)
  where t.id = tid;
  return null;
end; $$;

create trigger reviews_rating_recompute
  after insert or update or delete on public.reviews
  for each row execute function public.recompute_tour_rating();
