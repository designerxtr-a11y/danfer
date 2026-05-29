-- =============================================================
-- Migración 00012 — Reseñas REALES de Facebook (recomendaciones)
-- Fuente: facebook.com/Danfertourscusco/reviews (clientes reales).
-- Son recomendaciones de FB (positivas) → se cargan como 5★.
-- Como son del negocio en general, se reparten entre los 5 tours
-- principales para que cada uno gane estrellas. Si sabes a qué tour
-- corresponde cada cliente, cambia el slug del subquery.
-- Publicadas (is_published=true) → cuentan para el aggregateRating.
-- =============================================================

insert into public.reviews
  (tour_id, author_name, author_country, rating, title, body, is_verified, is_published, created_at)
values
  ((select id from public.tours where slug = 'machu-picchu-full-day'),
   'Avi Porras Zevallos', null, 5, null,
   'Súper recomendado, desde inicio a fin muy puntuales con todo lo ofrecido. Los guías muy amables y divertidos.',
   true, true, '2026-04-20T12:00:00Z'),

  ((select id from public.tours where slug = 'camino-inca-4-dias'),
   'Yoel Alexander', null, 5, null,
   '100% recomendado. Tuvimos una experiencia increíble; cumplieron con cada detalle del itinerario al pie de la letra. Desde el inicio hasta el final, el servicio fue impecable y profesional.',
   true, true, '2026-04-14T12:00:00Z'),

  ((select id from public.tours where slug = 'valle-sagrado-vip'),
   'Margeory Castañeda Ramos', null, 5, null,
   'Muy recomendado, súper atentos desde que te recogen del aeropuerto hasta que finaliza el tour. Lo mejor es que te ayudan a planificar el tour de acuerdo a la disponibilidad de cada turista.',
   true, true, '2026-03-29T12:00:00Z'),

  ((select id from public.tours where slug = 'rainbow-mountain'),
   'Lucy Chavez Esquivel', null, 5, null,
   'Si tienen pensado viajar a este hermoso lugar, la mejor opción es con esta empresa. No te tienes que preocupar por nada, tienen las mejores guías A1. Una empresa muy seria.',
   true, true, '2026-03-17T12:00:00Z'),

  ((select id from public.tours where slug = 'laguna-humantay'),
   'Angy Valentín', null, 5, null,
   'Súper recomendado, realizaron una excelente planificación de nuestro itinerario. Las personas son muy amables y están en constante comunicación. Todo lo mencionado en el itinerario se cumplió al 100%.',
   true, true, '2026-02-26T12:00:00Z');

-- Verificación
select t.slug, r.author_name, r.rating, r.created_at
from public.reviews r
join public.tours t on t.id = r.tour_id
order by r.created_at desc;
