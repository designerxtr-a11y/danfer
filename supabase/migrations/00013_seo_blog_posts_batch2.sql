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
