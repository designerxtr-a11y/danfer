# SEO de fichas de tour + preview de WhatsApp — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que al compartir un tour de boletomachupicchutours.com por WhatsApp salga la foto del tour, y que las fichas compitan por búsquedas de intención de compra.

**Architecture:** Se deja de generar la imagen OG con `ImageResponse` (siempre PNG, ~1.9 MB) y se apunta `og:image` a la foto del tour transformada por el CDN de origen (Supabase Storage o Unsplash) a JPEG 1200×630 de ~90-110 KB. Toda la lógica nueva vive en dos módulos de funciones puras y sin imports (`og-image.ts`, `tour-meta.ts`) para poder testearla con el runner nativo de Node.

**Tech Stack:** Next 16.2.6 (App Router), React 19.2.4, next-intl (`localePrefix: as-needed`), Supabase, Node v24.14.1, TypeScript 5 (`moduleResolution: bundler`, `noEmit: true`).

## Global Constraints

- **Repo del código:** `C:\xampp\htdocs\boletomachupicchutours`. El spec y este plan viven en `cuscotours-v2`; **todos los comandos y rutas de este plan son relativos al repo de BMT**.
- **Spec:** `docs/superpowers/specs/2026-08-08-boletomachupicchutours-seo-fichas-og-whatsapp-design.md` (en cuscotours-v2).
- **Sin dependencias nuevas.** Nada de `sharp`, vitest, jest ni playwright. Los tests usan `node:test` + `node:assert`, que vienen con Node.
- **`og-image.ts` y `tour-meta.ts` no llevan ningún `import`.** El runner de Node no resuelve el alias `@/`. Todo lo que necesiten (URL de fallback, año, precio) entra por parámetro.
- **Los tests importan con extensión** (`from "./og-image.ts"`), que es lo que exige Node en ESM.
- Dimensiones OG fijas: **1200 × 630**. Tope de título: **60**. Tope de descripción: **155**. Tope de peso de imagen: **300 KB**.
- Textos de UI en español y en inglés según `locale`; el código y los comentarios en español, como el resto del repo.
- **No se toca el `robots: { index: false, follow: false }` del layout.** El sitio sigue `noindex`; solo se abre `robots.txt`.
- Sin remoto Git: los commits son locales y el deploy es `npx vercel --prod` (preguntar antes de desplegar).

---

### Task 1: Infraestructura de tests nativa

Habilita `node --test` sobre TypeScript sin agregar dependencias. Es requisito de todas las tareas siguientes, así que va primero y se valida con un test trivial que después se borra.

**Files:**
- Modify: `tsconfig.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: nada.
- Produces: el comando `npm test`, que ejecuta `node --test "src/**/*.test.ts"`. Las tareas 2 y 3 lo usan.

- [ ] **Step 1: Confirmar la versión de Node**

Run: `node --version`
Expected: `v24.14.1` (o superior). Si es menor a v22.18, **detenerse**: el runner no strippea tipos y este plan no aplica.

- [ ] **Step 2: Agregar `allowImportingTsExtensions` a tsconfig.json**

Dentro de `compilerOptions`, después de `"isolatedModules": true,`:

```json
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
```

Es válido porque el repo ya tiene `"noEmit": true` (TypeScript solo permite este flag sin emisión). Sin él, `next build` falla al typechequear los `*.test.ts`, que importan con extensión.

- [ ] **Step 3: Agregar el script `test` a package.json**

En `"scripts"`, después de `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test \"src/**/*.test.ts\""
```

- [ ] **Step 4: Crear un test temporal que verifique que el runner strippea tipos**

Create: `src/lib/seo/smoke.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";

interface Caja {
  n: number;
}

test("node --test corre TypeScript sin transpilar", () => {
  const c: Caja = { n: 1200 };
  assert.equal(c.n, 1200);
});
```

- [ ] **Step 5: Correr el test**

Run: `npm test`
Expected: PASS — `# pass 1`, `# fail 0`.

Si falla con `ERR_UNKNOWN_FILE_EXTENSION`, la versión de Node es demasiado vieja: volver al Step 1.

- [ ] **Step 6: Verificar que el typecheck sigue limpio**

Run: `npx tsc --noEmit`
Expected: sin salida, exit 0.

