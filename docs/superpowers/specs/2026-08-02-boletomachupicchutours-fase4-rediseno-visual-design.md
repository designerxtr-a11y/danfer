# boletomachupicchutours.com — Fase 4: Rediseño visual (turquesa, look de agencia)

## Contexto

Fases 1 (infraestructura) y 3 (catálogo + contenido home) están completas y en producción. El spec de Fase 3 dejó registrado explícitamente que el sistema visual dorado/"night" existente se conservaba tal cual, y que de cuscoperu.com solo se tomaba la estructura de contenido (filas temáticas, FAQ), no el estilo visual.

Al ver el sitio ya desplegado, el usuario pidió lo contrario a lo documentado: quiere que el frontend se sienta visualmente como cuscoperu.com, no solo estructuralmente. Se hizo brainstorming con mockups (paleta de color y tipografía) para definir cuánto parecido es razonable, dado que cuscoperu.com es un competidor real y activo, no relacionado con Danfer — un clon visual muy literal tiene riesgo de parecido de marca ("trade dress"), distinto del riesgo de "doorway site" ya mitigado frente a Danfer en Fase 1.

**Decisión:** interpretación **inspirada, no clon literal** — misma sensación de "operador de viajes serio y confiable" (paleta fría + blanco, tipografía limpia de agencia), con composición y detalles propios.

## Alcance de esta fase

Reskin visual completo de todas las páginas públicas de boletomachupicchutours:

- Home (`/`) y todas sus secciones
- `/tours` (listado) y `/tours/[slug]` (detalle)
- `/sobre-nosotros`
- `/blog` y `/blog/[slug]`
- `/destinos`, `/destinos/[slug]`
- `/contacto`, `/reservar/[slug]`, `/reservar/confirmacion`
- `/cancelacion`, `/privacidad`, `/terminos`
- `navbar.tsx` y `footer.tsx` (globales)

**Fuera de alcance** (explícito):
- Panel `/admin` — herramienta interna, no es imagen de marca pública, no se toca.
- Contenido/copy de los tours (redactado en Fase 3) — este es un cambio de estilo visual, no de contenido.
- Estructura de secciones del home (filas temáticas, FAQ, orden) — ya quedó alineada a cuscoperu.com desde Fase 3, no se reestructura de nuevo.
- Reseñas/certificaciones reales — sigue sin haberlas; ver sección 4.
- Traducción a inglés — Fase 5, sin cambios aquí (el reskin aplica por igual a los textos ya existentes en ambos locales).

## 1. Paleta de color

