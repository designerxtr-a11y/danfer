-- =============================================================
-- ARCHIVO COMBINADO PARA APLICAR DE UNA SOLA VEZ
-- Pega TODO este contenido en el Supabase SQL editor y ejecuta.
-- Contiene los 3 batches de blog: 00013 (5) + 00014 (10) + 00015 (5)
-- = 20 posts nuevos. Todo idempotente (on conflict do nothing):
-- correrlo dos veces NO duplica ni rompe nada.
-- (Este archivo NO es una migracion; es solo para copy-paste.)
-- =============================================================

-- >>>>>>>>>>>>>>>>>>>> BATCH 00013 >>>>>>>>>>>>>>>>>>>>
-- =============================================================
-- Migración 00013 — Segunda tanda de blog posts SEO (long-tail)
-- 5 guías informacional/comercial que llenan huecos del blog y
-- enlazan a las páginas de destinos/tours (intención de compra).
-- Target keywords:
--   1. "como llegar a machu picchu desde cusco"
--   2. "rainbow mountain / vinicunca / montaña de 7 colores"
--   3. "que hacer en el valle sagrado de cusco"
--   4. "laguna humantay como visitar / dificultad"
--   5. "salkantay trek / alternativa camino inca"
-- NOTA portadas: se reusan URLs Unsplash ya vivas en posts previos
-- para no romper imágenes. Reemplazar por FOTOS PROPIAS desde
-- /admin/blog cuando estén disponibles (mejor para SEO y marca).
-- =============================================================

-- ===== 1. CÓMO LLEGAR A MACHU PICCHU DESDE CUSCO ======================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'como-llegar-a-machu-picchu-desde-cusco',
  jsonb_build_object('es', 'Cómo llegar a Machu Picchu desde Cusco: todas las opciones (2026)'),
  jsonb_build_object('es', 'No hay carretera directa a Machu Picchu. Te explicamos las 5 formas de llegar desde Cusco — tren, Camino Inca, Salkantay, Hidroeléctrica e Inca Jungle — con precios, tiempos y cuál conviene según tu viaje.'),
  jsonb_build_object('es', $body$
# Cómo llegar a Machu Picchu desde Cusco: todas las opciones (2026)

Llegar a Machu Picchu no es tan simple como subir a un bus. **No existe carretera directa** desde Cusco hasta la ciudadela: toda ruta combina tren, caminata o un largo trayecto por trochas. La opción que elijas cambia por completo el costo, la duración y la experiencia. En Danfer Tours operamos las cinco rutas que existen — aquí te las explicamos para que elijas la que mejor se ajusta a tu tiempo y presupuesto.

## Lo primero: Aguas Calientes es la puerta de entrada

Toda ruta termina en **Machu Picchu Pueblo** (antes llamado Aguas Calientes, 2.040 msnm), el único pueblo al pie de la montaña. Desde ahí subes a la ciudadela de dos formas:

- **Bus de subida (Consettur)**: 30 minutos por una carretera en zigzag. US$24 ida y vuelta para extranjeros.
- **Caminata**: 1,5 a 2 horas por escaleras incas empinadas. Gratis, pero exigente y a 2.400 m.

Lo que cambia entre rutas es **cómo llegas hasta Aguas Calientes**.

## Opción 1 — Tren (la forma clásica y más cómoda)

Es la vía que usan el 80% de los visitantes. El tren sale de dos estaciones:

- **Ollantaytambo** (Valle Sagrado): la principal. Desde Cusco son ~2 horas en auto/bus hasta la estación, luego **1,5 h de tren** a Aguas Calientes.
- **Poroy / San Pedro** (Cusco): operan solo en temporada seca y con menos frecuencia.

Dos empresas cubren la ruta: **PeruRail** e **IncaRail**, con servicios de distinto nivel:

| Servicio | Empresa | Precio ida aprox | Para quién |
|----------|---------|------------------|-----------|
| Expedition / Voyager | PeruRail / IncaRail | US$70–90 | Mejor relación precio |
| Vistadome / The 360 | PeruRail / IncaRail | US$110–170 | Ventanas panorámicas |
| Hiram Bingham | PeruRail | US$500+ | Lujo, comida gourmet |

**Recomendación**: para la mayoría, sal de Cusco temprano, toma el tren desde **Ollantaytambo** y vuelve el mismo día (Full Day) o duerme una noche en Aguas Calientes para entrar al amanecer. Mira nuestros [tours a Machu Picchu](/destinos/machu-picchu).

## Opción 2 — Camino Inca (el trek legendario)

El [Camino Inca clásico de 4 días](/destinos/camino-inca) es la única ruta que te lleva caminando por el sendero original inca hasta entrar por el **Intipunku (Puerta del Sol)** al amanecer. Requiere **permiso del SERNANP** (cupos limitados, se agotan con meses de anticipación) y buena condición física. Si es tu sueño, lee nuestra [guía paso a paso del Camino Inca](/blog/camino-inca-paso-a-paso-4-dias).

## Opción 3 — Salkantay Trek (la mejor alternativa sin permiso)

El **Salkantay 5D/4N** rodea el nevado Salkantay (6.271 m) y llega a Machu Picchu sin necesidad de permiso SERNANP. Paisajes incluso más variados que el Camino Inca: glaciares, lagunas turquesa y selva alta. Detalles en nuestra [guía del Salkantay Trek](/blog/salkantay-trek-guia).

## Opción 4 — Por Hidroeléctrica (la ruta económica)

La opción **mochilero**: minivan de Cusco a la central **Hidroeléctrica** (6–7 horas por Santa María y Santa Teresa), luego **2,5–3 horas caminando** junto a la vía férrea hasta Aguas Calientes. Cuesta una fracción del tren (US$30–60 ida y vuelta el transporte), pero es un día entero de viaje y **el tramo de carretera es peligroso en temporada de lluvias** (octubre–abril) por derrumbes. Ideal para quien tiene mucho tiempo y poco presupuesto.

## Opción 5 — Inca Jungle (aventura + adrenalina)

Versión joven y activa: combina **downhill en bicicleta**, rafting opcional, zipline y caminata, llegando a Machu Picchu en 3–4 días por la ruta de Santa Teresa. Muy popular entre mochileros que quieren acción sin el permiso del Camino Inca.

## Comparativa rápida

| Ruta | Duración a MP | Precio aprox (ida/vuelta) | Esfuerzo | Ideal para |
|------|---------------|---------------------------|----------|-----------|
| Tren | Medio día | US$140–340 | Bajo | Comodidad, poco tiempo |
| Camino Inca 4D | 4 días | US$650+ | Alto | Trekkers, experiencia única |
| Salkantay 5D | 5 días | US$550–700 | Alto | Aventura sin permiso |
| Hidroeléctrica | 1 día largo | US$30–60 + caminata | Medio | Presupuesto bajo |
| Inca Jungle | 3–4 días | US$250–350 | Medio-alto | Adrenalina |

## Documentos y reglas que no puedes olvidar

- **Pasaporte original** (no fotocopia): te lo piden en el tren, en la entrada y para el sello gratuito de Machu Picchu.
- **Entrada con circuito asignado** (1, 2, 3 o 4) y **turno de hora**: reserva con 1–2 meses de anticipación, más en temporada alta.
- **Guía obligatorio** para grupos grandes; tiempo máximo dentro: 3 horas.

## Nuestra recomendación

Si vienes con poco tiempo y quieres comodidad: **tren desde Ollantaytambo**. Si buscas la experiencia de tu vida y tienes condición: **Camino Inca** (o **Salkantay** si no consigues permiso). Si viajas con presupuesto ajustado: **Hidroeléctrica**.

¿Quieres que armemos tu ruta a Machu Picchu? Mira [todos nuestros tours](/tours) o revisa el [itinerario perfecto de 7 días en Cusco](/blog/itinerario-7-dias-cusco). Cualquier duda, escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com).
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["machu-picchu", "como-llegar", "tren", "transporte", "guia"]'::jsonb,
  true,
  now() - interval '2 hours',
  jsonb_build_object('es', 'Cómo llegar a Machu Picchu desde Cusco 2026: las 5 rutas'),
  jsonb_build_object('es', 'Las 5 formas de llegar a Machu Picchu desde Cusco: tren, Camino Inca, Salkantay, Hidroeléctrica e Inca Jungle. Precios, tiempos y cuál conviene según tu viaje.')
) on conflict (slug) do nothing;

-- ===== 2. RAINBOW MOUNTAIN (VINICUNCA) ================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'rainbow-mountain-vinicunca-guia',
  jsonb_build_object('es', 'Rainbow Mountain (Vinicunca): guía completa de la Montaña de 7 Colores'),
  jsonb_build_object('es', 'Todo sobre Rainbow Mountain en Cusco: altitud, dificultad, cómo llegar, qué llevar, mejor época y la diferencia entre Vinicunca, Palccoyo y Pallay Punchu. Consejos para no sufrir el soroche.'),
  jsonb_build_object('es', $body$
# Rainbow Mountain (Vinicunca): guía completa de la Montaña de 7 Colores

La **Montaña de 7 Colores** o **Vinicunca** se volvió, en menos de una década, el segundo atractivo más visitado de Cusco después de Machu Picchu. Sus franjas de colores —rojo, ocre, turquesa, lavanda— son producto de minerales depositados por millones de años y revelados por el deshielo. Pero es un destino **a 5.036 msnm**: la altitud más alta a la que llegará la mayoría de viajeros. Esta guía te dice cómo visitarla bien y sin sufrir.

## ¿Dónde está y qué es exactamente?

Vinicunca está en la cordillera del Vilcanota, a unas **3 horas en auto al sureste de Cusco**, en el distrito de Pitumarca. La cima del mirador está a **5.036 m** (algunos miden 5.200 m en el punto más alto). Los colores vienen de minerales: óxido de hierro (rojos), clorita (verdes), sulfato de calcio (blancos). Estuvo cubierta de nieve hasta hace ~15 años; el retroceso glaciar la dejó al descubierto.

## Cómo llegar

No hay transporte público práctico — se visita en **tour Full Day** desde Cusco:

- **Salida 4:00–4:30 am** de Cusco en bus.
- ~3 horas hasta el poblado de **Pitumarca / Phulawasipata** (punto de inicio del trek).
- Desayuno en el camino.
- **Trekking de 1,5–2 horas de subida** (5 km) hasta el mirador, más 1–1,5 h de bajada.
- Retorno a Cusco entre 5 y 7 pm.

Mira nuestro [tour a Rainbow Mountain](/destinos/rainbow-mountain).

## Dificultad real (sé honesto contigo mismo)

La caminata **no es técnica** —es un sendero ancho y de pendiente moderada— pero la **altitud lo cambia todo**. A 5.000 m respiras la mitad del oxígeno que a nivel del mar. Caminar 100 metros puede dejarte sin aliento. Claves:

- Camina **muy lento**, paso corto y constante.
- Para a respirar cada pocos minutos sin culpa.
- Hidrátate y mastica hoja de coca.
- Si te agotas, hay **caballos** (US$30–40 ida y vuelta) que te suben casi hasta el mirador final.

**Imprescindible**: aclimatarte **mínimo 2 días en Cusco** antes de venir. No hagas Rainbow Mountain el día que llegas de Lima. Lee nuestra [guía del soroche / mal de altura](/blog/soroche-cusco-mal-de-altura).

## Vinicunca vs Palccoyo vs Pallay Punchu

Hay tres "montañas de colores" y conviene saber la diferencia:

| Montaña | Altitud | Caminata | Multitudes | Ideal para |
|---------|---------|----------|-----------|-----------|
| **Vinicunca** | 5.036 m | 1,5–2 h subida | Altas | El clásico, colores intensos |
| **Palccoyo** | 4.900 m | 30–45 min, casi plano | Bajas | Familias, quien teme la altitud |
| **Pallay Punchu** | 4.700 m | 45 min empinada | Muy bajas | Aventureros, formación tipo "diente" |

Si la altitud o las multitudes te preocupan, **Palccoyo** es la mejor alternativa: mismos colores, caminata muchísimo más fácil y casi sin gente.

## Mejor época para ir

- **Mayo a septiembre (seca)**: cielos despejados, colores más visibles, sin barro. La mejor época. Eso sí, frío extremo al amanecer (−5 a 0 °C en la cima).
- **Octubre a abril (lluvias)**: riesgo de niebla que tapa los colores y de **nieve cubriendo la montaña** (los colores desaparecen bajo el blanco). Si vas en estos meses, prioriza días sin lluvia.

Más detalle en nuestra [guía del clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).

## Qué llevar

- Ropa **por capas**: térmica + polar + cortavientos impermeable (el clima cambia en minutos).
- Gorro, guantes y buff para el frío del amanecer.
- **Lentes de sol UV400 y protector solar SPF 50+**: a 5.000 m el sol quema brutal.
- Botas o zapatillas de trekking con buen grip.
- 2 litros de agua, snacks (chocolate, frutos secos), hoja o caramelos de coca.
- Efectivo en soles (baños, caballo, snacks en el camino).
- Poncho impermeable en temporada de lluvias.

## Consejos finales de guía local

- **Reserva el primer turno**: salir temprano evita la niebla del mediodía y a los grupos masivos.
- **No subestimes la altitud**: es más alta que el Campo Base del Everest (5.150 m está muy cerca).
- **Combínala bien**: ideal hacerla después de Humantay (4.200 m) como progresión de altitud. Mira la [Laguna Humantay](/destinos/laguna-humantay).
- Si viajas con niños o adultos mayores, elige **Palccoyo**.

¿Listo para ver los 7 colores? Reserva el [tour a Rainbow Mountain con Danfer Tours](/destinos/rainbow-mountain) — operamos con guía certificado y tanque de oxígeno en todas las excursiones de altura. Explora también [todos nuestros tours](/tours).
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  10,
  '["rainbow-mountain", "vinicunca", "montaña-7-colores", "trekking", "altitud"]'::jsonb,
  true,
  now() - interval '4 hours',
  jsonb_build_object('es', 'Rainbow Mountain Vinicunca 2026: guía, altitud y cómo visitar'),
  jsonb_build_object('es', 'Guía completa de Rainbow Mountain (Vinicunca): altitud 5.036 m, dificultad, cómo llegar, qué llevar, mejor época y Vinicunca vs Palccoyo vs Pallay Punchu.')
) on conflict (slug) do nothing;