- [ ] **Step 7: Borrar el test temporal**

Run: `rm src/lib/seo/smoke.test.ts`

Ya cumplió su función: probó que el runner anda. Los tests reales llegan en las tareas 2 y 3.

- [ ] **Step 8: Commit**

```bash
git add tsconfig.json package.json
git commit -m "chore: habilitar el runner de tests nativo de node para archivos .ts"
```

---

### Task 2: `tourOgImage()` — la URL de la imagen del preview

**Files:**
- Create: `src/lib/seo/og-image.ts`
- Test: `src/lib/seo/og-image.test.ts`

**Interfaces:**
- Consumes: el comando `npm test` de la Task 1.
- Produces:
  - `interface OgImage { url: string; width: number; height: number; alt: string }`
  - `function tourOgImage(coverUrl: string | null | undefined, alt: string, fallbackUrl: string): OgImage`
  - `const OG_WIDTH = 1200`, `const OG_HEIGHT = 630`
  - La Task 5 llama a `tourOgImage` desde `page.tsx`.

- [ ] **Step 1: Escribir el test que falla**

Create: `src/lib/seo/og-image.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { tourOgImage, OG_WIDTH, OG_HEIGHT } from "./og-image.ts";

const FALLBACK = "https://boletomachupicchutours.com/opengraph-image";

test("Supabase Storage: reescribe a /render/image/ y fija los params de transformación", () => {
  const cover =
    "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/camino-inca-4-dias/1781143500154-po5sz0.jpg";
  assert.equal(
    tourOgImage(cover, "Camino Inca", FALLBACK).url,
    "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/render/image/public/tour-images/camino-inca-4-dias/1781143500154-po5sz0.jpg?width=1200&height=630&resize=cover&quality=70"
  );
});

test("Supabase Storage: descarta cualquier query previo", () => {
  const cover =
    "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/x/y.jpg?width=50&foo=bar";
  assert.equal(
    tourOgImage(cover, "X", FALLBACK).url,
    "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/render/image/public/tour-images/x/y.jpg?width=1200&height=630&resize=cover&quality=70"
  );
});

test("Unsplash: reescribe el query a 1200x630 JPEG", () => {
  const cover =
    "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=900&h=1440&fit=crop";
  assert.equal(
    tourOgImage(cover, "Palccoyo", FALLBACK).url,
    "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=1200&h=630&fit=crop&q=75&fm=jpg"
  );
});

test("Unsplash: elimina auto=format, que devolvería WebP y rompería el preview", () => {
  const cover =
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop";
  const url = tourOgImage(cover, "Machu Picchu", FALLBACK).url;
  assert.equal(
    url,
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&h=630&fit=crop&q=75&fm=jpg"
  );
  assert.ok(!url.includes("auto="), "no debe quedar ningún auto= en la URL");
});

test("cover vacío o nulo: cae al fallback", () => {
  assert.equal(tourOgImage(null, "X", FALLBACK).url, FALLBACK);
  assert.equal(tourOgImage(undefined, "X", FALLBACK).url, FALLBACK);
  assert.equal(tourOgImage("", "X", FALLBACK).url, FALLBACK);
});

test("ruta relativa o URL inválida: cae al fallback", () => {
  assert.equal(tourOgImage("/img/local.jpg", "X", FALLBACK).url, FALLBACK);
  assert.equal(tourOgImage("no-es-una-url", "X", FALLBACK).url, FALLBACK);
});

test("host desconocido: cae al fallback en vez de arriesgar una imagen sin transformar", () => {
  assert.equal(tourOgImage("https://cdn.ejemplo.com/a.png", "X", FALLBACK).url, FALLBACK);
});

test("siempre devuelve 1200x630 y el alt recibido", () => {
  const og = tourOgImage("https://images.unsplash.com/photo-abc", "Montaña de 7 Colores", FALLBACK);
  assert.equal(og.width, OG_WIDTH);
  assert.equal(og.height, OG_HEIGHT);
  assert.equal(og.alt, "Montaña de 7 Colores");
  assert.equal(OG_WIDTH, 1200);
  assert.equal(OG_HEIGHT, 630);
});
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL con `Cannot find module` apuntando a `./og-image.ts` — el módulo todavía no existe.

- [ ] **Step 3: Escribir la implementación**

Create: `src/lib/seo/og-image.ts`

```ts
/**
 * URL de la imagen que ven WhatsApp y Facebook al compartir una ficha de tour.
 *
 * Se sirve la foto del tour transformada por el CDN de origen, NO una imagen
 * generada con `ImageResponse`: satori/resvg siempre emiten PNG, y un 1200x630
 * con foto de fondo pesa ~1.9 MB — muy por encima de los ~300 KB a partir de
 * los cuales WhatsApp deja de renderizar el preview.
 *
 * Funciones puras y SIN imports a propósito: así corren bajo `node --test`, que
 * no resuelve el alias `@/`. La URL de fallback entra por parámetro en vez de
 * importar `siteUrl()`.
 */