`--color-turquoise` (#0077B6) y `--color-turquoise-deep` (#023E8A) ya existen en `src/app/globals.css` como color secundario de fondo — pasan a ser el color **primario** de marca, reemplazando a `--color-night` (#0B1929) como color dominante.

| Token | Antes (rol) | Después (rol) |
|---|---|---|
| `--color-turquoise` / `-deep` | Secundario, decorativo (blobs de fondo) | **Primario** — navbar, hero, botones principales, acentos de sección, footer |
| `--color-night` | Fondo dominante (hero, footer, secciones oscuras) | Solo texto oscuro sobre fondos claros donde haga falta contraste; deja de usarse como `background` |
| `--color-gold` / `-bright` | Acento protagonista (CTAs, eyebrows, `text-gradient-gold`) | Acento puntual reducido — hover de botones, algún highlight aislado; deja de ser el color que "define" la marca |
| `--color-paper` / `--color-cream` / `--color-stone` | Fondos claros de algunas secciones | Sin cambio — pasan a ser el fondo dominante en casi toda página |
| `--color-terracotta` | Sin uso activo hoy | Sin cambio, se mantiene disponible sin uso obligatorio |

No se agregan tokens nuevos — el cambio es de **rol** (qué color domina), no de paleta.

## 2. Tipografía

| Token | Antes | Después |
|---|---|---|
| `--font-display` (Playfair, serif) | Todos los títulos (`h1`/`h2` de secciones) | Se deja de usar en componentes rediseñados — títulos pasan a `--font-body` (Inter), peso 700-800 |
| `--font-hand` (Caveat, script) | "Eyebrows" cursivos sobre cada sección (ej. "Inolvidables, garantizado") | Se deja de usar — eyebrows pasan a texto uppercase con letter-spacing (`text-[11px] uppercase tracking-[0.25em]`, patrón que ya existe en `featured-tours.tsx` para los eyebrows secundarios) |
| `--font-body` (Inter) | Solo párrafos | Se convierte en la única fuente del sitio (títulos, eyebrows y párrafos) |

Nota: `--font-display` y `--font-hand` no se eliminan de `globals.css` (evita romper algo fuera de alcance que aún los referencie, ej. contenido rico de blog vía `.prose` si aplica) — simplemente dejan de usarse en las clases de los componentes listados en la sección 3.

**Pendiente sin dueño (detectado en el review final de Fase 4a):** `globals.css` tiene 2 usos literales de `--color-gold` fuera de la tabla de tokens — `::selection { background: var(--color-gold) }` y `::-webkit-scrollbar-thumb:hover { background: var(--color-gold) }`. Ninguna sub-fase los tiene asignados explícitamente todavía; se resuelven en la sub-fase que toque `globals.css` de forma más estructural, o en la última sub-fase de Fase 4 como limpieza final.

## 3. Componentes y páginas afectadas

Mismo cambio de tokens aplicado consistentemente. Se agrupan por área para la futura planificación:

- **Global:** `src/app/globals.css` (roles de color descritos arriba), `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/newsletter-form.tsx`, `src/components/layout/whatsapp-button.tsx` (los últimos dos no estaban en esta lista originalmente — el review final de Fase 4a los encontró sin dueño, migrados ahí mismo con aprobación del usuario; ya completos, no requieren trabajo en sub-fases futuras)
- **Home:** `hero.tsx`, `stats.tsx`, `featured-tours.tsx` + `featured-tours.client.tsx`, `destinations.tsx` + `destinations.client.tsx`, `testimonials.tsx` + `testimonials.client.tsx`, `faq.tsx`
- **Tours:** `tours/page.tsx` + `page.client.tsx` (listado), `tours/[slug]/page.tsx` (detalle)
- **Sobre nosotros:** `sobre-nosotros/page.tsx`
- **Blog:** `blog/page.tsx`, `blog/[slug]/page.tsx`
- **Páginas menores:** `destinos/`, `contacto/`, `reservar/`, `cancelacion/`, `privacidad/`, `terminos/` — mismo cambio de tokens, sin rediseño estructural adicional (son páginas simples, el reskin es casi automático al cambiar los tokens si los componentes de home/tours ya migraron)

## 4. Reseñas y elementos de confianza

Sin cambios respecto a la regla ya establecida en Fase 3: no se fabrican reseñas, ratings ni certificaciones. La sección de testimonios se rediseña visualmente (paleta nueva) pero mantiene su lógica actual — si no hay reseñas reales, queda en estado vacío honesto. No se agrega ningún badge tipo "TripAdvisor" u otra certificación que la marca no tenga hoy.

## Testing / verificación de esta fase

- `npm run build` pasa sin errores nuevos (mismo criterio que Fases 1 y 3 — sin framework de tests).
- Revisión visual en `npm run dev` de cada página listada en el Alcance: dominante turquesa/blanco, sin fondos "night" oscuros como base, sin texto en Playfair/Caveat.
- `grep -rn "font-hand\|font-display" src/components/sections src/components/layout src/app/\[locale\]/\(public\)` — sin resultados en los archivos listados en la sección 3 (pueden quedar en `admin/` u otros fuera de alcance).
- Ningún dato fabricado nuevo: mismo grep de Fase 3 (`mincetur|8,500|8500|tripadvisor|danfer`) sigue sin resultados.
- Sitio sigue `noindex` — esta fase no toca `robots.ts` ni `layout.tsx`.