-- ===== 3. QUÉ HACER EN EL VALLE SAGRADO ===============================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'que-hacer-valle-sagrado-cusco',
  jsonb_build_object('es', 'Qué hacer en el Valle Sagrado de Cusco: guía completa día a día'),
  jsonb_build_object('es', 'Pisac, Ollantaytambo, Chinchero, Maras y Moray: todo lo que puedes ver en el Valle Sagrado de los Incas. Itinerarios de 1 y 2 días, boleto turístico, mejor época y dónde dormir.'),
  jsonb_build_object('es', $body$
# Qué hacer en el Valle Sagrado de Cusco: guía completa día a día

El **Valle Sagrado de los Incas** es, para muchos, lo mejor de un viaje a Cusco — incluso por encima de Machu Picchu. Está más bajo que la ciudad (2.800 vs 3.400 m), lo que lo hace **ideal para aclimatarte** los primeros días, y concentra mercados andinos, fortalezas incas, terrazas imposibles y pueblos vivos. Esta guía te dice qué ver y cómo organizarlo.

## ¿Qué es el Valle Sagrado?

Es el valle del río **Urubamba (Vilcanota)**, al norte de Cusco, que se extiende aproximadamente entre Pisac y Ollantaytambo. Los incas lo consideraron sagrado por su fertilidad y su alineación con las estrellas; hoy guarda algunos de los sitios arqueológicos mejor conservados del imperio. Mira nuestros [tours al Valle Sagrado](/destinos/valle-sagrado).

## Los imperdibles del Valle Sagrado

### Pisac — mercado y ruinas
Famoso por su **mercado artesanal** (textiles, plata, cerámica) y por el **parque arqueológico** sobre el pueblo: andenes agrícolas en forma de abanico y el cementerio inca más grande conocido. Los **domingos y jueves** son los días grandes de mercado.

### Ollantaytambo — la fortaleza viva
El mejor ejemplo de urbanismo inca todavía habitado: calles, canales y casas originales del siglo XV. La **fortaleza** sobre el pueblo tiene terrazas monumentales y el Templo del Sol con bloques de seis metros. Además es la **estación de tren** principal hacia Machu Picchu, así que muchos viajeros duermen aquí.

### Chinchero — el balcón del valle
Pueblo a 3.760 m con una iglesia colonial sobre cimientos incas, terrazas y los mejores **talleres de textil tradicional** (verás el teñido natural con cochinilla y plantas). Punto alto con vistas espectaculares.

### Maras — las salineras
Más de **3.000 pozas de sal** escalonadas en la ladera, explotadas desde tiempos preincas y todavía trabajadas por familias locales. Una de las postales más fotografiadas del Perú.

### Moray — el laboratorio agrícola inca
Andenes circulares concéntricos que funcionaban como **laboratorio de cultivos**: cada nivel tiene un microclima distinto, con hasta 15 °C de diferencia entre el anillo superior y el fondo. Ingeniería agrícola adelantada a su tiempo.

## Itinerarios recomendados

### En 1 día (Valle Sagrado clásico)
Salida 8 am, retorno 7 pm: **Pisac (mercado + ruinas) → almuerzo buffet en Urubamba → Ollantaytambo**. Es el tour más común y cubre lo esencial.

### En 1 día (ruta Maras–Moray)
Para quien ya hizo el clásico o prefiere paisajes: **Chinchero → Maras (salineras) → Moray**, a veces llamado "Valle Sagrado VIP". Mira nuestro [tour Valle Sagrado VIP](/destinos/valle-sagrado).

### En 2 días (la forma ideal)
Día 1: Pisac y Ollantaytambo, **duermes en Ollantaytambo**. Día 2: Maras, Moray y Chinchero de regreso a Cusco — o tomas el tren a Machu Picchu desde Ollantaytambo. Es la combinación perfecta para aclimatarte y no correr.

## Boleto Turístico de Cusco (BTC)

La mayoría de sitios del valle (Pisac, Ollantaytambo, Chinchero, Moray) **no se pagan por separado**: necesitas el **Boleto Turístico**. Opciones:

- **Integral** (S/130, ~US$35): 16 sitios, válido 10 días. Conviene si harás city tour + Valle Sagrado.
- **Parcial Circuito III** (S/70): solo Valle Sagrado (Pisac, Ollantaytambo, Chinchero, Moray), válido 2 días.

**Maras (salineras) se paga aparte** (~S/10) porque es explotación comunal, no estatal.

## Mejor época para visitarlo

El valle es agradable casi todo el año. La **temporada seca (mayo–septiembre)** da cielos despejados ideales para fotos; la **de lluvias (octubre–abril)** lo pinta de un verde intenso espectacular, con lluvias generalmente por la tarde. Detalles en la [guía del clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).

## Dónde dormir

- **Ollantaytambo**: lo más práctico si vas a Machu Picchu al día siguiente (tren a la mano, duermes más bajo).
- **Urubamba**: el centro del valle, con la mayor oferta de hoteles de todo nivel.
- **Pisac**: ambiente bohemio, ideal para quedarse cerca del mercado.

## Consejo final

Haz el Valle Sagrado **antes** que Machu Picchu y los treks de altura: te aclimata gradualmente y entiendes el contexto inca antes de llegar a la ciudadela. Combínalo siguiendo nuestro [itinerario de 7 días en Cusco](/blog/itinerario-7-dias-cusco).

¿Listo para recorrerlo? Mira nuestros [tours al Valle Sagrado](/destinos/valle-sagrado) o explora [todos los tours](/tours). Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com).
$body$),
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["valle-sagrado", "pisac", "ollantaytambo", "maras-moray", "cusco"]'::jsonb,
  true,
  now() - interval '6 hours',
  jsonb_build_object('es', 'Qué hacer en el Valle Sagrado de Cusco 2026: guía e itinerarios'),
  jsonb_build_object('es', 'Pisac, Ollantaytambo, Chinchero, Maras y Moray: qué ver en el Valle Sagrado, itinerarios de 1 y 2 días, boleto turístico, mejor época y dónde dormir.')
) on conflict (slug) do nothing;

-- ===== 4. LAGUNA HUMANTAY ============================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'laguna-humantay-guia',
  jsonb_build_object('es', 'Laguna Humantay: cómo visitarla, dificultad y qué llevar'),
  jsonb_build_object('es', 'Guía completa de la Laguna Humantay (4.200 m): cómo llegar desde Cusco, dificultad real del trek, opción de caballo, qué llevar, mejor época y cómo evitar el mal de altura.'),
  jsonb_build_object('es', $body$
# Laguna Humantay: cómo visitarla, dificultad y qué llevar

La **Laguna Humantay** es una de las excursiones de un día más impresionantes de Cusco: una laguna de un turquesa irreal al pie del nevado Humantay (5.473 m), alimentada por su deshielo. Está a **4.200 msnm**, así que es exigente pero alcanzable para la mayoría con algo de aclimatación. Aquí va todo lo que necesitas saber antes de ir.

## ¿Dónde está la Laguna Humantay?

Está en la cordillera del Vilcabamba, a unas **3 horas en auto al noroeste de Cusco**, cerca de **Soraypampa**, el punto de partida del famoso trek Salkantay. El color turquesa viene de los **sedimentos minerales del glaciar** suspendidos en el agua. Mira nuestro [tour a la Laguna Humantay](/destinos/laguna-humantay).

## Cómo llegar

Se visita en **tour Full Day** desde Cusco:

- **Salida 4:00–5:00 am** en bus.
- ~3 horas hasta **Mollepata** (desayuno) y luego a **Soraypampa** (3.900 m), inicio del trek.
- **Trekking de 1,5 h de subida** (2 km pero empinados) hasta la laguna a 4.200 m, más ~1 h de bajada.
- Almuerzo de regreso y retorno a Cusco entre 5 y 7 pm.

## Dificultad real

El trek es **corto pero intenso**: solo 2 km de subida, pero ganas 300 metros de desnivel a más de 4.000 m de altitud, donde el oxígeno escasea. No es técnico, pero te dejará sin aliento si subes rápido. Consejos:

- Camina **lento y constante**, con pausas cortas.
- Lleva hoja de coca o caramelos de coca.
- Hay **caballos** (US$30 aprox) que te suben gran parte del trayecto si lo necesitas.

**Clave**: aclimatarte **al menos 2 días en Cusco** antes. Humantay suele usarse como "calentamiento" antes de Rainbow Mountain (5.036 m). Lee nuestra [guía del soroche](/blog/soroche-cusco-mal-de-altura).

## Qué llevar

- Ropa **por capas**: térmica, polar y cortavientos impermeable.
- Gorro, guantes y buff (hace frío al amanecer y arriba).
- **Lentes de sol UV400 y protector solar SPF 50+** — el sol a 4.200 m es intenso.
- Botas o zapatillas de trekking con grip.
- 1,5–2 litros de agua, snacks energéticos.
- Bastones de trekking (ayudan mucho en la bajada).
- Poncho impermeable en temporada de lluvias.
- Efectivo en soles (entrada comunal ~S/20, baños, caballo).

## Mejor época

- **Mayo a septiembre (seca)**: cielos despejados, mejor visibilidad del nevado y el turquesa más vivo. Frío al amanecer.
- **Octubre a abril (lluvias)**: paisaje verde, pero riesgo de niebla y senderos resbaladizos. La laguna sigue bonita pero el cielo nublado apaga el color.

Detalles en la [guía del clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).

## Humantay + Salkantay: la conexión

Soraypampa, punto de inicio de Humantay, es también el **día 1 del trek Salkantay** a Machu Picchu. Si te enamoras del paisaje en el Full Day, considera el trek completo: lee nuestra [guía del Salkantay Trek](/blog/salkantay-trek-guia).

## Consejo final

Humantay es **la mejor prueba de altitud de un día**: si la haces sin problemas, estás listo para Rainbow Mountain o un trek mayor. Si sufres, replantea tu itinerario de altura. Combínala con nuestro [itinerario de 7 días en Cusco](/blog/itinerario-7-dias-cusco).

¿Listo para verla? Reserva el [tour a la Laguna Humantay con Danfer Tours](/destinos/laguna-humantay) o mira [todos nuestros tours](/tours). Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com).
$body$),
  'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["laguna-humantay", "trekking", "altitud", "cusco", "full-day"]'::jsonb,
  true,
  now() - interval '8 hours',
  jsonb_build_object('es', 'Laguna Humantay 2026: cómo visitarla, dificultad y qué llevar'),
  jsonb_build_object('es', 'Guía de la Laguna Humantay (4.200 m): cómo llegar desde Cusco, dificultad del trek, opción de caballo, qué llevar, mejor época y consejos contra el soroche.')
) on conflict (slug) do nothing;

-- ===== 5. SALKANTAY TREK =============================================
insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'salkantay-trek-guia',
  jsonb_build_object('es', 'Salkantay Trek a Machu Picchu: la mejor alternativa al Camino Inca'),
  jsonb_build_object('es', 'Guía del Salkantay Trek 5D/4N: itinerario, dificultad, altitud del abra (4.630 m), qué llevar, precio y comparativa Salkantay vs Camino Inca. Ideal si no conseguiste permiso SERNANP.'),
  jsonb_build_object('es', $body$
# Salkantay Trek a Machu Picchu: la mejor alternativa al Camino Inca

Cuando los permisos del Camino Inca se agotan —y se agotan rápido— la pregunta es siempre la misma: *¿qué otra caminata me lleva a Machu Picchu?* La respuesta de la mayoría de guías locales es el **Salkantay Trek**. National Geographic lo nombró uno de los 25 mejores treks del mundo, y a diferencia del Camino Inca **no necesita permiso del SERNANP**. Esta guía te explica por qué es tan especial y cómo prepararte.

## ¿Qué es el Salkantay Trek?

Es una caminata de **5 días / 4 noches** (también hay versión de 4D/3N) que rodea el **nevado Salkantay (6.271 m)**, la montaña sagrada más imponente de la región, y desciende desde la puna glaciar hasta la selva alta antes de llegar a Machu Picchu. En total, unos **70 km** atravesando algunos de los paisajes más variados de los Andes peruanos.

## Por qué elegir Salkantay en vez del Camino Inca

- **No requiere permiso SERNANP**: puedes reservar con pocas semanas de anticipación (el [Camino Inca](/blog/camino-inca-paso-a-paso-4-dias) necesita 4–6 meses).
- **Paisajes más variados**: glaciares, la laguna turquesa Humantay, bosque nuboso y selva.
- **Más económico**: suele costar US$550–700 vs US$650+ del Camino Inca.
- **Menos regulado**: grupos y horarios más flexibles.

Lo que **no** tiene: no entra por la Puerta del Sol ni recorre el sendero inca empedrado con sitios arqueológicos en el camino. Es naturaleza pura, no arqueología.

## Itinerario resumido (5D/4N)

### Día 1 — Cusco → Soraypampa → Laguna Humantay
Traslado a Mollepata y Soraypampa (3.900 m). Caminata de aclimatación a la **[Laguna Humantay](/destinos/laguna-humantay)** (4.200 m) y regreso al campamento. Noche en domos o carpas.

### Día 2 — El día grande: Abra Salkantay (4.630 m)
El día más exigente: ascenso al **paso Salkantay (4.630 m)**, el punto más alto del trek, con vistas frente a frente al nevado. Luego un largo descenso hacia la selva alta y clima más cálido. ~22 km.

### Día 3 — Selva alta y Santa Teresa
Caminata descendente entre cascadas, plantaciones de café y granadilla. Opción de **baños termales de Cocalmayo** y zipline en Santa Teresa.

### Día 4 — Hacia Aguas Calientes
Caminata por la ruta de la Hidroeléctrica siguiendo la vía férrea hasta **Aguas Calientes** (Machu Picchu Pueblo). Noche en hotel (¡cama de verdad!).

### Día 5 — Machu Picchu
Subida temprano a **[Machu Picchu](/destinos/machu-picchu)**, tour guiado y retorno a Cusco en tren + bus.

## Dificultad y preparación

Es un trek **exigente** por la distancia, los desniveles y la altitud del abra. No necesitas ser atleta, pero sí llegar con preparación: caminatas de varias horas las semanas previas y, crucial, **2–3 días de aclimatación en Cusco** antes de empezar. Las noches del día 1 y 2 son muy frías (bajo cero). Revisa nuestra [guía del soroche](/blog/soroche-cusco-mal-de-altura).

## Qué llevar

- **Saco de dormir** −10 °C (alquilable).
- **Bastones de trekking** (muy útiles en los descensos largos).
- Botas de trekking ya probadas + sandalias para el campamento.
- Ropa por capas: del frío glaciar al calor de selva en un solo día.
- Casaca y pantalón impermeables, gorro, guantes.
- Lentes UV400, protector solar SPF 50+, repelente (selva).
- Linterna frontal, 2 L de agua, snacks, pasaporte original.
- Efectivo en soles para propinas, baños termales y extras.

## Mejor época

**Mayo a septiembre** (temporada seca) es la ideal: senderos firmes, cielos despejados, mejores vistas del nevado. **Febrero** es el peor mes (lluvias máximas, igual que en el Camino Inca). Más detalle en la [guía del clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).

## Salkantay vs Camino Inca: comparativa

| Criterio | Salkantay 5D | Camino Inca 4D |
|----------|--------------|----------------|
| Permiso SERNANP | No | Sí (cupos limitados) |
| Anticipación | 2–4 semanas | 4–6 meses |
| Punto más alto | 4.630 m | 4.215 m |
| Paisaje | Glaciar + selva | Sendero inca + ruinas |
| Llegada a MP | En tren/bus desde Aguas Calientes | Caminando por el Intipunku |
| Precio aprox | US$550–700 | US$650+ |
| Ideal para | Amantes de la naturaleza | Amantes de la historia inca |

## La decisión

Si valoras **paisajes de naturaleza brutales** y flexibilidad, o **no conseguiste permiso del Camino Inca**, el Salkantay es tu mejor opción —y para muchos, una experiencia incluso superior. Si tu sueño es caminar el sendero original inca y entrar por la Puerta del Sol, espera y reserva el [Camino Inca](/destinos/camino-inca).

¿Listo para el reto? Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o mira [todos nuestros tours](/tours) y armamos tu trek a Machu Picchu.
$body$),
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  11,
  '["salkantay", "trekking", "machu-picchu", "camino-inca", "alternativa"]'::jsonb,
  true,
  now() - interval '10 hours',
  jsonb_build_object('es', 'Salkantay Trek 2026: guía, itinerario y vs Camino Inca'),
  jsonb_build_object('es', 'Guía del Salkantay Trek 5D/4N a Machu Picchu: itinerario, dificultad, abra a 4.630 m, qué llevar, precio y comparativa Salkantay vs Camino Inca.')
) on conflict (slug) do nothing;