export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const SUPABASE_OBJECT_PATH = "/storage/v1/object/public/";
const SUPABASE_RENDER_PATH = "/storage/v1/render/image/public/";

export function tourOgImage(
  coverUrl: string | null | undefined,
  alt: string,
  fallbackUrl: string
): OgImage {
  return {
    url: resolveUrl(coverUrl, fallbackUrl),
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt,
  };
}

function resolveUrl(coverUrl: string | null | undefined, fallbackUrl: string): string {
  if (!coverUrl) return fallbackUrl;

  let parsed: URL;
  try {
    parsed = new URL(coverUrl);
  } catch {
    // Rutas relativas o strings que no son URL absoluta.
    return fallbackUrl;
  }

  // Supabase Storage: el endpoint /render/image/ aplica la transformación.
  // Se detecta por el path y no por el host, para que siga andando si algún
  // día el proyecto se mueve o se auto-hospeda.
  if (parsed.pathname.includes(SUPABASE_OBJECT_PATH)) {
    parsed.pathname = parsed.pathname.replace(SUPABASE_OBJECT_PATH, SUPABASE_RENDER_PATH);
    parsed.search = "";
    parsed.searchParams.set("width", String(OG_WIDTH));
    parsed.searchParams.set("height", String(OG_HEIGHT));
    parsed.searchParams.set("resize", "cover");
    parsed.searchParams.set("quality", "70");
    return parsed.toString();
  }

  // Unsplash (imgix). Se limpia el query entero antes de reescribirlo: varias
  // URLs traen `auto=format`, que tiene precedencia sobre `fm` y devolvería
  // WebP/AVIF — soporte irregular en los previews de WhatsApp.
  if (parsed.hostname === "images.unsplash.com") {
    parsed.search = "";
    parsed.searchParams.set("w", String(OG_WIDTH));
    parsed.searchParams.set("h", String(OG_HEIGHT));
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("q", "75");
    parsed.searchParams.set("fm", "jpg");
    return parsed.toString();
  }

  // Host desconocido: no se puede garantizar formato ni peso, así que se
  // prefiere una imagen genérica que sí renderiza. Si se suman covers de otro
  // CDN, agregarle su rama acá o sus previews saldrán genéricos.
  return fallbackUrl;
}
```

- [ ] **Step 4: Correr los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — `# pass 8`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/og-image.ts src/lib/seo/og-image.test.ts
git commit -m "feat(seo): helper que transforma el cover del tour a JPEG 1200x630 para el preview"
```

---

### Task 3: `tourSeoTitle()` y `tourSeoDescription()`

**Files:**
- Create: `src/lib/seo/tour-meta.ts`
- Test: `src/lib/seo/tour-meta.test.ts`

**Interfaces:**
- Consumes: el comando `npm test` de la Task 1.
- Produces:
  - `function tourSeoTitle(tourTitle: string, year: number, locale: "es" | "en"): string`
  - `function tourSeoDescription(input: { base: string; priceUsd: number; duration: string; locale: "es" | "en" }): string`
  - `const TITLE_MAX = 60`, `const DESCRIPTION_MAX = 155`
  - La Task 5 llama a ambas desde `page.tsx`.

- [ ] **Step 1: Escribir el test que falla**

Create: `src/lib/seo/tour-meta.test.ts`

Los valores esperados están calculados sobre los datos reales de producción del 2026-08-08.

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { tourSeoTitle, tourSeoDescription, TITLE_MAX, DESCRIPTION_MAX } from "./tour-meta.ts";

test("title ES: nombre del tour + keyword de intención", () => {
  assert.equal(
    tourSeoTitle("Camino Inca Clásico 4D/3N", 2026, "es"),
    "Camino Inca Clásico 4D/3N: precio 2026 y reservas"
  );
});

test("title EN: variante en inglés", () => {
  assert.equal(
    tourSeoTitle("Classic Inca Trail 4D/3N", 2026, "en"),
    "Classic Inca Trail 4D/3N: 2026 price & booking"
  );
});

test("title: el formato completo se usa mientras entre en 60", () => {
  const t = tourSeoTitle("Cusco, Valle Sagrado y Machu Picchu", 2026, "es");
  assert.equal(t, "Cusco, Valle Sagrado y Machu Picchu: precio 2026 y reservas");
  assert.equal(t.length, 59);
});

test("title: degrada al formato corto cuando el completo pasa de 60", () => {
  // Caso real: el formato completo daría 69 caracteres.
  const t = tourSeoTitle("Valle Sur: Tipón, Pikillacta y Andahuaylillas", 2026, "es");
  assert.equal(t, "Valle Sur: Tipón, Pikillacta y Andahuaylillas: precio 2026");
  assert.ok(t.length <= TITLE_MAX);
});

test("title: si ni el formato corto entra, devuelve el nombre pelado sin truncarlo", () => {
  const largo = "Trekking Salkantay a Machu Picchu por la ruta alternativa de 5 días";
  assert.equal(tourSeoTitle(largo, 2026, "es"), largo);
});

test("description: base + sufijo con precio y duración reales", () => {
  const d = tourSeoDescription({
    base: "El clásico imprescindible: tren panorámico, ciudadela inca y almuerzo, todo resuelto para ti.",
    priceUsd: 100,
    duration: "Full day",
    locale: "es",
  });
  assert.equal(
    d,
    "El clásico imprescindible: tren panorámico, ciudadela inca y almuerzo, todo resuelto para ti. Desde US$100 · Full day · reserva directa."
  );
  assert.ok(d.length <= DESCRIPTION_MAX);
});

test("description EN: sufijo en inglés", () => {
  const d = tourSeoDescription({
    base: "The must-do classic: panoramic train, Inca citadel and lunch.",
    priceUsd: 100,
    duration: "Full day",
    locale: "en",
  });
  assert.equal(
    d,
    "The must-do classic: panoramic train, Inca citadel and lunch. From US$100 · Full day · book direct."
  );
});

test("description: agrega el punto final cuando la base no lo trae", () => {
  const d = tourSeoDescription({
    base: "Caminata de un día hasta las laderas multicolor de Vinicunca, con Ausangate nevado de fondo",
    priceUsd: 35,
    duration: "1 día",
    locale: "es",
  });
  assert.equal(
    d,
    "Caminata de un día hasta las laderas multicolor de Vinicunca, con Ausangate nevado de fondo. Desde US$35 · 1 día · reserva directa."
  );
});

test("description: usa el tope completo sin pasarse", () => {
  const d = tourSeoDescription({
    base: "4 días caminando los caminos de piedra incas, con porteadores, cocinero y el amanecer en Machu Picchu como cierre.",
    priceUsd: 150,
    duration: "4 días",
    locale: "es",
  });
  assert.equal(d.length, 155);
  assert.ok(d.endsWith(" Desde US$150 · 4 días · reserva directa."));
});

test("description: trunca en límite de palabra y cierra con … cuando no entra", () => {
  const d = tourSeoDescription({
    base: "Una descripción deliberadamente larguísima que no va a entrar de ninguna manera dentro del tope de ciento cincuenta y cinco caracteres junto con el sufijo de datos.",
    priceUsd: 150,
    duration: "4 días",
    locale: "es",
  });
  assert.ok(d.length <= DESCRIPTION_MAX, `largo real ${d.length}`);
  assert.ok(d.includes("…"), "debe cerrar la base truncada con …");
  assert.ok(d.endsWith(" Desde US$150 · 4 días · reserva directa."));
  assert.ok(!d.includes(" …"), "no debe quedar espacio colgando antes del …");
});

test("description: redondea el precio a entero", () => {
  const d = tourSeoDescription({ base: "Tour.", priceUsd: 127.5, duration: "1 día", locale: "es" });
  assert.ok(d.includes("US$128"), d);
});

test("description: con un duration_label absurdo, prioriza el texto del tour", () => {
  const d = tourSeoDescription({
    base: "Tour corto.",
    priceUsd: 100,
    duration: "x".repeat(200),
    locale: "es",
  });
  assert.equal(d, "Tour corto.");
});
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL con `Cannot find module` apuntando a `./tour-meta.ts`.

- [ ] **Step 3: Escribir la implementación**

Create: `src/lib/seo/tour-meta.ts`

```ts
/**
 * Textos SEO de la ficha de tour.
 *
 * El <title> deja fuera el sufijo de marca ("· Boleto Machu Picchu Tours", 28
 * caracteres) y lo cambia por palabras clave de intención: para una marca nueva
 * sin reconocimiento, ese espacio rinde más como keyword. El og:title SÍ
 * conserva la marca — lo arma page.tsx — porque en WhatsApp no hay tope de 60.
 *
 * Funciones puras y SIN imports, igual que og-image.ts, para poder correrlas
 * bajo `node --test`.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export type SeoLocale = "es" | "en";

/**
 * Formato completo si entra en 60 caracteres; si no, formato corto; y si
 * tampoco, el nombre pelado. El nombre del tour nunca se trunca: es preferible
 * un título largo a uno cortado a la mitad.
 */
