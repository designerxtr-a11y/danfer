# Japonés Fase 1 (base `/ja`): plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** que `/ja/...` exista, con toda la interfaz en japonés y el contenido de la base de datos en inglés de respaldo, y que las cotizaciones `/quote` puedan salir en japonés.

**Architecture:**
- Se agrega `ja` a next-intl y al tipo `Locale`.
- Un helper `L(locale, {es, en, ja})` reemplaza los ternarios `locale === "en" ? EN : ES`. Si falta `ja`, cae a `en`.
- `t()`/`tList()` resuelven los campos jsonb con la cadena `ja → en → es`.
- El SEO (alternates, sitemap, og) aprende `ja`. Las páginas siguen estáticas porque el locale llega por params.

**Tech Stack:** Next 16 (App Router, leer `node_modules/next/dist/docs/` si algo choca), next-intl, TypeScript, Supabase, Node 24 (`node --test` con type stripping).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-06-japones-design.md`.
- Las páginas públicas tienen que salir ○/● en `next build`, nunca ƒ (excepto reservar, quote, sitemaps). Nada de `cookies()`/`headers()`/`getLocale()` en layouts raíz ni en consultas públicas.
- Respaldo de contenido: `ja → en → es`. ES y EN se comportan igual que hoy.
- Precios en US$ en `/ja`.
- Textos legales largos (términos, privacidad, cancelación) y "Sobre nosotros": en `/ja` se muestra la versión EN (Fase 1). Esas páginas quedan con canonical a `/en`.
- Japonés sencillo y cortés (です/ます). Nombres propios en katakana: マチュピチュ, クスコ, 聖なる谷, オリャンタイタンボ, アグアスカリエンテス, インカ道, レインボーマウンテン, フマンタイ湖.
- Sin emojis.

---

### Task 1: plumbing de locale y helpers

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/types/database.ts:3-4,88-100`
- Create: `src/lib/i18n/pick.ts`
- Test: `src/lib/i18n/pick.test.ts`

**Interfaces:**
- Produces: `type Locale = "es" | "en" | "ja"`; `L<T>(locale: Locale, v: { es: T; en: T; ja?: T }): T`; `t(field, locale)` y `tList(list, locale)` con cadena `ja → en → es`; `hasJa(field): boolean`.

- [ ] **Step 1: test que falla** (`src/lib/i18n/pick.test.ts`)

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { L } from "./pick.ts";
import { t, tList } from "../../types/database.ts";

test("L picks ja, falls back to en", () => {
  assert.equal(L("ja", { es: "a", en: "b", ja: "c" }), "c");
  assert.equal(L("ja", { es: "a", en: "b" }), "b");
  assert.equal(L("es", { es: "a", en: "b", ja: "c" }), "a");
  assert.equal(L("en", { es: "a", en: "b" }), "b");
});

test("t chain ja -> en -> es", () => {
  assert.equal(t({ es: "a", en: "b", ja: "c" }, "ja"), "c");
  assert.equal(t({ es: "a", en: "b" }, "ja"), "b");
  assert.equal(t({ es: "a" }, "ja"), "a");
  assert.equal(t({ es: "a" }, "en"), "a");
});

test("tList chain", () => {
  assert.deepEqual(tList({ es: ["a"], en: ["b"], ja: [] }, "ja"), ["b"]);
  assert.deepEqual(tList({ es: ["a"], ja: ["c"] }, "ja"), ["c"]);
  assert.deepEqual(tList(["x"], "ja"), ["x"]);
});
```

- [ ] **Step 2:** `node --experimental-strip-types --test src/lib/i18n/pick.test.ts` → FAIL (no existe `pick.ts`).

- [ ] **Step 3: implementación**

`src/lib/i18n/pick.ts`:
```ts
import type { Locale } from "@/types/database";

