# boletomachupicchutours.com — Fase 1: Infraestructura — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar un sitio esqueleto de boletomachupicchutours.com funcionando en producción — fork limpio de la arquitectura de cuscotours-v2, sin ninguna referencia a Danfer, con Supabase/Vercel propios, admin funcional, y bloqueado a indexación hasta que Fase 3 (contenido real) esté lista.

**Architecture:** Proyecto Next.js 16 independiente en `C:\xampp\htdocs\boletomachupicchutours`, con su propio repo git, copiado del árbol `src/` de cuscotours-v2 y limpiado de branding Danfer vía un script de reemplazo mecánico. Supabase propio (mismo esquema estructural, sin datos de Danfer). Deploy a un proyecto Vercel propio.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (`@supabase/ssr`), next-intl (ES/EN), Tiptap (editor blog admin).

## Global Constraints

- Next.js 16 en este repo tiene cambios breaking respecto a la versión estándar — antes de escribir código Next-específico revisar `node_modules/next/dist/docs/` (regla heredada de `AGENTS.md` de cuscotours-v2, copiado también al proyecto nuevo).
- Nombre de marca placeholder exacto en todo el código: `Boleto Machu Picchu Tours`. Ninguna referencia a "Danfer" puede quedar en el código nuevo (verificado por grep).
- Teléfono/WhatsApp: dejar el placeholder ya reconocido por el código, `+51 984 123 456` / `+51984123456`, sin inventar un número nuevo — `publicPhone()` en `settings.ts` ya lo omite automáticamente del JSON-LD.
- Dirección: sin calle inventada — usar solo `Cusco, Perú` hasta que Fase 2 confirme una dirección real y distinta a la de Danfer (evita colisión de NAP).
- El sitio completo debe estar `noindex, nofollow` + `robots.txt` disallow-all hasta que Fase 5 lo revierta explícitamente.
- Todo debe vivir en infraestructura separada de Danfer: repo git propio, proyecto Supabase propio, proyecto Vercel propio. Nada compartido.

---

### Task 1: Scaffold del proyecto nuevo