export function tourSeoTitle(tourTitle: string, year: number, locale: SeoLocale): string {
  const candidatos =
    locale === "en"
      ? [`${tourTitle}: ${year} price & booking`, `${tourTitle}: ${year} price`, tourTitle]
      : [`${tourTitle}: precio ${year} y reservas`, `${tourTitle}: precio ${year}`, tourTitle];
  return candidatos.find((c) => c.length <= TITLE_MAX) ?? tourTitle;
}

export interface TourDescriptionInput {
  /** Texto propio del tour: short_desc, o subtitle, o el fallback de page.tsx. */
  base: string;
  /** Precio ya con el descuento aplicado, igual que el Offer del JSON-LD. */
  priceUsd: number;
  duration: string;
  locale: SeoLocale;
}

export function tourSeoDescription({
  base,
  priceUsd,
  duration,
  locale,
}: TourDescriptionInput): string {
  const precio = Math.round(priceUsd);
  const sufijo =
    locale === "en"
      ? ` From US$${precio} · ${duration} · book direct.`
      : ` Desde US$${precio} · ${duration} · reserva directa.`;
  const texto = base.trim();

  // Un duration_label absurdamente largo puede dejar al sufijo sin lugar. En
  // ese caso gana el texto propio del tour.
  if (sufijo.length >= DESCRIPTION_MAX) return texto.slice(0, DESCRIPTION_MAX);

  if (texto.length + sufijo.length <= DESCRIPTION_MAX) {
    const faltaPunto = !/[.!?]$/.test(texto);
    const cierra =
      faltaPunto && texto.length + 1 + sufijo.length <= DESCRIPTION_MAX ? `${texto}.` : texto;
    return cierra + sufijo;
  }

  const espacio = DESCRIPTION_MAX - sufijo.length - 1; // -1 por el "…"
  return `${truncarEnPalabra(texto, espacio)}…${sufijo}`;
}

