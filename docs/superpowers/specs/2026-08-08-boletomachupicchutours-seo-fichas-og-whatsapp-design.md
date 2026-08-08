# SEO de fichas de tour + preview de WhatsApp — boletomachupicchutours.com

**Fecha:** 2026-08-08
**Repo del código:** `C:\xampp\htdocs\boletomachupicchutours` (el spec vive en cuscotours-v2, como el resto de fases de BMT)
**Alcance:** fichas de tour (`/tours/[slug]`, ES y EN) + `robots.ts`

## Problema

Al compartir el link de un tour por WhatsApp no aparece la imagen del tour. Y las fichas,
aunque tienen datos estructurados completos, no compiten por las búsquedas de intención de
compra.

## Diagnóstico (verificado en producción el 2026-08-08)

Tres causas independientes, todas confirmadas con evidencia:

1. **`robots.txt` = `Disallow: /`.** El sitio quedó cerrado desde Fase 1. El crawler de
   WhatsApp respeta `robots.txt`, así que lo más probable es que ni llegue a leer la página.
   *No verificable desde el entorno de desarrollo* — se confirma recién compartiendo un link
   real después del deploy.

2. **`og:image` apunta a una URL que redirige.** La file convention emite
   `https://boletomachupicchutours.com/es/tours/camino-inca-4-dias/opengraph-image-kaxd2h?e5ac91d9bf360f81`
   porque construye la URL desde el segmento `[locale]` con el valor real del param (`es`).
   next-intl está en `localePrefix: as-needed`, así que `/es/*` devuelve **307** hacia la
   versión sin prefijo (y pierde el query hash). Los crawlers de WhatsApp/Facebook no siguen
   redirects de imagen de forma confiable.

3. **La imagen pesa 1.9 MB.** `ImageResponse` (satori + resvg) **siempre** emite PNG; la
   variable `contentType` solo declara el MIME, no transcodifica. Un PNG 1200×630 con foto de
   fondo no baja de ~1.5 MB. WhatsApp deja de renderizar el preview por encima de ~300 KB.
   La OG del home sí funciona porque no lleva foto (78 KB).

Hallazgos secundarios:

- La OG se regenera en cada request: `Cache-Control: public, max-age=0, must-revalidate`,
  `X-Vercel-Cache: MISS`, 3.6 s por imagen.
- `og:image:alt` está fijo en `"Tour en Cusco"` en vez del nombre del tour.

Dato que condiciona el diseño: de los **33 tours publicados, solo 4 tienen foto propia en
Supabase Storage; los otros 29 usan stock de Unsplash**, y varios comparten la misma foto
(medido sobre `sitemap-images.xml`, 2026-08-08). Ambos hosts sirven
transformaciones baratas y ya se probaron contra los assets reales:

| Origen | URL de transformación | Resultado medido |
| --- | --- | --- |
| Supabase Storage | `/render/image/public/…?width=1200&height=630&resize=cover&quality=70` | 200, `image/jpeg`, **90 KB** |
| Unsplash | `?w=1200&h=630&fit=crop&q=75&fm=jpg` | 200, `image/jpeg`, **108 KB** |

## Decisiones tomadas

| Decisión | Elección | Por qué |
| --- | --- | --- |
| Sitio | boletomachupicchutours.com | — |
| robots | `robots.txt` abierto, `meta noindex` se queda | WhatsApp/Facebook pueden leer el preview; Google sigue sin indexar. El interruptor de lanzamiento (Fase 5) pasa a ser solo el `robots` del layout. |
| Imagen OG | Foto del tour transformada por el CDN de origen | Es lo que se pidió ("que salga la imagen del tour"), y es la única opción sin generación en tiempo de request. Se descartó componer una tarjeta brandeada con `sharp` (dependencia nueva + generación dinámica justo donde hoy falla) y pre-generarla al guardar el tour (toca el admin, hay que regenerar al cambiar el precio). |
| Alcance SEO | Fichas de tour: `<title>` + meta description | Los datos estructurados ya están completos (Product, Offer, TouristTrip, Course, FAQPage, BreadcrumbList, Organization, WebSite). El listado y la portada quedan fuera. |
| Formato de `<title>` | Palabra clave de intención, sin sufijo de marca | Para una marca nueva sin reconocimiento, esos 27 caracteres rinden más como keyword que como branding. La marca igual aparece en el dominio bajo el título. |

## Diseño

### 1. `src/lib/seo/og-image.ts` (nuevo)

Función pura, sin red ni dependencias.

```ts
export interface OgImage { url: string; width: number; height: number; alt: string }
export function tourOgImage(coverUrl: string | null | undefined, alt: string): OgImage
```

Siempre devuelve `width: 1200, height: 630`. Ramas, en orden:

1. **Supabase Storage** — la URL contiene `/storage/v1/object/public/`. Se reemplaza ese
   tramo por `/storage/v1/render/image/public/` y se fija el query a
   `width=1200&height=630&resize=cover&quality=70` (descartando cualquier query previo).