**Files:**
- Create: `C:\xampp\htdocs\boletomachupicchutours\` (árbol completo copiado)
- Modify: `package.json` (campo `name`), `.env.example` (URL por defecto)

- [ ] **Step 1: Copiar el árbol de archivos base**

```bash
mkdir -p /c/xampp/htdocs/boletomachupicchutours
cd /c/xampp/htdocs/boletomachupicchutours
cp -r /c/xampp/htdocs/cuscotours-v2/src .
cp -r /c/xampp/htdocs/cuscotours-v2/public .
rm -f public/google92bfd6c2e8f3881d.html
mkdir -p scripts supabase/migrations
cp /c/xampp/htdocs/cuscotours-v2/scripts/*.mjs scripts/
cp /c/xampp/htdocs/cuscotours-v2/package.json \
   /c/xampp/htdocs/cuscotours-v2/tsconfig.json \
   /c/xampp/htdocs/cuscotours-v2/next.config.ts \
   /c/xampp/htdocs/cuscotours-v2/postcss.config.mjs \
   /c/xampp/htdocs/cuscotours-v2/eslint.config.mjs \
   /c/xampp/htdocs/cuscotours-v2/.env.example \
   /c/xampp/htdocs/cuscotours-v2/.gitignore \
   /c/xampp/htdocs/cuscotours-v2/AGENTS.md \
   /c/xampp/htdocs/cuscotours-v2/CLAUDE.md \
   .
```

Expected: `ls` en `boletomachupicchutours` muestra `src public scripts supabase package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .env.example .gitignore AGENTS.md CLAUDE.md`.

Nota: `cp scripts/*.mjs` copia solo los `.mjs` sueltos de nivel superior (herramientas genéricas: `translate-apply.mjs`, `list-admins.mjs`, etc.) — la subcarpeta `scripts/en/` (traducciones de blog de Danfer) NO se copia porque el glob no recorre subdirectorios.

- [ ] **Step 2: Renombrar el paquete**

Editar `package.json` línea 2:

```json
  "name": "boletomachupicchutours",
```

- [ ] **Step 3: Actualizar la URL por defecto**

Editar `.env.example`, línea `NEXT_PUBLIC_SITE_URL`:

```
NEXT_PUBLIC_SITE_URL=https://boletomachupicchutours.com
```

- [ ] **Step 4: Instalar dependencias**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm install
```

Expected: termina sin errores fatales; se crean `node_modules/` y `package-lock.json` propios.

- [ ] **Step 5: Verificar que el dev server levanta**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

Expected: consola muestra `Ready` sin errores de build. Abrir `http://localhost:3000/es` en el navegador y confirmar que carga sin overlay de error de Next.js (el contenido todavía dirá "Danfer" — se corrige en el Task 3). Detener el server (Ctrl+C) al confirmar.

- [ ] **Step 6: Commit inicial**

```bash
cd /c/xampp/htdocs/boletomachupicchutours
git init
git add -A
git commit -m "chore: scaffold inicial copiado de cuscotours-v2 (fase 1 infra)"
```

---

### Task 2: Bloqueo de indexación (noindex temporal)

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/app/layout.tsx:72-82`

- [ ] **Step 1: Bloquear robots.txt**

En `src/app/robots.ts`, reemplazar el bloque `rules`:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    // FASE 1-4: sitio en construcción, sin contenido real todavía.
    // Revertir a "allow: /" recién en Fase 5 (lanzamiento).
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`, `${SITE}/sitemap-images.xml`],
  };
}
```

- [ ] **Step 2: Bloquear meta robots**

En `src/app/layout.tsx`, reemplazar el bloque `robots` (líneas 72-82):

```ts
  robots: {
    // FASE 1-4: sitio en construcción. Revertir a true/true en Fase 5.
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
```

- [ ] **Step 3: Verificar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

En otra terminal:

```bash
curl -s http://localhost:3000/robots.txt
```

Expected: la respuesta contiene `Disallow: /`. Detener el server.

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts src/app/layout.tsx
git commit -m "feat(seo): noindex temporal mientras no hay contenido real (fase 1-4)"
```

---

### Task 3: Rebrand mecánico (Danfer → placeholder)

**Files:**
- Create (temporal): `rebrand.mjs` (raíz del proyecto, se borra al final del task)
- Modify: todo archivo bajo `src/` que contenga "danfer" (case-insensitive) — la lista exacta la produce el script, no se enumera a mano.

**Depende de:** Task 1 (necesita el árbol `src/` ya copiado).

- [ ] **Step 1: Confirmar el problema (baseline)**

```bash
cd /c/xampp/htdocs/boletomachupicchutours
grep -ril "danfer" src | wc -l
```

Expected: un número mayor a 0 (confirma que el branding de Danfer sigue presente tras la copia).

- [ ] **Step 2: Crear el script de reemplazo**

Crear `rebrand.mjs` en la raíz del proyecto:

```js
// rebrand.mjs — reemplazo mecánico de branding Danfer → placeholder
// "Boleto Machu Picchu Tours". Correr UNA vez sobre src/, luego borrar.
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".md", ".json"]);

// Orden importa: patrones más largos/específicos primero, catch-alls al final.
const REPLACEMENTS = [
  ["Danfer Tours Cusco S.A.C.", "Boleto Machu Picchu Tours"],
  ["https://www.tiktok.com/@danfertourscusco", "#"],
  ["https://www.facebook.com/danfertourscusco", "#"],
  ["https://www.instagram.com/danfertourscusco", "#"],
  ["Danfer Tours Cusco", "Boleto Machu Picchu Tours"],
  ["Danfer Tours", "Boleto Machu Picchu Tours"],
  ["DANFER", "BOLETO MP"],
  ["Danfer", "Boleto Machu Picchu Tours"],
  ["danfertourscusco.com", "boletomachupicchutours.com"],
  ["@danfertourscusco", ""],
  ["danfertourscusco", "boletomachupicchutours"],
  ["danfer", "boletomachupicchutours"],
  ["Av. El Sol 314, Cusco, Perú", "Cusco, Perú"],
  ["Av. El Sol 314, Cusco, Peru", "Cusco, Peru"],
];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const info = statSync(full);
    if (info.isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(extname(full))) {
      let content = readFileSync(full, "utf8");
      let changed = false;
      for (const [from, to] of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        writeFileSync(full, content, "utf8");
        console.log("rebranded:", full);
      }
    }
  }
}

walk(ROOT);
console.log("Listo.");
```

- [ ] **Step 3: Ejecutar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && node rebrand.mjs
```

Expected: una línea `rebranded: src/...` por cada archivo tocado (alrededor de 36), termina con `Listo.`.

- [ ] **Step 4: Verificar que no queda ninguna referencia**

```bash
grep -ril "danfer" src | wc -l
```

Expected: `0`. Si no es 0, abrir los archivos listados por `grep -ril "danfer" src` y revisar manualmente por qué no coincidió con ninguna regla del script (ej. variante de mayúsculas no contemplada) antes de continuar.

- [ ] **Step 5: Revisión manual rápida de los archivos más sensibles**

```bash
grep -n "Boleto Machu Picchu Tours" src/app/layout.tsx
grep -n "Boleto Machu Picchu Tours" src/app/[locale]/\(public\)/terminos/page.tsx
grep -n "Cusco, Perú" src/lib/queries/settings.ts
```

Expected: cada comando devuelve al menos una línea, confirmando que el título del sitio, el texto legal de términos y la dirección placeholder quedaron coherentes (no cortados a la mitad de una oración).

- [ ] **Step 6: Borrar el script temporal y commitear**

```bash
rm rebrand.mjs
git add -A
git commit -m "refactor(brand): rebrand placeholder Danfer -> Boleto Machu Picchu Tours"
```

---

### Task 4: Migraciones SQL de Fase 1

**Files:**
- Create: `supabase/migrations/00001_initial_schema.sql` (copia)
- Create: `supabase/migrations/00002_rls_policies.sql` (copia)
- Create: `supabase/migrations/00003_faqs_coords_blog.sql` (copia de `00006_faqs_coords_blog.sql` original)
- Create: `supabase/migrations/00004_admin_signup_bootstrap.sql` (copia de `00011_admin_signup_bootstrap.sql` original)
- Create: `supabase/migrations/00005_categories_and_settings_seed.sql` (nuevo, placeholder)
- Create: `supabase/migrations/00006_promote_admin.sql` (copia de `00004_promote_admin.sql` original)

No se portan las migraciones `00003_seed` (tours reales de Danfer), `00005_brand_danfer`, `00007`–`00010`, `00012`–`00015` (contenido/blog/reseñas específicos de Danfer) — quedan para Fase 3/4 con contenido reescrito propio.

- [ ] **Step 1: Copiar las migraciones estructurales**

```bash
cd /c/xampp/htdocs/boletomachupicchutours/supabase/migrations
cp /c/xampp/htdocs/cuscotours-v2/supabase/migrations/00001_initial_schema.sql 00001_initial_schema.sql
cp /c/xampp/htdocs/cuscotours-v2/supabase/migrations/00002_rls_policies.sql 00002_rls_policies.sql
cp /c/xampp/htdocs/cuscotours-v2/supabase/migrations/00006_faqs_coords_blog.sql 00003_faqs_coords_blog.sql
cp /c/xampp/htdocs/cuscotours-v2/supabase/migrations/00011_admin_signup_bootstrap.sql 00004_admin_signup_bootstrap.sql
cp /c/xampp/htdocs/cuscotours-v2/supabase/migrations/00004_promote_admin.sql 00006_promote_admin.sql
```

- [ ] **Step 2: Crear la migración de categorías + settings placeholder**

Crear `supabase/migrations/00005_categories_and_settings_seed.sql`:

```sql
-- =====================================================
-- Boleto Machu Picchu Tours — Categorías + Settings placeholder
-- FASE 1: los valores de marca son PLACEHOLDER. Fase 2 los
-- reemplaza con la identidad de marca real (contacto, redes,
-- dirección, tagline definitivos).
-- =====================================================

insert into public.categories (slug, name, description, cover_image, sort_order) values
('machu-picchu', '{"es":"Machu Picchu","en":"Machu Picchu"}',
  '{"es":"La maravilla del mundo","en":"World wonder"}',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200&auto=format&fit=crop', 1),
('valle-sagrado', '{"es":"Valle Sagrado","en":"Sacred Valley"}',
  '{"es":"Pueblos andinos y ruinas","en":"Andean towns and ruins"}',
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop', 2),
('camino-inca', '{"es":"Camino Inca","en":"Inca Trail"}',
  '{"es":"Trekking ancestral","en":"Ancestral trekking"}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1200&auto=format&fit=crop', 3),
('aventura', '{"es":"Aventura","en":"Adventure"}',
  '{"es":"Rainbow Mountain, Humantay, Ausangate","en":"Rainbow Mountain, Humantay, Ausangate"}',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1200&auto=format&fit=crop', 4);

insert into public.settings (key, value) values
('site_name',    '"Boleto Machu Picchu Tours"'::jsonb),
('site_tagline', '{"es":"Tu boleto y tour a Machu Picchu, sin complicaciones","en":"Your Machu Picchu ticket and tour, made simple"}'::jsonb),
('contact_email','"hola@boletomachupicchutours.com"'::jsonb),
('contact_phone','"+51 984 123 456"'::jsonb),
('whatsapp',     '"+51984123456"'::jsonb),
('social',       '{"instagram":"","facebook":"","tiktok":""}'::jsonb);

select 'Categorías y settings placeholder cargados' as status;
```

Nota: `contact_phone`/`whatsapp` usan intencionalmente los mismos dígitos placeholder que ya reconoce `publicPhone()` en `settings.ts` (`51984123456`) — el código los omite automáticamente del JSON-LD por ser falsos. No inventar un número distinto aquí.

- [ ] **Step 3: Verificar**

```bash
ls /c/xampp/htdocs/boletomachupicchutours/supabase/migrations
```

Expected: exactamente 6 archivos, `00001` a `00006`.

- [ ] **Step 4: Commit**

```bash
cd /c/xampp/htdocs/boletomachupicchutours
git add supabase/migrations
git commit -m "feat(db): migraciones fase 1 (schema, RLS, blog/FAQs, admin bootstrap, seed placeholder)"
```

---

### Task 5: Proyecto Supabase y variables de entorno

**Files:**
- Create: `.env.local` (no se commitea — ya está en `.gitignore`)

**Depende de:** el usuario debe haber creado el proyecto Supabase nuevo (acordado en el diseño: "aún no existe, hay que crearlo").

- [ ] **Step 1: Pedir las credenciales al usuario**

Preguntar por, del dashboard de Supabase del proyecto nuevo (Settings → API):
- Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
- `anon` public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`)

- [ ] **Step 2: Crear `.env.local`**

```
NEXT_PUBLIC_SUPABASE_URL=<url del proyecto>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
NEXT_PUBLIC_SITE_URL=https://boletomachupicchutours.com
```

- [ ] **Step 3: Verificar que no se commitea**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && git status
```

Expected: `.env.local` NO aparece en la lista (confirma que `.gitignore` copiado del Task 1 ya lo excluye).

---

### Task 6: Aplicar migraciones al Supabase nuevo

**Depende de:** Task 4 (archivos SQL) y Task 5 (proyecto Supabase creado).

- [ ] **Step 1: Ejecutar cada migración en orden**

En el dashboard de Supabase del proyecto nuevo → SQL Editor → New Query: pegar y ejecutar, en este orden exacto, el contenido completo de cada archivo:

1. `00001_initial_schema.sql`
2. `00002_rls_policies.sql`
3. `00003_faqs_coords_blog.sql`
4. `00004_admin_signup_bootstrap.sql`
5. `00005_categories_and_settings_seed.sql`
6. `00006_promote_admin.sql` — **NO ejecutar todavía**: tiene un placeholder de email que se completa recién en el Task 7, después de registrar el primer usuario.

- [ ] **Step 2: Verificar el esquema**

En el SQL Editor:

```sql
select key, value from public.settings order by key;
select slug, name from public.categories order by sort_order;
select count(*) from public.tours;
```

Expected: `settings` devuelve 6 filas con `site_name = "Boleto Machu Picchu Tours"`; `categories` devuelve 4 filas; `tours` devuelve `0`.

---

### Task 7: Verificación end-to-end local

**Depende de:** Tasks 1-6 completos.

- [ ] **Step 1: Levantar el dev server**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

- [ ] **Step 2: Verificar home ES/EN**

Abrir `http://localhost:3000/es` y `http://localhost:3000/en`. Expected: ambas cargan sin error, el título de la pestaña y el navbar dicen "Boleto Machu Picchu Tours" (no "Danfer").

- [ ] **Step 3: Registrar el primer admin**

Ir a `http://localhost:3000/admin/login`, usar el formulario de registro con el email real del usuario. Expected: tras registrarse, entra directo al panel admin (el trigger de `00004_admin_signup_bootstrap.sql` lo marca `is_admin = true` por ser el primer usuario).

Verificar en Supabase SQL Editor:

```sql
select p.id, u.email, p.is_admin
from public.profiles p join auth.users u on u.id = p.id;
```

Expected: una fila, `is_admin = true`.

- [ ] **Step 4: Smoke test de CRUD de tours**

Desde `/admin/tours/new`, crear un tour de prueba (título "Test", cualquier categoría, precio 1). Guardar.

Verificar:

```sql
select slug, title from public.tours;
```

Expected: una fila con el tour de prueba.

Borrar el tour desde el admin. Verificar:

```sql
select count(*) from public.tours;
```

Expected: `0`.

- [ ] **Step 5: Detener el server**

```bash
# Ctrl+C en la terminal del dev server
```

---

### Task 8: Deploy a producción

**Depende de:** Tasks 1-7 completos y verificados. El dominio `boletomachupicchutours.com` ya está registrado por el usuario (confirmado en el diseño).

**Esta tarea toca infraestructura de producción real (Vercel, DNS) — confirmar con el usuario antes de ejecutar cada paso, no asumir autorización previa.**

- [ ] **Step 1: Crear el proyecto en Vercel**

Confirmar con el usuario si prefiere conectarlo vía GitHub (requiere subir el repo a un remoto nuevo, no relacionado al de Danfer) o vía `vercel` CLI directo desde la carpeta local. Ninguna de las dos require que el repo actual tenga remoto — se puede hacer `vercel --prod` desde la carpeta sin GitHub.

- [ ] **Step 2: Configurar variables de entorno en Vercel**

Copiar las mismas 4 variables de `.env.local` (Task 5) al proyecto de Vercel (Settings → Environment Variables), con `NEXT_PUBLIC_SITE_URL=https://boletomachupicchutours.com`.

- [ ] **Step 3: Deploy**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && vercel --prod
```

Expected: build exitoso, URL `*.vercel.app` funcionando.

- [ ] **Step 4: Conectar el dominio**

En Vercel → Domains, agregar `boletomachupicchutours.com`. Seguir las instrucciones de DNS que muestra Vercel (registros A/CNAME) y configurarlos en el registrador donde el usuario compró el dominio.

- [ ] **Step 5: Verificar en producción**

```bash
curl -sI https://boletomachupicchutours.com | head -5
curl -s https://boletomachupicchutours.com/robots.txt
```

Expected: `HTTP/2 200`, certificado HTTPS válido (sin warning del navegador), y `robots.txt` muestra `Disallow: /` (confirma que el bloqueo de indexación del Task 2 sigue activo en producción).

---

## Self-Review

**Spec coverage:** cada punto del spec de Fase 1 (scaffold, limpieza de Danfer, Supabase propio, deploy) tiene tarea propia (Tasks 1-8). El punto "identidad de marca real" y "contenido de tours" quedan explícitamente fuera (Fases 2-3), consistente con el spec.

**Placeholder scan:** sin TBD/TODO en los pasos. Los únicos valores "placeholder" son datos de marca intencionales (parte del alcance de Fase 1), no huecos del plan.

**Type consistency:** n/a — plan de infraestructura, no hay funciones/tipos compartidos entre tasks más allá de rutas de archivo, que son consistentes en todo el documento (`src/app/robots.ts`, `src/app/layout.tsx`, `src/lib/queries/settings.ts`, numeración `00001`-`00006` de migraciones).