function truncarEnPalabra(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const recortado = ultimoEspacio > 0 ? corte.slice(0, ultimoEspacio) : corte;
  // Sin puntuación colgando justo antes del "…".
  return recortado.replace(/[\s.,;:·-]+$/, "");
}
```

- [ ] **Step 4: Correr los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — `# pass 20`, `# fail 0` (8 de og-image + 12 de tour-meta).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/tour-meta.ts src/lib/seo/tour-meta.test.ts
git commit -m "feat(seo): builders de title y description de fichas de tour"
```

---

### Task 4: Abrir robots.txt

**Files:**
- Modify: `src/app/robots.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `/robots.txt` con `Allow: /`. La Task 6 lo verifica en producción.

- [ ] **Step 1: Reemplazar la regla de bloqueo**

En `src/app/robots.ts`, cambiar el bloque `rules`:

```ts
    // FASE 1-4: sitio en construcción, sin contenido real todavía.
    // Revertir a "allow: /" recién en Fase 5 (lanzamiento).
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
```

por:

```ts
    // robots.txt abierto a propósito, aunque el sitio siga sin lanzarse: los
    // crawlers de WhatsApp y Facebook respetan robots.txt, y con Disallow no
    // pueden leer los og: para armar el preview del link.
    //
    // Lo que mantiene el sitio fuera de Google es el `robots: { index: false }`
    // del layout — ESE es el interruptor a tocar en Fase 5, no este archivo.
    // (Google necesita poder rastrear la página para llegar a ver el noindex.)
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
```

