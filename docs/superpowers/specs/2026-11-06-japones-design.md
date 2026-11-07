# Danfer Tours en japonés (`/ja`)

Fecha: 2026-11-06 · Aprobado por el usuario en el chat.

## Objetivo

Están llegando clientes japoneses. El sitio público (danfertourscusco.com) tiene que poder leerse en japonés, y las cotizaciones `/quote` también tienen que poder enviarse en japonés.

## Decisiones

- **Rutas:** se agrega el locale `ja` a `src/i18n/routing.ts`. El español sigue en la raíz, el inglés en `/en` y el japonés en `/ja` (`localePrefix: "as-needed"` no cambia).
- **Respaldo de contenido:** si falta el japonés, se muestra **inglés** y, si también falta, español. `t()` y `tList()` (`src/types/database.ts`) usan la cadena `ja → en → es`. Para `es` y `en` el comportamiento actual no cambia.
- **Datos:** sin migración. Los campos jsonb `{es, en}` pasan a admitir `ja`: `Localized = { es: string; en?: string; ja?: string }`, y lo mismo en la forma objeto de `LocalizedList`.
- **SEO:**
  - `buildAlternates()` emite `ja: /ja/...` cuando el contenido tiene japonés.
  - Una página `/ja` sin japonés propio (por ejemplo, un post del blog sin `ja`) tiene canonical a la URL `/en` (o a la ES, si tampoco hay EN) y no emite hreflang `ja`.
  - El sitemap incluye las URLs `/ja` solo cuando hay contenido `ja`.
  - `ogLocale("ja") = "ja_JP"`.
- **Precios:** en US$, igual que en `/en`.
- **Fuente:** Noto Sans JP se carga solo cuando `lang="ja"`, mediante `RootHtml`. ES y EN no cargan esa fuente.
- **Render:** las páginas públicas siguen saliendo ○/● en `next build`. `generateStaticParams` incluye `ja`, sin `cookies()`/`getLocale()` en layouts raíz (ver la nota del 2026-10-25).
- **Traducción:** la escribe Claude. Redacción simple. Los nombres propios (Machu Picchu, Ollantaytambo, Aguas Calientes) van en katakana con el nombre latino donde ayude. Precios y fechas se copian tal cual.

## Fases (cada una se despliega por separado)

### Fase 1: base
- `routing.ts`, `messages.ts` (bloque `ja` completo), tipo `Locale`, `t()`/`tList()`, `buildAlternates`, `ogLocale`, sitemap.
- Los unos 90 lugares con `locale === "en"`/`"es"` en 57 archivos: cada uno se revisa para que `ja` no caiga en español por accidente.
- Selector de idioma con ES / EN / 日本語 (navbar y móvil).
- Cotizaciones: `lang: "ja"` en `quotes-data.ts`, textos de `page.tsx`, `passport-upload.tsx` y `paypal-button.tsx`.
- Fuente JP.
- **Criterio de hecho:** `/ja` y `/ja/tours` muestran la interfaz en japonés y el contenido en inglés. Una cotización con `lang: "ja"` sale completa en japonés. El build pasa con las páginas públicas en ○/●.

### Fase 2: contenido de venta
- 14 tours (título, subtítulo, descripciones, listas, FAQs, itinerario, info importante, meta) y 4 categorías, con un script idempotente `scripts/ja/tours.mjs` que solo fusiona la clave `ja`.
- 5 páginas de destinos (`src/lib/destinations-ja/*`, igual que `destinations-en`).
- Admin: pestaña o campos JA en el editor de tours, del blog y en Ajustes.
- **Criterio de hecho:** `/ja/tours/<slug>` sale 100% en japonés, con hreflang `ja` activo.

### Fase 3: blog
- De 15 a 20 posts clave en japonés: Machu Picchu (entradas, cómo llegar, mejor época, noviembre, diciembre), Camino Inca, clima de Cusco, mal de altura, Montaña 7 Colores, Valle Sagrado, Humantay, Cusco en N días y precios.
- Workflow: `scripts/ja/<slug>.mjs` + un aplicador que fusiona solo `ja` en `title`, `excerpt`, `body_md`, `meta_*`.
- Los demás posts quedan con canonical a EN en `/ja` y fuera del sitemap `ja`.

## Fuera de alcance
- Moneda en yenes, pagos locales japoneses, correos automáticos en japonés.
- Traducir los 86 posts.
