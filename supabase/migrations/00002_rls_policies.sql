-- =====================================================
-- CuscoTours v2 — Row Level Security
-- =====================================================

-- Enable RLS on all public tables
alter table public.profiles          enable row level security;
alter table public.categories        enable row level security;
alter table public.tours             enable row level security;
alter table public.tour_itinerary    enable row level security;
alter table public.tour_availability enable row level security;
alter table public.bookings          enable row level security;
alter table public.reviews           enable row level security;
alter table public.inquiries         enable row level security;
alter table public.subscribers       enable row level security;
alter table public.settings          enable row level security;

-- Helper: check admin
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- =====================================================
-- PROFILES
-- =====================================================
create policy "profiles: select own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- =====================================================
-- CATEGORIES — public read, admin write
-- =====================================================
create policy "categories: public read"
  on public.categories for select
  using (is_published = true or public.is_admin());

create policy "categories: admin write"
  on public.categories for all
  using (public.is_admin());

-- =====================================================
-- TOURS — public read published, admin write all
-- =====================================================
create policy "tours: public read published"
  on public.tours for select
  using (is_published = true or public.is_admin());

create policy "tours: admin write"
  on public.tours for all
  using (public.is_admin());

-- =====================================================
-- TOUR_ITINERARY — same as tours
-- =====================================================
create policy "itinerary: public read"
  on public.tour_itinerary for select
  using (
    exists (select 1 from public.tours t
            where t.id = tour_id and (t.is_published or public.is_admin()))
  );

create policy "itinerary: admin write"
  on public.tour_itinerary for all
  using (public.is_admin());

-- =====================================================
-- TOUR_AVAILABILITY — public read open spots
-- =====================================================
create policy "availability: public read"
  on public.tour_availability for select
  using (true);

create policy "availability: admin write"
  on public.tour_availability for all
  using (public.is_admin());

-- =====================================================
-- BOOKINGS — own bookings only (or admin)
-- =====================================================
create policy "bookings: select own or admin"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

-- Anyone (logged or not) can create a booking; if logged, user_id must match.
create policy "bookings: insert"
  on public.bookings for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "bookings: admin update"
  on public.bookings for update
  using (public.is_admin());

-- =====================================================
-- REVIEWS — public read published, authenticated write own
-- =====================================================
create policy "reviews: public read"
  on public.reviews for select
  using (is_published = true or public.is_admin());

create policy "reviews: authenticated insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews: own update"
  on public.reviews for update
  using (auth.uid() = user_id or public.is_admin());

-- =====================================================
-- INQUIRIES — open insert, admin read
-- =====================================================
create policy "inquiries: anyone insert"
  on public.inquiries for insert
  with check (true);

create policy "inquiries: admin read"
  on public.inquiries for select
  using (public.is_admin());

-- =====================================================
-- SUBSCRIBERS — open insert, admin read
-- =====================================================
create policy "subscribers: anyone insert"
  on public.subscribers for insert
  with check (true);

create policy "subscribers: admin read"
  on public.subscribers for select
  using (public.is_admin());

-- =====================================================
-- SETTINGS — public read non-secret keys, admin write
-- =====================================================
create policy "settings: public read"
  on public.settings for select
  using (true);

create policy "settings: admin write"
  on public.settings for all
  using (public.is_admin());
