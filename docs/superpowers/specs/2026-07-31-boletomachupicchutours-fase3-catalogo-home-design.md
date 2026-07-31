# boletomachupicchutours.com — Fase 3: Catálogo de tours + contenido del home

## Contexto

Fase 1 (infraestructura) está completa y en producción — ver `2026-07-30-boletomachupicchutours-fase1-infra-design.md`. El sitio está `noindex` hasta que haya contenido real. Esta fase entrega ese contenido: los 6 tours reales que opera el negocio (mismos tours/equipo/permisos que danfertourscusco.com, marca distinta), redactados desde cero, más los ajustes de home necesarios para presentarlos bien.

Durante el brainstorming se revisó cuscoperu.com (sitio de referencia ya identificado en el spec de Fase 1) como modelo de estructura de contenido — no de estilo visual, que ya es superior en boletomachupicchutours (sistema editorial dorado/"night" existente, se conserva tal cual). De esa revisión salieron además dos hallazgos de contenido fabricado heredado de un rebrand mecánico anterior, que esta fase también corrige.

**Relación con Danfer (aclarado con el usuario):** Boleto Machu Picchu Tours es la misma operación real (mismos guías, vehículos, permisos) que Danfer, con marca e infraestructura separadas. Esto permite reclamar experiencia real en términos generales, pero **no** cifras/fechas/ratings específicos de Danfer bajo el nombre nuevo (esas cifras son verificables y falsas para esta marca — ver sección "Sobre nosotros y footer").

## Alcance de esta fase

1. Importar y redactar los 6 tours reales en el Supabase de boletomachupicchutours.
2. FAQ por tour (campo `tours.faqs`, ya soportado por el frontend).
3. Corregir contenido fabricado en "Sobre nosotros" y el footer.
4. Corregir precios falsos en el FAQ del home y hacerlo visible (hoy es JSON-LD invisible).
5. Reorganizar la grilla de tours destacados del home en filas temáticas.

**Fuera de alcance** (explícito, para fases posteriores o decisión ya tomada):
- Badges de certificación (CARTUC/IATA/GERCETUR): no hay certificaciones reales que mostrar todavía.
- Filtros en `/tours` (duración/precio): con 6 tours no aportan; cuscoperu.com los necesita porque tiene 48.
- Traducción a inglés de todo lo nuevo: Fase 5, según el roadmap original.
- Identidad visual (logo, colores, fotos de portada/polaroids): el usuario la gestiona directamente desde `/admin/settings`.

## 1. Catálogo de tours

**Fuente de datos:** Supabase de Danfer (cuscotours-v2), tabla `tours` + `tour_itinerary` (solo `camino-inca-4-dias` tiene filas). Los 6 tours, ya verificado que categorías y slugs calzan 1:1 entre ambos proyectos:

| slug | categoría | precio | duración |
|---|---|---|---|
| machu-picchu-full-day | machu-picchu | $100 | 1d |
| camino-inca-4-dias | camino-inca | $150 | 4d |
| city-tour-cusco | machu-picchu | $15 | 1d |
| valle-sagrado-vip | valle-sagrado | $125 | 1d |
| rainbow-mountain | aventura | $35 | 1d |
| laguna-humantay | aventura | $35 | 1d |

**Qué se copia tal cual** (datos de negocio/hechos reales, no contenido): precio, duración, dificultad, tamaño de grupo, altitud, categoría, fotos (`cover_image`/`gallery` — 4 tours tienen fotos reales de Danfer, `machu-picchu-full-day` y `city-tour-cusco` siguen con stock de Unsplash; se importan tal cual están hoy en ambos casos).

**Qué se redacta desde cero:** `title` (mismo tour, texto propio), `subtitle`, `short_desc`, `description`, `highlights`, `includes`, `excludes`, `what_to_bring`, y la descripción de cada día de `tour_itinerary` (Camino Inca). Lo escribe Claude directamente (prosa original, sin parafraseador algorítmico — decisión revisada durante el brainstorming), con el ángulo de marca "tu boleto a Machu Picchu, sin complicaciones" y calidad a la altura de cuscoperu.com.

**FAQ por tour:** 3-4 preguntas y respuestas por tour en el campo `tours.faqs` (jsonb, ya soportado por `TourFaqs` en el frontend y por `tourFaqsSchema()`), en la línea de las FAQ del home (mejor época, altitud, qué llevar, con qué antelación reservar) pero específicas de cada tour.

**Reviews/rating:** NO se copian `rating`/`reviews_count` de Danfer (1-2 reseñas cada uno, no representativas). Los tours nuevos arrancan en el default de la tabla (`rating=5.0`, `reviews_count=0`) — consistente con la decisión ya tomada en Fase 1 de no portar reseñas reales de Danfer.

**Mecánica:** script `scripts/import-tours-from-danfer.mjs` en boletomachupicchutours. Los datos "hecho" (precio, duración, etc.) y las URLs de imágenes se leen en vivo del Supabase de Danfer vía credenciales pasadas por variable de entorno en el momento de ejecutar (`SOURCE_SUPABASE_URL`, `SOURCE_SUPABASE_SERVICE_ROLE_KEY` — nunca se guardan en el repo nuevo, mantiene la separación de infraestructura de Fase 1). El texto redactado (title/subtitle/description/highlights/includes/excludes/what_to_bring/faqs/itinerario) va embebido como contenido literal en el propio script — no se genera en tiempo de ejecución. Upsert por `slug` (re-ejecutable sin duplicar).