- [ ] **Step 2: Verificar que el layout sigue en noindex**

Run: `grep -n "index: false" src/app/layout.tsx`
Expected: dos coincidencias (la de `robots` y la de `googleBot`). Si no aparecen, **detenerse**: se abriría el sitio a Google sin querer.

- [ ] **Step 3: Verificar en dev**

Run: `npm run dev` en una terminal, y en otra: `curl -s http://localhost:3000/robots.txt`
Expected:

```
User-Agent: *
Allow: /

Sitemap: https://boletomachupicchutours.com/sitemap.xml
Sitemap: https://boletomachupicchutours.com/sitemap-images.xml
```

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts
git commit -m "fix(seo): abrir robots.txt para que WhatsApp pueda leer el preview"
```

---

### Task 5: Cablear la ficha de tour

El cambio de verdad: `generateMetadata` pasa a usar los tres helpers y se borra la ruta de imagen de 1.9 MB.

**Files:**
- Modify: `src/app/[locale]/(public)/tours/[slug]/page.tsx` (solo `generateMetadata` y sus imports)
- Delete: `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `tourOgImage`, `OgImage` (Task 2); `tourSeoTitle`, `tourSeoDescription` (Task 3); `siteUrl()` de `@/lib/seo/site-url`; `buildAlternates`, `ogLocale` de `@/lib/seo/alternates`; `t()` de `@/types/database`.
- Produces: las fichas emiten `og:image` absoluto y sin redirect. La Task 6 lo audita.

- [ ] **Step 1: Agregar los imports**

En `src/app/[locale]/(public)/tours/[slug]/page.tsx`, junto al import de `buildAlternates`:

```ts
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { siteUrl } from "@/lib/seo/site-url";
import { tourOgImage } from "@/lib/seo/og-image";
import { tourSeoTitle, tourSeoDescription } from "@/lib/seo/tour-meta";
```

Nota: acá **sí** se usa el alias `@/` porque este archivo lo compila Next, no `node --test`.

- [ ] **Step 2: Reemplazar el cuerpo de `generateMetadata`**

Reemplazar la función `generateMetadata` completa (desde `export async function generateMetadata` hasta su `}` de cierre) por:

```ts
export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  const title = t(tour.title, lc);
  const base =
    t(tour.short_desc, lc) ||
    t(tour.subtitle, lc) ||
    (lc === "en"
      ? `Guided ${title} tour in Cusco. Book with Boleto Machu Picchu Tours, official operator.`
      : `Tour guiado a ${title} en Cusco. Reserva con Boleto Machu Picchu Tours, operador oficial.`);

  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  const description = tourSeoDescription({
    base,
    priceUsd: finalPrice,
    duration: t(tour.duration_label, lc),
    locale: lc,
  });

  // og:image explícito y absoluto. Antes lo generaba opengraph-image.tsx, que
  // emitía una URL con prefijo /es — y next-intl (localePrefix: as-needed) la
  // devolvía con 307, que los crawlers de WhatsApp/Facebook no siguen.
  const og = tourOgImage(tour.cover_image, title, `${siteUrl()}/opengraph-image`);

  return {
    // `absolute` saltea el template "%s · Boleto Machu Picchu Tours" del layout:
    // en la SERP esos 28 caracteres rinden más como palabra clave.
    title: { absolute: tourSeoTitle(title, new Date().getFullYear(), lc) },
    description,
    alternates: buildAlternates(`/tours/${tour.slug}`, lc),
    openGraph: {
      // El og:title SÍ lleva la marca: en WhatsApp no hay tope de 60.
      title: `${title} · Boleto Machu Picchu Tours`,
      description,
      url: lc === "en" ? `/en/tours/${tour.slug}` : `/tours/${tour.slug}`,
      type: "website",
      locale: ogLocale(lc),
      images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og.url],
    },
  };
}
```

