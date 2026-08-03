# boletomachupicchutours.com — Navbar mega-menú (paridad con cuscoperu.com) + video del hero en mobile

## Contexto

El usuario vio el sitio ya desplegado (Fase 4b-1 en producción: hero + stats con el nuevo look turquesa) y señaló que no se siente "como cuscoperu.com" — concretamente por dos cosas que **no** son parte del rediseño visual (color/tipografía) de la Fase 4: el video del hero no se ve en mobile, y el navbar no tiene el menú de categorías con dropdown que tiene cuscoperu.com.

A diferencia de Fase 4 (spec padre `2026-08-02-...-fase4-rediseno-visual-design.md`, explícitamente "reskin visual únicamente — no se toca copy/contenido ni la estructura de secciones"), este trabajo sí toca estructura y contenido del navbar — por eso vive en su propio spec, no como una sub-fase más de Fase 4. Reabre dos archivos que Fase 4 ya había dado por completos: `navbar.tsx` (Fase 4a) y `hero.tsx` (Fase 4b-1).

cuscoperu.com se usa, como ya quedó fijado en Fase 3, solo como referencia de **estructura** (qué categorías tiene un menú de agencia de viajes de Cusco), no de contenido literal — boletomachupicchutours solo vende 6 tours enfocados en Machu Picchu (los mismos que opera Danfer), no el catálogo Perú-amplio de cuscoperu. El mapeo de categorías de este spec usa exclusivamente inventario real ya existente (tours, categorías, destinos, páginas institucionales) — no crea tours, paquetes ni contenido nuevo.

## Alcance

- `src/components/layout/navbar.tsx` — mega-menú con dropdowns (desktop) + acordeones (mobile overlay)
- `src/components/sections/hero.tsx` — video de fondo también en mobile
- `src/app/[locale]/(public)/layout.tsx` — pasa los datos nuevos (categorías+tours, destinos) al `Navbar` como props, mismo patrón que ya usa para `logoUrl`

**Fuera de alcance:**
- Crear tours, paquetes multi-día o cualquier contenido nuevo (blog posts, páginas) — el mapeo usa solo lo que ya existe hoy.
- Añadir filtrado por categoría en `/tours` vía query param (`?category=`) — hoy ese filtro es solo estado local de cliente (`page.client.tsx`); los links del mega-menú apuntan directo a cada tour, no a una vista pre-filtrada.
- Tags/filtrado del blog — no existe esa infraestructura hoy; "Qué Hacer" enlaza directo a `/blog` sin dropdown.
- Colores/tipografía — se reutilizan tal cual los tokens y reglas ya fijados en Fase 4a/4b-1 (turquesa primario, `--color-gold` solo en el wordmark del logo, sin `font-display`/`font-hand`, botones con fondo propio en blanco sólido + texto `turquoise-deep`).
- Footer — no se toca.

## 1. Navbar: mega-menú con contenido real

### Mapeo de categorías (cuscoperu → boletomachupicchutours)

| Item del menú | Tipo | Contenido | Fuente de datos |
|---|---|---|---|
| Machu Picchu Tours | Dropdown | Tours de la categoría `machu-picchu` | `getCategoriesWithTours()` |
| Cusco Tours | Dropdown | Tours de la categoría `valle-sagrado` (Pisac, Ollantaytambo) | `getCategoriesWithTours()` |
| Camino Inca y Trekking | Dropdown | Tours de `camino-inca` + `aventura` (Rainbow Mountain, Humantay) combinados en una sola lista | `getCategoriesWithTours()` |
| Vacaciones Perú | Link directo (sin dropdown) | Apunta a `/tours` (los 6 tours) | — |
| Conoce Perú | Dropdown | Los 5 destinos de contenido (Machu Picchu, Camino Inca, Valle Sagrado, Rainbow Mountain, Laguna Humantay) + "Ver todos" a `/destinos` | `listDestinations()` de `@/lib/destinations-content` |
| Qué Hacer | Link directo (sin dropdown) | Apunta a `/blog` | — |
| Info Útil | Dropdown | Sobre Nosotros, Contacto, Reviews (`/#reviews`, solo funciona desde home), Términos, Cancelación, Privacidad | rutas estáticas, hardcodeadas en `navbar.tsx` |

Notas sobre el mapeo:
- **Categorías de tours vs. destinos son fuentes distintas.** La tabla `categories` (4 filas: `machu-picchu`, `valle-sagrado`, `camino-inca`, `aventura`) agrupa tours; `listDestinations()` (5 entradas, incluye `laguna-humantay` que no tiene categoría de tour propia) es contenido editorial para `/destinos`. El mega-menú usa cada una donde corresponde — no se intenta unificarlas.
- **"Vacaciones Perú" y "Qué Hacer" son links simples, no dropdowns**, porque no hay un segundo nivel real que mostrar (no hay paquetes multi-día; no hay tags de blog). Visualmente son un item de nav más, sin flecha/chevron de dropdown.
- Se preserva todo lo que existe hoy en el navbar (Reviews) — se reubica dentro de "Info Útil" en vez de desaparecer.

