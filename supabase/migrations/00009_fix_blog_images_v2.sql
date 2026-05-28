-- =============================================================
-- Migración 00009 — fix v2: reemplaza IDs de Unsplash rotos
-- 1568552497474-d75ae9c7fc9b → 404 (Soroche)
-- 1580619305218-8423a7ef79b4 funciona pero se ve muy parecido a MP
-- =============================================================

-- Itinerario 7 días → cambia a paisaje montañoso distinto (no MP)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop'
where slug = 'itinerario-7-dias-cusco';

-- Soroche → cambia a sendero/trekking (foto válida que sí existe)
update public.blog_posts
set cover_image = 'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?q=80&w=1600&auto=format&fit=crop'
where slug = 'soroche-cusco-mal-de-altura';

select slug, cover_image from public.blog_posts order by published_at desc;
