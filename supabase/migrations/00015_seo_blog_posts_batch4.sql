-- =============================================================
-- Migración 00015 — Cuarta tanda de blog posts SEO (long-tail)
-- 5 guías de ALTA CALIDAD sobre huecos de keyword reales que el
-- blog aún no cubría. El blog pasa de 20 a 25 posts.
-- Foco: calidad > cantidad (evitar "scaled content abuse").
-- Cada post: voz de guía local, tablas, TL;DR y enlaces internos
-- a /destinos/*, /tours, /reservar y otros posts del blog.
-- ES-only. Tildes correctas en TODOS los campos.
-- Keywords:
--   1. donde alojarse en cusco (barrios / hospedaje)
--   2. como llegar a cusco (vuelos, bus, desde Lima)
--   3. tren a machu picchu (PeruRail vs IncaRail, rutas)
--   4. huayna picchu vs montaña machu picchu (cuál subir)
--   5. palccoyo (montaña de colores alternativa a Vinicunca)
-- NOTA portadas: reusan URLs Unsplash ya vivas en posts previos
-- (desde este entorno no se pueden verificar URLs nuevas).
-- Reemplazar por FOTOS PROPIAS desde /admin/blog cuando estén
-- disponibles (mejor SEO + marca).
-- Idempotente: on conflict (slug) do nothing.
-- =============================================================

-- ===== 1. DÓNDE ALOJARSE EN CUSCO =====================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'donde-alojarse-en-cusco',
  jsonb_build_object('es', 'Dónde alojarse en Cusco: mejores barrios y zonas (guía 2026)'),
  jsonb_build_object('es', 'Guía local de los mejores barrios para alojarte en Cusco según tu viaje: Centro Histórico, San Blas, San Pedro y Valle Sagrado. Ventajas, precios y consejos de altura.'),
  jsonb_build_object('es', $body$
# Dónde alojarse en Cusco: la guía honesta por barrios

Elegir bien la zona donde duermes en Cusco cambia tu viaje más de lo que crees. La ciudad es pequeña y caminable, pero está a **3,400 metros de altura** y sus calles son empinadas y empedradas: arrastrar una maleta cuesta arriba a esa altitud, recién llegado, es agotador. Como guías locales te decimos sin rodeos qué barrio te conviene según el tipo de viaje que harás.

## TL;DR — La respuesta corta

- **Primera vez y quieres todo cerca:** Centro Histórico (Plaza de Armas).
- **Ambiente bohemio, vistas y fotos:** San Blas.
- **Presupuesto mochilero:** alrededor de San Pedro y Av. El Sol.
- **Llegas directo de Lima y quieres aclimatarte mejor:** duerme la primera noche en el **Valle Sagrado** (Urubamba/Ollantaytambo), 600 m más bajo.

| Barrio | Ideal para | Precio noche (doble) | Altura |
|--------|-----------|----------------------|--------|
| Centro Histórico | Primera vez, comodidad | US$60–180 | 3,400 m |
| San Blas | Parejas, fotógrafos | US$50–150 | 3,450 m |
| San Pedro / El Sol | Mochileros, presupuesto | US$15–45 | 3,380 m |
| Valle Sagrado | Aclimatación, calma | US$50–250 | 2,800 m |

## Centro Histórico — el corazón, para la primera visita

Si es tu primer viaje a Cusco, duerme aquí. Estás a pasos de la **Plaza de Armas**, restaurantes, agencias, casas de cambio y los puntos de recojo de casi todos los tours. La mayoría de excursiones —incluido el [city tour de Cusco](/blog/city-tour-cusco)— te recogen del hotel en esta zona sin costo extra.

La contra: es lo más turístico y caro, y algunas calles tienen vida nocturna ruidosa. Pide una habitación interior si eres de sueño ligero.

## San Blas — el barrio de los artistas

Subiendo desde la plaza está **San Blas**, el barrio bohemio de Cusco: callejuelas empedradas, talleres de artesanos, cafés con terraza y las mejores vistas de los tejados rojos de la ciudad. Es perfecto para parejas y para quien viaja a tomar fotos.

El detalle a considerar: está cuesta arriba. Llegar con maletas el primer día, recién bajado del avión, se siente. Si te alojas aquí, toma un taxi hasta la puerta y dale un par de días al cuerpo. Lee primero nuestra guía del [mal de altura o soroche](/blog/soroche-cusco-mal-de-altura).

## San Pedro y Avenida El Sol — para presupuestos ajustados

Alrededor del **Mercado de San Pedro** y bajando por la **Av. El Sol** encuentras los hostales y hospedajes más económicos, comida local barata y aún estás a 10–15 minutos a pie de la plaza. Es la zona favorita de mochileros y de quien viaja largo. A cambio de precio sacrificas algo de encanto y tranquilidad.

## Valle Sagrado — la jugada inteligente para aclimatarte

Este es el consejo que pocos blogs dan: si llegas en avión directo desde Lima (nivel del mar) a Cusco (3,400 m), el salto de altura es brusco. El **Valle Sagrado** —Urubamba, Ollantaytambo, Pisac— está a unos **2,800 metros**, 600 más abajo, y el cuerpo lo agradece.

Dormir tu primera o segunda noche en el valle, visitar [qué hacer en el Valle Sagrado](/blog/que-hacer-valle-sagrado-cusco) y subir a Cusco después es una de las mejores estrategias contra el soroche. Además, **Ollantaytambo es la estación de tren** desde donde sale el camino más corto a Machu Picchu.

## ¿Cuántas noches y en qué orden?

Para un viaje clásico de 5–6 días, este reparto funciona muy bien:

1. **Noche 1–2:** Valle Sagrado (aclimatación + Pisac/Ollantaytambo).
2. **Noche 3:** Aguas Calientes o regreso, según tu plan a [Machu Picchu](/destinos/machu-picchu).
3. **Noche 4–5:** Cusco ciudad (Centro o San Blas) para el city tour, San Blas y excursiones como [Rainbow Mountain](/destinos/rainbow-mountain).

Si solo tienes pocos días, mira nuestro [itinerario de 7 días por Cusco](/blog/itinerario-7-dias-cusco) para encajar las piezas.

## Consejos finales de un guía local

- **Pide hotel con calefacción.** Las noches de mayo a agosto bajan de 0°C y muchos alojamientos económicos no calientan.
- **Confirma traslado del aeropuerto.** Llegar mareado de altura y tener que regatear un taxi no es plan.
- **Reserva con antelación en junio–agosto e Inti Raymi**, la temporada más llena del año.

## ¿Te armamos el viaje completo?

En **Danfer Tours Cusco** no solo guiamos tours: te ayudamos a ordenar tu itinerario, elegir la zona correcta para dormir y aclimatarte bien para que disfrutes desde el primer día. Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) con tus fechas, o mira [nuestros tours y paquetes](/tours) para reservar. Cusco se disfruta más cuando duermes en el lugar correcto.
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["cusco","hospedaje","barrios","viaje","guia"]'::jsonb,
  true,
  now() - interval '1 hours',
  jsonb_build_object('es', 'Dónde alojarse en Cusco 2026: mejores barrios'),
  jsonb_build_object('es', 'Dónde alojarse en Cusco según tu viaje: Centro Histórico, San Blas, San Pedro y Valle Sagrado. Precios, ventajas y consejos de altura de guías locales.')
) on conflict (slug) do nothing;

-- ===== 2. CÓMO LLEGAR A CUSCO =========================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'como-llegar-a-cusco',
  jsonb_build_object('es', 'Cómo llegar a Cusco: vuelos, bus y rutas desde Lima (2026)'),
  jsonb_build_object('es', 'Todas las formas de llegar a Cusco: vuelos desde Lima y otras ciudades, bus, distancias y tiempos. Consejos sobre el aeropuerto, traslados y la altura al aterrizar.'),
  jsonb_build_object('es', $body$
# Cómo llegar a Cusco: todas las opciones explicadas

Cusco es la puerta de entrada a Machu Picchu, el Valle Sagrado y los Andes peruanos, así que casi todo viaje a esta región empieza por una pregunta práctica: **¿cómo llego?** Te lo explicamos con tiempos, precios aproximados y los consejos que solo da quien vive aquí.

## TL;DR — La respuesta corta

- **Más rápido y común:** vuelo Lima–Cusco (1h 20min).
- **Más económico:** bus Lima–Cusco (20–22 horas), o bus desde Arequipa/Puno.
- **Aeropuerto:** Alejandro Velasco Astete (CUZ), a 10 min del centro.
- **Ojo con la altura:** aterrizas a 3,400 m de golpe; planea el primer día tranquilo.

## En avión: la opción de la mayoría

La forma más práctica de llegar a Cusco es volando. El **Aeropuerto Internacional Alejandro Velasco Astete (CUZ)** recibe vuelos diarios desde varias ciudades.

| Ruta | Duración | Frecuencia |
|------|----------|------------|
| Lima → Cusco | 1h 20min | Muy alta (decenas al día) |
| Arequipa → Cusco | 50 min | Diaria |
| La Paz (Bolivia) → Cusco | 1h | Algunos días |

Consejos de vuelo:

- **Vuela temprano.** Los vuelos de la mañana tienen menos probabilidad de retraso o cancelación; en temporada de lluvias (noviembre–marzo) la niebla matutina a veces afecta, pero las tardes son más inestables.
- **Reserva con semanas de antelación** para junio, julio y agosto, y especialmente alrededor del [Inti Raymi (24 de junio)](/blog/inti-raymi-cusco).
- **El aeropuerto está dentro de la ciudad**, a unos 10 minutos en taxi del Centro Histórico. Coordina el traslado con tu hotel si puedes.

## En bus: para presupuestos ajustados (o por la aventura)

Si viajas con poco presupuesto o quieres ver el paisaje, los buses conectan Cusco con casi todo el sur del Perú. Las empresas de categoría "cama" o "VIP" son cómodas y seguras.

| Ruta | Duración aprox. |
|------|-----------------|
| Lima → Cusco | 20–22 horas |
| Arequipa → Cusco | 9–10 horas |
| Puno (Lago Titicaca) → Cusco | 6–7 horas |
| Ica / Nazca → Cusco | 14–16 horas |

La ruta **Puno → Cusco** merece mención aparte: existe el llamado "bus turístico" que para en sitios arqueológicos del camino (Andahuaylillas, Raqchi, La Raya) y se convierte en un tour en sí mismo.

## La gran ventaja del bus: aclimatación gradual

Hay un beneficio real de llegar por tierra desde Arequipa o Puno: el cuerpo sube de altura poco a poco en lugar del salto brusco del avión. Eso reduce el riesgo de **soroche** (mal de altura). Si llegas volando directo desde Lima, lee antes nuestra guía para [prevenir el mal de altura en Cusco](/blog/soroche-cusco-mal-de-altura) y planea un primer día sin esfuerzos.

## Al aterrizar: qué hacer las primeras horas

1. **Hidrátate** y muévete despacio; nada de cargar maletas corriendo.
2. **Toma mate de coca**, te lo ofrecen en casi todos los hoteles.
3. **Deja Machu Picchu para después** de un par de días de aclimatación si puedes.
4. **Decide dónde dormir** según nuestra guía de [dónde alojarse en Cusco](/blog/donde-alojarse-en-cusco); el Valle Sagrado, más bajo, es ideal la primera noche.

## ¿Y de Cusco a Machu Picchu?

Llegar a Cusco es solo el primer tramo. Desde aquí, el siguiente paso es Machu Picchu, que tiene su propia logística de tren y bus. Lo explicamos a fondo en [cómo llegar a Machu Picchu desde Cusco](/blog/como-llegar-a-machu-picchu-desde-cusco) y en nuestra guía de [trenes a Machu Picchu](/blog/tren-a-machu-picchu).

## Te recibimos en Cusco

En **Danfer Tours Cusco** coordinamos traslados desde el aeropuerto, te ayudamos a planear las primeras horas para que la altura no te arruine el viaje y armamos tu ruta hacia [Machu Picchu](/destinos/machu-picchu) y el Valle Sagrado. Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa [nuestros tours](/tours). Tú llega; del resto nos encargamos nosotros.
$body$),
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["cusco","como-llegar","vuelos","transporte","guia"]'::jsonb,
  true,
  now() - interval '2 hours',
  jsonb_build_object('es', 'Cómo llegar a Cusco: vuelos y bus desde Lima'),
  jsonb_build_object('es', 'Cómo llegar a Cusco en avión o bus desde Lima, Arequipa y Puno: tiempos, precios, aeropuerto y consejos de altura al aterrizar. Guía local 2026.')
) on conflict (slug) do nothing;

-- ===== 3. TREN A MACHU PICCHU =========================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'tren-a-machu-picchu',
  jsonb_build_object('es', 'Tren a Machu Picchu: PeruRail vs IncaRail, rutas y precios'),
  jsonb_build_object('es', 'Guía completa del tren a Machu Picchu: diferencias entre PeruRail e IncaRail, estaciones de Ollantaytambo y Poroy, tipos de servicio, precios y cómo elegir tu tren.'),
  jsonb_build_object('es', $body$
# Tren a Machu Picchu: la guía completa para elegir bien

No existe carretera que llegue directamente a Machu Picchu. Salvo que hagas el [Camino Inca](/destinos/camino-inca) u otro trek, **la única forma de llegar es en tren** hasta el pueblo de Aguas Calientes (Machu Picchu Pueblo), y de ahí en bus de subida. Aquí te explicamos cómo funciona el tren, las dos compañías y cómo elegir el servicio correcto.

## TL;DR — La respuesta corta

- **Dos compañías:** PeruRail e IncaRail. Ambas son seguras y buenas.
- **Estación recomendada:** Ollantaytambo (en el Valle Sagrado), el tramo más corto.
- **Reserva con anticipación**, los trenes se llenan en temporada alta.
- **El tren NO te deja en la ciudadela:** llega a Aguas Calientes; falta el bus de subida.

## Las dos compañías: PeruRail vs IncaRail

| | PeruRail | IncaRail |
|--|----------|----------|
| Servicio económico | Expedition | The Voyager |
| Servicio medio/panorámico | Vistadome | The 360° |
| Servicio de lujo | Hiram Bingham | First Class / Private |
| Salidas | Muy frecuentes | Frecuentes |

La verdad sin marketing: para el viajero promedio, **las dos cumplen perfecto**. La diferencia entre el servicio económico y el panorámico está en los ventanales más amplios (incluso en el techo) y el servicio a bordo. El paisaje del cañón del Urubamba es espectacular en cualquiera de los dos.

## ¿Desde qué estación salir?

Esta es la decisión que más afecta tu tiempo y precio:

| Estación | Dónde está | Duración a Aguas Calientes |
|----------|-----------|----------------------------|
| **Ollantaytambo** | Valle Sagrado | ~1h 30min (la más usada) |
| Poroy / Cusco | Cerca de Cusco | ~3h 30min (más cara y larga) |
| Urubamba | Valle Sagrado | ~2h 30min |

**Nuestra recomendación:** sal desde **Ollantaytambo**. Es el tramo más corto y barato. Para llegar a Ollantaytambo desde Cusco tomas un transporte terrestre de ~1h 45min, que además te permite conocer el [Valle Sagrado](/blog/que-hacer-valle-sagrado-cusco) en el camino. Es justamente la ruta que detallamos en [cómo llegar a Machu Picchu desde Cusco](/blog/como-llegar-a-machu-picchu-desde-cusco).

## Tipos de servicio: ¿cuál elijo?

- **Económico (Expedition / The Voyager):** el mejor valor. Cómodo, con ventanas amplias. La elección de la mayoría.
- **Panorámico (Vistadome / The 360°):** ventanas en el techo, snacks y a veces show a bordo en el regreso. Vale la pena si quieres maximizar las vistas.
- **Lujo (Hiram Bingham / First Class):** carísimo, con comida gourmet, bar y atención premium. Para ocasiones especiales.

## Consejos clave del tren

- **Reserva con semanas de antelación** en temporada seca (mayo–septiembre); los horarios buenos se agotan.
- **Equipaje limitado:** los trenes permiten un bolso de mano (aprox. 5 kg / 157 cm lineales). Deja la maleta grande en tu hotel de Cusco u Ollantaytambo.
- **Lleva tu pasaporte:** lo piden al abordar y debe coincidir con el boleto y con tu [entrada a Machu Picchu](/blog/entradas-machu-picchu-circuitos).
- **Guarda el boleto de regreso** y llega temprano a la estación de Aguas Calientes a la vuelta.

## No olvides el bus de subida

El tren te deja en **Aguas Calientes**, al pie de la montaña. Desde ahí, un bus sube por una carretera en zigzag de unos 25–30 minutos hasta la entrada de la ciudadela. Es un boleto aparte (ida y vuelta) y conviene comprarlo con tiempo. La alternativa es subir caminando (~1h 30min de escaleras empinadas), gratis pero exigente a la altura.

## Lo que muchos no calculan: todo debe encajar

La magia (y el dolor de cabeza) de Machu Picchu es que **tren + bus + entrada con horario** deben coincidir. Si tu entrada es para las 10:00, tu tren y bus tienen que dejarte a tiempo. Un solo eslabón mal calculado y pierdes la entrada, que no es reembolsable.

## Déjanos la logística a nosotros

En **Danfer Tours Cusco** coordinamos tren, bus, entrada con el circuito correcto y guía, todo sincronizado, para que tú solo disfrutes. Mira [nuestros tours a Machu Picchu](/tours) o escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) con tus fechas. Conocemos [Machu Picchu](/destinos/machu-picchu) de memoria y te llevamos sin estrés.
$body$),
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["machu-picchu","tren","perurail","incarail","guia"]'::jsonb,
  true,
  now() - interval '3 hours',
  jsonb_build_object('es', 'Tren a Machu Picchu: PeruRail vs IncaRail 2026'),
  jsonb_build_object('es', 'Tren a Machu Picchu explicado: PeruRail vs IncaRail, estaciones, tipos de servicio, precios y consejos. Cómo elegir tu tren a Aguas Calientes. Guía local.')
) on conflict (slug) do nothing;

-- ===== 4. HUAYNA PICCHU VS MONTAÑA MACHU PICCHU =======================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'huayna-picchu-vs-montana-machu-picchu',
  jsonb_build_object('es', 'Huayna Picchu vs Montaña Machu Picchu: cuál subir'),
  jsonb_build_object('es', 'Comparativa honesta entre Huayna Picchu y Montaña Machu Picchu: dificultad, vistas, duración, altura y cuál elegir según tu condición física y tipo de entrada.'),
  jsonb_build_object('es', $body$
# Huayna Picchu vs Montaña Machu Picchu: ¿cuál subir?

Cuando compras tu entrada a Machu Picchu con montaña, debes elegir entre dos cumbres: **Huayna Picchu** (la montaña puntiaguda que aparece de fondo en la foto clásica) o **Montaña Machu Picchu** (la más alta, al otro lado). No puedes hacer las dos el mismo día y la entrada se reserva por separado. Aquí va la comparación honesta para que aciertes.

## TL;DR — La respuesta corta

- **Huayna Picchu:** más famosa, vistas en picado de la ciudadela, más vertical y expuesta, cupos muy limitados. Reserva con MUCHA anticipación.
- **Montaña Machu Picchu:** más alta, sube en escalones constantes, vista panorámica amplísima, menos vértigo, más cupos.
- **¿Vértigo o miedo a las alturas?** Elige Montaña Machu Picchu.
- **¿Quieres LA foto mirando la ciudadela desde arriba?** Huayna Picchu.

## Tabla comparativa

| | Huayna Picchu | Montaña Machu Picchu |
|--|---------------|----------------------|
| Altura cima | 2,693 m | 3,082 m |
| Desnivel desde la ciudadela | ~260 m | ~650 m |
| Duración (ida y vuelta) | 1.5–2 h | 2.5–3.5 h |
| Tipo de sendero | Escaleras incas empinadas, expuesto | Escalones largos y constantes |
| Vértigo | Alto en tramos | Bajo |
| Vista principal | La ciudadela desde arriba | Panorámica del valle y nevados |
| Cupos diarios | Muy limitados | Más amplios |

## Huayna Picchu — la icónica

Es la cumbre que todos reconocen. La subida es corta pero **intensa y vertical**: escaleras incas talladas, tramos con cable de acero y algún paso estrecho con caída a los lados. La recompensa es ver la ciudadela de Machu Picchu en miniatura, justo debajo de ti, desde un ángulo que ninguna otra cumbre da.

No es para quien sufre de vértigo. Y sus cupos se agotan **con meses de antelación**, sobre todo en temporada alta. Si la quieres, reserva apenas tengas fechas.

## Montaña Machu Picchu — la subestimada

Más alta pero, paradójicamente, **menos aterradora**. El sendero son escalones largos y regulares que suben de forma constante; cansa las piernas, pero no tiene la exposición vertiginosa de Huayna Picchu. Desde la cima ves un panorama enorme: la ciudadela a lo lejos, el cañón del Urubamba y, en días claros, nevados. Tiene más cupos y suele ser más fácil de conseguir.

## ¿Cuál encaja con tu entrada?

Recuerda que estas montañas van con **circuitos específicos** de la entrada a Machu Picchu. No todas las entradas las incluyen, y el circuito determina por dónde caminas dentro de la ciudadela. Lo explicamos a detalle en [entradas a Machu Picchu y circuitos](/blog/entradas-machu-picchu-circuitos). Elige la combinación entrada + montaña al momento de comprar, porque después no se puede cambiar.

## Lo que debes considerar antes de decidir

- **Tu estado físico y la altura.** Ambas exigen, y estás a más de 2,600 m. Aclimatízate antes; lee nuestra guía del [mal de altura en Cusco](/blog/soroche-cusco-mal-de-altura).
- **El clima.** En temporada de lluvias las escaleras se ponen resbalosas, sobre todo en Huayna Picchu. Consulta el [clima de Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).
- **Tu horario de entrada.** La montaña tiene franjas de ingreso; calcula que sumarás 2–4 horas a tu visita.
- **El vértigo es real.** Si dudas, Montaña Machu Picchu es la elección segura y igual de espectacular.

## ¿Y si no subo ninguna?

Totalmente válido. La visita a la **ciudadela de [Machu Picchu](/destinos/machu-picchu)** por sí sola ya es una de las experiencias más impresionantes del mundo. Las montañas son un extra para quien quiere esfuerzo y vistas aéreas; no son obligatorias para "ver Machu Picchu de verdad".

## Te ayudamos a elegir y reservar

En **Danfer Tours Cusco** te asesoramos según tu condición física y tus fechas, conseguimos la combinación de entrada + montaña + circuito correcta y te guiamos arriba con seguridad. Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o mira [nuestros tours a Machu Picchu](/tours). La cumbre correcta hace la diferencia entre disfrutar y sufrir.
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["machu-picchu","huayna-picchu","montana","trekking","guia"]'::jsonb,
  true,
  now() - interval '4 hours',
  jsonb_build_object('es', 'Huayna Picchu vs Montaña Machu Picchu: cuál subir'),
  jsonb_build_object('es', 'Huayna Picchu vs Montaña Machu Picchu comparadas: dificultad, vistas, altura, duración y cupos. Cuál elegir según tu condición y vértigo. Guía local 2026.')
) on conflict (slug) do nothing;

-- ===== 5. PALCCOYO, LA MONTAÑA DE COLORES ALTERNATIVA =================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'palccoyo-montana-colores',
  jsonb_build_object('es', 'Palccoyo: la montaña de colores alternativa a Vinicunca'),
  jsonb_build_object('es', 'Palccoyo es la montaña de 7 colores más fácil y con menos gente que Vinicunca: caminata corta, tres cordilleras de color y bosque de piedras. Cómo llegar y cuándo ir.'),
  jsonb_build_object('es', $body$
# Palccoyo: la montaña de colores sin multitudes

Todo el mundo conoce Vinicunca, la famosa **Montaña de 7 Colores**. Pero pocos saben que existe una alternativa más fácil, con menos gente y, para muchos, igual de impresionante: **Palccoyo**. Si el soroche te preocupa o no quieres caminar tres horas entre multitudes, este es tu lugar.

## TL;DR — La respuesta corta

- **Palccoyo = la versión fácil** de la montaña de colores.
- **Caminata corta:** 30–45 minutos casi planos (vs. las 3 h exigentes de Vinicunca).
- **Mucha menos gente** y, a menudo, mejores precios.
- **Bonus:** tres montañas de colores + un "bosque de piedras".
- Igual estás a gran altura (~4,900 m): aclimatízate antes.

## Palccoyo vs Vinicunca: la comparación honesta

| | Palccoyo | Vinicunca (Rainbow Mountain) |
|--|----------|------------------------------|
| Caminata | 30–45 min, casi plana | 3–4 h ida y vuelta, exigente |
| Altura máxima | ~4,900 m | ~5,036 m |
| Multitudes | Pocas | Muchas |
| Atractivo extra | 3 cerros de color + bosque de piedras | El mirador icónico |
| Ideal para | Familias, poco tiempo, evitar esfuerzo | Quien quiere "la" montaña famosa |

Si quieres conocer a fondo la opción clásica, tenemos una guía dedicada: [Rainbow Mountain (Vinicunca)](/blog/rainbow-mountain-vinicunca-guia) y la página del [destino Rainbow Mountain](/destinos/rainbow-mountain).

## Por qué elegir Palccoyo

1. **La caminata es cortísima.** A casi 5,000 metros, caminar poco es un lujo enorme. La sensación de altura golpea menos.
2. **Vas a tu ritmo.** Sin la presión de las filas y la marea de gente de Vinicunca.
3. **Tres por una.** En Palccoyo se ven varias laderas de colores, no un solo mirador.
4. **El bosque de piedras.** Formaciones rocosas verticales que parecen un paisaje de otro planeta, único de esta zona.

## Cuándo ir

La mejor época es la **temporada seca (mayo a septiembre)**, cuando hay cielos despejados y los colores se ven nítidos. En temporada de lluvias el camino puede embarrarse y a veces cae nieve que cubre los colores. Revisa el [clima de Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes) antes de fijar fecha. Sea cual sea el mes, sal **temprano**: las nubes de la tarde suelen tapar las cumbres.

## Cómo es el día (a grandes rasgos)

Es una excursión de día completo desde Cusco. Sales de madrugada (suele incluir recojo del hotel), hay un trayecto largo en transporte hasta la zona de Checacupe/Palccoyo, una parada para desayunar y luego la caminata corta hasta los miradores. Por la tarde, regreso a Cusco. Lleva ropa de abrigo en capas, protector solar, agua y algo de efectivo para entradas o baños.

## La altura: no la subestimes

Aunque caminas poco, **sigues a casi 4,900 metros**. Eso es más alto que muchas cumbres de los Alpes. Por eso es clave llegar ya aclimatado: pasa al menos dos días en Cusco o el Valle Sagrado antes y lee nuestra guía para [prevenir el mal de altura](/blog/soroche-cusco-mal-de-altura). Justamente por su caminata corta, Palccoyo es la mejor opción de montaña de colores para quien sufre con la altura o viaja con niños o adultos mayores.

## ¿Vinicunca o Palccoyo?

- Elige **Vinicunca** si quieres la montaña icónica de las fotos y no te asusta una caminata dura en altura.
- Elige **Palccoyo** si priorizas comodidad, menos gente y un día más relajado sin renunciar al color.

Ambas son espectaculares; no hay opción equivocada, solo la que mejor encaja contigo.

## Vamos juntos a Palccoyo

En **Danfer Tours Cusco** te llevamos a Palccoyo con transporte cómodo, recojo del hotel, guía local y el ritmo correcto para la altura. Si dudas entre Palccoyo y Vinicunca, te ayudamos a decidir según tu condición. Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa [nuestros tours](/tours). La montaña de colores te espera, y la versión sin multitudes existe.
$body$),
  'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["palccoyo","montana-de-colores","vinicunca","rainbow-mountain","guia"]'::jsonb,
  true,
  now() - interval '5 hours',
  jsonb_build_object('es', 'Palccoyo: montaña de colores alternativa a Vinicunca'),
  jsonb_build_object('es', 'Palccoyo, la montaña de 7 colores fácil y sin multitudes: caminata corta de 40 min, 3 cordilleras de color y bosque de piedras. Cómo llegar y cuándo ir.')
) on conflict (slug) do nothing;

-- ===== Verificación rápida =============================================
select slug, title->>'es' as titulo, read_minutes, published_at
from public.blog_posts
where slug in (
  'donde-alojarse-en-cusco','como-llegar-a-cusco','tren-a-machu-picchu',
  'huayna-picchu-vs-montana-machu-picchu','palccoyo-montana-colores'
)
order by published_at desc;