### Comportamiento del dropdown (desktop)

- Se abre con `onMouseEnter` en el item del nav, se cierra con `onMouseLeave` del conjunto item+panel (con un pequeño delay, patrón estándar, para que mover el mouse en diagonal hacia el panel no lo cierre de golpe).
- Panel tipo mega-menú: ancho fijo razonable (no todo el viewport), fondo blanco sólido con sombra (`shadow-soft`, ya usado en el navbar sólido), independiente de si el navbar está en estado transparente u opaco — el panel del dropdown siempre es legible (fondo blanco + texto `night`), nunca transparente sobre el hero.
- Cada link del panel: título del tour/destino + ícono `ArrowRight` sutil en hover, mismo lenguaje visual que el resto del sitio (turquesa en hover, no gold).
- Los items sin dropdown (Vacaciones Perú, Qué Hacer) son `<Link>` directos, sin lógica de hover/panel.

### Mobile (overlay a pantalla completa, ya existente)

- Mismos 7 items. Los que tienen dropdown se vuelven acordeones (tap para expandir/colapsar la sublista), reutilizando el patrón de animación que ya tiene el overlay mobile (`AnimatePresence`, stagger por índice).
- Los que son link directo se comportan igual que hoy (tap → navega y cierra el overlay).

### Flujo de datos

`layout.tsx` (server component) ya hace `getSettings()` para el logo; se agregan en paralelo `getCategoriesWithTours()` y `listDestinations()`, y se pasan como props nuevas a `<Navbar>` (`categories`, `destinations`), igual patrón que `logoUrl`. `Navbar` sigue siendo `"use client"` para el estado de scroll/hover/mobile-menu, pero ya no hace ningún fetch — solo recibe datos.

## 2. Hero: video también en mobile

Hoy `hero.tsx` muestra una `<Image>` estática (LCP, `priority`) en mobile y el `<video>` solo en `md:` — decisión tomada porque el MP4 1080p externo de Pexels penaliza datos/LCP en tráfico orgánico móvil (comentario existente en el código).

Cambio: en vez de eliminar esa protección, se le da a mobile una variante **más liviana del mismo clip** (resolución menor, mismo contenido). El patrón poster-primero se mantiene igual en todos los breakpoints: la `<Image>` sigue siendo el elemento que pinta primero (sigue siendo candidato a LCP), y el `<video>` reemplaza visualmente en cuanto tiene datos suficientes vía el mismo `IntersectionObserver` que ya decide play/pause — solo cambia qué archivo de video se le sirve a cada breakpoint.

- Desktop (`md:` y mayor): variante actual (1920×1080).
- Mobile (`<md`): variante liviana del mismo clip (menor resolución/bitrate).
- Se elimina la clase `hidden` del `<video>` en mobile; ambos breakpoints muestran video, cambia el `src`.

**Pendiente de verificar en el plan de implementación:** Pexels normalmente publica cada video en varios tamaños de archivo (bajo el mismo ID de video, distintos IDs de archivo), pero no está confirmado que exista una variante liviana descargable por URL directa para este clip (`2169307`) sin pasar por su página/API. Si no hay una variante lista para usar por URL directa, el fallback es comprimir el MP4 actual a una versión ligera (ej. 720p o menor bitrate) y alojarla junto a los demás assets del proyecto (mismo lugar que sirve `VIDEO_POSTER`), en vez de bloquear el cambio.

## Testing / verificación

- `npm run build` pasa sin errores nuevos.
- Revisión visual en `npm run dev`, viewport mobile (<768px) y desktop, de `/es` y `/en`:
  - Hero: video visible y reproduciéndose en mobile (no solo la foto estática).
  - Navbar desktop: cada uno de los 7 items se ve; los 5 con dropdown abren un panel blanco legible con los links correctos; los 2 sin dropdown navegan directo.
  - Navbar mobile: overlay muestra los 7 items, los acordeones expanden/colapsan correctamente.
- Verificar que ningún link nuevo sea 404 (tours/destinos por slug real, `/blog`, `/tours`, `/destinos`, `/#reviews`, y las páginas institucionales).
- `grep -n "text-gold\|font-display\|font-hand" src/components/layout/navbar.tsx` — sin resultados nuevos (el único gold permitido sigue siendo el wordmark del logo, ya existente).
