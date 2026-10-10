# Rediseño página de tour (Fase 1) — Plan de implementación

> Spec: `docs/superpowers/specs/2026-10-09-danfer-tour-page-redesign-design.md`. Ejecución inline en esta sesión.

**Goal:** página de tour estilo AB Expeditions (mosaico, datos rápidos, pestañas, sidebar con prueba social, mapa, carrusel) con la marca Danfer.

**Architecture:** `page.tsx` sigue como orquestador server-side. Cada bloque nuevo vive en un componente propio en `src/components/tours/`. Las pestañas son un componente cliente que recibe los paneles ya renderizados como `ReactNode` (todo el contenido queda en el HTML; los paneles inactivos llevan `hidden`).

**Tech Stack:** Next 16 (App Router), React 19, Tailwind 4, framer-motion, lucide-react, Supabase.

## Global Constraints

- Colores: `night`, `gold`, `gold-bright`, `stone`, `cream` (sin rojo AB). La pestaña activa usa `bg-gold`.
- El JSON-LD no cambia.
- Ninguna calificación de terceros alimenta el schema.
- Sin test runner en el repo: verificar con `npx tsc --noEmit -p .`, `npx eslint <archivos>`, capturas con Chrome headless y `curl` + grep.
- Columnas nuevas opcionales en tipos (`important_info?`, `route_map_url?`): la página funciona aunque la migración no esté aplicada.

## Tasks

### Task 1: Extraer piezas compartidas
- Crear `src/components/tours/tripadvisor-badge.tsx`: `TripadvisorLogo({className})` y `TripadvisorRating({compact?: boolean, locale})`, que muestra el logo, 5 círculos verdes, el rating y el conteo de `TRIPADVISOR`.
- Crear `src/components/tours/tour-lightbox.tsx`: `TourLightbox({images, index, onClose, onIndex})`, extraído de `tour-gallery.tsx`.
- Modificar `booking-widget.tsx` (usa `TripadvisorLogo` importado) y `tour-gallery.tsx` (usa `TourLightbox`).
- Verificar: tsc + eslint. Commit.

### Task 2: Cabecera en mosaico + bloque de título + datos rápidos
- Crear `tour-header-gallery.tsx` (client): `TourHeaderGallery({images: GalleryImage[], locale})`. Desktop: grid de 4 columnas × 2 filas (grande `col-span-2 row-span-2` + 4 chicas). Móvil: carrusel snap con contador `n/total`. El clic abre `TourLightbox`.
- Crear `tour-quick-facts.tsx`: `TourQuickFacts({duration, type, difficulty, groupSize, locale})`, tarjeta blanca con 4 celdas e íconos (Clock, Compass, Mountain, Users).
- `page.tsx`: `images` sin duplicados (portada + galería, por url); `mosaic = images.length >= 5`. En modo mosaico: breadcrumbs → mosaico → título (H1, `TripadvisorRating`, etiquetas, `short_desc`). Si no, el hero actual. Los datos rápidos van en ambos modos, arriba de las pestañas. La galería dentro del contenido solo se muestra en modo hero.

### Task 3: Pestañas
- Crear `tour-tabs.tsx` (client): `TourTabs({tabs: {id: string; label: string; icon: ReactNode; content: ReactNode}[]})`. Barra `bg-night rounded-2xl`, sticky `top-20 z-30`, ícono arriba y label `uppercase text-[11px]`. Activa `bg-gold text-white`. Paneles con `hidden={active !== id}` dentro de una tarjeta blanca. El hash `#<id>` abre la pestaña al cargar (setState dentro de un `setTimeout`, por la regla de lint). Al hacer clic: `history.replaceState` del hash y scroll a la barra si está fuera de vista. En móvil, scroll horizontal.
- `page.tsx`: arma las pestañas `resumen` (descripción + destacados), `itinerario`, `incluye` (`TourIncludes` con `whatToBring=[]`), `preguntas`, `info` (`important_info`), `que-llevar` (`what_to_bring`). Omite las vacías. Debajo, siempre visibles: punto de encuentro, reseñas y formulario.

### Task 4: Extras de la columna derecha, mapa, carrusel, certificaciones
- Crear `tour-sidebar-extras.tsx`: `FeaturedReview({review: Review | null, locale})` (fallback a `FACEBOOK_REVIEWS[0]`) y `ExpertCard({whatsapp, tourTitle, locale})`.
- Crear `tour-route-map.tsx`: `TourRouteMap({url, title, locale})`.
- `related-tours.tsx` → carrusel (client) con flechas usando `TourCard`. `getRelatedTours(..., 6)`.
- Crear `src/lib/certifications.ts` (`CERTIFICATIONS: {name, logo}[] = []`) y `certifications-strip.tsx` (devuelve null si está vacío).
- Tipos: `important_info?: LocalizedList; route_map_url?: string | null` en `Tour`.

### Task 5: Verificación y deploy de la página
- tsc + eslint. Capturas desktop/móvil de un tour con ≥5 imágenes y de otro con menos. Comparar el JSON-LD antes y después. Commit + push → Vercel. Verificar en producción.

### Task 6: Migración + admin (gated)
- `supabase/migrations/00017_tour_important_info_route_map.sql`: `alter table tours add column if not exists important_info jsonb not null default '[]'::jsonb, add column if not exists route_map_url text;`
- El usuario la aplica en el SQL Editor de Supabase (no hay credenciales de DB en `.env.local`).
- Después: el admin (`_tour-form.tsx`, `actions.ts`) suma un `ListEditor` ES/EN para Información útil y un `ImageUpload` para el mapa. Deploy solo después de aplicar la migración (si no, guardar un tour falla).