2. **Unsplash** — hostname `images.unsplash.com`. Se conserva el path y se **reescribe** el
   query a `w=1200&h=630&fit=crop&q=75&fm=jpg`.
   **`auto` se elimina explícitamente**: `auto=format` tiene precedencia sobre `fm` en imgix y
   devolvería WebP/AVIF, cuyo soporte en previews de WhatsApp es irregular. Varias URLs
   actuales traen `auto=format`.
3. **Cualquier otra cosa** (otro host, string vacío, ruta relativa, URL inválida) — fallback a
   `${siteUrl()}/opengraph-image`, la OG del home (78 KB PNG, ya verificada en producción).
   Es deliberadamente conservador: se prefiere una imagen genérica que sí renderiza a una
   desconocida que puede pesar de más. Si en el futuro se suman covers de otro CDN, hay que
   agregarles su rama acá o sus previews salen genéricos.

Parseo con la clase `URL` dentro de `try/catch`; cualquier excepción cae al fallback.

### 2. `generateMetadata` de `src/app/[locale]/(public)/tours/[slug]/page.tsx`

**`<title>`** — vía `title: { absolute: … }` para saltar el template `%s · Boleto Machu Picchu Tours`
del layout. `year = new Date().getFullYear()`.

| Locale | Formato | Ejemplo (59 car.) |
| --- | --- | --- |
| ES | `{tour}: precio {year} y reservas` | `Cusco, Valle Sagrado y Machu Picchu: precio 2026 y reservas` |
| EN | `{tour}: {year} price & booking` | `Cusco, Sacred Valley & Machu Picchu: 2026 price & booking` |

Degradación si supera **60 caracteres**: primero a `{tour}: precio {year}` / `{tour}: {year} price`,
y si aún supera, a `{tour}` pelado — el nombre del tour **nunca se trunca**, así que un tour de
nombre muy largo puede quedar por encima de 60 y eso es aceptable.

La regla sí se ejercita hoy: "Valle Sur: Tipón, Pikillacta y Andahuaylillas" (45 car.) daría 69
con el sufijo completo y degrada a 58. De hecho ese tour y "Cusco, Valle Sagrado y Machu Picchu"
**ya hoy exceden los 60** con el sufijo de marca actual (73 y 63 car.), así que el cambio también
los arregla.

**Meta description** — base + sufijo con datos reales, tope **155 caracteres**:

- `base` = `t(short_desc, lc)` → si vacío `t(subtitle, lc)` → si vacío, el fallback actual
  (`Tour guiado a {title} en Cusco. Reserva con Boleto Machu Picchu Tours, operador oficial.`).
- `sufijo` ES: ` Desde US${price} · {duration} · reserva directa.`
  EN: ` From US${price} · {duration} · book direct.`
- `price` = precio **con descuento aplicado**, `toFixed(0)` — el mismo valor que muestra la
  ficha y que emite el `Offer` del JSON-LD, para que no se contradigan.
- `duration` = `t(tour.duration_label, lc)`.
- **Orden exacto de las operaciones sobre `base`:**
  1. `trim()`.
  2. Si `base.length + sufijo.length ≤ 155`: si `base` no termina en `.`, `!` ni `?` se le
     agrega `.` — y si ese punto extra hiciera pasar el tope, se omite. Resultado:
     `base + sufijo`.
  3. Si no entra: se trunca `base` en límite de palabra a `155 − sufijo.length − 1` y se le
     agrega `…`. En esta rama **no** se agrega punto (el `…` hace de cierre). Resultado:
     `base truncado + "…" + sufijo`.
- Caso patológico (sufijo solo > 155): se devuelve `base` truncado a 155 y se descarta el sufijo.

**Imagen** — `openGraph.images` y `twitter.images` se declaran explícitamente con el resultado
de `tourOgImage(tour.cover_image, t(tour.title, lc))`. Al ser una URL absoluta externa, deja de
construirse desde el segmento `/es` y desaparece el 307. El `alt` pasa a ser el nombre real del
tour.

**Separación SERP vs. social (intencional, no inconsistencia):** el `<title>` pierde la marca
porque compite por caracteres en Google; `og:title` y `twitter:title` la conservan
(`{tour} · Boleto Machu Picchu Tours`) porque en WhatsApp no hay límite de 60 y ahí la marca suma.

### 3. `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx` — se elimina

Declarar `openGraph.images` en `generateMetadata` pisa la file convention (es la regla ya
documentada en el repo, aplicada al revés). Dejar el archivo sería mantener una ruta de 1.9 MB
que se regenera en cada request sin que nadie la consuma.

### 4. `src/app/robots.ts`

`disallow: "/"` → `allow: "/"`. Comentario explicando que el bloqueo de lanzamiento pasa a ser
únicamente el `robots: { index: false, follow: false }` del layout, y que ese es el interruptor
a tocar en Fase 5.