- [ ] **Step 3: Borrar la ruta de imagen generada**

Run: `rm "src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx"`

Declarar `openGraph.images` pisa la file convention, así que el archivo queda muerto: sería una ruta de 1.9 MB regenerándose en cada request sin que nadie la consuma.

- [ ] **Step 4: Verificar typecheck y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: ambos exit 0, sin salida de error.

- [ ] **Step 5: Verificar el HTML que sale en dev**

Con `npm run dev` corriendo:

Run: `curl -s http://localhost:3000/tours/camino-inca-4-dias | grep -oE '<meta property="og:image[^>]*>|<title>[^<]*</title>'`
Expected: un `og:image` absoluto apuntando a `pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/render/image/public/…` (sin `/es/`, sin `opengraph-image`), `og:image:width` 1200, `og:image:height` 630, y `<title>Camino Inca Clásico 4D/3N: precio 2026 y reservas</title>`.

- [ ] **Step 6: Commit**

```bash
git add -A "src/app/[locale]/(public)/tours/[slug]"
git status --short "src/app/[locale]/(public)/tours/[slug]"
# Debe listar: M page.tsx  y  D opengraph-image.tsx
git commit -m "fix(seo): og:image de tours servida desde el CDN y titles con keyword de intencion"
```

---

### Task 6: Script de auditoría

Cierra el ciclo: convierte "¿anda el preview?" en un comando con exit code.

**Files:**
- Create: `scripts/audit-og.mjs`

**Interfaces:**
- Consumes: el sitio corriendo (dev o producción).
- Produces: `node scripts/audit-og.mjs [baseUrl]` — exit 0 si todas las fichas pasan, 1 si alguna falla.

- [ ] **Step 1: Escribir el script**

Create: `scripts/audit-og.mjs`

```js
/**
 * Audita las OG de las fichas de tour.
 *
 * Para cada /tours/* del sitemap verifica que og:image responda 200 DIRECTO
 * (sin redirect — los crawlers de WhatsApp/Facebook no los siguen de forma
 * confiable), que sea JPEG o PNG, y que pese menos de 300 KB, el umbral a
 * partir del cual WhatsApp deja de renderizar el preview. De paso controla los
 * largos de <title> y meta description.
 *
 * Uso:
 *   node scripts/audit-og.mjs                        # producción
 *   node scripts/audit-og.mjs http://localhost:3000  # dev
 */

const BASE = (process.argv[2] ?? "https://boletomachupicchutours.com").replace(/\/+$/, "");
const MAX_BYTES = 300 * 1024;
const TITLE_MAX = 60;
const DESC_MAX = 155;

const pick = (html, re) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&");

// El sitemap emite <loc> con el dominio de producción incluso servido desde
// dev (usa siteUrl()), así que se le reemplaza el origen por BASE. Sin esto,
// apuntar el script a localhost auditaría producción igual.
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]*\/tours\/[^<]+)<\/loc>/g)].map((m) =>
      new URL(new URL(m[1]).pathname, BASE).toString()
    )
  ),
];

if (urls.length === 0) {
  console.error(`No se encontraron fichas de tour en ${BASE}/sitemap.xml`);
  process.exit(1);
}

console.log(`Auditando ${urls.length} fichas en ${BASE}\n`);

let fallaron = 0;
for (const url of urls) {
  const slug = url.split("/tours/")[1];
  const html = await (await fetch(url)).text();

  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const img = pick(html, /<meta property="og:image" content="([^"]*)"/);

  const problemas = [];
  if (title.length > TITLE_MAX) problemas.push(`title ${title.length}>${TITLE_MAX}`);
  if (desc.length > DESC_MAX) problemas.push(`desc ${desc.length}>${DESC_MAX}`);

  if (!img) {
    problemas.push("sin og:image");
  } else {
    const res = await fetch(img, { redirect: "manual" });
    if (res.status !== 200) {
      problemas.push(`img HTTP ${res.status}`);
    } else {
      const tipo = res.headers.get("content-type") ?? "";
      const bytes = (await res.arrayBuffer()).byteLength;
      if (!/^image\/(jpeg|png)/.test(tipo)) problemas.push(`tipo ${tipo}`);
      if (bytes > MAX_BYTES) problemas.push(`${Math.round(bytes / 1024)} KB > 300 KB`);
    }
  }

  if (problemas.length > 0) fallaron++;
  console.log(`${problemas.length ? "FAIL" : "ok  "}  ${slug.padEnd(42)} ${problemas.join(", ")}`);
}

console.log(`\n${urls.length - fallaron}/${urls.length} fichas OK`);
process.exit(fallaron > 0 ? 1 : 0);
```