/** Texto de UI por idioma. Si falta `ja`, cae a `en`. */
export function L<T>(locale: Locale, v: { es: T; en: T; ja?: T }): T {
  if (locale === "ja") return v.ja ?? v.en;
  return v[locale];
}
```
Nota: el test importa con ruta relativa. Si `@/types/database` no resuelve en `node --test`, en `pick.ts` usar `import type` (se borra al quitar los tipos, así que no falla).

`src/types/database.ts`:
```ts
export type Locale = "es" | "en" | "ja";
export type Localized = { es: string; en?: string; ja?: string };
// ...
export function t(field: Localized | null | undefined, locale: Locale = "es"): string {
  if (!field) return "";
  if (locale === "ja") return field.ja || field.en || field.es || "";
  return field[locale] ?? field.es ?? "";
}
export type LocalizedList = string[] | { es: string[]; en?: string[]; ja?: string[] };
export function tList(list: LocalizedList | null | undefined, locale: Locale = "es"): string[] {
  if (!list) return [];
  if (Array.isArray(list)) return list;
  if (locale === "ja") return (list.ja?.length ? list.ja : list.en?.length ? list.en : list.es) ?? [];
  return (list[locale]?.length ? list[locale] : list.es) ?? [];
}
export function hasJa(field: Localized | null | undefined): boolean {
  return !!field?.ja?.trim();
}
```
`src/i18n/routing.ts`: `locales: ["es", "en", "ja"]`.

- [ ] **Step 4:** test → PASS. `npx tsc --noEmit -p .` va a fallar en `messages.ts` (falta `ja`) y en los `Record<"es"|"en">`: anotar la lista, que se resuelve en las tareas 2 a 7.
- [ ] **Step 5:** commit `feat(i18n): add ja locale, L() helper and ja→en→es fallback`.

### Task 2: bloque `ja` en messages.ts

**Files:** Modify `src/lib/i18n/messages.ts` (agregar `ja: {...}` con exactamente las mismas claves que `en`).

- [ ] **Step 1:** copiar el bloque `en` como `ja` y traducir cada valor al japonés (por ejemplo, `nav.tours: "ツアー"`, `nav.destinations: "目的地"`, `nav.blog: "ガイド"`, `hero.cta: "ツアーを予約"`, `difficulty.moderate: "普通"`). Tipar `ja` como `typeof messages.en`, para que el compilador avise si falta una clave.
- [ ] **Step 2:** `npx tsc --noEmit -p .`: `messages.ts` sin errores.
- [ ] **Step 3:** commit `feat(i18n): Japanese UI messages`.

### Task 3: html, fuente, layouts y SEO

**Files:**
- Modify: `src/components/layout/root-html.tsx` (Noto Sans JP solo si `lang === "ja"`)
- Modify: `src/app/[locale]/layout.tsx` (`generateStaticParams` incluye `ja`; si lee `routing.locales`, ya queda)
- Modify: `src/lib/seo/alternates.ts`, `src/app/sitemap.ts`, `src/lib/seo/schema.ts` (`inLanguage`, URLs por locale)
- Modify: `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx`, `blog/[slug]/opengraph-image.tsx` (título con `t()`)

- [ ] **Step 1:** en `root-html.tsx` agregar
```ts
import { Noto_Sans_JP } from "next/font/google";
const notoJp = Noto_Sans_JP({ variable: "--font-jp", subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", preload: false });
```
En `className`, agregar `${lang === "ja" ? notoJp.variable + " font-jp" : ""}`. En `globals.css`, agregar `.font-jp body, .font-jp { font-family: var(--font-inter), var(--font-jp), sans-serif; }` y, para los títulos con Playfair, `:lang(ja) .font-display { font-family: var(--font-jp), serif; font-weight: 700; }`.
- [ ] **Step 2:** `buildAlternates(path, locale, { enAvailable = true, jaAvailable = false })`:
  - `languages` incluye `ja: /ja${clean}` solo si `jaAvailable`.
  - Canonical para `locale === "ja"`: si `jaAvailable`, `/ja${clean}`; si no, `enAvailable ? enUrl : esUrl`.
  - `ogLocale("ja") = "ja_JP"`.
  - Las páginas de UI pura (home, /tours, /destinos, /blog índice, /contacto) pasan `jaAvailable: true`. Las de contenido de base de datos pasan `jaAvailable: hasJa(x.title)`.
- [ ] **Step 3:** sitemap: además de `es`/`en`, agregar `ja` en `alternates.languages` y como URL propia solo para páginas de UI y contenido con `hasJa`. La función de URL de la línea 10 pasa a `locale === "es" ? "" : "/" + locale`.
- [ ] **Step 4:** schema: `inLanguage` incluye `"ja"` donde ya están `es` y `en`. URLs de tours por locale, igual que en el sitemap.
- [ ] **Step 5:** `npx next build`: `/ja`, `/ja/tours` y `/ja/tours/[slug]` aparecen como ●. Commit `feat(seo): ja alternates, sitemap, schema and JP font`.

### Task 4: navbar, footer, WhatsApp y selector de idioma

**Files:** `src/components/layout/navbar.tsx`, `footer.tsx`, `whatsapp-button.tsx`, `src/app/[locale]/(public)/layout.tsx`.

- [ ] **Step 1:**
  - Agregar un tercer botón al selector (escritorio en línea 233 y móvil en 457) con un componente `JapanFlag` (SVG inline: círculo rojo `#BC002D` sobre blanco, mismo tamaño que `USFlag`), `aria-label="日本語"` y `onClick={() => locale !== "ja" && setLocale("ja")}`.
  - Verificar que `setLocale` use el router de `@/i18n/navigation` (respeta `/ja`).
- [ ] **Step 2:** reemplazar cada `locale === "en" ? X : Y` del archivo por `L(locale, { es: Y, en: X, ja: "…" })` con su traducción. Por ejemplo, `L(locale, { es: "Reservar", en: "Book now", ja: "予約する" })`. Los mensajes prellenados de WhatsApp en japonés quedan en inglés (el equipo responde en inglés): `ja` omitido → `en`.
- [ ] **Step 3:** `npx tsc --noEmit -p .` limpio en estos archivos. Commit `feat(i18n): ja language switcher and layout chrome`.

### Task 5: portada y tours

**Files:**
- `src/components/sections/{hero,stats,featured-tours,featured-tours.client,testimonials.client,certifications}.tsx`
- `src/components/tours/*` (los 12 con ternarios de la auditoría)
- `src/app/[locale]/(public)/tours/page.tsx`, `page.client.tsx`, `tours/[slug]/page.tsx`, `reservar/[slug]/page.tsx`, `reservar/confirmacion/page.tsx`

- [ ] **Step 1:**
  - Misma conversión `L()` en cada ternario y en cada `const en = locale === "en"` (los usos de `en ? A : B` pasan a `L(locale, {es: B, en: A, ja: …})`).
  - Fechas: `toLocaleDateString(L(locale, { es: "es-PE", en: "en-US", ja: "ja-JP" }), …)`.
  - `Record<"es" | "en", …>` → `Record<Locale, …>`, agregando la entrada `ja`.
- [ ] **Step 2:**
  ```bash
  grep -rnE 'locale === "en"|const en = ' src/components/sections src/components/tours "src/app/[locale]/(public)/tours" "src/app/[locale]/(public)/reservar"
  ```
  Tiene que dar 0 resultados, o solo casos justificados con un comentario.
- [ ] **Step 3:** commit `feat(i18n): ja home and tour pages`.

### Task 6: blog, destinos y páginas estáticas

**Files:**
- `src/components/blog/{whatsapp-cta,post-toc,tour-cta,post-cta}.tsx`
- `src/app/[locale]/(public)/blog/page.tsx`, `blog/[slug]/page.tsx`
- `destinos/page.tsx`, `destinos/[slug]/page.tsx`, `src/lib/destinations-content.ts`
- `contacto`, `sobre-nosotros`, `terminos`, `privacidad`, `cancelacion`

- [ ] **Step 1:** los componentes del blog y la UI de destinos y contacto se convierten con `L()`.
- [ ] **Step 2:**
  - Legales y "Sobre nosotros": cambiar `locale === "en" ? <En/> : <Es/>` por `locale === "es" ? <Es/> : <En/>`, y `buildAlternates(..., { jaAvailable: false })`.
  - Contenido de destinos: `ja` usa la versión `destinations-en` hasta la Fase 2, con `jaAvailable: false`.
- [ ] **Step 3:** post del blog: `buildAlternates(path, locale, { enAvailable: hasEn, jaAvailable: hasJa(post.title) })`. El cuerpo se resuelve con `t()`, que ya cae a EN.
- [ ] **Step 4:** commit `feat(i18n): ja blog chrome, destinations and static pages (EN fallback)`.

### Task 7: cotizaciones en japonés

**Files:** `src/app/[locale]/(public)/quote/[token]/{quotes-data.ts,page.tsx,passport-upload.tsx,paypal-button.tsx}`

- [ ] **Step 1:**
  - `lang: "en" | "es" | "ja"` en el tipo `Quote`.
  - Bloque `ja` en el `COPY` de `page.tsx`, con todas las claves de `en` y `waMessage` en inglés (lo lee el equipo).
  - `ja` en el `COPY` de `passport-upload.tsx` (`uploadLabel: "写真をアップロード"`, `uploading: "アップロード中…"`, `done: "受け付けました。ありがとうございます！"`, `traveler: (n) => \`旅行者 ${n}\``, `tooBig`, `failed`, `hint`).
  - Lo mismo en `paypal-button.tsx` si tiene textos.
- [ ] **Step 2:** cambiar `machu-picchu-9-nov` a `lang: "ja"` **no**: el cliente ya pagó y la página que conoce está en inglés. Verificar con una cotización temporal en local (`npx next dev`, abrir `/ja/quote/<token>`) y no commitearla.
- [ ] **Step 3:** commit `feat(quote): Japanese quote pages`.

### Task 8: verificación y despliegue

- [ ] `node --experimental-strip-types --test src/lib/i18n/pick.test.ts` → PASS.
- [ ] `npx tsc --noEmit -p .` → 0 errores.
- [ ] `npx next build`: rutas públicas `/ja/...` en ○/●. Comparar el conteo de ƒ con el build anterior: no tiene que subir.
- [ ] `npx next start` y revisar `/ja`, `/ja/tours`, `/ja/tours/machu-picchu-2d-1n`, `/ja/blog`, `/ja/contacto`: sin textos en español. Los legales en EN.
- [ ] `curl -s localhost:3000/ja/tours/machu-picchu-2d-1n | grep -o 'hreflang="[a-z-]*"'`: sin `ja` (el tour aún no tiene JA). En `/ja`, `ja` presente.
- [ ] Push a `main` (despliega), comprobar `https://danfertourscusco.com/ja` → 200.