select slug, title->>'es' as titulo, read_minutes, published_at
from public.blog_posts
order by published_at desc;

-- >>>>>>>>>>>>>>>>>>>> BATCH 00014 >>>>>>>>>>>>>>>>>>>>
-- =============================================================
-- Migración 00014 — Tercera tanda de blog posts SEO (long-tail)
-- 10 guías informacional/comercial. El blog pasa de 10 a 20 posts.
-- Cada una sobre una keyword distinta y real (sin canibalizar),
-- con enlaces internos a /destinos/*, /tours y otros posts.
-- Redactadas con voz de guía local (Danfer Tours Cusco), ES-only.
-- Keywords:
--   1. cuanto cuesta viajar a machu picchu (presupuesto)
--   2. boleto turistico cusco
--   3. entradas machu picchu / circuitos 2026
--   4. maras y moray
--   5. city tour cusco
--   6. que llevar a cusco (equipaje)
--   7. que hacer en cusco en 3 dias
--   8. machu picchu en 2 dias 1 noche
--   9. que comer en cusco (gastronomia)
--  10. inti raymi (Fiesta del Sol, 24 junio)
-- NOTA portadas: reusan URLs Unsplash ya vivas en posts previos
-- para no romper imágenes. Reemplazar por FOTOS PROPIAS desde
-- /admin/blog cuando estén disponibles (mejor SEO + marca).
-- =============================================================

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'cuanto-cuesta-viajar-a-machu-picchu',
  jsonb_build_object('es', 'Cuánto cuesta viajar a Machu Picchu en 2026: presupuesto real'),
  jsonb_build_object('es', 'Te explico con cifras reales cuánto cuesta viajar a Machu Picchu y Cusco en 2026, con tres presupuestos: mochilero, estándar y premium.'),
  jsonb_build_object('es', $body$
# Cuánto cuesta viajar a Machu Picchu en 2026: el presupuesto real

Es la pregunta que más me hacen los viajeros cuando escriben a Danfer Tours: "Danfer, ¿cuánto cuesta de verdad llegar a Machu Picchu?". Y entiendo la duda, porque en internet encuentras cifras que van desde 60 dólares hasta miles, sin que nadie te explique qué incluye cada número. Aquí, como guía local que vive en Cusco, te doy el desglose honesto y al detalle para que armes tu presupuesto sin sorpresas.

## Lo que de verdad pagas para llegar a Machu Picchu

A Machu Picchu no se llega "directo" desde Cusco. Es una cadena de costos que se suman: transporte hasta Ollantaytambo o la Hidroeléctrica, tren o caminata, bus de subida, la entrada y, si quieres entender lo que ves, un guía. Vamos concepto por concepto con precios de 2026.

### La entrada a Machu Picchu

La entrada para extranjeros cuesta alrededor de **S/152** (unos US$41) en el circuito más común. Hay circuitos más económicos y otros más caros según lo que incluyan (Huayna Picchu o Montaña suben el precio a S/200 o más). Los peruanos pagan menos, alrededor de S/64. Importante: se compran online y se agotan en temporada alta, así que reserva con semanas de anticipación. Te explico el detalle en mi guía de [cómo llegar a Machu Picchu desde Cusco](/blog/como-llegar-a-machu-picchu-desde-cusco).

### El tren

El tren es el gasto que más varía. Un boleto de ida entre Ollantaytambo y Aguas Calientes cuesta entre **US$70 y US$170** según el servicio (Expedition, Vistadome o el lujoso Hiram Bingham, que se va a varios cientos). Ida y vuelta, calcula entre US$140 y US$340 por persona. Si quieres ahorrar, la ruta por la Hidroeléctrica reemplaza el tren por van más caminata y baja muchísimo el costo.

### El bus de subida (Consettur)

Desde Aguas Calientes hasta la ciudadela hay 400 metros de subida en zigzag. El bus de Consettur cuesta **US$24 ida y vuelta** para extranjeros (alrededor de US$12 por tramo). Puedes subir caminando gratis, pero son unos 90 minutos de escaleras empinadas; mucha gente sube en bus y baja a pie.

### El guía

Un guía oficial en la ciudadela cuesta entre **US$30 y US$60** según si es privado o compartido y el idioma. No es obligatorio, pero te aseguro que Machu Picchu sin guía es solo piedras bonitas; con guía entiendes la historia, la astronomía inca y por qué ese lugar te deja sin aliento.

## Tres presupuestos para Machu Picchu y Cusco (por persona)

Aquí está el corazón del artículo. Armé tres perfiles realistas para una experiencia centrada en Machu Picchu más un par de días en Cusco. Los montos son aproximados en dólares por persona.

| Concepto | Mochilero | Estandar | Premium |
| --- | --- | --- | --- |
| Entrada Machu Picchu | US$41 | US$41 | US$55 |
| Tren ida y vuelta | US$0 (Hidroelectrica) | US$160 | US$340 |
| Transporte/van | US$40 | US$30 | US$0 (incluido) |
| Bus Consettur | US$0 (a pie) | US$24 | US$24 |
| Guia | US$15 (compartido) | US$30 | US$60 (privado) |
| Hotel (2 noches Cusco + 1 Aguas Calientes) | US$60 | US$180 | US$450 |
| Comidas (4 días) | US$48 | US$100 | US$220 |
| Tours extra (Valle Sagrado, etc.) | US$35 | US$80 | US$200 |
| **Total aprox.** | **US$239** | **US$645** | **US$1,349** |

### Qué significa cada perfil

**Mochilero:** vas por la Hidroeléctrica, duermes en hostales, comes en menús locales (S/12-18 el almuerzo) y subes caminando. Es duro físicamente pero totalmente viable. Aquí Machu Picchu te puede salir por menos de US$250 en total.

**Estándar:** es el viaje que recomiendo a la mayoría. Tren Expedition o Vistadome, hoteles cómodos de 3 estrellas, guía compartido y algún tour adicional. Equilibrio perfecto entre comodidad y precio.

**Premium:** tren de lujo, hoteles boutique, guía privado y traslados puerta a puerta. Si vienes pocos días y quieres que todo fluya sin esfuerzo, esta es tu opción.

## El atajo: un tour Full Day todo incluido

Si no quieres armar tú mismo cada pieza del rompecabezas, un **tour Full Day a Machu Picchu** cuesta entre **US$380 y US$450** por persona e incluye transporte, tren, bus Consettur, entrada y guía en un solo día desde Cusco. Es la forma más cómoda y la que eligen quienes tienen poco tiempo. Puedes ver nuestras opciones en [nuestros tours](/tours) o conocer más del destino en [Machu Picchu](/destinos/machu-picchu).

## Gastos que la gente olvida presupuestar

Más allá de Machu Picchu, hay costos pequeños que suman:

- **Boleto Turístico del Cusco:** S/130 (extranjeros) si vas a visitar Sacsayhuamán, el Valle Sagrado y otros sitios. Casi indispensable.
- **Propinas:** en Cusco se acostumbra dejar algo al guía y al chofer; calcula US$5-10 por día.
- **Agua, snacks y entradas menores:** S/30-50 al día.
- **Aclimatación:** llega 1-2 días antes a Cusco (3,400 m). No es un gasto grande, pero esas noches extra de hotel cuentan.
- **Vuelos internos Lima-Cusco:** entre US$80 y US$200 ida y vuelta según la fecha.

## Cómo gastar menos sin arruinar la experiencia

Después de años acompañando viajeros, estos son mis consejos para estirar el presupuesto:

1. **Viaja en temporada media** (abril-mayo o septiembre-octubre): buen clima y precios más amables. Te lo cuento en mi guía de la [mejor época para Machu Picchu](/blog/mejor-epoca-machu-picchu).
2. **Reserva la entrada y el tren con anticipación:** los servicios baratos se agotan primero y te quedas con los caros.
3. **Quédate más días en Cusco:** prorratea costos como el guía y el transporte uniéndote a grupos. Si tienes una semana, mira mi [itinerario de 7 días por Cusco](/blog/itinerario-7-dias-cusco).
4. **Come donde comen los locales:** un menú del día cuesta una fracción de lo que pagas en un restaurante turístico.

## Entonces, ¿cuánto necesito en total?

Para un viaje de 4 días centrado en Machu Picchu y Cusco, un presupuesto realista por persona es: **US$240-300 mochilero**, **US$600-750 estándar** y **US$1,300 o más premium**. A eso suma tus vuelos y cualquier extensión al Valle Sagrado, Rainbow Mountain o la Laguna Humantay.

Lo importante es que ahora tienes los números reales para decidir, no cifras infladas de blogs que nunca pisaron Cusco.

## Listo para planear tu viaje a Machu Picchu

En Danfer Tours armamos tu viaje a la medida de tu presupuesto, sea mochilero o premium, y te decimos con transparencia cuánto cuesta cada cosa. Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) y cuéntanos tus fechas, o revisa directamente [nuestros tours a Machu Picchu](/tours) para reservar hoy. Cusco te espera, y nosotros te ayudamos a llegar sin pagar de más.
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["machu-picchu","presupuesto","costos","viaje","guia"]'::jsonb,
  true,
  now() - interval '1 hours',
  jsonb_build_object('es', 'Cuánto cuesta viajar a Machu Picchu 2026'),
  jsonb_build_object('es', 'Cuánto cuesta viajar a Machu Picchu en 2026: presupuesto real con tren, entrada, bus y guía. Desglose mochilero, estándar y premium en dólares.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'boleto-turistico-cusco',
  jsonb_build_object('es', 'Boleto Turístico de Cusco: qué incluye, precio y cuál comprar'),
  jsonb_build_object('es', 'Te explicamos qué es el Boleto Turístico de Cusco, cuánto cuesta, qué sitios cubre cada modalidad y cómo elegir el mejor para tu viaje.'),
  jsonb_build_object('es', $body$
# Boleto Turístico de Cusco: qué incluye, precio y cuál comprar

En Danfer Tours Cusco nos preguntan casi a diario lo mismo: "¿necesito el Boleto Turístico y cuál me conviene?". La respuesta corta es sí, casi siempre lo vas a necesitar; la larga es la que te cuento aquí, con precios reales, los sitios que cubre cada modalidad y los errores que vemos cometer a los viajeros cada semana.

## ¿Qué es el Boleto Turístico de Cusco (BTC)?

El Boleto Turístico de Cusco, o BTC, es una entrada única que agrupa el acceso a 16 atractivos del Cusco y el Valle Sagrado. Lo administra el COSITUC (Comité de Servicios Integrados Turístico Culturales del Cusco), y existe desde hace décadas precisamente para ordenar el ingreso a sitios arqueológicos, museos y centros culturales que de otro modo tendrías que pagar uno por uno.

La idea es simple: en lugar de comprar entradas sueltas en cada parque, llevas un solo boleto físico que el guardaparque pincha o sella al ingresar. No es opcional en la mayoría de los sitios principales; sin él, no te dejan pasar a lugares como Sacsayhuamán o Pisac.

## ¿Qué incluye y qué NO incluye?

Aquí está la confusión número uno. Mucha gente cree que el BTC "abre todas las puertas" del Cusco, y no es así. Cubre los sitios administrados por el COSITUC, pero los íconos más famosos se pagan por separado.

**Sí incluye (entre los 16 sitios):**

- Sacsayhuamán, Q'enqo, Puka Pukara y Tambomachay (las ruinas cercanas a la ciudad)
- Pisac, Ollantaytambo y Chinchero (Valle Sagrado)
- Moray (los andenes circulares)
- Tipón y Pikillacta (Valle Sur)
- Museos: Museo de Arte Contemporáneo, Museo Histórico Regional, Museo de Arte Popular, Museo de Sitio del Qoricancha y el Monumento a Pachacuteq
- Centro Qosqo de Arte Nativo (espectáculo de danzas folklóricas por la noche)

**NO incluye (se pagan aparte):**

- **Machu Picchu** (entrada independiente vía la web oficial del Ministerio de Cultura)
- **Catedral del Cusco** y el circuito religioso
- **Qoricancha** (el templo en sí; el BTC solo cubre su museo de sitio, que es otra cosa)
- **Salineras de Maras** (administradas por la comunidad local)
- Iglesia de la Compañía, San Blas y otros templos

Si tu plan es Machu Picchu + Catedral + Qoricancha + Maras, ninguno de esos entra en el Boleto Turístico. Es el malentendido más caro que vemos.

## Modalidades y precios del Boleto Turístico

El BTC se vende en dos grandes formatos: el **Integral**, que cubre los 16 sitios, y el **Parcial**, dividido en tres circuitos más baratos pero limitados. Estos son los precios vigentes para 2026:

| Modalidad | Precio adulto | Validez | Sitios que cubre |
|---|---|---|---|
| Integral | S/130 | 10 días | Los 16 atractivos completos |
| Parcial Circuito I | S/70 | 1 día | Sacsayhuamán, Q'enqo, Puka Pukara, Tambomachay |
| Parcial Circuito II | S/70 | 2 días | Museos de la ciudad, Centro Qosqo de Arte Nativo, Tipón, Pikillacta |
| Parcial Circuito III | S/70 | 2 días | Pisac, Ollantaytambo, Chinchero, Moray |

### ¿Cuál te conviene?

Nuestra recomendación honesta depende de cuántos días tengas:

- **Vas a quedarte 4 días o más y harás city tour + Valle Sagrado:** compra el **Integral (S/130)**. Sale más barato que dos o tres parciales juntos y tienes 10 días de margen, suficiente para repartir las visitas sin correr.
- **Solo te interesa el Valle Sagrado (Pisac, Ollantaytambo, Moray):** el **Parcial Circuito III (S/70)** es ideal y te ahorra dinero.
- **Solo harás el city tour de las ruinas cercanas:** el **Parcial Circuito I (S/70)** cubre exactamente eso.

Ojo con la validez: el Circuito I dura **un solo día**, así que no lo compres "por adelantado" pensando usarlo el fin de semana. Empieza a contar desde el momento del ingreso.

## Descuentos: estudiantes, peruanos y CAN

No todos pagan S/130. Hay tarifas reducidas que vale la pena conocer:

- **Estudiantes con carné ISIC vigente:** pagan aproximadamente la mitad. El carné universitario común no siempre lo aceptan; el que funciona sin discusión es el **ISIC internacional**. Llévalo físico.
- **Estudiantes menores de 18 años:** también acceden a tarifa reducida presentando documento.
- **Peruanos y ciudadanos de la Comunidad Andina (CAN — Bolivia, Colombia, Ecuador):** tienen tarifa nacional, más baja que la de extranjeros, presentando DNI o documento de identidad del país andino.
- **Niños menores de 10 años:** generalmente ingresan gratis o con descuento, dependiendo del sitio.

Un consejo de guía: ten siempre el documento original a mano. En la puerta de cada sitio te lo pueden pedir junto al boleto, y sin él te cobran tarifa completa.

## ¿Dónde comprar el Boleto Turístico?

Tienes dos caminos confiables:

1. **Oficina del COSITUC en el centro del Cusco** (Av. El Sol 103, Galerías Turísticas). Es el lugar oficial, pagas en efectivo o con tarjeta y te entregan el boleto físico al instante. Te recomendamos pasar el primer día, apenas llegues, para no perder tiempo.
2. **En la boletería de los propios sitios.** Puedes comprarlo al ingresar al primer atractivo (por ejemplo, en Sacsayhuamán o Pisac). Funciona, aunque las colas en temporada alta pueden ser largas.

Evita comprarlo a revendedores en la calle: el boleto auténtico es nominativo y trae los recuadros para sellar. Si viajas con nosotros, nosotros nos encargamos de la logística para que no pierdas ni una mañana en trámites.

## Cómo encaja el BTC en tu itinerario

Si todavía estás armando tu ruta, el Boleto Turístico marca el orden lógico de las visitas. Para sacarle el jugo al Integral, lo ideal es combinar un día de city tour con uno o dos días en el Valle Sagrado. Te dejamos guías que usamos con nuestros propios clientes:

- Para planear las paradas imperdibles, lee [qué hacer en el Valle Sagrado del Cusco](/blog/que-hacer-valle-sagrado-cusco).
- Si tienes una semana completa, este [itinerario de 7 días por Cusco](/blog/itinerario-7-dias-cusco) reparte los sitios del boleto sin agobios.
- Conoce a fondo cada pueblo y andén en nuestra página de [destinos del Valle Sagrado](/destinos/valle-sagrado).
- Y si prefieres que organicemos todo (entradas, transporte y guía), revisa nuestros [tours en Cusco](/tours).

## Recomendaciones finales de Danfer Tours

Resumiendo lo que de verdad importa: el BTC es obligatorio para los sitios principales, pero **no** cubre Machu Picchu, la Catedral, el Qoricancha ni las salineras de Maras; presupuéstalos aparte. Compra el **Integral (S/130)** si vas a moverte por la ciudad y el Valle, o un **Parcial (S/70)** si tu plan es más corto. Lleva siempre tu documento original para acceder a descuentos, y cómpralo en el COSITUC el primer día.

¿Quieres que armemos un itinerario donde el Boleto Turístico rinda al máximo y no pagues entradas que no vas a usar? Escríbenos a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o mira directamente nuestros [tours en Cusco](/tours): te ayudamos a elegir la modalidad correcta y a coordinar cada visita para que disfrutes el Cusco sin complicaciones.
$body$),
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["boleto-turistico","cusco","entradas","precios","guia"]'::jsonb,
  true,
  now() - interval '2 hours',
  jsonb_build_object('es', 'Boleto Turístico de Cusco: precios y qué incluye'),
  jsonb_build_object('es', 'Guía del Boleto Turístico de Cusco: precio (S/130 integral, S/70 parcial), qué sitios incluye, descuentos y dónde comprarlo.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'entradas-machu-picchu-circuitos',
  jsonb_build_object('es', 'Entradas a Machu Picchu 2026: circuitos, precios y cómo comprarlas'),
  jsonb_build_object('es', 'Te explico paso a paso los circuitos de Machu Picchu, los tipos de boleto, precios 2026 y cómo conseguir tu entrada con turno de la mañana sin sorpresas.'),
  jsonb_build_object('es', $body$
# Entradas a Machu Picchu 2026: circuitos, precios y cómo comprarlas

Soy guía local en Cusco y la pregunta que más me hacen es la misma: "¿cómo consigo mis entradas a Machu Picchu y cuál circuito elijo?". Desde que el Ministerio de Cultura reorganizó el ingreso por circuitos, comprar el boleto correcto se volvió la parte más importante de planear tu viaje. Aquí te lo explico claro, con precios aproximados de 2026, las rutas que verás en cada circuito y mis trucos para conseguir el turno de la mañana, que es el bueno.

## Cómo funciona el ingreso hoy

Machu Picchu ya no es "entras y caminas por donde quieras". El ingreso está organizado en **circuitos** con rutas fijas y unidireccionales: avanzas en un solo sentido y **no hay reingreso**. Estos son los puntos que tienes que tener grabados antes de comprar:

- **5.940 visitantes por día**, repartidos en **turnos horarios**. Tu boleto trae una hora de ingreso; respétala.
- Tienes un máximo de **3 horas dentro** de la llaqta. Suena poco, pero alcanza de sobra para el recorrido.
- **Pasaporte original obligatorio**, el mismo con el que compraste. Sin él no entras, aunque tengas el boleto.
- **Guía recomendado** (y en varias rutas, prácticamente indispensable): un buen guía convierte las piedras en historia y te ayuda a no perder tiempo.
- Sentido único y sin reingreso: si sales, ya no vuelves a entrar con el mismo boleto.

Si todavía estás viendo el "cómo y cuándo" del viaje en general, te dejo dos lecturas que combinan perfecto con esta: [cómo llegar a Machu Picchu desde Cusco](/blog/como-llegar-a-machu-picchu-desde-cusco) y [la mejor época para visitar Machu Picchu](/blog/mejor-epoca-machu-picchu).

## Los tres circuitos de Machu Picchu

El santuario se divide en tres grandes circuitos, y cada uno tiene sub-rutas. Resumiendo mucho: el **Circuito 1** es panorámico (las mejores fotos desde arriba), el **Circuito 2** es el clásico y más completo (incluye la postal de toda la vida y baja al sector urbano), y el **Circuito 3** es el "realeza" o inferior, más corto y por la parte baja. Esta tabla te ayuda a decidir.

| Circuito | Sub-rutas | Qué ves | Para quién |
|---|---|---|---|
| **Circuito 1 — Panorámico** | 1-A (con Montaña Machupicchu), 1-B (terraza superior / Inti Punku según disponibilidad) | Vistas desde lo alto, la foto postal aérea, terrazas agrícolas superiores. No baja al sector urbano | Quienes priorizan fotos y panorámicas; combinables con caminata exigente |
| **Circuito 2 — Clásico (el más completo)** | 2-A (terraza superior clásica), 2-B (terraza inferior) | La **postal clásica** de Machu Picchu, recorrido por el sector urbano: templos, plazas, el Templo del Sol, recintos principales | La mayoría de visitantes; primera vez; quien quiere "verlo todo" |
| **Circuito 3 — Realeza / Inferior** | 3-A (con Huayna Picchu), 3-B (con Huchuy Picchu), 3-C (diseño industrial-bajo) | Parte baja de la ciudadela, sector de la realeza, templos del nivel inferior. No incluye la panorámica alta | Quien combina con Huayna Picchu; segunda visita; ritmo más tranquilo |

Mi recomendación honesta para una primera vez: **Circuito 2**. Es el que tiene la foto clásica que tienes en la cabeza y a la vez te mete entre los templos. Si tu sueño es subir una montaña, ahí entran los boletos combinados.

## Boletos combinados: Huayna Picchu y Montaña Machupicchu

Hay dos montañas que se compran junto con tu entrada y **no se venden por separado**:

- **Machu Picchu + Huayna Picchu**: la montaña empinada que aparece detrás en las fotos. Subida exigente, escaleras talladas, vistas de vértigo. Va con el **Circuito 3** (sub-ruta con Huayna Picchu).
- **Machu Picchu + Montaña Machupicchu**: más alta y de subida larga pero menos vertical; panorámicas enormes de todo el valle. Va con el **Circuito 1**.

Lo importante: los **cupos son escasos**. Cada montaña tiene pocos turnos al día y se agotan rápido. Te recomiendo **reservar con 1 a 2 meses de anticipación**, y en **temporada alta hasta 4 a 6 meses antes** si quieres una fecha y hora concretas. Si tu viaje cae entre mayo y septiembre, no lo dejes para última hora.

## Precios aproximados 2026

Los precios cambian cada temporada y dependen de tu categoría (extranjero, nacional, estudiante, niño). Te doy los valores aproximados para **extranjero adulto** en 2026, que es lo que la mayoría me consulta:

| Tipo de boleto | Precio aprox. (extranjero adulto) |
|---|---|
| Solo Machu Picchu (un circuito) | **S/ 152** |
| Machu Picchu + Huayna Picchu | **S/ 200** |
| Machu Picchu + Montaña Machupicchu | similar al combinado de Huayna Picchu |

Para que tengas referencia en otra moneda, S/ 152 ronda los **US$ 40** según el tipo de cambio del día. A esto súmale el tren, el bus de Aguas Calientes a la entrada y el guía: por eso siempre digo que el boleto es solo una parte del presupuesto total.

## Dónde comprar tus entradas

Hay dos caminos seguros y uno que te ahorra dolores de cabeza:

1. **Web oficial del Ministerio de Cultura** (la plataforma de venta de boletos, conocida como "tuboleto"). Es la fuente oficial, compras directo y pagas con tarjeta. Necesitas los datos de tu pasaporte exactos.
2. **Con una agencia de confianza** (como nosotros): nos encargamos de conseguir el circuito, el turno y los combinados de montaña, y los integramos con tren, bus y guía. Es la opción más cómoda, sobre todo si quieres Huayna Picchu o Montaña en temporada alta.

Mi consejo: si tu fecha es flexible y vas en temporada baja, comprar tú mismo en la web oficial funciona bien. Si vas en temporada alta, quieres una montaña, o simplemente no quieres arriesgarte con cupos y horarios, deja que una agencia lo arme por ti.

## Cómo conseguir el turno de la mañana

El turno de la mañana es el más codiciado: luz suave para las fotos, menos calor y, con suerte, la neblina levantándose entre las ruinas. Estos son mis trucos:

- **Compra apenas se abran las ventas** para tu fecha; los primeros turnos (alrededor de las 6:00–8:00) vuelan.
- **Sé flexible con el día**: a veces moviendo tu visita un día consigues la mañana que el día anterior estaba lleno.
- **Reserva con anticipación real**: 1 a 2 meses normalmente, 4 a 6 en temporada alta.
- **Hospédate en Aguas Calientes** la noche previa si quieres el primer bus; subir desde el pueblo de madrugada es la forma de llegar fresco al turno temprano.
- Si quieres exprimir el destino, considera el plan de [Machu Picchu en 2 días y 1 noche](/blog/machu-picchu-2-dias-1-noche): te da margen para un turno temprano sin correr.

## Resumen rápido antes de comprar

- Elige circuito: **2** para primera vez, **1** para panorámicas, **3** si vas con Huayna Picchu.
- Decide si quieres montaña (Huayna Picchu o Montaña Machupicchu) y reserva con tiempo.
- Compra en la **web oficial** o con **agencia**; ten el pasaporte a la mano.
- Apunta a un **turno de mañana** y respeta tu hora de ingreso.
- Lleva tu **pasaporte original** el día de la visita: sin él no entras.

Si quieres conocer más del destino antes de decidir, mira nuestra página de [Machu Picchu](/destinos/machu-picchu) con todo el detalle.

## ¿Te ayudo a conseguir tus entradas?

Conseguir el circuito correcto, el turno de la mañana y los cupos de montaña puede ser un dolor de cabeza, sobre todo en temporada alta. Nosotros lo hacemos todos los días y lo integramos con tu tren, bus y guía. Escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa nuestros [tours a Machu Picchu](/tours) y armamos tu visita a tu medida.
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["machu-picchu","entradas","circuitos","como-comprar","2026"]'::jsonb,
  true,
  now() - interval '3 hours',
  jsonb_build_object('es', 'Entradas a Machu Picchu 2026: circuitos y precios'),
  jsonb_build_object('es', 'Circuitos, tipos de boleto, precios 2026 y cómo comprar tus entradas a Machu Picchu. Guía local con trucos para el turno de la mañana.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'maras-moray-tour',
  jsonb_build_object('es', 'Maras y Moray: guía local para visitar las salineras y los andenes circulares'),
  jsonb_build_object('es', 'Te cuento cómo visitar las Salineras de Maras y los andenes de Moray desde Cusco: qué son, cómo llegar, mejor hora, entradas y qué llevar.'),
  jsonb_build_object('es', $body$
# Maras y Moray: guía local para visitar las salineras y los andenes circulares

Soy guía en Cusco y, si me preguntas qué dos lugares del Valle Sagrado dejan a mis pasajeros con la boca abierta en una sola mañana, te digo sin dudar: **las Salineras de Maras y los andenes de Moray**. Uno es un tablero blanco de miles de pozas de sal colgadas en la ladera; el otro, un anfiteatro de terrazas circulares que los incas usaron como laboratorio agrícola. Están a pocos minutos uno del otro y se visitan juntos en medio día. Aquí te explico todo como se lo cuento a quien viaja conmigo.

## Qué son las Salineras de Maras

Las Salineras de Maras son más de **3.000 pozas de sal** escalonadas sobre la quebrada de Qaqawiñay. El agua brota de un manantial subterráneo cargado de sal y, desde tiempos **preincas**, las familias de la comunidad la canalizan hacia pequeñas terrazas donde el sol la evapora y deja la sal cristalizada.

Lo que más me gusta contar es que esto no es un museo: es una **explotación comunal y familiar** que sigue viva. Cada poza tiene dueño dentro de la comunidad de Maras, y la cosecha de sal se reparte por familias, tal como hace siglos. Cuando caminas por los senderos angostos entre las pozas, estás viendo trabajo real, no una escenografía para turistas.

La entrada a las Salineras cuesta alrededor de **S/10** por persona y se paga **aparte del Boleto Turístico** (este sitio no está incluido). Es una tarifa que va directo a la comunidad, así que pagarla es apoyar a quienes mantienen vivo el lugar.

## Qué es Moray

Moray, a pocos kilómetros, es completamente distinto. Son **andenes circulares concéntricos** que descienden formando enormes anillos, como un anfiteatro hundido en la tierra. Para los incas fue un **laboratorio agrícola**: un lugar para experimentar con cultivos a distintas alturas.

El detalle genial es el de los **microclimas**. Entre la terraza más alta y la del fondo puede haber hasta **15 °C de diferencia** de temperatura. Esto permitía a los incas probar cómo se comportaban papas, maíz y otras especies en condiciones que imitaban distintos pisos ecológicos del Imperio, antes de llevarlos a sembrar en su región de origen. Es, básicamente, agricultura científica hace 500 años.

Moray **sí está cubierto por el Boleto Turístico** de Cusco, así que con tu boleto general (o el parcial del Valle Sagrado) entras sin pagar extra. Si aún no lo tienes claro, lee mi guía del [Boleto Turístico de Cusco](/blog/boleto-turistico-cusco) para elegir la modalidad que te conviene.

## Maras vs Moray: comparativa rápida

| Aspecto | Salineras de Maras | Andenes de Moray |
|---|---|---|
| Qué es | Pozas de sal preincas, explotación comunal | Andenes circulares, laboratorio agrícola inca |
| Altitud aprox. | ~3.380 m s. n. m. | ~3.500 m s. n. m. |
| Entrada | ~S/10 (aparte del Boleto Turístico) | Incluida en el Boleto Turístico |
| Tiempo de visita | 45–60 min | 45–60 min |
| Mejor hora | Mañana (mejor luz, menos gente) | Mañana o media mañana |

## Cómo llegar desde Cusco

Desde Cusco, Maras y Moray están a poco más de **1 hora** en auto. La forma más cómoda es ir en un **tour de medio día**, que sale por la mañana, o sumarlos a un **full day** del Valle Sagrado. La ruta es por la carretera a Urubamba y luego un desvío hacia el pueblo de Maras.

Si quieres aprovechar el día, lo ideal es **combinar Maras y Moray con Chinchero**, otro pueblo del Valle Sagrado famoso por su iglesia colonial y sus tejedoras. Muchos de mis pasajeros hacen el circuito Chinchero – Moray – Maras en una sola salida, y queda redondo.

Puedes ver todas las opciones y rutas armadas en mi página de [tours](/tours), y si quieres entender mejor la zona, te recomiendo leer sobre el [Valle Sagrado](/destinos/valle-sagrado) y mi lista de [qué hacer en el Valle Sagrado](/blog/que-hacer-valle-sagrado-cusco).

## Mejor hora para visitar

Para las **Salineras de Maras**, te insisto: ve **por la mañana**. La luz pega de frente sobre las pozas blancas y el contraste con la quebrada es espectacular para las fotos. Además, al mediodía el sol de altura cae con fuerza y hay menos sombra donde guarecerse.

Para **Moray** funciona bien la mañana o la media mañana; al ser un terreno abierto, cualquier hora con buena luz rinde, pero antes de las 11 evitarás los grupos grandes.

## Qué llevar

Por la altura y el sol, mi lista corta para este tour es siempre la misma:

- **Protección solar**: gorro o sombrero, lentes y bloqueador. El sol del Valle Sagrado engaña porque hace fresco pero quema.
- **Agua**: lleva al menos medio litro; la caminata es ligera pero estás sobre los 3.300 metros.
- **Calzado cómodo y con agarre**: en Maras los senderos entre pozas son estrechos y a veces resbalan.
- **Algo de abrigo ligero**: las mañanas empiezan frías y luego sube la temperatura.
- **Efectivo en soles**: para la entrada de las Salineras y para comprar sal de Maras, que es un recuerdo perfecto.

## Fotografía: dónde están las mejores tomas

En **Maras**, las fotos más impactantes salen desde el mirador de la entrada, con todas las pozas blancas cayendo en cascada hacia la quebrada. Si bajas por los senderos, busca el reflejo del cielo en el agua de las pozas recién llenadas.

En **Moray**, ubícate en el borde superior del anfiteatro principal para captar los anillos completos; una persona parada abajo da una idea brutal de la escala. La luz lateral de la mañana marca mejor las terrazas y les da profundidad.

## Consejos finales de un guía local

No corras. Maras y Moray se disfrutan caminando despacio, escuchando la historia detrás de cada poza y cada andén. Si vienes de Cusco recién llegado, este tour de medio día es una excelente forma de **aclimatarte** sin esfuerzo grande antes de subir a Machu Picchu. Y compra tu paquetito de sal directo a las familias: te llevas Cusco a tu cocina.

## Reserva tu tour a Maras y Moray

¿Listo para conocer las salineras y los andenes circulares conmigo? Escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) y armamos tu salida a medida, sola o combinada con Chinchero y el resto del Valle Sagrado. Revisa todas las opciones en mi página de [tours](/tours) y nos vemos en el camino.
$body$),
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["maras","moray","salineras","valle-sagrado","tour"]'::jsonb,
  true,
  now() - interval '4 hours',
  jsonb_build_object('es', 'Maras y Moray: guía local para visitarlos | Cusco'),
  jsonb_build_object('es', 'Cómo visitar las Salineras de Maras y los andenes de Moray desde Cusco: qué son, cómo llegar, mejor hora, entradas y qué llevar. Guía local.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'city-tour-cusco',
  jsonb_build_object('es', 'City Tour Cusco: qué incluye, qué ver, duración y precio'),
  jsonb_build_object('es', 'Te cuento como guía local qué incluye el City Tour Cusco: la Catedral, Qoricancha y las cuatro ruinas cercanas, con duración, precio y las entradas que necesitas.'),
  jsonb_build_object('es', $body$
# City Tour Cusco: qué incluye, qué ver, duración y precio

Soy guía local en Cusco y, si hay un tour que recomiendo hacer apenas llegas, es el **City Tour Cusco**. En medio día conoces el corazón histórico de la ciudad y las cuatro ruinas incas que la rodean. Es la mejor manera de entender por qué Cusco fue la capital del imperio más grande de América, y además te ayuda a aclimatarte sin esfuerzo antes de cosas más exigentes como Machu Picchu o el Camino Inca.

En esta guía te explico exactamente qué incluye, qué vas a ver en cada parada, cuánto dura, cuánto cuesta y qué entradas necesitas comprar. Todo desde mi experiencia llevando viajeros por estas calles.

## Qué es el City Tour Cusco

El City Tour clásico es un recorrido guiado de **medio día** que combina dos partes: el centro histórico de la ciudad (Catedral y Qoricancha) y el circuito arqueológico de las afueras, con cuatro sitios incas muy cercanos entre sí: **Sacsayhuamán, Q'enqo, Puca Pucara y Tambomachay**.

La mayoría de operadores, nosotros incluidos, salen **por la tarde, alrededor de la 1:00 pm**, y terminan entre las 5:30 y 6:00 pm. Te recogen cerca de la Plaza de Armas o de tu hotel, y la unidad te lleva de un sitio a otro para que no camines distancias largas, algo que se agradece mucho los primeros días por la altura.

## Las paradas del City Tour

Aquí tienes el resumen de lo que vas a visitar, qué es cada lugar y qué entrada necesitas:

| Sitio | Qué es | Entrada |
|---|---|---|
| Catedral del Cusco | Templo colonial sobre el palacio inca de Wiracocha; arte de la Escuela Cusqueña | ~S/40 (aparte) |
| Qoricancha | Templo del Sol inca, el más sagrado del imperio | ~S/15 (aparte) |
| Sacsayhuamán | Fortaleza ceremonial con muros megalíticos | Boleto Turístico |
| Q'enqo | Santuario tallado en roca, posible lugar de rituales | Boleto Turístico |
| Puca Pucara | Puesto de control y descanso en el camino inca | Boleto Turístico |
| Tambomachay | "Baños del Inca", sistema de fuentes y agua sagrada | Boleto Turístico |

### Catedral del Cusco

Frente a la Plaza de Armas, la Catedral se levantó sobre el palacio del inca Wiracocha usando piedras traídas de Sacsayhuamán. Dentro vas a encontrar tesoros de la Escuela Cusqueña, como el famoso cuadro de la Última Cena donde Jesús y los apóstoles comparten un cuy. Es la mejor introducción al mestizaje cultural del Cusco.

### Qoricancha, el Templo del Sol

Qoricancha era el templo más importante del imperio, con paredes que estuvieron cubiertas de láminas de oro. Sobre sus muros incas perfectos los españoles construyeron el convento de Santo Domingo. Ese contraste, piedra inca abajo y arco colonial arriba, es de lo más impresionante que verás en la ciudad.

### Sacsayhuamán

Subiendo a las afueras llegas a Sacsayhuamán, la parada estrella. Sus muros están formados por bloques de piedra de hasta 120 toneladas, encajados con una precisión que todavía sorprende a los ingenieros. Desde aquí tienes una vista panorámica de toda la ciudad. Es donde cada 24 de junio se celebra el Inti Raymi.

### Q'enqo

A pocos minutos está Q'enqo, un afloramiento rocoso tallado con canales, escalinatas y una galería subterránea. Se cree que fue un lugar de rituales y posiblemente de momificación. Es pequeño pero muy interesante por su simbolismo.

### Puca Pucara

Puca Pucara significa "fortaleza roja" por el color de sus piedras al atardecer. Probablemente funcionó como puesto de control y descanso para viajeros y comitivas que entraban a la ciudad. Es una parada rápida con buenas vistas del valle.

### Tambomachay

Cerramos el circuito en Tambomachay, conocido como los "Baños del Inca". Es un conjunto de fuentes y acueductos que aún hoy llevan agua cristalina, prueba del dominio inca sobre la hidráulica. Era un sitio ligado al culto al agua.

## Duración del City Tour

El recorrido completo dura entre **4 y 5 horas**. Como te comenté, suele salir alrededor de la **1:00 pm**, lo que tiene una ventaja: por la tarde hay mejor luz para fotos en Sacsayhuamán y termina justo para que regreses a cenar al centro.

Si quieres un ritmo más tranquilo o sumar paradas, podemos armar una versión privada. Mira las opciones en nuestra página de [tours](/tours).

## Precio aproximado

El City Tour en grupo cuesta normalmente entre **US$30 y US$45 por persona**, dependiendo de la temporada, del tamaño del grupo y de si es compartido o privado. Ese precio **incluye el transporte y el guía profesional**, pero ojo: **no incluye las entradas**, que se pagan aparte.

## Qué entradas necesitas

Esta es la parte que más confunde a los viajeros, así que la explico claro:

- **Boleto Turístico del Cusco (BTC):** es obligatorio para entrar a las cuatro ruinas (Sacsayhuamán, Q'enqo, Puca Pucara y Tambomachay). Conviene comprar el boleto general, que también sirve para sitios del Valle Sagrado. Te explico todo en mi guía del [boleto turístico de Cusco](/blog/boleto-turistico-cusco).
- **Catedral del Cusco:** entrada independiente, alrededor de **S/40**.
- **Qoricancha:** entrada independiente, alrededor de **S/15**.

Calcula este gasto adicional aparte del precio del tour para que no haya sorpresas.

## Mi recomendación: hazlo el primer o segundo día

Como guía, siempre aconsejo hacer el City Tour **el primer o segundo día** de tu viaje. Las caminatas son cortas, hay paradas frecuentes y el transporte hace casi todo el trabajo, así que tu cuerpo se va acostumbrando a los 3,400 metros sin forzar. Es una aclimatación natural antes de retos mayores.

Si llegas sintiendo el **soroche** (dolor de cabeza, cansancio, náuseas), lee primero mis consejos sobre el [mal de altura en Cusco](/blog/soroche-cusco-mal-de-altura). Y si todavía estás organizando tu viaje completo, te será muy útil mi [itinerario de 7 días en Cusco](/blog/itinerario-7-dias-cusco), donde encaja perfecto este tour.

## Qué llevar

Para disfrutarlo sin contratiempos te recomiendo llevar:

- Bloqueador solar y sombrero o gorra: el sol de altura es fuerte.
- Una casaca ligera o cortavientos: en las ruinas hace más fresco que en el centro.
- Agua y algún snack para mantener la energía.
- Zapatillas cómodas para caminar sobre piedra irregular.
- Efectivo en soles para las entradas y propinas.
- Tu Boleto Turístico y documento de identidad a la mano.

## Extras que puedes sumar

Si te queda energía después del tour, dos lugares cercanos valen mucho la pena. El barrio de **San Blas**, el más bohemio de la ciudad, es perfecto para perderte entre callecitas empedradas, talleres de artesanos y miradores al atardecer. Y por la mañana, antes de salir, date una vuelta por el **Mercado de San Pedro**, donde pruebas jugos de frutas, panes y comida local a precios de cusqueño.

## Reserva tu City Tour Cusco

El City Tour es la puerta de entrada perfecta para entender Cusco y aclimatarte con calma. Si quieres que te lo organice con un guía local que conoce cada piedra de estos sitios, escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa las opciones y reserva en nuestra página de [tours](/tours). Nos vemos en la Plaza de Armas.
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  7,
  '["city-tour","cusco","sacsayhuaman","qoricancha","guia"]'::jsonb,
  true,
  now() - interval '5 hours',
  jsonb_build_object('es', 'City Tour Cusco: qué incluye, precio y duración'),
  jsonb_build_object('es', 'Guía local del City Tour Cusco: Catedral, Qoricancha y las 4 ruinas. Duración, precio US$30-45, entradas y qué llevar. Reserva con Danfer Tours.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'que-llevar-a-cusco',
  jsonb_build_object('es', 'Qué llevar a Cusco: lista de equipaje para Cusco y Machu Picchu'),
  jsonb_build_object('es', 'Como guía local te comparto qué empacar para Cusco y Machu Picchu: ropa por capas, calzado, protección solar y checklist según temporada y tipo de tour.'),
  jsonb_build_object('es', $body$
# Qué llevar a Cusco: la lista de equipaje que de verdad necesitas

Soy guía aquí en Cusco y la pregunta que más me hacen antes de cada viaje es la misma: "¿qué llevo?". Después de cientos de tours por la ciudad, el Valle Sagrado y Machu Picchu, aprendí que la clave no es traer mucho, sino traer lo correcto. Cusco está a 3,400 metros sobre el nivel del mar y el clima cambia muchísimo entre el día y la noche: puedes pasar de 20°C al mediodía a casi 0°C de madrugada, un salto de hasta 25°C. Por eso aquí no se viste por "temperatura del día", se viste por capas.

En esta guía te doy mi lista real de equipaje, ordenada por categorías, y al final una checklist que puedes copiar tal cual. También diferencio lo que necesitas para los city tours tranquilos y lo que exige un trek serio como el Camino Inca o Salkantay.

## Ropa: el sistema de capas es la regla de oro

El error clásico es traer un solo abrigo grueso. No funciona: a media mañana te asas y de noche te congelas. La solución es vestirte en capas que te puedas poner y quitar a lo largo del día.

- **Primera capa (térmica):** una o dos camisetas térmicas que evacuen el sudor. Evita el algodón puro para actividad física, porque se queda húmedo y enfría.
- **Segunda capa (aislante):** un polar o una micropluma. Es la capa que atrapa el calor; ligera pero abrigadora.
- **Tercera capa (protección):** una chaqueta cortavientos e impermeable. En Cusco la lluvia aparece sin avisar, sobre todo entre octubre y abril.

Suma pantalones cómodos (uno de trekking de secado rápido y uno casual), gorro de lana para la noche, guantes ligeros y un buff o bufanda para el cuello. Con esto cubres desde un café en la Plaza de Armas hasta el amanecer en Machu Picchu. Si quieres entender mejor cuánto frío te tocará, revisa el [clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes) antes de armar la maleta.

## Calzado: ya probado, nunca estrenado

Esto te lo repito como guía: **no estrenes zapatos en Cusco**. He visto demasiadas ampollas arruinar caminatas. Para city tours y el Valle Sagrado bastan unas zapatillas deportivas cómodas con buen agarre, porque las calles son empedradas y empinadas. Para Machu Picchu y cualquier trek, trae botas de trekking que ya hayas usado al menos varias semanas, con tobillo firme y suela antideslizante. Añade un par de medias de trekking gruesas y, si puedes, sandalias o calzado ligero para descansar los pies por la tarde.

## Protección solar: el sol de altura quema más de lo que crees

A 3,400 metros la atmósfera filtra mucha menos radiación, así que el sol castiga aunque el día esté fresco o nublado. No subestimes esto: es de lo que más se quejan los viajeros que vienen sin prepararse.

- Protector solar **SPF 50+**, aplicado y reaplicado.
- Gafas de sol con filtro **UV400**.
- Gorro o sombrero de ala ancha.
- Bálsamo labial con protección solar (los labios se parten muchísimo aquí por el sol y el aire seco).

## Salud y altitud: prepárate para el soroche

El mal de altura, o soroche, es real y le puede tocar a cualquiera. La mejor defensa es llegar y descansar el primer día, hidratarte bien y comer ligero. En mi botiquín nunca falta:

- **Hoja o caramelos de coca** y mate de coca: ayudan con los síntomas leves de la altura.
- **Ibuprofeno o paracetamol** para el dolor de cabeza típico de los primeros días.
- **Diamox (acetazolamida)**, solo si tu médico te lo receta antes del viaje; no lo tomes por tu cuenta.
- Pastillas para el malestar estomacal y suero de rehidratación oral.
- **Repelente de insectos** si tu plan incluye selva o Aguas Calientes, donde hay mosquitos.

Si quieres llegar mejor preparado, te recomiendo leer mi guía sobre el [soroche y el mal de altura en Cusco](/blog/soroche-cusco-mal-de-altura), donde explico cómo prevenirlo paso a paso.

## Documentos: el pasaporte manda

Aquí no hay excusas: **lleva siempre tu pasaporte original**. Es imprescindible para subir al tren y para ingresar a Machu Picchu, donde comparan tu documento con la entrada. Una copia no sirve para el ingreso. Te conviene tener:

- Pasaporte original (y una copia digital y física por seguridad).
- Tus entradas a Machu Picchu y boletos de tren impresos o en el celular.
- Carné ISIC si eres estudiante y quieres descuentos.
- Seguro de viaje con cobertura en altura.

## Electrónicos y dinero

Cusco usa enchufes tipo A y C (220V), así que trae un adaptador universal. No olvides:

- Cargador y power bank (en los treks no hay enchufes).
- Cámara o celular con buena batería; las vistas lo merecen.
- Linterna frontal para amaneceres y campamentos.

Sobre el dinero: aunque muchos lugares aceptan tarjeta, **lleva soles en efectivo**. En mercados, propinas, transporte local y pueblos pequeños el efectivo es rey. Cambia algo de moneda en la ciudad y trae billetes pequeños.

## Checklist rápida según el tipo de viaje

Aquí tienes la tabla que reparto a mis grupos. Marca lo que ya tengas:

| Categoría | City tours y Valle Sagrado | Trek (Camino Inca / Salkantay) |
|---|---|---|
| Ropa térmica | 1 capa base + polar | 2 capas base + polar grueso |
| Chaqueta | Cortavientos impermeable | Impermeable + pluma para la noche |
| Calzado | Zapatillas con agarre | Botas de trekking probadas |
| Dormir | No aplica | Saco de dormir hasta -10°C |
| Apoyo | Opcional | Bastones de trekking |
| Mochila | Pequeña de día | Mochila grande + mochila de día |
| Protección solar | SPF 50+, UV400, gorro | Igual, más reaplicación constante |
| Salud | Botiquín básico + coca | Botiquín completo + repelente |
| Documentos | Pasaporte original | Pasaporte original + permiso de trek |

## Qué llevar según la temporada

Cusco tiene dos temporadas muy marcadas y cambian lo que metes en la maleta:

- **Temporada seca (mayo a septiembre):** días soleados y noches muy frías. Prioriza capas de abrigo, gorro y guantes para las madrugadas. Llueve poco, pero igual trae el cortavientos.
- **Temporada de lluvias (octubre a abril):** más cálida de día, pero con chubascos. Aquí lo impermeable es obligatorio: chaqueta, funda para la mochila y, si haces trek, polainas. El Camino Inca cierra en febrero por mantenimiento, así que planifica con eso en mente.

## Si vas a hacer el Camino Inca

Un trek de varios días es otra liga. Además de todo lo anterior, necesitas saco de dormir para -10°C, bastones de trekking, una mochila de día cómoda y disciplina para empacar ligero, porque cada gramo cuenta en la subida. Te dejo mi guía detallada del [Camino Inca paso a paso en 4 días](/blog/camino-inca-paso-a-paso-4-dias) para que sepas exactamente qué esperar en cada jornada.

## Listo para empacar

Con esta lista no te sobrará casi nada y no te faltará lo importante. Mi consejo final: prueba todo antes de viajar, arma capas y no traigas miedo, trae buena actitud. Si tienes dudas sobre qué llevar para tu tour específico, escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) y con gusto te ayudo a afinar tu equipaje.

¿Listo para vivir Cusco? Mira nuestros [tours disponibles](/tours) y empieza a planear tu aventura. Nos vemos en la Plaza de Armas.
$body$),
  'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["que-llevar","equipaje","cusco","lista","viaje"]'::jsonb,
  true,
  now() - interval '6 hours',
  jsonb_build_object('es', 'Qué llevar a Cusco: lista de equipaje completa'),
  jsonb_build_object('es', 'Guía local: qué empacar para Cusco y Machu Picchu. Ropa por capas, calzado, protección solar, altitud y checklist según temporada y tipo de tour.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'que-hacer-en-cusco-3-dias',
  jsonb_build_object('es', 'Qué hacer en Cusco en 3 días: itinerario realista'),
  jsonb_build_object('es', 'Te comparto el itinerario de 3 días en Cusco que armo para mis viajeros, priorizando la aclimatación a la altura para que disfrutes Machu Picchu sin soroche.'),
  jsonb_build_object('es', $body$
# Qué hacer en Cusco en 3 días: el itinerario que recomiendo como guía local

Soy guía aquí en Cusco y la pregunta que más me hacen es: "Danfer, solo tengo 3 días, ¿qué hago?". Tres días es lo mínimo para conocer lo esencial sin correr como loco, y la clave está en una sola palabra: **aclimatación**. Cusco está a 3.400 metros sobre el nivel del mar, y si llegas y subes de una a un cerro alto, el soroche (mal de altura) te puede arruinar el viaje. Por eso este itinerario está pensado para que tu cuerpo se acostumbre poco a poco.

Te dejo el plan exacto que armo para mis viajeros, con horarios reales, altitudes y un consejo honesto al final.

## La regla de oro: aclimatarse primero

Antes de empezar, grábate esto: el primer día **no se hace esfuerzo fuerte**. Nada de Rainbow Mountain ni Humantay apenas bajas del avión. El truco es bajar de altura el primer día completo yendo al Valle Sagrado (está más bajo que la ciudad, a unos 2.800-2.900 m) y dejar las excursiones de mucha altura para el final, cuando ya llevas dos noches durmiendo en la zona. Si quieres entender bien cómo funciona el cuerpo en altura, te recomiendo leer mi guía sobre el [soroche o mal de altura en Cusco](/blog/soroche-cusco-mal-de-altura) antes de viajar.

## Día 1: llegada + Valle Sagrado (aclimatación inteligente)

### Mañana

Si tu vuelo llega temprano, deja las maletas en el hotel y **descansa al menos 2 horas**. Tómate un mate de coca o de muña, hidrátate y come algo ligero. No subas escaleras corriendo ni cargues mochilas pesadas el primer par de horas; es cuando el cuerpo más sufre.

### Tarde

Después del mediodía, en lugar de quedarte en la ciudad alta, baja al **Valle Sagrado**. Suena contraintuitivo viajar el primer día, pero el valle está más bajo que Cusco y eso ayuda a tu organismo a acostumbrarse de forma suave. Visita el mercado de Pisac y, si llegas a tiempo, las terrazas incas de Pisac. La caminata es ligera y el aire se siente mejor que en la ciudad.

Termina el día cenando temprano y durmiendo en el valle o regresando a Cusco. Te dejo más detalle de lugares en mi página del [Valle Sagrado](/destinos/valle-sagrado).

## Día 2: Machu Picchu (el día grande)

### Mañana

Este es el corazón del viaje. La salida del tren desde Ollantaytambo suele ser muy temprano (los servicios más cómodos parten entre las **05:00 y las 07:00**), así que prepárate la noche anterior. El tren te lleva a Aguas Calientes en aproximadamente 1 hora 40 minutos, y de ahí subes en bus 25 minutos hasta la ciudadela.

Una ventaja enorme de hacer Machu Picchu el Día 2: la ciudadela está a **2.430 m**, más bajo que Cusco, así que es perfecto para un cuerpo que aún se está adaptando.

### Tarde

Recorre la ciudadela con guía (te explico cada sector: el Templo del Sol, la Roca Sagrada, el Intihuatana). El recorrido completo toma unas 2 a 3 horas según el circuito que tengas en tu boleto. Por la tarde regresas en tren a Ollantaytambo y luego en transporte a Cusco. Llegarás cansado pero feliz. Mira todos los detalles de entradas y circuitos en mi guía de [Machu Picchu](/destinos/machu-picchu).

## Día 3: cierre según tu estado físico

Aquí tienes dos caminos, y elegirás según cómo te sientas tras dos noches en altura.

### Opción suave: Maras y Moray

Si prefieres algo tranquilo, esta es mi recomendación. **Moray** son unos andenes circulares incas que funcionaban como laboratorio agrícola, y las **Salineras de Maras** son miles de pozos de sal escalonados que quitan el aliento por lo fotogénico. Es un día relajado, sin esfuerzo físico grande, ideal para cerrar el viaje sin agotarte antes de tomar el vuelo de regreso.

### Opción de aventura: Rainbow Mountain o Humantay

Solo si ya te sientes bien aclimatado y con energía, puedes animarte a la **Montaña de Colores (Vinicunca, 5.200 m)** o a la **Laguna Humantay (4.200 m)**. Ojo: son excursiones de mucha altura y mucho madrugón (salida típica entre las **03:00 y 04:30**). Si tienes la mínima duda con la altura, déjalas para otro viaje y quédate con Maras-Moray.

## Tabla resumen del itinerario

| Día | Actividad | Altitud aprox. | Dificultad |
|-----|-----------|----------------|------------|
| 1 | Llegada + Valle Sagrado (Pisac) | 2.800-2.900 m | Baja |
| 2 | Machu Picchu | 2.430 m | Media |
| 3 (suave) | Maras y Moray | 3.300-3.500 m | Baja |
| 3 (aventura) | Rainbow Mountain | 5.200 m | Alta |
| 3 (aventura) | Laguna Humantay | 4.200 m | Alta-media |

## Consejos prácticos para estos 3 días

- **Reserva Machu Picchu con anticipación.** Las entradas y los trenes se agotan, sobre todo en temporada alta (mayo a septiembre). No lo dejes para último momento.
- **Hidrátate más de lo normal.** La altura deshidrata. Lleva botella de agua y bebe mate de coca sin culpa.
- **Lleva capas de ropa.** En un mismo día puedes pasar del sol fuerte al frío de la tarde.
- **Efectivo a mano.** En mercados y Salineras conviene tener soles en efectivo; algunos lugares no aceptan tarjeta.
- **Calzado cómodo.** Caminarás sobre piedra inca, que es resbaladiza.

## ¿Y si tengo más días?

Seré honesto: 3 días es lo mínimo para no irte con la sensación de que te faltó todo. Si puedes estirar tu viaje, ganas tiempo para aclimatarte mejor y sumar lugares como la ciudad de Cusco con calma, la montaña de colores sin presión y hasta una caminata más larga. Para quienes tienen más tiempo armé un plan completo en mi [itinerario de 7 días por Cusco](/blog/itinerario-7-dias-cusco), que te recomiendo si de verdad quieres conocer la región a fondo.

## Cierre: arma tu viaje conmigo

Este itinerario de 3 días funciona muy bien si respetas el orden y cuidas la aclimatación. Pero cada viajero es distinto, y me encanta ajustar el plan a tu ritmo, tu presupuesto y tus ganas de aventura.

Escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) y cuéntame tus fechas; con gusto te armo el itinerario perfecto. Y si quieres ver todas las opciones disponibles, revisa mis [tours en Cusco](/tours). Nos vemos por acá arriba, en el ombligo del mundo.
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  9,
  '["cusco","itinerario","3-dias","machu-picchu","guia"]'::jsonb,
  true,
  now() - interval '7 hours',
  jsonb_build_object('es', 'Qué hacer en Cusco en 3 días: itinerario'),
  jsonb_build_object('es', 'Itinerario realista de 3 días en Cusco con horarios, altitudes y aclimatación: Valle Sagrado, Machu Picchu y excursión final. Guía local.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'machu-picchu-2-dias-1-noche',
  jsonb_build_object('es', 'Machu Picchu en 2 días 1 noche: itinerario y por qué conviene'),
  jsonb_build_object('es', 'Te cuento cómo organizar Machu Picchu en 2 días y 1 noche, con itinerario hora por hora, costos reales y por qué le gana al Full Day.'),
  jsonb_build_object('es', $body$
# Machu Picchu en 2 días 1 noche: el itinerario que recomiendo a mis viajeros

Como guía local de Cusco, te lo digo sin rodeos: si puedes, haz Machu Picchu en 2 días y 1 noche. He acompañado a cientos de viajeros que llegaron decididos a hacer el Full Day y, al final del recorrido, casi todos me dicen lo mismo: "ojalá hubiéramos dormido en Aguas Calientes". En esta guía te explico el itinerario que armo para mis grupos, cuánto cuesta de verdad, qué llevar para una sola noche y por qué dormir abajo cambia por completo la experiencia.

## Por qué 2D/1N le gana al Full Day

El Full Day suena tentador porque "lo resuelves en un día". Pero ese día empieza a las 4 de la mañana en Cusco y termina pasada la medianoche. Llegas a Machu Picchu al mediodía, con el sol fuerte, las multitudes en su punto máximo y tú reventado del madrugón y las horas de tren y bus.

Quedándote una noche en Machu Picchu Pueblo (Aguas Calientes) duermes a 30 minutos de la ciudadela. Al día siguiente subes con los primeros buses y entras casi solo, con la niebla todavía levantándose sobre las terrazas. Esa luz suave del amanecer es la que sale en las fotos que todos envidian.

| Criterio | 2 días / 1 noche | Full Day |
|---|---|---|
| Hora de entrada a Machu Picchu | Primer turno (06:00) | Mediodía (11:00-12:00) |
| Multitudes | Mínimas al amanecer | Máximas, llanura llena |
| Luz para fotos | Suave, niebla mágica | Sol duro, contraluces |
| Cansancio | Repartido en 2 días | Agotador, 20 h seguidas |
| Margen ante retrasos | Amplio (tienes 2 días) | Nulo, todo apretado |
| Precio aprox. por persona | US$60-200 extra (hotel+cena) | Más económico |
| Huayna Picchu / Montaña | Cómodo, con energía | Casi imposible por horario |

La única ventaja real del Full Day es el precio. Si tu presupuesto es muy ajustado, es válido. Pero si viajaste hasta Cusco, no escatimes en la joya del viaje.

## Día 1: de Cusco a Machu Picchu Pueblo

### Salida y tren

La mañana del día 1 sales de Cusco hacia el Valle Sagrado. La mayoría de trenes parten desde la estación de **Ollantaytambo**, así que primero tomas transporte por carretera (alrededor de 1 hora 45 minutos). Si tienes tiempo de sobra, te recomiendo salir temprano y conocer Ollantaytambo antes de abordar; es un pueblo inca vivo, con calles y canales originales.

Si tienes dudas sobre las rutas, los horarios y las diferencias entre trenes, lo explico en detalle en mi guía de [cómo llegar a Machu Picchu desde Cusco](/blog/como-llegar-a-machu-picchu-desde-cusco). Reserva el tren con semanas de anticipación, sobre todo en temporada alta.

El viaje en tren de Ollantaytambo a Aguas Calientes dura aproximadamente 1 hora 40 minutos y es precioso: vas bordeando el río Urubamba mientras la vegetación se vuelve cada vez más selvática. Llegas a **Machu Picchu Pueblo** alrededor del mediodía o primera hora de la tarde.

### Llegada y check-in

Dejas las maletas en el hotel y te quitas el peso de encima, literal. Este es el gran lujo del 2D/1N: no cargas mochilas pesadas al subir. Los hoteles en Aguas Calientes van desde **US$40 la noche** en opciones sencillas hasta **US$150 o más** en hoteles de categoría. Para una noche, una opción de US$60-90 con buen desayuno suele ser el punto justo.

### Tarde libre en Aguas Calientes

La tarde es tuya. Estas son mis recomendaciones favoritas:

- **Aguas termales**: el pueblo debe su nombre a sus baños termales. Después de un día de viaje, relajar las piernas en agua caliente, con el río de fondo, es una gloria. Lleva traje de baño y unas sandalias.
- **Museo de Sitio Manuel Chávez Ballón**: a unos 20-30 minutos caminando por la carretera al santuario, este museo pequeño pero excelente te da contexto histórico que hace que al día siguiente "leas" mejor las ruinas. Pocos turistas lo visitan y vale mucho la pena.
- **Mariposario de Machu Picchu**: junto al museo, ideal si viajas con niños o te gusta la naturaleza; verás especies endémicas de esta zona de ceja de selva.

Cena temprano y acuéstate pronto: mañana madrugamos. Ten en cuenta que **comer en Aguas Calientes es más caro** que en Cusco (un plato principal puede costar US$12-25), porque casi todo llega en tren.

## Día 2: amanecer en Machu Picchu

### Subida temprano

Aquí está el corazón del itinerario. Los primeros buses salen del pueblo alrededor de las **05:30** y la ciudadela abre a las **06:00**. Quédate en la cola del bus con tu boleto y tu pasaporte en mano. Subir entre los primeros significa cruzar la entrada cuando la montaña todavía está despertando.

Tu **entrada a Machu Picchu** funciona por turnos y circuitos asignados; debes respetar el horario impreso. Si no tienes claro qué circuito elegir ni cómo se compran, revisa mi guía de [entradas y circuitos de Machu Picchu](/blog/entradas-machu-picchu-circuitos) antes de viajar, porque los cupos del primer turno y de las montañas se agotan rápido.

### Tour guiado

Recomiendo siempre entrar con guía. Una cosa es ver piedras impresionantes y otra entender por qué están ahí: el Templo del Sol, la Roca Sagrada, el Intihuatana, los andenes agrícolas. Un recorrido guiado dura entre 2 y 2.5 horas y le da sentido a todo. Después del tour puedes quedarte recorriendo por tu cuenta dentro de tu circuito.

### Huayna Picchu o Montaña Machu Picchu

Con la energía del descanso de la noche anterior, ahora sí puedes animarte a una caminata extra:

- **Huayna Picchu**: la montaña puntiaguda clásica de las postales. Subida empinada de unas 2-3 horas ida y vuelta, con vistas espectaculares de la ciudadela desde arriba. Cupos muy limitados; resérvala con antelación.
- **Montaña Machu Picchu**: más larga y menos vertical, con panorámicas amplias del valle. Buena opción si Huayna Picchu ya está agotada.

Este es otro punto donde el Full Day pierde: con su horario, casi nunca alcanzas a subir ninguna de las dos montañas.

### Retorno

Bajas al pueblo en bus, almuerzas con calma y tomas tu tren de regreso a Ollantaytambo por la tarde, y de ahí transporte a Cusco. Llegas de noche, cansado pero sin el desgaste brutal del Full Day, y con un día completo de recuerdos en lugar de un par de horas a las apuradas.

## Qué llevar para una noche

No necesitas una maleta grande. Con un bolso pequeño basta:

- Muda de ropa para un día, ropa abrigadora para la noche y la madrugada.
- Impermeable o poncho ligero (en Machu Picchu puede llover en cualquier época).
- Traje de baño y sandalias para las aguas termales.
- Repelente de insectos: estás en ceja de selva.
- Bloqueador solar, gorra y gafas.
- Pasaporte físico (te lo piden en la entrada) y tus boletos.
- Efectivo en soles para taxis, propinas y compras pequeñas.
- Botella de agua reutilizable y algo de snack.

## Costos aproximados del 2D/1N

Más allá del transporte y la entrada, lo que suma el formato de 2 días es:

- **Hotel en Aguas Calientes**: US$40-150 la noche.
- **Cena y desayuno**: US$25-45 por persona (recuerda el sobreprecio del pueblo).
- **Aguas termales / museo / mariposario**: entradas económicas, unos pocos dólares cada una.

Es una inversión moderada que, en mi experiencia, todos consideran bien gastada. La época en que viajes también influye en clima y precios; si aún no decides cuándo ir, mira mi guía de la [mejor época para visitar Machu Picchu](/blog/mejor-epoca-machu-picchu).

## ¿Lo armamos juntos?

En [Danfer Tours Cusco](/destinos/machu-picchu) organizamos este itinerario de 2 días y 1 noche llave en mano: trenes, hotel en Aguas Calientes, entradas con el circuito correcto, bus y guía profesional para que solo te preocupes de disfrutar. Mira las opciones en nuestra página de [tours](/tours) y elige la que mejor se ajuste a tu viaje.

¿Tienes dudas o quieres que adaptemos el itinerario a tu ritmo? Escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa todos nuestros [tours](/tours). Te ayudo a vivir Machu Picchu sin prisas y con la mejor luz del amanecer.
$body$),
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["machu-picchu","2-dias","itinerario","aguas-calientes","guia"]'::jsonb,
  true,
  now() - interval '8 hours',
  jsonb_build_object('es', 'Machu Picchu en 2 días 1 noche: itinerario'),
  jsonb_build_object('es', 'Itinerario día a día para visitar Machu Picchu en 2 días y 1 noche: tren, hotel en Aguas Calientes, amanecer en la ciudadela, costos y consejos.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'que-comer-en-cusco',
  jsonb_build_object('es', 'Qué comer en Cusco: guía completa de comida típica cusqueña'),
  jsonb_build_object('es', 'Te cuento como guía local qué comer en Cusco: cuy, lechón, chicharrón, chairo, rocoto relleno, bebidas, postres, dónde comer barato y consejos de altitud.'),
  jsonb_build_object('es', $body$
# Qué comer en Cusco: guía completa de comida típica cusqueña

Soy guía local en Cusco y, después de años acompañando viajeros, he aprendido que comer aquí es parte del viaje, no un trámite. La cocina cusqueña mezcla raíces incas con influencia española: papas que no terminan nunca, maíces gigantes, carnes de altura y sopas que reconfortan a 3.400 metros. En esta guía te llevo plato por plato, te digo dónde comer, cuánto cuesta y cómo cuidar tu estómago para no perderte ni un bocado.

## Los platos típicos que tienes que probar

**Cuy al horno.** Es el plato emblema de los Andes. El cuy (conejillo de Indias) se asa entero y se sirve crujiente, acompañado de papas y ají. Sé que a muchos les choca la idea, pero es una tradición milenaria y, si te animas, lo recuerdas para siempre. Pídelo "al horno" antes que frito: queda más jugoso.

**Lechón cusqueño.** Cerdo horneado lentamente hasta que la piel cruje y la carne se deshace. Se come con tamal, mote (maíz hervido) y una salsa de cebolla. Los domingos en los pueblos del Valle Sagrado es una fiesta encontrarlo recién salido del horno de barro.

**Chicharrón de cerdo.** Trozos de cerdo hervidos en su propia grasa y luego dorados, servidos con mote, menta fresca y ensalada de cebolla. Es contundente: ideal después de una caminata, no antes.

**Adobo cusqueño.** El desayuno reparador por excelencia, sobre todo los domingos por la mañana. Es cerdo macerado en chicha de jora con ají y especias, cocido a fuego lento. Se sirve caliente, en caldo, y dicen que cura cualquier resaca.

**Rocoto relleno.** El rocoto es un ají rojo grueso que pica de verdad. Se vacía, se rellena con carne picada, pasas y maní, se cubre con queso y se hornea. Picante pero adictivo.

**Alpaca a la parrilla.** Carne magra, baja en grasa y muy sabrosa, parecida a un lomo tierno de res pero más suave. Es una opción más ligera que el cerdo y, para mí, de las mejores sorpresas para el viajero.

## Sopas y entradas: empieza por aquí

Los primeros días en Cusco te recomiendo arrancar por las sopas. No solo son deliciosas: ayudan con la adaptación a la altura.

**Chairo.** Sopa espesa de carne, chuño (papa deshidratada), habas, verduras y trigo. Es casi un plato completo en sí mismo y entibia el cuerpo en los días fríos.

**Sopa de quinua.** Reconfortante, ligera y nutritiva. La quinua es el superalimento andino por excelencia y esta sopa es perfecta para el primer día, cuando el cuerpo todavía está acostumbrándose.

**Choclo con queso.** No es sopa, pero es el aperitivo andino clásico: mazorca de maíz gigante de granos enormes y suaves, servida con una tajada de queso fresco. Lo venden incluso en los caminos hacia Machu Picchu.

**Tamales.** Masa de maíz envuelta en hoja, rellena de cerdo o ají. Los hay dulces y salados, ideales para el desayuno con un mate caliente.

## Bebidas típicas que acompañan cada comida

- **Chicha morada.** Refresco de maíz morado hervido con piña, canela, clavo y limón. Dulce, sin alcohol, apto para todos.
- **Chicha de jora.** Bebida fermentada de maíz, ancestral y ligeramente alcohólica. La sirven en las "chicherías" de los barrios; búscala marcada con una bandera roja en la puerta.
- **Mate de coca.** Infusión de hoja de coca, tu mejor aliada contra el soroche. Tómala apenas llegues.
- **Pisco sour.** El cóctel nacional del Perú: pisco, limón, jarabe, clara de huevo y amargo de angostura. Cuidado con la altura, pega más fuerte de lo normal.
- **Cerveza Cusqueña.** La cerveza local, con versiones rubia, negra y de trigo. Perfecta para cerrar el día.

## Postres y dulces

Para terminar, busca las **tejas** (dulces rellenos de manjar y frutos secos cubiertos de fondant) y los dulces de **maíz**. El barrio de **San Blas** es ideal para sentarse en una cafetería con vista, probar un postre artesanal y descansar las piernas después de subir sus cuestas empedradas.

## Tabla de platos y precios orientativos

| Plato | Qué es | Rango de precio (S/) |
|---|---|---|
| Cuy al horno | Conejillo de Indias asado entero | 45 - 80 |
| Lechón cusqueño | Cerdo horneado con piel crujiente | 18 - 30 |
| Chicharrón de cerdo | Cerdo dorado en su grasa con mote | 18 - 28 |
| Adobo cusqueño | Cerdo en caldo de chicha de jora | 12 - 22 |
| Rocoto relleno | Ají relleno de carne y queso | 15 - 25 |
| Alpaca a la parrilla | Carne magra de alpaca a la brasa | 30 - 55 |
| Chairo / Sopa de quinua | Sopas andinas reconfortantes | 8 - 18 |
| Choclo con queso | Maíz gigante con queso fresco | 5 - 10 |

Los precios varían según si comes en el Mercado de San Pedro, en un menú de barrio o en un restaurante turístico de la Plaza de Armas.

## Dónde comer en Cusco

**Mercado de San Pedro.** Mi primera recomendación para comer rico y barato. En sus puestos encuentras caldos, jugos enormes de fruta fresca, choclo con queso y platos del día por pocos soles. Vé temprano, cuando todo está recién hecho.

**Barrio de San Blas.** El rincón bohemio: cafés, restaurantes andinos con cocina de autor y vistas a los tejados. Ideal para una cena tranquila.

**Restaurantes andinos del Centro Histórico.** Alrededor de la Plaza de Armas hay cocinas que reinterpretan los platos clásicos. Pagas más, pero la presentación y el servicio lo valen para una ocasión especial.

## Comer bien con la altura: mi consejo de guía

Cusco está a 3.400 metros y el cuerpo necesita días para adaptarse. Mi recomendación: los primeros días come **ligero**. Prioriza sopas, papas, arroz y carbohidratos suaves; evita las comilonas de cerdo frito y el exceso de alcohol hasta que estés aclimatado. Comer pesado de golpe empeora el [mal de altura o soroche](/blog/soroche-cusco-mal-de-altura), así que dale tiempo a tu estómago.

Sobre higiene: bebe siempre **agua embotellada** (revisa que el sello esté intacto), evita el hielo de origen dudoso y prefiere fruta que puedas pelar. En puestos de mercado, elige los que tengan mucha rotación de clientes: comida que se mueve es comida fresca.

## Cómo encajar la comida en tu viaje

Si estás armando tu ruta, te dejo recursos para combinar gastronomía con paseos: revisa nuestro [itinerario de 7 días por Cusco](/blog/itinerario-7-dias-cusco) para saber qué comer cada día sin saturarte, y el [City Tour de Cusco](/blog/city-tour-cusco), que pasa muy cerca del Mercado de San Pedro, perfecto para almorzar después. Si prefieres que lo organicemos todo por ti, mira nuestros [tours guiados](/tours) con paradas gastronómicas incluidas.

## ¿Listo para comer Cusco a lo grande?

La comida cusqueña se disfruta mejor con quien sabe dónde buscar. Si quieres una experiencia con paradas en los mejores puestos y restaurantes locales, escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa nuestros [tours en Cusco](/tours). Te espero para que pruebes lo mejor de mi tierra.
$body$),
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["gastronomia","cusco","comida-tipica","que-comer","guia"]'::jsonb,
  true,
  now() - interval '9 hours',
  jsonb_build_object('es', 'Qué comer en Cusco: comida típica cusqueña'),
  jsonb_build_object('es', 'Guía local de qué comer en Cusco: cuy, lechón, chairo, rocoto relleno, bebidas, postres, dónde comer barato y consejos de altitud. Descúbrelo aquí.')
) on conflict (slug) do nothing;

insert into public.blog_posts (
  slug, title, excerpt, body_md, cover_image, author_name, read_minutes,
  tags, is_published, published_at, meta_title, meta_description
) values (
  'inti-raymi-cusco',
  jsonb_build_object('es', 'Inti Raymi 2026: la Fiesta del Sol en Cusco y cómo verla'),
  jsonb_build_object('es', 'Como guía cusqueño te cuento qué es el Inti Raymi, por qué se celebra el 24 de junio y cómo planificar para verlo en Sacsayhuamán este 2026.'),
  jsonb_build_object('es', $body$
# Inti Raymi 2026: la Fiesta del Sol en Cusco y cómo verla

Soy guía en Cusco y, si tuviera que elegir un solo día para que me visites, sería el **24 de junio**. Ese día la ciudad se detiene, las calles huelen a copal y miles de personas suben a Sacsayhuamán para ver el **Inti Raymi**, la Fiesta del Sol. Después de Carnaval de Río, es la celebración más grande de Sudamérica, y te aseguro que verla en persona no se parece a nada.

En esta guía te explico qué es, de dónde viene, dónde se desarrolla cada acto y cómo conseguir un buen lugar sin que te arruine el viaje. Escribo pensando en quien planifica verlo **este año 2026**, así que toma nota de las fechas y reserva con tiempo.

## ¿Qué es el Inti Raymi?

El Inti Raymi es la recreación de la antigua ceremonia inca en honor a **Inti**, el dios sol. Para los incas, Inti era el padre del Sapa Inca y la fuente de toda vida: la luz, las cosechas, el calendario. La fiesta era un agradecimiento y, a la vez, una petición de que el sol regresara con fuerza tras el día más corto del año.

Hoy es un gran espectáculo escénico con cientos de actores vestidos con trajes ceremoniales, música de quenas y pututos, ofrendas y danzas. El protagonista es el Inca, que va en andas y dirige la ceremonia en quechua. No es una recreación turística vacía: para los cusqueños es un acto de identidad y orgullo.

## Un poco de historia

El origen se atribuye al inca **Pachacútec**, en el siglo XV, quien instituyó la fiesta como la principal del calendario inca en el Cusco. Durante el Tahuantinsuyo llegaban representantes de los cuatro suyos a rendir homenaje al sol y al Sapa Inca.

Con la llegada de los españoles, la ceremonia fue **prohibida en la Colonia** por considerarse pagana, y desapareció de la vida pública durante siglos. La versión que ves hoy fue **revivida en 1944**, basada en las crónicas del Inca Garcilaso de la Vega, y desde entonces se celebra cada año como el evento central del mes jubilar de Cusco.

## La fecha: 24 de junio

El Inti Raymi se celebra siempre el **24 de junio**, fecha que coincide con el **solsticio de invierno austral**, el día más corto del año en el hemisferio sur. Tiene todo el sentido: era el momento en que el sol "se alejaba" más y había que pedirle que volviera.

Ten en cuenta que junio entero es de fiesta en Cusco, con desfiles, ferias y eventos casi a diario. El día 24 es feriado regional, así que la ciudad estará a tope.

## Los tres escenarios del día

Algo que muchos viajeros no saben: el Inti Raymi no ocurre en un solo lugar. Es una ceremonia itinerante que recorre tres escenarios a lo largo del día. Aquí tienes el resumen:

| Escenario | Hora aprox. | Acceso |
|---|---|---|
| Qoricancha (Templo del Sol) | 9:00 a.m. | Gratuito, calle abierta |
| Plaza de Armas | 11:00 a.m. | Gratuito, calle abierta |
| Explanada de Sacsayhuamán | 1:30 p.m. | Gratuito (laderas) o entrada pagada (graderías) |

### 1. Qoricancha, por la mañana

Todo arranca en el **Qoricancha**, el antiguo Templo del Sol, el lugar más sagrado del imperio. Allí el Inca saluda al sol naciente e invoca su bendición. Es un primer acto íntimo y muy fotogénico. Llega temprano porque el espacio frente al templo es reducido.

### 2. Plaza de Armas, al mediodía

La comitiva baja a la **Plaza de Armas**, sobre lo que fue el Haukaypata, la plaza ceremonial inca. Aquí se realiza el encuentro entre el tiempo y la autoridad: el Inca dialoga con el alcalde de la ciudad. Es el punto más céntrico y por eso el más lleno.

### 3. Sacsayhuamán, por la tarde: el acto principal

El gran final es en la **explanada de Sacsayhuamán**, la fortaleza de muros ciclópeos sobre la ciudad. Aquí, con cientos de actores, danzantes y el Inca presidiendo desde un trono, se desarrolla la ceremonia central, incluyendo la lectura de la ofrenda a Inti. Es un espectáculo de casi dos horas que vale cada minuto de la espera.

## Cómo verlo: gratis vs. graderías pagadas

Tienes dos formas de vivir el Inti Raymi, y conviene que decidas con tiempo.

**Zonas gratuitas.** En Qoricancha y la Plaza de Armas todo es de acceso libre; solo necesitas llegar temprano y aguantar el gentío. En Sacsayhuamán, las **laderas que rodean la explanada** son gratuitas: ves la ceremonia desde arriba, de lejos, pero con una vista panorámica preciosa. Eso sí, hay que subir varias horas antes para ganar sitio.

**Graderías pagadas.** Si quieres ver de cerca al Inca y los detalles, necesitas **entrada para las graderías** instaladas dentro de la explanada de Sacsayhuamán. Los precios rondan los **US$80 a US$200** según el sector (los más caros, frente al estrado, con asiento numerado). Estas entradas se agotan, así que **reserva con semanas o meses de anticipación**. Muchos viajeros las contratan dentro de un paquete con transporte y guía, que te evita la logística del traslado y el madrugón.

## Consejos prácticos de un guía local

- **Llega temprano.** Para cualquier escenario, cuanto antes mejor. En Sacsayhuamán, varias horas antes.
- **Protégete del sol.** A esa altura el sol quema fuerte aunque sea invierno: gorra, lentes y protector solar.
- **Lleva abrigo.** Suena contradictorio, pero en cuanto cae la tarde y el sol se va, la temperatura baja de golpe. Una chaqueta no sobra.
- **Agua y algo de comer.** Estarás muchas horas fuera; lleva agua y snacks.
- **Aclimatación primero.** Cusco está a 3.400 m. No llegues el mismo 24 desde el nivel del mar: date un par de días antes. Te cuento cómo es el ambiente en mi guía del [clima en Cusco mes a mes](/blog/clima-en-cusco-mes-a-mes).

## Junio es temporada alta: reserva con meses

Voy a ser directo: junio es **el mes más concurrido** del año en Cusco. Hoteles, trenes a Machu Picchu y restaurantes se llenan y suben de precio, y muchos se agotan. Si planeas combinar el Inti Raymi con Machu Picchu, compra los boletos de tren y la entrada cuanto antes; te explico la lógica de las fechas en [mejor época para Machu Picchu](/blog/mejor-epoca-machu-picchu).

Mi recomendación es venir unos días antes del 24, aprovechar para aclimatarte y conocer la ciudad. Si tienes poco tiempo, arma un itinerario eficiente con mi guía de [qué hacer en Cusco en 3 días](/blog/que-hacer-en-cusco-3-dias), y deja el día 24 libre por completo para la fiesta.

## Vívelo con nosotros

El Inti Raymi se planifica, no se improvisa. En Danfer Tours organizamos tu entrada a las graderías de Sacsayhuamán, el transporte y un guía que te explica cada parte de la ceremonia, además de armar tu viaje completo por Cusco y Machu Picchu alrededor de esas fechas.

Escríbeme a [hola@danfertourscusco.com](mailto:hola@danfertourscusco.com) o revisa nuestros [tours por Cusco](/tours) y aseguremos tu lugar para la Fiesta del Sol 2026. Las mejores ubicaciones vuelan: cuanto antes reserves, mejor verás al Inti.
$body$),
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1600&auto=format&fit=crop',
  'Danfer Tours Cusco',
  8,
  '["inti-raymi","fiesta-del-sol","cusco","junio","cultura"]'::jsonb,
  true,
  now() - interval '10 hours',
  jsonb_build_object('es', 'Inti Raymi 2026: Fiesta del Sol en Cusco'),
  jsonb_build_object('es', 'Qué es el Inti Raymi, por qué se celebra el 24 de junio y cómo verlo en Sacsayhuamán en 2026. Precios, escenarios y consejos de un guía local.')
) on conflict (slug) do nothing;

select slug, title->>'es' as titulo, read_minutes, published_at
from public.blog_posts
order by published_at desc;

-- >>>>>>>>>>>>>>>>>>>> BATCH 00015 >>>>>>>>>>>>>>>>>>>>
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