- [ ] **Step 2: Correrlo contra producción para ver el rojo de partida**

Run: `node scripts/audit-og.mjs`
Expected: FAIL — `0/33 fichas OK`, con 33 líneas `img HTTP 307` y dos títulos de más de 60. Producción todavía tiene el código viejo; esto confirma que el script detecta el problema real.

- [ ] **Step 3: Correrlo contra dev para ver el verde**

Con `npm run dev` corriendo:

Run: `node scripts/audit-og.mjs http://localhost:3000`
Expected: PASS — `33/33 fichas OK`, exit 0.

Si algún tour falla con `tipo` o peso, revisar de qué host sale su cover: si no es Supabase ni Unsplash, `tourOgImage` lo mandó al fallback y hay que agregarle una rama (Task 2).

- [ ] **Step 4: Commit**

```bash
git add scripts/audit-og.mjs
git commit -m "chore(seo): script que audita og:image, title y description de las fichas"
```

---

### Task 7: Build, deploy y verificación real

**Files:** ninguno — es la tarea de cierre.

**Interfaces:**
- Consumes: todas las tareas anteriores.
- Produces: el sitio en producción con el preview funcionando.

- [ ] **Step 1: Suite completa en verde**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: los cuatro en exit 0. `npm test` debe decir `# pass 20`, `# fail 0`.

- [ ] **Step 2: Preguntar antes de desplegar**

**No desplegar sin confirmación del usuario.** El repo no tiene remoto y `npx vercel --prod` publica directo. Preguntar explícitamente si desplegar ahora.

- [ ] **Step 3: Desplegar (solo con el OK)**

Run: `npx vercel --prod`
Expected: termina con la URL de producción.

- [ ] **Step 4: Auditar producción**

Run: `node scripts/audit-og.mjs`
Expected: PASS — `33/33 fichas OK`, exit 0. Es el mismo comando que en la Task 6 daba `0/33`.

- [ ] **Step 5: Verificar robots.txt y que el noindex sigue puesto**

Run: `curl -s https://boletomachupicchutours.com/robots.txt && curl -s https://boletomachupicchutours.com/tours/camino-inca-4-dias | grep -oE '<meta name="robots"[^>]*>'`
Expected: `Allow: /` en el robots.txt, **y** `<meta name="robots" content="noindex, nofollow"/>` en la ficha. Las dos cosas a la vez: es la combinación buscada.

- [ ] **Step 6: La prueba que cierra el caso**

Compartir `https://boletomachupicchutours.com/tours/camino-inca-4-dias` en un chat de WhatsApp y confirmar que aparece la foto del tour.

Es el único paso que valida la causa nº 1 del spec (que el `Disallow` bloqueaba al crawler), y no se puede automatizar.

Si el preview sigue sin salir: el crawler de WhatsApp cachea el resultado por días. Forzar el refresco compartiendo el link con `?v=2` al final, o pasando la URL por el Facebook Sharing Debugger (`https://developers.facebook.com/tools/debug/`) y pulsando "Scrape Again". Si con el link nuevo sí sale, era caché.

- [ ] **Step 7: Reportar el resultado**

Informar al usuario: `N/33` fichas en verde, y si la foto apareció o no en WhatsApp. Si algo quedó fallando, decirlo con la salida real del script — sin redondear.
