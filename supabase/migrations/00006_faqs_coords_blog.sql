-- =====================================================
-- Migration 6: FAQs, coordinates, blog posts, storage buckets
-- =====================================================

-- 1. Add FAQ column to tours
alter table public.tours
  add column if not exists faqs jsonb default '[]'::jsonb;
  -- Format: [{"q": {"es":"...","en":"..."}, "a": {"es":"...","en":"..."}}, ...]

-- 2. Coordinates for map
alter table public.tours
  add column if not exists coordinates jsonb;
  -- Format: {"lat": -13.1631, "lng": -72.5450, "zoom": 12}

-- 3. Blog posts table
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         jsonb not null,
  excerpt       jsonb,
  body_md       jsonb,                       -- {"es":"# Markdown...", "en":"..."}
  cover_image   text,
  author_name   text,
  author_avatar text,
  read_minutes  int default 5,
  tags          jsonb default '[]'::jsonb,   -- ["machu-picchu","tips"]
  is_published  boolean default false,
  published_at  timestamptz,
  meta_title    jsonb,
  meta_description jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists blog_posts_slug_idx      on public.blog_posts(slug);
create index if not exists blog_posts_published_idx on public.blog_posts(is_published) where is_published = true;

alter table public.blog_posts enable row level security;

drop policy if exists "blog: public read"   on public.blog_posts;
drop policy if exists "blog: admin write"   on public.blog_posts;

create policy "blog: public read"
  on public.blog_posts for select
  using (is_published = true or public.is_admin());

create policy "blog: admin write"
  on public.blog_posts for all
  using (public.is_admin());

create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- 4. Storage buckets
insert into storage.buckets (id, name, public)
values ('tour-images', 'tour-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

-- Storage RLS — public read, admin write
drop policy if exists "tour-images: public read"   on storage.objects;
drop policy if exists "tour-images: admin write"   on storage.objects;
drop policy if exists "blog-images: public read"   on storage.objects;
drop policy if exists "blog-images: admin write"   on storage.objects;
drop policy if exists "review-photos: public read" on storage.objects;
drop policy if exists "review-photos: auth write"  on storage.objects;

create policy "tour-images: public read"
  on storage.objects for select
  using (bucket_id = 'tour-images');

create policy "tour-images: admin write"
  on storage.objects for insert
  with check (bucket_id = 'tour-images' and public.is_admin());

create policy "blog-images: public read"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "blog-images: admin write"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.is_admin());

create policy "review-photos: public read"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy "review-photos: auth write"
  on storage.objects for insert
  with check (bucket_id = 'review-photos' and auth.uid() is not null);

-- 5. Sample coordinates for our seeded tours
update public.tours set coordinates = '{"lat":-13.1631,"lng":-72.5450,"zoom":13}'::jsonb
  where slug in ('machu-picchu-full-day', 'camino-inca-4-dias');

update public.tours set coordinates = '{"lat":-13.4196,"lng":-72.0817,"zoom":11}'::jsonb
  where slug = 'valle-sagrado-vip';

update public.tours set coordinates = '{"lat":-13.8688,"lng":-71.3070,"zoom":12}'::jsonb
  where slug = 'rainbow-mountain';

update public.tours set coordinates = '{"lat":-13.4115,"lng":-72.5499,"zoom":12}'::jsonb
  where slug = 'laguna-humantay';

update public.tours set coordinates = '{"lat":-13.5183,"lng":-71.9781,"zoom":14}'::jsonb
  where slug = 'city-tour-cusco';

-- 6. Sample FAQs for Machu Picchu
update public.tours set faqs = '[
  {"q":{"es":"¿Necesito aclimatarme antes del tour?","en":"Do I need to acclimatize before?"},
   "a":{"es":"Sí, recomendamos al menos 2 días en Cusco antes de subir a Machu Picchu para evitar el mal de altura.","en":"Yes, we recommend at least 2 days in Cusco before going to Machu Picchu to avoid altitude sickness."}},
  {"q":{"es":"¿Qué incluye el almuerzo?","en":"What does lunch include?"},
   "a":{"es":"Almuerzo buffet en Aguas Calientes con opciones vegetarianas y veganas.","en":"Buffet lunch in Aguas Calientes with vegetarian and vegan options."}},
  {"q":{"es":"¿Puedo subir Wayna Picchu?","en":"Can I climb Wayna Picchu?"},
   "a":{"es":"Sí, por un costo adicional de US$ 35. Cupos limitados — reserva con anticipación.","en":"Yes, for an extra US$ 35. Limited spots — book in advance."}},
  {"q":{"es":"¿Qué pasa si llueve?","en":"What if it rains?"},
   "a":{"es":"El tour opera bajo lluvia. Llevamos ponchos de emergencia. La temporada seca es abril-octubre.","en":"The tour operates in rain. We provide emergency ponchos. Dry season is April-October."}}
]'::jsonb where slug = 'machu-picchu-full-day';

select 'Migration 6 applied' as status;
