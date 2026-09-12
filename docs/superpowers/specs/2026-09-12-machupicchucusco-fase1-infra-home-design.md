# machupicchucusco.pe — Fase 1: Infraestructura + Home real

## Contexto

Danfer Tours (danfertourscusco.com) y boletomachupicchutours.com ya son dos marcas activas del mismo operador real (Danfer). El usuario es dueño del dominio **machupicchucusco.pe**, hoy un sitio PHP de terceros (script comprado, sin código local accesible) con **cero páginas indexadas en Google** y cero backlinks — confirmado con `site:machupicchucusco.pe` sin resultados, pese a que `robots.txt` y el meta tag permiten indexación. El nombre del dominio aporta una señal SEO menor (keywords "machupicchu"+"cusco" en el dominio, débil desde el "EMD update" de Google de 2012), pero no compensa la falta total de contenido/autoridad.

Decisión: retirar el sitio PHP viejo y construir un sitio nuevo en el mismo dominio, mismo stack que Danfer/boleto (Next.js + Supabase), como **tercera marca hermana**: **"MachuPicchuCusco"**, vendiendo los mismos tours reales que opera Danfer, mismo público objetivo que las otras dos marcas (no un nicho distinto — el usuario lo confirmó explícitamente: "igual conseguir pasajeros").

## Riesgo identificado: doorway sites (mismo que se mitigó con boleto)

Google prohíbe múltiples sitios del mismo negocio compitiendo por las mismas búsquedas con contenido/contacto duplicado (política de spam "doorway pages/sites"). Con TRES marcas hermanas ahora, el riesgo es aún más relevante que cuando se lanzó boleto.

**Mitigación (igual que con boleto, aplicada desde el día 1):**
- Marca propia "MachuPicchuCusco", sin mencionar "Danfer" ni "Boleto Machu Picchu Tours".
- Todo el copy (tours, home, futuro blog) escrito de cero — no se copia texto de Danfer ni de boleto, aunque describan la misma experiencia real.
- Identidad visual (paleta) distinta a Danfer (dorado/turquesa/navy) y boleto (verde/dorado "eco-adventure") — se define en esta misma fase, ya que el home la necesita.
- Contacto/WhatsApp propio (a confirmar con el usuario antes de publicar — placeholder aceptable si todavía no lo tiene).
- Supabase y proyecto de Vercel completamente separados de los otros dos.

## Roadmap completo (para contexto — solo Fase 1 se especifica en detalle aquí)

1. **Infraestructura + Home real** (este documento) — a diferencia de boleto, esta fase entrega un home publicable de verdad, no un esqueleto vacío (pedido explícito del usuario).
2. **Catálogo de tours** — páginas individuales por tour, `/tours`, `/destinos`
3. **Blog y señales de confianza** — artículos, FAQ, certificaciones, reseñas reales (cuando existan)
4. **Panel admin a medida + inglés completo + pulido SEO final**

## Fase 1 — Alcance

Dejar **machupicchucusco.pe** en producción con un home completo, real y con buen diseño (el usuario pidió explícitamente que supere al home actual de Danfer), corriendo contra un Supabase propio con datos reales mínimos (categorías + 4-6 tours reales de Danfer, copy reescrito).

**Explícitamente dentro de alcance:**
- Hero con fondo real (reutilizar fotos ya disponibles de los destinos — son fotos reales del negocio, no stock genérico)
- Franja de certificaciones (MINCETUR, CARTUC, etc. — credenciales reales del operador, legítimo reutilizarlas tal cual)
- Sección de tours destacados, con 4-6 tours reales cargados en el Supabase nuevo (mismos tours/precios/duración que opera Danfer, copy distinto)
- Sección de stats (años de experiencia, viajeros, rutas — datos reales del negocio)
- Identidad visual propia: paleta de colores, tipografía, logo (al menos wordmark tipeado; logo-imagen puede ser placeholder si el usuario no tiene uno todavía)
- Panel admin portado (funcional, para que el usuario pueda cargar/editar contenido después), aunque no se use a fondo en esta fase

