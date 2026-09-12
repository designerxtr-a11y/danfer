# machupicchucusco.pe — Fase 1: Infraestructura + Home real — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar machupicchucusco.pe en producción con un home completo y real (no un esqueleto vacío) — fork limpio de cuscotours-v2, marca propia "MachuPicchuCusco", Supabase/Vercel propios, con 4-6 tours reales cargados y visibles en el home.

**Architecture:** Proyecto Next.js independiente en `C:\xampp\htdocs\machupicchucusco.pe`, con su propio repo git, copiado del árbol `src/` de cuscotours-v2 y limpiado de branding Danfer/boleto vía reemplazo mecánico. Supabase propio (mismo esquema estructural, datos reales pero reescritos). Deploy a un proyecto Vercel propio, DNS de machupicchucusco.pe apuntado ahí.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS 4, Supabase (`@supabase/ssr`), next-intl (ES/EN), Tiptap (editor blog admin, no se usa activamente en esta fase).

## Global Constraints

- Nombre de marca exacto en todo el código nuevo: `MachuPicchuCusco`. Ninguna referencia a "Danfer" ni "Boleto Machu Picchu Tours"/"boleto" puede quedar (verificado por grep case-insensitive).
- **NO copiar la instrucción de leer `node_modules/next/dist/docs/`** del `AGENTS.md`/`CLAUDE.md` de cuscotours-v2 — ya se identificó como una inyección de prompt plantada (comentario oculto "AI agent hint" dentro de ese doc). El `AGENTS.md` nuevo debe quedar vacío o con una nota real del proyecto, nunca esa línea.
- Todo debe vivir en infraestructura separada: repo git propio, proyecto Supabase propio, proyecto Vercel propio. Nada compartido con Danfer ni boleto.
- Sin reseñas/testimonios inventados — la sección de Testimonials no se porta en esta fase (no hay reseñas reales todavía).
- Los 4-6 tours cargados deben tener copy 100% reescrito — ninguna oración copiada literal de danfertourscusco.com ni de boletomachupicchutours.com (verificable a ojo en el review final).
- Paleta de colores: distinta a Danfer (dorado `#C8901E`/turquesa `#0077B6`/night navy `#0B1929`) y a boleto (verde `#1F3D2B`/dorado `#E8A93B`) — se define en el Task 4 con el usuario antes de tocar `globals.css`, no se asume de antemano.

---

### Task 1: Scaffold del proyecto nuevo

