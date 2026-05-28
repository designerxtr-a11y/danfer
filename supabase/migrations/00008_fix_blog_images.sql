-- =============================================================
-- Migración 00008 — fix: cover images únicos por blog post
-- Tres posts compartían la misma foto de Machu Picchu.
-- =============================================================

-- 1. Clima en Cusco mes a mes → Rainbow Mountain (variedad/estaciones)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop'
where slug = 'clima-en-cusco-mes-a-mes';

-- 2. Camino Inca paso a paso → Andes trail (mantiene)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop'
where slug = 'camino-inca-paso-a-paso-4-dias';

-- 3. Itinerario 7 días → llama en Machu Picchu (cultural, cubre Cusco general)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?q=80&w=1600&auto=format&fit=crop'
where slug = 'itinerario-7-dias-cusco';

-- 4. Soroche / mal de altura → Machu Picchu desde abajo (altitud)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1568552497474-d75ae9c7fc9b?q=80&w=1600&auto=format&fit=crop'
where slug = 'soroche-cusco-mal-de-altura';

-- 5. Mejor época Machu Picchu → MP clásico (mantiene)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop'
where slug = 'mejor-epoca-machu-picchu';

select slug, cover_image from public.blog_posts order by published_at desc;
