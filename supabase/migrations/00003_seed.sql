-- =====================================================
-- CuscoTours v2 — Seed Data
-- 6 tours estrella de Cusco con itinerarios reales
-- =====================================================

-- Categories
insert into public.categories (slug, name, description, cover_image, sort_order) values
('machu-picchu', '{"es":"Machu Picchu","en":"Machu Picchu"}',
  '{"es":"La maravilla del mundo","en":"World wonder"}',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200&auto=format&fit=crop', 1),
('valle-sagrado', '{"es":"Valle Sagrado","en":"Sacred Valley"}',
  '{"es":"Pueblos andinos y ruinas","en":"Andean towns and ruins"}',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop', 2),
('camino-inca', '{"es":"Camino Inca","en":"Inca Trail"}',
  '{"es":"Trekking ancestral","en":"Ancestral trekking"}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1200&auto=format&fit=crop', 3),
('aventura', '{"es":"Aventura","en":"Adventure"}',
  '{"es":"Rainbow Mountain, Humantay, Ausangate","en":"Rainbow Mountain, Humantay, Ausangate"}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1200&auto=format&fit=crop', 4);

-- Tours
with cat as (
  select id, slug from public.categories
)
insert into public.tours
  (slug, category_id, title, subtitle, short_desc, description,
   cover_image, gallery, duration_days, duration_label, difficulty,
   max_group_size, altitude_max, price_usd, price_pen,
   highlights, includes, excludes, rating, reviews_count,
   is_featured, is_published)
values
-- 1. Machu Picchu Full Day
('machu-picchu-full-day',
  (select id from cat where slug='machu-picchu'),
  '{"es":"Machu Picchu Full Day","en":"Machu Picchu Full Day"}',
  '{"es":"La ciudadela inca en un día","en":"The Inca citadel in a day"}',
  '{"es":"Visita guiada a Machu Picchu desde Cusco. Tren panorámico, almuerzo gourmet incluido.","en":"Guided visit to Machu Picchu from Cusco. Panoramic train, gourmet lunch included."}',
  '{"es":"Vive la magia de Machu Picchu en una experiencia de un día desde Cusco. Embárcate en el tren panorámico Vistadome, llega a Aguas Calientes y sube en bus a la ciudadela. Guía bilingüe certificado, tour de 2 horas dentro del santuario, y tiempo libre para fotos icónicas.","en":"Experience the magic of Machu Picchu on a day trip from Cusco. Board the panoramic Vistadome train, reach Aguas Calientes, and bus up to the citadel. Bilingual certified guide, 2-hour tour inside, and free time for iconic photos."}',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  '[
    {"url":"https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop","alt":"Machu Picchu al amanecer"},
    {"url":"https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop","alt":"Vista panorámica"},
    {"url":"https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop","alt":"Sendero inca"}
  ]'::jsonb,
  1, '{"es":"1 día","en":"1 day"}', 'easy', 14, 2430, 380, 1420,
  '["Tren Vistadome panorámico","Guía bilingüe certificado","Almuerzo buffet en Aguas Calientes","Entrada a Machu Picchu","Bus oficial Consettur"]'::jsonb,
  '["Transporte Cusco–Ollantaytambo","Tren ida y vuelta","Bus subida y bajada","Entrada a Machu Picchu","Almuerzo buffet","Guía profesional"]'::jsonb,
  '["Desayuno","Cena","Propinas","Wayna Picchu (extra US$ 35)"]'::jsonb,
  4.9, 1247, true, true),

-- 2. Camino Inca 4 días
('camino-inca-4-dias',
  (select id from cat where slug='camino-inca'),
  '{"es":"Camino Inca Clásico 4D/3N","en":"Classic Inca Trail 4D/3N"}',
  '{"es":"Trek emblemático a Machu Picchu","en":"Iconic trek to Machu Picchu"}',
  '{"es":"4 días de caminata por la ruta inca original con porteadores, carpas y comidas gourmet.","en":"4-day hike along the original Inca trail with porters, tents, and gourmet meals."}',
  '{"es":"El trek más famoso de Sudamérica. 43 km por senderos empedrados originales del imperio inca, pasando por sitios arqueológicos exclusivos del camino (Wiñay Wayna, Phuyupatamarca) y llegando a Machu Picchu por la Puerta del Sol al amanecer del día 4.","en":"South America most famous trek. 43 km along original Inca stone trails, passing exclusive archaeological sites (Wiñay Wayna, Phuyupatamarca) and arriving at Machu Picchu through the Sun Gate at sunrise on day 4."}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  '[
    {"url":"https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop","alt":"Camino Inca"},
    {"url":"https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop","alt":"Campamento"}
  ]'::jsonb,
  4, '{"es":"4 días / 3 noches","en":"4 days / 3 nights"}', 'challenging', 12, 4215, 750, 2800,
  '["Puerta del Sol al amanecer","Carpas y porteadores","Chef en ruta","Sitios arqueológicos exclusivos","Permiso oficial incluido"]'::jsonb,
  '["Permiso oficial Camino Inca","Entrada Machu Picchu","Porteadores y carpas","3 desayunos, 3 almuerzos, 3 cenas","Cocinero","Tren regreso Aguas Calientes–Ollantaytambo","Guía profesional bilingüe"]'::jsonb,
  '["Saco de dormir (alquiler US$ 25)","Bastones (alquiler US$ 15)","Wayna Picchu","Primer desayuno y última cena"]'::jsonb,
  4.9, 892, true, true),

-- 3. Valle Sagrado VIP
('valle-sagrado-vip',
  (select id from cat where slug='valle-sagrado'),
  '{"es":"Valle Sagrado VIP","en":"Sacred Valley VIP"}',
  '{"es":"Pisac, Ollantaytambo y Chinchero","en":"Pisac, Ollantaytambo and Chinchero"}',
  '{"es":"Tour privado por los pueblos más emblemáticos del Valle Sagrado con almuerzo en hacienda.","en":"Private tour through the most iconic Sacred Valley towns with lunch at a hacienda."}',
  '{"es":"Recorrido en vehículo privado por Pisac (mercado y ruinas), Ollantaytambo (fortaleza inca viva) y Chinchero (tejedoras). Incluye almuerzo gourmet en una hacienda colonial con vista al valle. Guía exclusivo para tu grupo.","en":"Private vehicle tour through Pisac (market and ruins), Ollantaytambo (living Inca fortress), and Chinchero (weavers). Includes gourmet lunch at a colonial hacienda overlooking the valley. Exclusive guide for your group."}',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  '[]'::jsonb,
  1, '{"es":"1 día","en":"1 day"}', 'easy', 8, 3800, 195, 730,
  '["Vehículo privado","Almuerzo en hacienda colonial","Demostración de tejido tradicional","Guía exclusivo","Recojo y dejada en hotel"]'::jsonb,
  '["Transporte privado","Guía profesional","Almuerzo buffet","Boleto turístico"]'::jsonb,
  '["Bebidas","Propinas"]'::jsonb,
  4.8, 567, true, true),

-- 4. Rainbow Mountain
('rainbow-mountain',
  (select id from cat where slug='aventura'),
  '{"es":"Montaña de 7 Colores","en":"Rainbow Mountain"}',
  '{"es":"Vinicunca a 5,200 msnm","en":"Vinicunca at 5,200m"}',
  '{"es":"Trek de altura a la espectacular montaña de colores. Salida temprano desde Cusco.","en":"High-altitude trek to the spectacular colored mountain. Early departure from Cusco."}',
  '{"es":"Salida 3:30am hacia Pitumarca. Caminata de 2h hasta la cima de Vinicunca (5,200 msnm) atravesando paisajes andinos con alpacas, lagunas y la cordillera Ausangate al fondo.","en":"3:30am departure to Pitumarca. 2-hour hike to the top of Vinicunca (5,200m) through Andean landscapes with alpacas, lagoons, and the Ausangate range in the background."}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  '[]'::jsonb,
  1, '{"es":"1 día","en":"1 day"}', 'challenging', 16, 5200, 85, 320,
  '["5,200 msnm","Desayuno y almuerzo incluidos","Caballos disponibles (extra)","Vista de Ausangate"]'::jsonb,
  '["Transporte ida/vuelta","Desayuno","Almuerzo","Guía profesional","Entrada"]'::jsonb,
  '["Caballo (US$ 25 opcional)","Bastones","Cena"]'::jsonb,
  4.7, 1820, true, true),

-- 5. Laguna Humantay
('laguna-humantay',
  (select id from cat where slug='aventura'),
  '{"es":"Laguna Humantay","en":"Humantay Lake"}',
  '{"es":"Laguna turquesa a 4,200 msnm","en":"Turquoise lake at 4,200m"}',
  '{"es":"Trek de medio día a la laguna sagrada con aguas turquesa y nevado Salkantay de fondo.","en":"Half-day trek to the sacred lake with turquoise waters and Salkantay snow peak in the background."}',
  '{"es":"Salida 4:30am hacia Mollepata. Trek de 1.5h ascendiendo hasta la laguna glaciar Humantay, una de las postales más fotografiadas de Cusco. Ceremonia opcional con chamán local.","en":"4:30am departure to Mollepata. 1.5h ascending hike to the Humantay glacial lake, one of the most photographed postcards of Cusco. Optional ceremony with local shaman."}',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  '[]'::jsonb,
  1, '{"es":"1 día","en":"1 day"}', 'moderate', 16, 4200, 75, 280,
  '["Laguna glaciar turquesa","Vista del Salkantay (6,271m)","Ceremonia andina opcional"]'::jsonb,
  '["Transporte","Desayuno","Almuerzo buffet","Guía","Entrada"]'::jsonb,
  '["Bastones (alquiler S/15)","Caballo opcional"]'::jsonb,
  4.8, 1356, false, true),

-- 6. City Tour Cusco
('city-tour-cusco',
  (select id from cat where slug='machu-picchu'),
  '{"es":"City Tour Cusco","en":"Cusco City Tour"}',
  '{"es":"Sacsayhuamán, Qenqo, Pukapukara, Tambomachay","en":"Sacsayhuamán, Qenqo, Pukapukara, Tambomachay"}',
  '{"es":"Recorrido por la ciudad imperial y 4 sitios arqueológicos cercanos. Ideal para tu primer día.","en":"Tour of the imperial city and 4 nearby archaeological sites. Ideal for your first day."}',
  '{"es":"Tarde dedicada a conocer el casco histórico de Cusco: Catedral, Qoricancha (Templo del Sol), y los 4 sitios arqueológicos del circuito norte. Perfecto para aclimatarse a la altitud.","en":"Afternoon dedicated to discovering Cusco historic center: Cathedral, Qoricancha (Temple of the Sun), and the 4 archaeological sites of the northern circuit. Perfect for acclimatizing to altitude."}',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  '[]'::jsonb,
  1, '{"es":"Medio día","en":"Half day"}', 'easy', 20, 3700, 35, 130,
  '["Catedral y Qoricancha","Sacsayhuamán","Vista panorámica de Cusco","Ideal para aclimatación"]'::jsonb,
  '["Transporte turístico","Guía bilingüe","Boleto turístico parcial"]'::jsonb,
  '["Entrada Catedral (S/40)","Entrada Qoricancha (S/15)"]'::jsonb,
  4.6, 2340, false, true);

-- Itinerary for Camino Inca (the long one)
insert into public.tour_itinerary (tour_id, day_number, title, description, meals, accommodation)
select t.id, 1,
  '{"es":"Día 1 — Km 82 a Wayllabamba","en":"Day 1 — Km 82 to Wayllabamba"}'::jsonb,
  '{"es":"Recojo del hotel a las 5am. Traslado a Ollantaytambo (desayuno) y luego al km 82, punto de inicio. Caminata de 12 km (6h) por terreno mayormente plano hasta el campamento de Wayllabamba (3,000 msnm).","en":"Hotel pickup at 5am. Transfer to Ollantaytambo (breakfast) and then to km 82, the starting point. 12 km hike (6h) on mostly flat terrain to Wayllabamba campsite (3,000m)."}'::jsonb,
  '["lunch","dinner"]'::jsonb,
  '{"es":"Campamento Wayllabamba","en":"Wayllabamba campsite"}'::jsonb
from public.tours t where t.slug = 'camino-inca-4-dias'
union all select t.id, 2,
  '{"es":"Día 2 — Paso Warmiwañusca","en":"Day 2 — Dead Woman Pass"}'::jsonb,
  '{"es":"El día más duro: ascenso al paso de la Mujer Muerta (4,215 msnm). 16 km (9h) atravesando ecosistemas de puna y ceja de selva. Llegada al campamento de Pacaymayo.","en":"Hardest day: ascent to Dead Woman Pass (4,215m). 16 km (9h) crossing puna and cloud forest ecosystems. Arrival at Pacaymayo campsite."}'::jsonb,
  '["breakfast","lunch","dinner"]'::jsonb,
  '{"es":"Campamento Pacaymayo","en":"Pacaymayo campsite"}'::jsonb
from public.tours t where t.slug = 'camino-inca-4-dias'
union all select t.id, 3,
  '{"es":"Día 3 — Sitios arqueológicos","en":"Day 3 — Archaeological sites"}'::jsonb,
  '{"es":"Día más espectacular: visita a Runkurakay, Sayacmarca, Phuyupatamarca y Wiñay Wayna. 10 km de caminata principalmente en bajada por escalinatas incas. Llegada al campamento final.","en":"Most spectacular day: visit to Runkurakay, Sayacmarca, Phuyupatamarca and Wiñay Wayna. 10 km of mostly downhill hike on Inca stairs. Arrival at the final campsite."}'::jsonb,
  '["breakfast","lunch","dinner"]'::jsonb,
  '{"es":"Campamento Wiñay Wayna","en":"Wiñay Wayna campsite"}'::jsonb
from public.tours t where t.slug = 'camino-inca-4-dias'
union all select t.id, 4,
  '{"es":"Día 4 — Machu Picchu por la Puerta del Sol","en":"Day 4 — Machu Picchu via Sun Gate"}'::jsonb,
  '{"es":"Salida 3:30am para llegar a Inti Punku (Puerta del Sol) al amanecer y descender a Machu Picchu con la primera luz. Tour guiado de 2h en la ciudadela. Tren de regreso por la tarde.","en":"3:30am departure to reach Inti Punku (Sun Gate) at sunrise and descend to Machu Picchu with the first light. 2h guided tour at the citadel. Return train in the afternoon."}'::jsonb,
  '["breakfast"]'::jsonb,
  null::jsonb
from public.tours t where t.slug = 'camino-inca-4-dias';

-- Sample availability (next 30 days) for featured tours
insert into public.tour_availability (tour_id, date, total_spots, booked_spots)
select t.id, current_date + (d || ' days')::interval, t.max_group_size,
       floor(random() * t.max_group_size * 0.4)::int
from public.tours t
cross join generate_series(0, 60) d
where t.is_featured = true;

-- Sample reviews
insert into public.reviews (tour_id, author_name, author_country, rating, title, body, is_verified, is_published)
select t.id, n.name, n.country, n.rating, n.title, n.body, true, true
from public.tours t
cross join lateral (values
  ('Sarah Mitchell', 'United States', 5, 'Life-changing experience',
   'The Inca Trail was the highlight of our South America trip. Our guide Carlos knew everything about Inca history. The food cooked by the camp chef was incredible. Cannot recommend enough.'),
  ('Lukas Schmidt', 'Germany', 5, 'Best tour we have done',
   'Perfect organization from start to finish. The porters were amazing humans. Reaching the Sun Gate at sunrise on day 4 was magical.'),
  ('María González', 'México', 5, 'Inolvidable',
   'Una experiencia que cambió mi forma de ver el mundo. Cada detalle estuvo cuidado. Volveré por más rutas.'),
  ('Yuki Tanaka', 'Japan', 4, 'Beautiful and well organized',
   'Great experience overall. The high altitude is real, but the team was very caring. Would recommend going a couple days early to acclimatize.')
) as n(name, country, rating, title, body)
where t.is_featured = true;

-- Site settings
insert into public.settings (key, value) values
('site_name',    '"CuscoTours"'::jsonb),
('site_tagline', '{"es":"Descubre el corazón del Imperio Inca","en":"Discover the heart of the Inca Empire"}'::jsonb),
('contact_email','"hola@cuscotours.com"'::jsonb),
('contact_phone','"+51 984 123 456"'::jsonb),
('whatsapp',     '"+51984123456"'::jsonb),
('address',      '{"es":"Av. El Sol 314, Cusco, Perú","en":"Av. El Sol 314, Cusco, Peru"}'::jsonb),
('social',       '{"instagram":"@cuscotours","facebook":"cuscotours","tiktok":"@cuscotours"}'::jsonb);
