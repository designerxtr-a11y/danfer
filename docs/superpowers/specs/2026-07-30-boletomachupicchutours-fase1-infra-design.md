# boletomachupicchutours.com — Fase 1: Infraestructura

## Contexto

Danfer Tours (danfertourscusco.com) lleva ~2 meses de trabajo de SEO orgánico. El diagnóstico (ver memoria `seo-organico-danfertours`) es que el cuello de botella ya no es técnico sino reputación/autoridad de dominio frente a competidores como Viator, GetYourGuide, TripAdvisor.

Se analizó el competidor boletomachupicchu.com (agencia enfocada 100% en venta de boletos oficiales a Machu Picchu, con verificador de disponibilidad, comparativas de circuitos/rutas y lead magnet en PDF) y el sitio de referencia cuscoperu.com (operador maduro, ~50+ páginas, blog, certificaciones CARTUC/MINCETUR/IATA).

Decisión: construir un sitio hermano en el dominio **boletomachupicchutours.com** (ya registrado por el usuario), enfocado en el término de alta intención "boleto Machu Picchu", vendiendo los mismos tours que Danfer opera pero con contenido reescrito y marca propia — no una copia 1:1 ni un catálogo compartido.

## Riesgo identificado: doorway sites

Google prohíbe explícitamente múltiples sitios del mismo negocio compitiendo por las mismas búsquedas y embudando al mismo destino (política de spam "doorway pages/sites"). Si este sitio comparte teléfono/WhatsApp, fotos y contenido literal con danfertourscusco.com, Google puede detectarlo y aplicar acción manual a **ambos** dominios — empeorando el problema de autoridad ya diagnosticado en vez de resolverlo.

**Mitigación acordada con el usuario:**
- Marca hermana con identidad propia ("Boleto Machu Picchu Tours"), sin mencionar "Danfer".
- Contenido de tours reescrito desde cero por tour (mismos tours/operación real, texto distinto).
- Contacto/WhatsApp propio (a definir en Fase 2), no el de Danfer.
- Supabase e infraestructura de hosting completamente separados (proyecto Vercel propio, proyecto Supabase propio).

## Roadmap completo (para contexto — solo Fase 1 se especifica en detalle aquí)

1. **Infraestructura y scaffold** (este documento)
2. **Identidad de marca** — nombre visual, logo, colores, WhatsApp/contacto real
3. **Catálogo de tours** — contenido reescrito por tour (Machu Picchu + Cusco tours mínimo)
4. **Blog y señales de confianza** — artículos, FAQ, testimonios, certificaciones
5. **Inglés completo + pulido SEO final** — hreflang, sitemap, schema, lanzamiento

## Fase 1 — Alcance

Dejar un sitio esqueleto funcionando en producción en boletomachupicchutours.com, con login de admin operativo contra un Supabase propio, y la estructura lista para recibir marca (Fase 2) y contenido (Fase 3).

**Explícitamente fuera de alcance de esta fase:** contenido real de tours, blog posts, textos de marketing definitivos, logo/paleta final, WhatsApp/contacto real.

## Arquitectura

- Carpeta nueva `C:\xampp\htdocs\boletomachupicchutours`, proyecto Next.js 16 independiente, con **su propio repositorio git** — no es submódulo ni parte del repo de cuscotours-v2.
- Se parte copiando el árbol `src/` de cuscotours-v2 como base (Next 16 App Router, TypeScript, Tailwind, Supabase vía `@supabase/ssr`, next-intl ES/EN, editor Tiptap, utilidades SEO) y luego se limpia: se elimina o reemplaza todo lo específico de Danfer.
- **Nota:** este proyecto usa una versión de Next.js con cambios de breaking respecto a lo estándar (ver `AGENTS.md` de cuscotours-v2: "This is NOT the Next.js you know"). Antes de escribir código en el proyecto nuevo hay que revisar `node_modules/next/dist/docs/` igual que en el original.
- Supabase: proyecto nuevo (el usuario lo crea en supabase.com y entrega URL + anon key + service role key), con el mismo esquema estructural de tablas que cuscotours-v2 (tours, categorías, blog_posts, settings, reviews, bookings, inquiries, admin users), pero sin ningún dato de Danfer — arranca vacío o con seed genérico mínimo.
- Deploy: proyecto Vercel nuevo (no relacionado al de Danfer), dominio boletomachupicchutours.com (ya registrado por el usuario, falta apuntar DNS al proyecto de Vercel).

## Qué se porta tal cual (misma lógica, sin cambios funcionales)

- Auth de admin y CRUD de tours/blog/settings/reviews/bookings/inquiries (`src/app/admin/**`, `src/app/admin/_actions`, `src/app/admin/_components`)
- i18n ES/EN (`src/lib/i18n/**`, next-intl)
- Utilidades SEO: `src/lib/seo/schema.ts` (schema.org), `src/lib/seo/faq-extract.ts` (FAQPage), `src/lib/seo/alternates.ts` (hreflang/`buildAlternates`), `src/lib/seo/site-url.ts`, sitemap y OG images dinámicas por post/tour
- Editor Tiptap para blog (`@tiptap/*`)
- Capa de datos: `src/lib/queries/**`, `src/lib/supabase/**`

## Qué se limpia o reemplaza

- Nombre de marca, dominio, WhatsApp, enlaces a redes sociales (TikTok/Facebook/Instagram de `@danfertourscusco`) → placeholders de "Boleto Machu Picchu Tours"; contacto real se define en Fase 2
- Migraciones de contenido específico de Danfer (`00005_brand_danfer.sql`, `00009`–`00015_seo_blog_posts_*`, `00012_real_facebook_reviews.sql`) → **no se portan**; se mantiene solo el esqueleto estructural de las migraciones (schema + RLS policies)
- Contenido hardcodeado de destinos (`src/lib/destinations-content.ts`, `src/lib/destinations-en/*`) → se revisa caso por caso; si es genérico (info de Machu Picchu/Camino Inca) se puede adaptar, si es específico de Danfer se descarta
- Logo/paleta de colores → placeholder neutro hasta Fase 2
- `src/lib/scrapers/**` (incluye `paraphrase.ts`) → se conserva el código porque es reutilizable para poblar contenido reescrito en Fase 3, pero no se ejecuta en esta fase

## Testing / verificación de esta fase

- `npm run dev` levanta sin errores; home placeholder carga en `/es` y `/en`
- Login de admin funciona contra el Supabase nuevo (usuario admin creado vía migración de bootstrap)
- CRUD básico de un tour de prueba funciona end-to-end (crear/editar/borrar) contra el Supabase nuevo
- Deploy en Vercel accesible en boletomachupicchutours.com con HTTPS válido
- Grep de `danfer`/`Danfer` (case-insensitive) sobre el código nuevo no debe arrojar resultados fuera de comentarios explicativos de este documento