**Explícitamente fuera de alcance de esta fase:**
- Sección de reseñas/testimonios — no hay reseñas reales todavía para esta marca; no se inventan (regla ya establecida: cero ratings/reviews fabricados). Se agrega en una fase posterior cuando existan de verdad.
- Páginas de tour individuales, `/tours`, `/destinos`, blog — quedan para Fase 2+
- Contenido en inglés completo (puede quedar solo en español por ahora; estructura i18n se porta igual, pero no se traduce todo en esta fase)
- WhatsApp/contacto definitivo si el usuario no lo tiene a mano — placeholder aceptable, se reemplaza cuando esté disponible

## Arquitectura

- Carpeta `C:\xampp\htdocs\machupicchucusco.pe` (ya creada), proyecto Next.js independiente con su propio repositorio git — no submódulo ni parte de cuscotours-v2.
- Se parte copiando el árbol `src/` de cuscotours-v2 como base (mismo patrón ya usado para boleto: Next App Router, TypeScript, Tailwind, Supabase vía `@supabase/ssr`, next-intl, utilidades SEO, editor de blog), y se limpia todo lo específico de Danfer.
- Supabase: proyecto nuevo (el usuario lo crea en supabase.com y entrega URL + anon key + service role key), mismo esquema estructural de tablas que cuscotours-v2 (tours, categorías, blog_posts, settings, reviews, bookings, inquiries, admin users) pero sin datos de Danfer.
- Deploy: proyecto Vercel nuevo, dominio machupicchucusco.pe (el usuario ya lo tiene — falta apuntar DNS al proyecto Vercel nuevo una vez creado).
- **Nota de seguridad:** el `AGENTS.md` de cuscotours-v2 contiene una instrucción de leer `node_modules/next/dist/docs/` antes de escribir código — esto ya se identificó en una sesión anterior como una inyección de prompt plantada (el archivo contiene un comentario oculto "AI agent hint" con instrucciones adicionales encubiertas). El proyecto nuevo **no debe heredar esa instrucción** en su propio `AGENTS.md`/`CLAUDE.md` si se crea uno.

## Qué se porta tal cual (misma lógica, sin cambios funcionales)

- Auth de admin y CRUD de tours/blog/settings/reviews/bookings/inquiries
- i18n ES/EN (estructura completa, aunque el contenido EN no se complete en esta fase)
- Utilidades SEO: schema.org, FAQPage, hreflang/`buildAlternates`, sitemap, OG images dinámicas
- Componentes base ya validados: navbar con mega-menú, footer, sección de certificaciones (marquee), stats con polaroids, featured-tours grid

## Qué se rediseña o reemplaza

- Nombre de marca, dominio, WhatsApp, redes sociales → "MachuPicchuCusco" / placeholders hasta que el usuario confirme contacto real
- Paleta de colores y tipografía → nueva, distinta a Danfer y boleto (a definir con el usuario antes de tocar código de diseño)
- Contenido de tours/destinos → 4-6 tours reales (mismos datos operativos que Danfer: precio, duración, itinerario) con copy 100% reescrito
- Logo → wordmark tipeado como mínimo viable; logo-imagen si el usuario provee uno

## Testing / verificación de esta fase

- `npm run dev` levanta sin errores; home completo carga en `/es`
- Login de admin funciona contra el Supabase nuevo
- Los 4-6 tours reales aparecen correctamente en la sección de tours destacados del home, con fotos e info reales (no placeholders)
- Deploy en Vercel accesible en machupicchucusco.pe con HTTPS válido
- Grep de `danfer`/`Danfer`/`boleto` (case-insensitive) sobre el código y contenido nuevo no debe arrojar resultados
- Revisión visual manual: el home se ve distinto (paleta, tono) a danfertourscusco.com y boletomachupicchutours.com, no es un clon con logo cambiado