**Verificación:** 6 filas en `tours`, 4 filas en `tour_itinerary` para `camino-inca-4-dias`; `select slug, title->>'es', category_id from tours` muestra las categorías correctas; cada tour tiene `faqs` con al menos 3 entradas; grep de "danfer"/"Danfer" sobre el script y sobre el contenido insertado da 0 (no debería aparecer nunca, al ser texto nuevo, pero se verifica igual).

## 2. Sobre nosotros y footer — retirar contenido fabricado

Hallazgo: `sobre-nosotros/page.tsx` tiene una línea de tiempo con fechas y cifras específicas de Danfer (fundación 2012, "primer permiso Camino Inca 2016", "+5,000 viajeros 2019 · rating 4.9 en TripAdvisor", expansión 2022) y una barra de stats ("8,500+ viajeros felices", "35 rutas exclusivas", "4.9 rating TripAdvisor"). El footer tiene "Operador autorizado MINCETUR" y "12+ años en Cusco" en la trust strip. La metadata de la página repite "operador autorizado por MINCETUR con +12 años". Ninguna de estas cifras es verificable para esta marca — el caso más grave es el rating de TripAdvisor: esta marca no tiene perfil en TripAdvisor, así que publicar "4.9" es una afirmación falsa y fácilmente refutable.

**Regla aplicada:** experiencia en términos generales sí (mismo equipo real, confirmado por el usuario), cifras/fechas/ratings específicos no, hasta que existan de verdad bajo esta marca.

Cambios:
- **Timeline de milestones** (`sobre-nosotros/page.tsx`, array `milestones`): se elimina. Se reemplaza la sección por un párrafo corto sin fechas ("Detrás de Boleto Machu Picchu Tours hay un equipo que lleva años operando tours en Cusco — mismos guías certificados, mismos permisos, ahora enfocados 100% en hacerte fácil tu boleto y tu viaje a Machu Picchu.") — true en sustancia, sin inventar una cronología propia de una marca que nació esta semana.
- **Stats strip** (`8,500+`, `35`, `4.9 TripAdvisor`): se elimina el rating de TripAdvisor por completo (no existe perfil). Los otros dos números se eliminan también por no ser verificables bajo esta marca — la sección de values grid ("Cuatro razones para confiar") ya cubre el mensaje de confianza sin cifras.
- **Footer trust strip:** "Operador autorizado MINCETUR" → "Operador turístico autorizado" (general, sin nombrar un ente regulador específico sin confirmar); "12+ años en Cusco" → "Equipo con años de experiencia en Cusco" (mismo hecho, sin cifra exacta no verificable bajo esta marca).
- **Metadata de sobre-nosotros** (`generateMetadata`) y el value-card "Autorizados MINCETUR": mismo ajuste — quitar "MINCETUR" y "+12 años"/"13 años" por frases generales de experiencia/autorización.

## 3. FAQ del home — corregir y hacer visible

`homepageFaqSchema()` en `src/lib/seo/schema.ts` tiene 8 preguntas ya bien escritas, pero dos respuestas citan precios inventados que no coinciden con los reales: "Full Day a Machu Picchu... desde US$380" (real: $100) y "Camino Inca de 4 días desde US$750" (real: $150). Hoy además el bloque solo se emite como JSON-LD (`homepageFaqSchema()` en `page.tsx`), nunca se renderiza visible — lo cual incumple el requisito de Google de que el FAQPage schema refleje contenido visible en la página.

Cambios:
- Corregir los dos precios en `schema.ts` para que coincidan con los reales ($100 / $150).
- Nuevo componente `src/components/sections/faq.tsx` (accordion, mismo lenguaje visual dorado/editorial que el resto del home) que renderiza esas mismas 8 preguntas, insertado en `page.tsx` después de `Testimonials`.

## 4. Reorganizar tours destacados del home en filas temáticas

Hoy `FeaturedTours` es una sola grilla plana de 6 tarjetas (`getFeaturedTours(6)`). Se reorganiza en 3 filas curadas por tema, con encabezado tipo pregunta (inspirado en la estructura de cuscoperu.com, adaptado a un catálogo de 6 tours en vez de filtrar entre 48):

1. **"¿Cuáles son las mejores opciones para Machu Picchu?"** → `machu-picchu-full-day`, `camino-inca-4-dias`
2. **"Valle Sagrado y Cusco, lo esencial"** → `valle-sagrado-vip`, `city-tour-cusco`
3. **"Aventura en las alturas"** → `rainbow-mountain`, `laguna-humantay`

Nota: este agrupamiento es curatorial para el home (no depende de `category_id` — `city-tour-cusco` está categorizado como `machu-picchu` en la base de datos pero temáticamente se agrupa con Valle Sagrado en el home). El listado `/tours` y sus filtros por categoría, si los hay, siguen usando `category_id` sin cambios.

## Testing / verificación de esta fase

- `npm run dev`: home muestra 3 filas de tours (2 tarjetas c/u) + sección FAQ visible con precios correctos.
- Cada una de las 6 páginas `/tours/[slug]` carga con descripción, highlights, itinerario (Camino Inca) e includes/excludes propios; sección FAQ del tour visible con ≥3 preguntas.
- `/sobre-nosotros` y el footer ya no muestran fechas/cifras/ratings específicos no verificables (ni "MINCETUR", ni "TripAdvisor 4.9", ni años exactos, ni timeline con fechas).
- `select count(*) from tours` = 6, `select count(*) from tour_itinerary` = 4 (todas de `camino-inca-4-dias`).
- Sitio sigue `noindex` (sin cambios de Fase 1 en `robots.ts`/`layout.tsx` — el contenido se prepara, el lanzamiento a indexación sigue siendo Fase 5).
