-- =============================================================
-- Migración 00010 — Limpia las reseñas FICTICIAS del seed
-- =============================================================
-- Las reseñas sembradas (autores/textos inventados) y los conteos inflados
-- (tours.reviews_count = 1247, 892, 2340…) NO son reseñas reales de clientes.
-- Mostrarlas como aggregateRating es un riesgo de acción manual de Google.
--
-- A partir de ahora el aggregateRating del schema y los números visibles se
-- calculan desde la tabla `reviews` (ver getTourReviewStats). Por eso aquí:
--   1) Borramos las reseñas de prueba.
--   2) Reseteamos los contadores del seed a 0.
-- Las estrellas reaparecerán SOLAS y verídicas en cuanto cargues reseñas
-- reales (admin o inserción manual con clientes verificados).
--
-- ⚠️ EJECUTAR SOLO si todas las reseñas actuales son del seed (sitio nuevo).
--    Si ya tienes reseñas reales cargadas, NO borres todo: filtra por las de
--    prueba antes de aplicar.
-- =============================================================

-- 1) Eliminar reseñas sembradas
delete from public.reviews;

-- 2) Resetear los contadores ficticios de los tours
update public.tours
set rating = 0,
    reviews_count = 0;

-- Verificación
select slug, rating, reviews_count from public.tours order by slug;
select count(*) as reviews_restantes from public.reviews;