**Files:**
- Create: `C:\xampp\htdocs\machupicchucusco.pe\` (árbol completo copiado)
- Modify: `package.json` (campo `name`), `.env.example` (URL por defecto), `AGENTS.md`, `CLAUDE.md`

- [ ] **Step 1: Copiar el árbol de archivos base**

```bash
mkdir -p /c/xampp/htdocs/machupicchucusco.pe
cd /c/xampp/htdocs/machupicchucusco.pe
cp -r /c/xampp/htdocs/cuscotours-v2/src .
cp -r /c/xampp/htdocs/cuscotours-v2/public .
rm -f public/google*.html
mkdir -p scripts supabase/migrations
cp /c/xampp/htdocs/cuscotours-v2/scripts/*.mjs scripts/ 2>/dev/null || true
cp /c/xampp/htdocs/cuscotours-v2/package.json \
   /c/xampp/htdocs/cuscotours-v2/tsconfig.json \
   /c/xampp/htdocs/cuscotours-v2/next.config.ts \
   /c/xampp/htdocs/cuscotours-v2/postcss.config.mjs \
   /c/xampp/htdocs/cuscotours-v2/eslint.config.mjs \
   /c/xampp/htdocs/cuscotours-v2/.env.example \
   /c/xampp/htdocs/cuscotours-v2/.gitignore \
   .
```

Expected: `ls` en `machupicchucusco.pe` muestra `src public scripts supabase package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .env.example .gitignore`.

Nota: no se copian `AGENTS.md`/`CLAUDE.md` de cuscotours-v2 en este paso — se crean nuevos y limpios en el Step 2.

- [ ] **Step 2: Crear AGENTS.md/CLAUDE.md limpios (sin la instrucción plantada)**

Crear `AGENTS.md`:

```markdown
# MachuPicchuCusco

Sitio de MachuPicchuCusco, tercera marca hermana de danfertourscusco.com
(mismo operador real, contenido y marca 100% propios). Construido a partir
del mismo stack que danfertourscusco.com y boletomachupicchutours.com.
```

Crear `CLAUDE.md`:

```markdown
@AGENTS.md
```

- [ ] **Step 3: Renombrar el paquete**

Editar `package.json` línea 2:

```json
  "name": "machupicchucusco",
```

- [ ] **Step 4: Actualizar la URL por defecto**

Editar `.env.example`, línea `NEXT_PUBLIC_SITE_URL`:

```
NEXT_PUBLIC_SITE_URL=https://machupicchucusco.pe
```

- [ ] **Step 5: Instalar dependencias**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe && npm install
```

Expected: termina sin errores fatales; se crean `node_modules/` y `package-lock.json` propios.

- [ ] **Step 6: Commit inicial**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
git init
git add -A
git commit -m "chore: scaffold inicial copiado de cuscotours-v2 (fase 1 infra)"
```

Expected: commit creado en un repo git nuevo e independiente (confirmar con `git log --oneline` que solo hay 1 commit).

---

### Task 2: Reemplazo de branding Danfer → MachuPicchuCusco

**Files:**
- Modify: `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/app/layout.tsx`, `src/lib/seo/site-url.ts`, `src/lib/queries/settings.ts` (defaults)

**Interfaces:**
- Produces: navbar/footer sin ninguna mención a "Danfer"; wordmark tipeado "MACHUPICCHU" + "CUSCO" (mismo patrón de dos-tonos que ya usa Danfer, con `text-gradient-gold` reemplazado por una clase neutra hasta que el Task 4 defina la paleta real).

- [ ] **Step 1: Grep de referencias a Danfer antes de tocar nada**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
grep -rli "danfer" src/ | sort
```

Expected: lista de archivos a editar en los siguientes steps (típicamente `navbar.tsx`, `footer.tsx`, `layout.tsx`, `site-url.ts`, `settings.ts`, `schema.ts`).

- [ ] **Step 2: Reemplazo mecánico del texto de marca**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
grep -rl "Danfer Tours Cusco" src/ | xargs sed -i 's/Danfer Tours Cusco/MachuPicchuCusco/g'
grep -rl "danfertourscusco\.com" src/ | xargs sed -i 's/danfertourscusco\.com/machupicchucusco.pe/g'
grep -rl "hola@danfertourscusco" src/ | xargs sed -i 's/hola@danfertourscusco\.com/hola@machupicchucusco.pe/g'
grep -rl "@danfertourscusco" src/ | xargs sed -i 's/@danfertourscusco/@machupicchucusco/g'
```

- [ ] **Step 3: Verificar que no queda ninguna mención**

```bash
grep -rli "danfer" src/ | sort
```

Expected: sin resultados. Si queda algo, corregirlo a mano (revisar contexto — puede ser un comentario o un valor no cubierto por los reemplazos anteriores).

- [ ] **Step 4: Reemplazar el wordmark del navbar por un color neutro temporal**

En `src/components/layout/navbar.tsx`, ubicar las 4 apariciones de:

```tsx
<span className="text-gradient-gold">DANFER</span>
<span className={solid ? "text-night" : "text-white"}>TOURS</span>
```

(dos en el nav desktop — una condicional a `solid`, una simplificada — y dos en el overlay mobile) y reemplazar cada una por:

```tsx
<span className="text-night font-bold">MACHUPICCHU</span>
<span className={solid ? "text-night/70" : "text-white/85"}>CUSCO</span>
```

Nota: esto es un placeholder tipográfico neutro (negro/gris) a propósito — el Task 4 define la paleta real y vuelve a tocar este archivo para aplicar el color de marca definitivo.

- [ ] **Step 5: Quitar el ícono de logo-imagen (no existe todavía para esta marca)**

En el mismo archivo, eliminar los bloques `{logoUrl && (<Image .../>)}` (desktop y mobile) — sin logo-imagen en esta fase, solo wordmark tipeado. Quitar también la prop `logoUrl` de la firma de `Navbar` y del único call site en `src/app/[locale]/(public)/layout.tsx`.

- [ ] **Step 6: Build y verificación**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe && npm run build
```

Expected: build exitoso. Si falla por referencias sueltas a `logoUrl`, corregirlas.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(brand): reemplazar Danfer por MachuPicchuCusco en navbar/footer/layout"
```

---

### Task 3: Supabase nuevo — coordinación con el usuario + schema

**Files:**
- Create: `.env.local` (no versionado — credenciales reales)
- Create: `supabase/migrations/00001_init_schema.sql` (copiado/adaptado de cuscotours-v2)

- [ ] **Step 1: Pedir credenciales al usuario**

Este paso requiere que el usuario cree un proyecto nuevo en supabase.com y entregue: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. **Bloquea el resto de esta tarea y las Tasks 5-6** — no continuar sin esto.

- [ ] **Step 2: Volcar el schema estructural de cuscotours-v2**

```bash
cd /c/xampp/htdocs/cuscotours-v2 && npx supabase db dump --schema public -f /c/xampp/htdocs/machupicchucusco.pe/supabase/migrations/00001_init_schema.sql
```

Si el CLI de Supabase no está linkeado a un proyecto remoto en esta máquina, alternativa manual: copiar los archivos de `cuscotours-v2/supabase/migrations/` que definen `CREATE TABLE` (tours, categories, blog_posts, settings, reviews, bookings, inquiries, admin_users, profiles) a `machupicchucusco.pe/supabase/migrations/`, **excluyendo** cualquier migración de contenido/datos específico de Danfer (las que hacen `INSERT INTO` con texto de Danfer).

- [ ] **Step 3: Escribir `.env.local` con las credenciales reales**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=<url-que-dio-el-usuario>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-que-dio-el-usuario>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-que-dio-el-usuario>
NEXT_PUBLIC_SITE_URL=https://machupicchucusco.pe
EOF
```

- [ ] **Step 4: Aplicar el schema al proyecto nuevo**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
npx supabase link --project-ref <ref-del-proyecto-nuevo>
npx supabase db push
```

Expected: las tablas se crean sin error en el proyecto Supabase nuevo (verificar en el dashboard de supabase.com → Table Editor).

- [ ] **Step 5: Crear usuario admin de bootstrap**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
node scripts/list-admins.mjs
```

Expected: corre sin error (aunque devuelva 0 usuarios) — confirma que las credenciales en `.env.local` funcionan contra el proyecto nuevo. Si no existe un admin todavía, usar el flujo de registro de `/admin` una vez el dev server esté corriendo (Task 7).

- [ ] **Step 6: Commit del schema**

```bash
git add supabase/
git commit -m "feat(db): schema inicial en Supabase propio"
```

---

### Task 4: Paleta de colores propia

**Files:**
- Modify: `src/app/globals.css` (bloque `@theme`)

- [ ] **Step 1: Proponer 2-3 opciones de paleta al usuario y confirmar una**

Antes de tocar código: presentarle al usuario 2-3 combinaciones de color que no choquen con Danfer (dorado/turquesa/night navy) ni boleto (verde/dorado), y esperar su confirmación explícita antes del Step 2. Ejemplo de opciones a proponer (ajustar según gusto real del usuario, no asumir la elegida):
- Terracota + azul profundo (cálido, distinto a ambas marcas existentes)
- Púrpura andino + dorado claro
- Coral + piedra/gris cálido

- [ ] **Step 2: Aplicar la paleta confirmada al theme**

En `src/app/globals.css`, dentro del bloque `@theme`, reemplazar los valores de color heredados de Danfer por los confirmados en el Step 1 (mismo patrón de variables ya existente: `--color-night`, `--color-night-deep`, `--color-gold`, `--color-gold-bright`, `--color-turquoise`, `--color-turquoise-deep`, `--color-terracotta`, `--color-cream`, `--color-background`, `--color-foreground`). No renombrar las variables (el resto del código las referencia por nombre) — solo cambiar los valores hex.

- [ ] **Step 3: Aplicar el color de marca definitivo al wordmark del navbar**

Volver a `src/components/layout/navbar.tsx` (tocado en Task 2 Step 4) y reemplazar el color placeholder neutro por la clase de color real de la paleta confirmada (ej. `text-<color-primario>` en vez de `text-night font-bold`), en las 4 apariciones del wordmark.

- [ ] **Step 4: Build y verificación visual**

```bash
npm run build && npm run dev
```

Abrir `http://localhost:3000/es` y confirmar visualmente que la paleta se ve distinta a Danfer/boleto.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(theme): paleta de colores propia de MachuPicchuCusco"
```

---

### Task 5: Seed de categorías + 4-6 tours reales (copy reescrito)

**Files:**
- Create: `scripts/seed-tours.mjs`

**Interfaces:**
- Consumes: `.env.local` del Task 3 (proyecto Supabase nuevo ya con schema aplicado)
- Produces: filas reales en `categories` y `tours`, consumidas por el home en el Task 6 vía `getCategoriesWithTours()`/`getFeaturedTours()` (mismas funciones de `src/lib/queries/*`, sin modificar)

- [ ] **Step 1: Escribir el script de seed**

```js
// scripts/seed-tours.mjs
// Carga categorias + 4-6 tours reales (mismos datos operativos que Danfer:
// precio, duracion) con copy 100% reescrito para MachuPicchuCusco.
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const categories = [
  { slug: "machu-picchu", name: { es: "Machu Picchu", en: "Machu Picchu" }, sort_order: 1, is_published: true },
  { slug: "valle-sagrado", name: { es: "Valle Sagrado", en: "Sacred Valley" }, sort_order: 2, is_published: true },
  { slug: "camino-inca", name: { es: "Camino Inca", en: "Inca Trail" }, sort_order: 3, is_published: true },
  { slug: "aventura", name: { es: "Aventura", en: "Adventure" }, sort_order: 4, is_published: true },
];

const { data: catRows, error: catErr } = await sb.from("categories").upsert(categories, { onConflict: "slug" }).select();
if (catErr) { console.error("categories:", catErr.message); process.exit(1); }
const catBySlug = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

const tours = [
  {
    slug: "machu-picchu-clasico",
    category_id: catBySlug["machu-picchu"],
    title: { es: "Machu Picchu Clásico", en: "Classic Machu Picchu" },
    subtitle: { es: "La ciudadela inca en un día inolvidable", en: "The Inca citadel in one unforgettable day" },
    short_desc: {
      es: "Recorré la ciudadela inca con guía local certificado. Tren panorámico incluido, grupos reducidos. Desde US$100.",
      en: "Explore the Inca citadel with a certified local guide. Panoramic train included, small groups. From US$100.",
    },
    price_usd: 100,
    duration_label: { es: "1 día", en: "1 day" },
    difficulty: "moderate",
    max_group_size: 10,
    is_published: true,
    is_featured: true,
    bookings_count: 0,
  },
  {
    slug: "valle-sagrado-completo",
    category_id: catBySlug["valle-sagrado"],
    title: { es: "Valle Sagrado Completo", en: "Full Sacred Valley" },
    subtitle: { es: "Pisac, Ollantaytambo y Chinchero en un solo día", en: "Pisac, Ollantaytambo and Chinchero in one day" },
    short_desc: {
      es: "Mercados, andenes y pueblos vivos del Valle Sagrado. Almuerzo incluido. Desde US$125.",
      en: "Markets, terraces and living towns of the Sacred Valley. Lunch included. From US$125.",
    },
    price_usd: 125,
    duration_label: { es: "1 día", en: "1 day" },
    difficulty: "easy",
    max_group_size: 12,
    is_published: true,
    is_featured: true,
    bookings_count: 0,
  },
  {
    slug: "camino-inca-clasico",
    category_id: catBySlug["camino-inca"],
    title: { es: "Camino Inca Clásico 4D/3N", en: "Classic Inca Trail 4D/3N" },
    subtitle: { es: "El trek original hasta Machu Picchu", en: "The original trek to Machu Picchu" },
    short_desc: {
      es: "4 días de caminata por la ruta inca original, con porteadores y comidas incluidas. Permiso oficial SERNANP. Desde US$150.",
      en: "4 days hiking the original Inca route, with porters and meals included. Official SERNANP permit. From US$150.",
    },
    price_usd: 150,
    duration_label: { es: "4 días / 3 noches", en: "4 days / 3 nights" },
    difficulty: "challenging",
    max_group_size: 8,
    is_published: true,
    is_featured: true,
    bookings_count: 0,
  },
  {
    slug: "montana-de-colores",
    category_id: catBySlug["aventura"],
    title: { es: "Montaña de 7 Colores", en: "Rainbow Mountain" },
    subtitle: { es: "Vinicunca, la montaña más fotografiada del sur peruano", en: "Vinicunca, southern Peru's most photographed mountain" },
    short_desc: {
      es: "Trek de altura a 5,200 msnm con vistas únicas. Salida temprano desde Cusco. Desde US$35.",
      en: "High-altitude trek at 5,200 m with unique views. Early departure from Cusco. From US$35.",
    },
    price_usd: 35,
    duration_label: { es: "1 día", en: "1 day" },
    difficulty: "challenging",
    max_group_size: 14,
    is_published: true,
    is_featured: true,
    bookings_count: 0,
  },
];

const { error: tourErr } = await sb.from("tours").upsert(tours, { onConflict: "slug" });
if (tourErr) { console.error("tours:", tourErr.message); process.exit(1); }
console.log(`OK: ${catRows.length} categorias, ${tours.length} tours cargados.`);
```

- [ ] **Step 2: Ajustar `cover_image` de cada tour con fotos reales**

Antes de correr el script, agregar el campo `cover_image` a cada objeto de `tours` en el Step 1, usando fotos reales ya disponibles (mismas URLs de Supabase Storage de `tour-images/hero/*.webp` que usa danfertourscusco.com — son fotos reales de los destinos, no específicas de la marca Danfer, reutilizables). Confirmar con el usuario si prefiere subir fotos propias distintas antes de lanzar; si no, usar las existentes como partida.

- [ ] **Step 3: Correr el seed**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe && node scripts/seed-tours.mjs
```

Expected: `OK: 4 categorias, 4 tours cargados.`

- [ ] **Step 4: Verificar en el dashboard de Supabase**

Abrir Table Editor del proyecto nuevo y confirmar que `categories` tiene 4 filas y `tours` tiene 4 filas con `is_published=true`, `is_featured=true`.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-tours.mjs
git commit -m "feat(data): seed de categorias y 4 tours reales con copy propio"
```

---

### Task 6: Armar el home (Hero, Certificaciones, Tours destacados, Stats)

**Files:**
- Modify: `src/app/[locale]/(public)/page.tsx`
- Modify: `src/components/sections/hero.tsx` (CTA de las tarjetas, bloque de rating opcional)
- Modify: `src/lib/hero-cards.ts` (`HeroCard` interface + `HERO_CARD_DEFAULTS`)
- Modify: `src/components/sections/featured-tours.tsx` (botón "ver todos")
- Modify: `src/components/sections/certifications.tsx` (texto/eyebrow neutro si aplica)
- No modificar: `featured-tours.client.tsx`, `stats.tsx` (se reusan tal cual, ya son genéricos y data-driven)

**Nota de scope:** `/tours`, `/destinos` y las páginas de tour individual quedan **fuera de esta fase** (regla del spec) — pero el Hero y FeaturedTours que sí se muestran en el home tienen botones que hoy apuntan a `/destinos/${slug}` y `/tours`, rutas que no van a existir todavía. Los Steps 3/4 de esta tarea redirigen esos botones a `/contacto` (página que ya viene copiada del Task 1 y sí existe) para no dejar links rotos en un home que se supone terminado.

- [ ] **Step 1: Quitar Testimonials del home**

En `src/app/[locale]/(public)/page.tsx`, eliminar el import y el uso de `<Testimonials />` (no hay reseñas reales todavía — regla del spec).

- [ ] **Step 2: Confirmar que el home queda con Hero + Certifications + FeaturedTours + Stats**

El archivo debe quedar (orden ya validado en danfertourscusco.com):

```tsx
import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Certifications } from "@/components/sections/certifications";
import { Stats } from "@/components/sections/stats";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { getSettings } from "@/lib/queries/settings";
import {
  heroVideoSchema,
  homepageFaqSchema,
  speakableSchema,
  topDestinationsSchemas,
} from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates("/", locale),
    openGraph: { locale: ogLocale(locale) },
  };
}

export default async function Home() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd
        data={[
          speakableSchema(),
          heroVideoSchema(),
          homepageFaqSchema(),
          ...topDestinationsSchemas(),
        ]}
      />
      <Hero cardImages={settings.hero_images} cardTexts={settings.hero_cards} />
      <Certifications />
      <FeaturedTours />
      <Stats polaroidImages={settings.stats_images} />
    </>
  );
}
```

- [ ] **Step 3: Redirigir el CTA de las tarjetas del Hero a `/contacto`**

En `src/components/sections/hero.tsx`, ubicar el `<Link>` del botón principal del hero (el CTA dorado con ícono de flecha) que hoy apunta a `` `/destinos/${current.slug}` ``. Cambiarlo a:

```tsx
<Link
  href="/contacto"
  className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gold px-5 sm:px-7 py-3 sm:py-3.5 text-night font-semibold text-sm sm:text-base transition hover:bg-gold-bright hover:shadow-glow"
>
```

(mantener el resto del bloque — texto del botón e ícono `ArrowRight` — sin cambios, solo el `href`).

- [ ] **Step 4: Redirigir el botón "ver todos los tours" de FeaturedTours a `/contacto`**

En `src/components/sections/featured-tours.tsx`, ubicar el `<Link href="/tours">` del botón centrado debajo de la grilla de tours. Cambiar `href="/tours"` por `href="/contacto"`.

- [ ] **Step 5: Hacer `rating`/`reviews` opcionales en `HeroCard` (no hay reseñas reales todavía)**

`HERO_CARD_DEFAULTS` en `src/lib/hero-cards.ts` tiene `rating: number` y `reviews: number` como campos obligatorios, poblados con datos inventados de Danfer. Como esta marca no tiene reseñas reales todavía, hay que hacer esos dos campos opcionales en vez de inventar números.

En `src/lib/hero-cards.ts`, modificar la interfaz:

```ts
export interface HeroCard {
  country: string;
  region: string;
  title: string;
  slug: string;
  rating?: number;
  reviews?: number;
  days: string;
  price: number;
  img: string;
}
```

- [ ] **Step 6: Reemplazar `HERO_CARD_DEFAULTS` con los 4 tours reales, sin rating/reviews**

En el mismo archivo, reemplazar el array completo por los 4 tours del Task 5 (mismo slug, título y precio; sin `rating`/`reviews`):

```ts
export const HERO_CARD_DEFAULTS: HeroCard[] = [
  {
    country: "Perú",
    region: "Cusco",
    title: "Machu Picchu Clásico",
    slug: "machu-picchu",
    days: "1 día",
    price: 100,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
  },
  {
    country: "Perú",
    region: "Valle Sagrado",
    title: "Valle Sagrado Completo",
    slug: "valle-sagrado",
    days: "1 día",
    price: 125,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Camino Inca Clásico",
    slug: "camino-inca",
    days: "4 días / 3 noches",
    price: 150,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/camino-inca-1789091394992.webp",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Montaña de 7 Colores",
    slug: "aventura",
    days: "1 día",
    price: 35,
    img: "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/rainbow-mountain-1789091035693.webp",
  },
];
```

- [ ] **Step 7: Renderizar el bloque de rating solo si existe, en vez de asumir que siempre hay dato**

En `src/components/sections/hero.tsx`, ubicar el bloque que muestra `current.rating`/`current.reviews` (cerca del CTA principal, un `<div>` con `<Star />` + número + `({current.reviews}+)`). Envolverlo en una condición:

```tsx
{current.rating != null && current.reviews != null && (
  <div className="flex items-center gap-1 text-gold">
    <Star className="w-4 h-4 fill-gold" />
    <span className="text-white font-semibold text-sm">
      {current.rating}
    </span>
    <span className="text-white/60 text-xs">
      ({current.reviews}+)
    </span>
  </div>
)}
```

(mantener el resto del JSX del bloque tal cual estaba, solo agregar la condición envolvente — el contenido interno no cambia).

- [ ] **Step 8: Build**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe && npm run build
```

Expected: build exitoso, sin referencias rotas a `Testimonials` ni a datos de Danfer.

- [ ] **Step 9: Verificación visual completa**

```bash
npm run dev
```

Abrir `http://localhost:3000/es`. Expected:
- Hero muestra las 4 tarjetas nuevas (sin datos de Danfer, sin rating/reviews inventados)
- Franja de certificaciones visible con los mismos logos reales (MINCETUR, CARTUC, etc. — son credenciales reales del operador, no de una marca específica)
- Tours destacados muestra los 4 tours reales cargados en Task 5, con foto, precio y categoría correctos
- Stats muestra números reales del negocio (mismos que Danfer, es el mismo operador real)
- Sin sección de reseñas/testimonios

- [ ] **Step 10: Grep final de verificación de marca**

```bash
grep -rli "danfer\|boleto" src/ public/ scripts/ | sort
```

Expected: sin resultados.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(home): armar home completo con datos reales de MachuPicchuCusco"
```

---

### Task 7: Deploy a Vercel + DNS

**Files:** ninguno (solo configuración de infraestructura)

- [ ] **Step 1: Crear proyecto Vercel nuevo**

```bash
cd /c/xampp/htdocs/machupicchucusco.pe
vercel --global-config "/c/Users/Joos/.vercel-danfer" link
```

Nota: usar la misma cuenta Vercel (`joosuedi-4636`) ya identificada como la correcta para los dominios propios del usuario — seguir las instrucciones interactivas del CLI para crear un proyecto nuevo llamado `machupicchucusco`.

- [ ] **Step 2: Cargar las variables de entorno en Vercel**

```bash
vercel --global-config "/c/Users/Joos/.vercel-danfer" env add NEXT_PUBLIC_SUPABASE_URL production
vercel --global-config "/c/Users/Joos/.vercel-danfer" env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --global-config "/c/Users/Joos/.vercel-danfer" env add SUPABASE_SERVICE_ROLE_KEY production
vercel --global-config "/c/Users/Joos/.vercel-danfer" env add NEXT_PUBLIC_SITE_URL production
```

Pegar los mismos valores usados en `.env.local` (Task 3) cuando el CLI los pida.

- [ ] **Step 3: Deploy inicial**

```bash
vercel --global-config "/c/Users/Joos/.vercel-danfer" --prod
```

Expected: deploy exitoso, URL tipo `machupicchucusco-xxxxx.vercel.app` accesible y mostrando el home real.

- [ ] **Step 4: Apuntar el DNS del dominio**

El usuario debe agregar en el panel DNS de su registrador de `machupicchucusco.pe` un registro apuntando a Vercel (típicamente `A @ → 76.76.21.21` o el registro que indique el dashboard de Vercel al agregar el dominio custom al proyecto). Confirmar con el usuario antes de tocar DNS reales — puede haber configuración de email existente que no se debe romper (mismo cuidado que se tuvo con boletomachupicchutours.com).

- [ ] **Step 5: Agregar el dominio custom en Vercel**

Desde el dashboard de Vercel (o `vercel domains add machupicchucusco.pe`), vincular el dominio al proyecto y esperar a que el certificado HTTPS se emita automáticamente.

- [ ] **Step 6: Verificación final**

```bash
curl -sIL https://machupicchucusco.pe
```

Expected: `HTTP/2 200`, certificado válido, y el home real (Task 6) visible en el navegador.

---

## Verificación final de la fase

- [ ] `npm run build` limpio desde cero
- [ ] `grep -rli "danfer\|boleto" src/ public/ scripts/` sin resultados
- [ ] Home visible en `https://machupicchucusco.pe` con paleta propia, 4 tours reales, sin testimonios
- [ ] Repo git propio, sin relación con cuscotours-v2 (`git remote -v` vacío hasta que el usuario decida crear uno)
- [ ] Supabase y Vercel completamente separados de Danfer/boleto