### 5. `scripts/audit-og.mjs` (nuevo)

Sigue la convención `audit-*.mjs` ya presente en el repo. Recibe una URL base
(default: producción), lee `sitemap.xml`, y para cada `/tours/*`:

- descarga el HTML y extrae `og:image`, `og:image:alt` y `<title>`;
- pide el `og:image` **sin seguir redirects** y verifica: status `200` (no 3xx),
  `content-type` `image/jpeg` o `image/png`, y peso `< 300 KB`;
- verifica que `<title>` ≤ 60 car. y `description` ≤ 155 car.

Sale con código ≠ 0 si algo falla, e imprime una tabla por tour.

## Verificación

El repo no tiene infraestructura de tests (sin vitest/jest/playwright). En vez de agregar un
framework, se usa el **runner nativo de Node**, que en la v24.14.1 instalada corre TypeScript
directamente sin transpilar. Verificado empíricamente antes de escribir el plan:

- `node --test 'src/**/*.test.ts'` ejecuta tests en `.ts` sin dependencias nuevas.
- Requiere `allowImportingTsExtensions: true` en tsconfig (válido porque ya está `noEmit: true`);
  se comprobó que typechequea limpio con las mismas opciones del repo. Baseline actual:
  `npx tsc --noEmit` → exit 0.
- Por eso `tourOgImage` y los builders de texto son **funciones puras sin imports**: el runner
  de Node no resuelve el alias `@/`. La URL de fallback se pasa por parámetro en vez de
  importar `siteUrl()`.

Pasos:

1. `npm test`, `npm run lint` y `npm run build` sin errores.
2. `node scripts/audit-og.mjs http://localhost:3000` en dev: los 33 tours en verde.
3. Tras `npx vercel --prod`: `node scripts/audit-og.mjs` contra producción, todo en verde.
   **Baseline medido hoy: `0/33 fichas OK`** (33× `img HTTP 307`, más 2 títulos de 63 y 75
   caracteres). Ese es el rojo del que hay que partir.
4. `curl https://boletomachupicchutours.com/robots.txt` muestra `Allow: /`, y una ficha sigue
   emitiendo `<meta name="robots" content="noindex, nofollow">`.
5. **Prueba manual, la única que cierra el caso:** compartir el link de un tour en un chat de
   WhatsApp y confirmar que sale la foto. Es el único paso que valida la causa nº 1.
6. Facebook Sharing Debugger sobre una ficha, para ver qué lee el crawler si algo falla.

## Riesgos y límites conocidos

- **La causa nº 1 no se puede verificar antes del deploy.** Si tras abrir `robots.txt` el
  preview sigue sin salir, el siguiente sospechoso es la caché del crawler de WhatsApp (que
  guarda el resultado por días) — se fuerza el refresco cambiando el link (p. ej. agregando
  `?v=2`) o pasando la URL por el Sharing Debugger de Facebook.
- **Varios tours comparten la misma foto de Unsplash**, así que sus previews van a salir
  idénticos. Es un problema de contenido: se resuelve subiendo fotos reales desde el admin, no
  con código.
- **Las OG del blog tienen el mismo problema de peso** (mismo patrón `ImageResponse` con foto).
  Queda fuera de alcance: el blog de BMT hoy está vacío. Cuando se llene, aplicar este mismo
  diseño.
- **Se pierde el overlay con logo y precio** en el preview. Aceptado: WhatsApp ya muestra
  título y descripción como texto debajo de la imagen, y el precio aparece al abrir la ficha.
- **Abrir `robots.txt` con `meta noindex`** es una combinación válida y deliberada (Google
  necesita rastrear la página para *ver* el `noindex`), pero implica que el sitio queda
  legible para cualquier crawler que ignore el `meta`. Es el precio de tener previews.

## Archivos

| Archivo | Acción |
| --- | --- |
| `src/lib/seo/og-image.ts` | nuevo — `tourOgImage()` |
| `src/lib/seo/og-image.test.ts` | nuevo |
| `src/lib/seo/tour-meta.ts` | nuevo — `tourSeoTitle()` y `tourSeoDescription()` |
| `src/lib/seo/tour-meta.test.ts` | nuevo |
| `src/app/[locale]/(public)/tours/[slug]/page.tsx` | `generateMetadata`: title, description, images |
| `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx` | eliminar |
| `src/app/robots.ts` | `disallow` → `allow` |
| `scripts/audit-og.mjs` | nuevo |
| `tsconfig.json` | `allowImportingTsExtensions: true` |
| `package.json` | script `test` |

Nota sobre `tour-meta.ts`: el diseño aprobado no lo nombraba (hablaba solo de "cambios en
`generateMetadata`"). Se separa en su propio módulo porque la degradación de título y el
truncado de descripción son lógica con ramas que merece test propio, y dejarla inline en
`page.tsx` la volvería no testeable. No cambia el comportamiento acordado.
