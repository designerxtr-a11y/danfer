# Paleta de boletomachupicchutours.com alineada al logo — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recolorear boletomachupicchutours.com para que use los colores reales del logo (navy `#01173E` + naranja `#FD4707`) en vez de la paleta turquesa/dorado actual, sin tocar estructura, copy ni componentes.

**Architecture:** Repintado casi total del sitio se logra cambiando **valores** de los tokens Tailwind `@theme` en `src/app/globals.css` (los nombres `night`/`turquoise`/`turquoise-deep` se conservan; ~1.100 clases del código ya usan esos nombres y se repintan solas). Encima de eso, un puñado de ediciones manuales acotadas: el wordmark de respaldo del logo, los 5 botones "Reservar" que pasan de azul a naranja, checkboxes de admin, y varias superficies con color hardcodeado fuera de Tailwind (favicons, imágenes Open Graph, dos sombras con `rgba()` literal) que el cambio de tokens no alcanza.

**Tech Stack:** Next.js 16.2.6 (App Router, convenciones de metadata: `icon.tsx`/`apple-icon.tsx`/`manifest.ts`/`opengraph-image.tsx` vía `next/og`), Tailwind CSS v4 (`@theme` en CSS, sin `tailwind.config`), React 19, TypeScript.

**Repo de trabajo:** `C:\xampp\htdocs\boletomachupicchutours` (todas las rutas de este plan son relativas a ese repo, no a `cuscotours-v2` donde vive este documento).

## Global Constraints

- No renombrar tokens (`night`, `turquoise`, `turquoise-deep` mantienen su nombre, solo cambia el valor hex).
- No tocar estructura de secciones, copy, ni componentes fuera de las clases/valores de color listados aquí.
- El único botón/link que cambia de azul a naranja es el que dispara una reserva: los 5 usos exactos listados en la Tarea 4. Todo lo demás que hoy es `turquoise` se repinta solo (queda navy) — no se toca a mano.
- Naranja (`flame`) nunca como texto corrido pequeño sobre blanco (falla contraste 3.45:1); solo permitido como relleno de botón (`flame-deep`/`flame` con texto blanco), objeto gráfico/icono, texto grande+bold sobre blanco, texto sobre fondo `night`, o en el wordmark de respaldo (excepción de logotipo ya documentada, ver Tarea 2).
- Cada tarea debe dejar el repo en estado compilable y visualmente consistente (sin referencias colgantes a clases/tokens eliminados) — por eso los tokens `flame`/`flame-deep` se crean y el dorado se elimina en la misma tarea (Tarea 2), no en tareas separadas.
- Spec completo: `docs/superpowers/specs/2026-08-14-boletomachupicchutours-paleta-logo-design.md` (en el repo `cuscotours-v2`).

---

### Task 1: Repintar los tokens base (`night`, `turquoise`, `turquoise-deep`)

**Files:**
- Modify: `src/app/globals.css:4-27` (bloque `@theme`)

**Interfaces:**
- Consumes: ninguno (primera tarea).
- Produces: los tokens `--color-night` (`#01173E`), `--color-night-deep` (`#000C24`), `--color-turquoise` (`#123E8C`), `--color-turquoise-deep` (`#071F52`), `--color-foreground` (`#01173E`), `--color-border` (`rgba(1, 23, 62, 0.1)`), `--shadow-card`/`--shadow-soft` (mismo `rgba(1, 23, 62, ·)`). Todas las tareas siguientes y el resto del código (~1.100 usos de `bg-night`/`text-turquoise`/etc.) dependen de estos valores nuevos.

- [ ] **Step 1: Confirmar los valores viejos antes de editar**

Run: `grep -n "color-night\|color-turquoise\|color-foreground\|color-border\|shadow-card\|shadow-soft" src/app/globals.css`

Expected (estado actual, antes de este task):
```
6:  --color-night: #0B1929;
7:  --color-night-deep: #060F1C;
8:  --color-turquoise: #0077B6;
9:  --color-turquoise-deep: #023E8A;
19:  --color-foreground: #0B1929;
21:  --color-border: rgba(11, 25, 41, 0.1);
25:  --shadow-card: 0 30px 60px -25px rgba(11, 25, 41, 0.25);
26:  --shadow-soft: 0 10px 30px -10px rgba(11, 25, 41, 0.1);
```

- [ ] **Step 2: Editar el bloque `@theme`**

Reemplazar el bloque completo (líneas 4-27 de `src/app/globals.css`):

```css
@theme {
  /* Cusco brand palette */
  --color-night: #0B1929;
  --color-night-deep: #060F1C;
  --color-turquoise: #0077B6;
  --color-turquoise-deep: #023E8A;
  --color-cream: #FAF7F2;
  --color-paper: #FFFFFF;
  --color-stone: #F5F3EE;

  /* Único uso restante del dorado: el wordmark del logo (.text-gradient-gold). */
  --color-gold: #C8901E;
  --color-gold-bright: #E8B043;

  --color-background: #FFFFFF;
  --color-foreground: #0B1929;
  --color-muted: #6B7280;
  --color-border: rgba(11, 25, 41, 0.1);

  --font-body: var(--font-inter);

  --shadow-card: 0 30px 60px -25px rgba(11, 25, 41, 0.25);
  --shadow-soft: 0 10px 30px -10px rgba(11, 25, 41, 0.1);
}
```

por:

```css
@theme {
  /* Boleto Machu Picchu Tours brand palette — alineada al logo real */
  --color-night: #01173E;
  --color-night-deep: #000C24;
  --color-turquoise: #123E8C;
  --color-turquoise-deep: #071F52;
  --color-cream: #FAF7F2;
  --color-paper: #FFFFFF;
  --color-stone: #F5F3EE;

  /* Único uso restante del dorado: el wordmark del logo (.text-gradient-gold). */
  --color-gold: #C8901E;
  --color-gold-bright: #E8B043;

  --color-background: #FFFFFF;
  --color-foreground: #01173E;
  --color-muted: #6B7280;
  --color-border: rgba(1, 23, 62, 0.1);

  --font-body: var(--font-inter);

  --shadow-card: 0 30px 60px -25px rgba(1, 23, 62, 0.25);
  --shadow-soft: 0 10px 30px -10px rgba(1, 23, 62, 0.1);
}
```

(El bloque `--color-gold`/`--color-gold-bright` se deja intacto aquí a propósito — se elimina en la Tarea 2, junto con sus últimos usos, para que el repo nunca quede con una clase apuntando a un token borrado.)

- [ ] **Step 3: Verificar el cambio**

Run: `grep -n "color-night\|color-turquoise\|color-foreground\|color-border\|shadow-card\|shadow-soft" src/app/globals.css`

Expected:
```
6:  --color-night: #01173E;
7:  --color-night-deep: #000C24;
8:  --color-turquoise: #123E8C;
9:  --color-turquoise-deep: #071F52;
19:  --color-foreground: #01173E;
21:  --color-border: rgba(1, 23, 62, 0.1);
25:  --shadow-card: 0 30px 60px -25px rgba(1, 23, 62, 0.25);
26:  --shadow-soft: 0 10px 30px -10px rgba(1, 23, 62, 0.1);
```

- [ ] **Step 4: Levantar el dev server y confirmar visualmente**

Run: `npm run dev` (dejarlo corriendo), abrir `http://localhost:3000/es` en el navegador.
Expected: el hero, navbar, footer y botones que antes eran azul medio ahora se ven azul marino oscuro. Nada debe verse roto (sin texto invisible, sin fondos negros sólidos inesperados). Cerrar el dev server (Ctrl+C) al terminar de mirar.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): recolorear tokens base a navy del logo (night/turquoise)"
```

---

### Task 2: Wordmark de respaldo a navy/naranja + eliminar el dorado

**Files:**
- Modify: `src/app/globals.css` (agregar tokens `flame`/`flame-deep`, eliminar `gold`/`gold-bright` y `.text-gradient-gold`, actualizar `::selection` y hover de scrollbar)
- Modify: `src/components/layout/navbar.tsx:152`, `src/components/layout/navbar.tsx:341`
- Modify: `src/components/layout/footer.tsx:117`
- Modify: `src/app/admin/login/page.tsx:15`
- Modify: `src/app/admin/_components/sidebar.tsx:55`

**Interfaces:**
- Consumes: ninguno (los tokens `night`/`turquoise` de la Tarea 1 no participan aquí).
- Produces: tokens `--color-flame` (`#FD4707`) y `--color-flame-deep` (`#D93A05`), consumidos por las Tareas 3 y 4. Clase `.text-gradient-gold` y tokens `--color-gold`/`--color-gold-bright` dejan de existir — ninguna tarea posterior debe referenciarlos.

- [ ] **Step 1: Agregar los tokens `flame`/`flame-deep` y quitar el dorado en `globals.css`**

En el bloque `@theme` (ya editado en la Tarea 1), reemplazar:

```css
  /* Único uso restante del dorado: el wordmark del logo (.text-gradient-gold). */
  --color-gold: #C8901E;
  --color-gold-bright: #E8B043;
```

por:

```css
  --color-flame: #FD4707;
  --color-flame-deep: #D93A05;
```

- [ ] **Step 2: Actualizar `::selection` y el hover del scrollbar**

Reemplazar:

```css
::selection {
  background: var(--color-gold);
  color: #fff;
}
```

por:

```css
::selection {
  background: var(--color-flame);
  color: #fff;
}
```

Y reemplazar:

```css
::-webkit-scrollbar-thumb:hover { background: var(--color-gold); }
```

por:

```css
::-webkit-scrollbar-thumb:hover { background: var(--color-flame); }
```

- [ ] **Step 3: Eliminar la clase `.text-gradient-gold`**

Borrar por completo este bloque de `src/app/globals.css` (ya no se usa ninguna variante degradada — el logo real usa color sólido):

```css
/* Utility: gradient gold text */
.text-gradient-gold {
  background: linear-gradient(135deg, #C8901E 0%, #E8B043 50%, #C25A3E 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

- [ ] **Step 4: Verificar que no queda ningún rastro de dorado en `globals.css`**

Run: `grep -n "gold" src/app/globals.css`
Expected: sin salida (ningún resultado).

- [ ] **Step 5: Reemplazar el wordmark en los 5 archivos**

En cada uno de estos archivos, cambiar `className="text-gradient-gold"` por `className="text-flame"` en el `<span>BOLETO MP</span>`:

`src/components/layout/navbar.tsx:152`
```tsx
              <span className="text-gradient-gold">BOLETO MP</span>
```
→
```tsx
              <span className="text-flame">BOLETO MP</span>
```

`src/components/layout/navbar.tsx:341`
```tsx
                    <span className="text-gradient-gold">BOLETO MP</span>
```
→
```tsx
                    <span className="text-flame">BOLETO MP</span>
```

`src/components/layout/footer.tsx:117`
```tsx
              <span className="text-gradient-gold">BOLETO MP</span>
```
→
```tsx
              <span className="text-flame">BOLETO MP</span>
```

`src/app/admin/login/page.tsx:15`
```tsx
            <span className="text-gradient-gold">BOLETO MP</span>
```
→
```tsx
            <span className="text-flame">BOLETO MP</span>
```

`src/app/admin/_components/sidebar.tsx:55`
```tsx
          <span className="text-gradient-gold">BOLETO MP</span>
```
→
```tsx
          <span className="text-flame">BOLETO MP</span>
```

- [ ] **Step 6: Verificar que no queda ningún uso de `text-gradient-gold` ni de tokens dorados en `src/`**

Run: `grep -rn "text-gradient-gold\|color-gold\b" src`
Expected: sin salida.

- [ ] **Step 7: Ver el resultado en el navbar (sin logo subido)**

Esto solo es visible si `logoUrl` está vacío en `/admin/settings` — hoy el sitio tiene un logo subido, así que este fallback no se ve en producción. Verificación rápida igual: `npm run dev`, abrir `http://localhost:3000/admin/login` (esa página no depende de `logoUrl`, siempre usa el wordmark de texto).
Expected: "BOLETO MP" se ve en naranja sólido (no degradado), "TOURS" en navy. Cerrar el dev server al terminar.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/components/layout/navbar.tsx src/components/layout/footer.tsx src/app/admin/login/page.tsx src/app/admin/_components/sidebar.tsx
git commit -m "feat(theme): wordmark de respaldo a naranja solido, eliminar tokens dorados"
```

---

### Task 3: Checkboxes/sliders de admin — `accent-gold` a `accent-flame`

**Files:**
- Modify: `src/app/admin/blog/post-form.tsx:304`
- Modify: `src/app/admin/import/import-client.tsx:311`
- Modify: `src/app/admin/tours/_tour-form.tsx:643`
- Modify: `src/app/[locale]/(public)/tours/page.client.tsx:188`

**Interfaces:**
- Consumes: token `--color-flame` (Tarea 2).

- [ ] **Step 1: Confirmar los 4 usos actuales**

Run: `grep -rn "accent-gold" src`
Expected:
```
src/app/admin/blog/post-form.tsx:304:              className="w-5 h-5 rounded accent-gold"
src/app/admin/import/import-client.tsx:311:                  className="w-4 h-4 accent-gold"
src/app/admin/tours/_tour-form.tsx:643:        className="w-4 h-4 accent-gold"
src/app/[locale]/(public)/tours/page.client.tsx:188:                  className="w-full accent-gold"
```

- [ ] **Step 2: Reemplazar cada uno**

`src/app/admin/blog/post-form.tsx:304`
```tsx
              className="w-5 h-5 rounded accent-gold"
```
→
```tsx
              className="w-5 h-5 rounded accent-flame"
```

`src/app/admin/import/import-client.tsx:311`
```tsx
                  className="w-4 h-4 accent-gold"
```
→
```tsx
                  className="w-4 h-4 accent-flame"
```

`src/app/admin/tours/_tour-form.tsx:643`
```tsx
        className="w-4 h-4 accent-gold"
```
→
```tsx
        className="w-4 h-4 accent-flame"
```

`src/app/[locale]/(public)/tours/page.client.tsx:188`
```tsx
                  className="w-full accent-gold"
```
→
```tsx
                  className="w-full accent-flame"
```

- [ ] **Step 3: Verificar**

Run: `grep -rn "accent-gold" src`
Expected: sin salida.

Run: `grep -rn "accent-flame" src`
Expected: los mismos 4 archivos/líneas de arriba, con `accent-flame`.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/blog/post-form.tsx src/app/admin/import/import-client.tsx src/app/admin/tours/_tour-form.tsx "src/app/[locale]/(public)/tours/page.client.tsx"
git commit -m "feat(admin): accent-gold a accent-flame en checkboxes y slider"
```

---

### Task 4: Botones "Reservar" a naranja

**Files:**
- Modify: `src/components/layout/navbar.tsx:292`, `src/components/layout/navbar.tsx:446`
- Modify: `src/components/tours/booking-widget.tsx:229`, `src/components/tours/booking-widget.tsx:298`
- Modify: `src/app/[locale]/(public)/reservar/[slug]/checkout-form.tsx:261`

**Interfaces:**
- Consumes: tokens `--color-flame`/`--color-flame-deep` (Tarea 2).
- Produces: ninguno consumido por tareas posteriores — esta es la única tarea que toca estos 5 botones.

Regla (spec, sección "Reglas de uso del naranja"): el patrón es `bg-flame-deep` + `hover:bg-flame` + texto blanco, igual estructura que el `bg-turquoise`/`hover:bg-turquoise-deep` que reemplaza — mismo criterio en los 4 botones que ya usaban hover explícito. El CTA del menú móvil (`navbar.tsx:446`) usa `hover:opacity-90` en vez de un hover de color — se deja ese patrón intacto, solo cambia el color base, para no alterar comportamiento no pedido.

- [ ] **Step 1: Confirmar los 5 usos actuales**

Run: `grep -n "bg-turquoise " src/components/layout/navbar.tsx src/components/tours/booking-widget.tsx "src/app/[locale]/(public)/reservar/[slug]/checkout-form.tsx"`

Expected (entre otros usos de `bg-turquoise/NN` con slash que no aplican aquí):
```
src/components/layout/navbar.tsx:292:            className="hidden lg:inline-flex items-center whitespace-nowrap rounded-full bg-turquoise px-5 py-2 text-white text-sm font-semibold hover:bg-turquoise-deep hover:shadow-soft transition"
src/components/layout/navbar.tsx:446:                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold hover:opacity-90 transition"
src/components/tours/booking-widget.tsx:229:          className="mt-4 w-full group flex items-center justify-center gap-2 rounded-full bg-turquoise hover:bg-turquoise-deep text-white font-semibold py-4 transition hover:shadow-soft"
src/components/tours/booking-widget.tsx:298:            className="w-full flex items-center justify-center gap-2 rounded-full bg-turquoise hover:bg-turquoise-deep text-white font-semibold py-4 transition disabled:opacity-60"
src/app/[locale]/(public)/reservar/[slug]/checkout-form.tsx:261:              className="flex items-center gap-2 bg-turquoise hover:bg-turquoise-deep text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
```

- [ ] **Step 2: `navbar.tsx` — CTA desktop (línea 292)**

```tsx
            className="hidden lg:inline-flex items-center whitespace-nowrap rounded-full bg-turquoise px-5 py-2 text-white text-sm font-semibold hover:bg-turquoise-deep hover:shadow-soft transition"
```
→
```tsx
            className="hidden lg:inline-flex items-center whitespace-nowrap rounded-full bg-flame-deep px-5 py-2 text-white text-sm font-semibold hover:bg-flame hover:shadow-soft transition"
```

- [ ] **Step 3: `navbar.tsx` — CTA menú mobile (línea 446)**

```tsx
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold hover:opacity-90 transition"
```
→
```tsx
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-flame-deep px-7 py-3.5 text-white font-semibold hover:opacity-90 transition"
```

- [ ] **Step 4: `booking-widget.tsx` — botón "Reservar ahora" (línea 229)**

```tsx
          className="mt-4 w-full group flex items-center justify-center gap-2 rounded-full bg-turquoise hover:bg-turquoise-deep text-white font-semibold py-4 transition hover:shadow-soft"
```
→
```tsx
          className="mt-4 w-full group flex items-center justify-center gap-2 rounded-full bg-flame-deep hover:bg-flame text-white font-semibold py-4 transition hover:shadow-soft"
```

- [ ] **Step 5: `booking-widget.tsx` — botón "Confirmar · US$X" (línea 298)**

```tsx
            className="w-full flex items-center justify-center gap-2 rounded-full bg-turquoise hover:bg-turquoise-deep text-white font-semibold py-4 transition disabled:opacity-60"
```
→
```tsx
            className="w-full flex items-center justify-center gap-2 rounded-full bg-flame-deep hover:bg-flame text-white font-semibold py-4 transition disabled:opacity-60"
```

- [ ] **Step 6: `checkout-form.tsx` — botón "Enviar solicitud" (línea 261)**

```tsx
              className="flex items-center gap-2 bg-turquoise hover:bg-turquoise-deep text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
```
→
```tsx
              className="flex items-center gap-2 bg-flame-deep hover:bg-flame text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
```

- [ ] **Step 7: Verificar que ningún otro botón de este tipo quedó sin tocar y que los 5 quedaron en flame**

Run: `grep -n "bg-flame-deep" src/components/layout/navbar.tsx src/components/tours/booking-widget.tsx "src/app/[locale]/(public)/reservar/[slug]/checkout-form.tsx"`
Expected: 5 líneas (292, 446, 229, 298, 261 respectivamente), cada una con `bg-flame-deep` en el `className`.

- [ ] **Step 8: Ver el resultado en el navegador**

Run: `npm run dev`, abrir `http://localhost:3000/es` y `http://localhost:3000/es/tours/<un-slug-de-tour>`.
Expected: el botón "Reservar" del navbar (desktop y al abrir el menú mobile) se ve naranja; el botón "Reservar ahora" del widget de reserva en la ficha de tour también. El resto de botones (links de nav, badges, "Volver al sitio", etc.) siguen en navy — no deben verse naranjas. Cerrar el dev server.

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/tours/booking-widget.tsx "src/app/[locale]/(public)/reservar/[slug]/checkout-form.tsx"
git commit -m "feat(cta): boton de reservar a naranja de marca (navbar, widget, checkout)"
```

---

### Task 5: Favicons y `theme_color` del manifest

**Files:**
- Modify: `src/app/icon.tsx:50-51`
- Modify: `src/app/apple-icon.tsx:46-47`
- Modify: `src/app/manifest.ts:12`

**Interfaces:**
- Ninguna — estos archivos usan hex literal en objetos de estilo/config, no tokens Tailwind, así que no dependen de las tareas anteriores.

Nota (fuera de alcance, no se toca en esta tarea): la letra `"D"` que se renderiza en `icon.tsx`/`apple-icon.tsx` es un resto de la marca hermana Danfer — solo se actualiza el color aquí, no el contenido.

- [ ] **Step 1: `icon.tsx` — gradiente de fondo y color de la "D"**

`src/app/icon.tsx:50-51`:
```tsx
          background: "linear-gradient(135deg, #0B1929 0%, #060F1C 100%)",
          color: "#E8B043",
```
→
```tsx
          background: "linear-gradient(135deg, #01173E 0%, #000C24 100%)",
          color: "#FFFFFF",
```

- [ ] **Step 2: `apple-icon.tsx` — mismo cambio**

`src/app/apple-icon.tsx:46-47`:
```tsx
          background: "linear-gradient(135deg, #0B1929 0%, #060F1C 100%)",
          color: "#E8B043",
```
→
```tsx
          background: "linear-gradient(135deg, #01173E 0%, #000C24 100%)",
          color: "#FFFFFF",
```

- [ ] **Step 3: `manifest.ts` — `theme_color`**

`src/app/manifest.ts:12`:
```ts
    theme_color: "#0B1929",
```
→
```ts
    theme_color: "#01173E",
```

- [ ] **Step 4: Verificar que no queda ningún hex viejo en estos 3 archivos**

Run: `grep -n "#0B1929\|#060F1C\|#E8B043" src/app/icon.tsx src/app/apple-icon.tsx src/app/manifest.ts`
Expected: sin salida.

- [ ] **Step 5: Ver el favicon renderizado**

Run: `npm run dev`, abrir `http://localhost:3000/icon` y `http://localhost:3000/apple-icon` directamente en el navegador (Next las sirve como imagen en esas rutas).

Nota: si hay un favicon subido en `/admin/settings` (Identidad visual), estas rutas van a mostrar ese logo real sobre fondo blanco, no la "D" — en ese caso el cambio de este task no se verá hasta que se borre el favicon subido; igual queda correcto para el caso sin subir. Cerrar el dev server al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/app/icon.tsx src/app/apple-icon.tsx src/app/manifest.ts
git commit -m "feat(favicon): recolorear favicon de respaldo y theme_color a navy"
```

---

### Task 6: Imágenes Open Graph (home, blog, tours)

**Files:**
- Modify: `src/app/opengraph-image.tsx:20,29,39,60`
- Modify: `src/app/[locale]/(public)/blog/[slug]/opengraph-image.tsx:39,60,83,113`
- Modify: `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx:58,83,126,137`

**Interfaces:**
- Ninguna — mismo motivo que Tarea 5 (hex/rgba literales en JSX inline styles servidos por `next/og`, no tokens Tailwind).

- [ ] **Step 1: `src/app/opengraph-image.tsx` — gradiente de fondo (línea 20)**

```tsx
          background:
            "linear-gradient(135deg, #0B1929 0%, #060F1C 100%)",
```
→
```tsx
          background:
            "linear-gradient(135deg, #01173E 0%, #000C24 100%)",
```

- [ ] **Step 2: `src/app/opengraph-image.tsx` — glow decorativo (línea 29)**

```tsx
              "radial-gradient(circle at 20% 30%, rgba(200,144,30,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,119,182,0.2), transparent 50%)",
```
→
```tsx
              "radial-gradient(circle at 20% 30%, rgba(253,71,7,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(18,62,140,0.2), transparent 50%)",
```

- [ ] **Step 3: `src/app/opengraph-image.tsx` — texto "BOLETO MP" (línea 39)**

```tsx
              color: "#C8901E",
```
(el que está dentro del bloque `fontSize: 28, fontWeight: 800, letterSpacing: 3` — el primero de los dos `#C8901E` del archivo)
→
```tsx
              color: "#FD4707",
```

- [ ] **Step 4: `src/app/opengraph-image.tsx` — tagline "Descubre el Perú" (línea 60)**

```tsx
              color: "#C8901E",
```
(el segundo `#C8901E`, dentro del bloque `fontSize: 30, fontStyle: "italic"`)
→
```tsx
              color: "#FD4707",
```

- [ ] **Step 5: `src/app/[locale]/(public)/blog/[slug]/opengraph-image.tsx` — fondo base (línea 39)**

```tsx
          background: "#0B1929",
```
→
```tsx
          background: "#01173E",
```

- [ ] **Step 6: mismo archivo — overlay sobre la foto de portada (línea 60)**

```tsx
              "linear-gradient(135deg, rgba(11,25,41,0.88) 0%, rgba(11,25,41,0.45) 100%)",
```
→
```tsx
              "linear-gradient(135deg, rgba(1,23,62,0.88) 0%, rgba(1,23,62,0.45) 100%)",
```

- [ ] **Step 7: mismo archivo — "BOLETO MP" (línea 83) y fecha del post (línea 113)**

```tsx
              <span style={{ color: "#E8B043", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>BOLETO MP</span>
```
→
```tsx
              <span style={{ color: "#FD4707", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>BOLETO MP</span>
```

```tsx
            {date && <span style={{ color: "#E8B043" }}>{date}</span>}
```
→
```tsx
            {date && <span style={{ color: "#FD4707" }}>{date}</span>}
```

- [ ] **Step 8: `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx` — overlay sobre la foto de portada (línea 58)**

```tsx
              "linear-gradient(135deg, rgba(11,25,41,0.85) 0%, rgba(11,25,41,0.4) 100%)",
```
→
```tsx
              "linear-gradient(135deg, rgba(1,23,62,0.85) 0%, rgba(1,23,62,0.4) 100%)",
```

- [ ] **Step 9: mismo archivo — "BOLETO MP" (línea 83)**

```tsx
              <span style={{ color: "#E8B043", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>BOLETO MP</span>
```
→
```tsx
              <span style={{ color: "#FD4707", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>BOLETO MP</span>
```

- [ ] **Step 10: mismo archivo — rating con estrella (línea 126)**

```tsx
              <span style={{ color: "#E8B043" }}>
                ★ {tour.rating.toFixed(1)} ({tour.reviews_count})
              </span>
```
→
```tsx
              <span style={{ color: "#FD4707" }}>
                ★ {tour.rating.toFixed(1)} ({tour.reviews_count})
              </span>
```

- [ ] **Step 11: mismo archivo — precio grande (línea 137)**

```tsx
              <span style={{ fontSize: 60, fontWeight: 800, color: "#E8B043" }}>
                US${price.toFixed(0)}
              </span>
```
→
```tsx
              <span style={{ fontSize: 60, fontWeight: 800, color: "#FD4707" }}>
                US${price.toFixed(0)}
              </span>
```

- [ ] **Step 12: Verificar que no queda ningún hex/rgba viejo en los 3 archivos**

Run: `grep -n "#0B1929\|#060F1C\|#C8901E\|#E8B043\|rgba(11,25,41\|rgba(200,144,30\|rgba(0,119,182" src/app/opengraph-image.tsx "src/app/[locale]/(public)/blog/[slug]/opengraph-image.tsx" "src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx"`
Expected: sin salida.

- [ ] **Step 13: Ver las 3 imágenes OG renderizadas**

Run: `npm run dev`, abrir en el navegador:
- `http://localhost:3000/opengraph-image`
- `http://localhost:3000/es/blog/<un-slug-de-post>/opengraph-image`
- `http://localhost:3000/es/tours/<un-slug-de-tour>/opengraph-image`

Expected: fondo navy oscuro (no azul medio ni negro puro), texto "BOLETO MP"/fecha/rating/precio en naranja, "TOURS" y el resto del texto en blanco, legible. Cerrar el dev server.

- [ ] **Step 14: Commit**

```bash
git add src/app/opengraph-image.tsx "src/app/[locale]/(public)/blog/[slug]/opengraph-image.tsx" "src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx"
git commit -m "feat(seo): recolorear imagenes Open Graph a navy/naranja de marca"
```

---

### Task 7: Sombras `rgba()` hardcodeadas en tarjetas de tours

**Files:**
- Modify: `src/components/sections/destinations.client.tsx:72`
- Modify: `src/components/sections/featured-tours.client.tsx:85`

**Interfaces:**
- Ninguna — valores arbitrarios de Tailwind (`shadow-[...]`), no tokens.

- [ ] **Step 1: `destinations.client.tsx` (línea 72)**

```tsx
              className="lg:col-span-3 relative rounded-3xl overflow-hidden h-[460px] lg:h-[520px] group ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(11,25,41,0.35)] hover:shadow-[0_40px_80px_-25px_rgba(2,62,138,0.45)] transition-shadow duration-500"
```
→
```tsx
              className="lg:col-span-3 relative rounded-3xl overflow-hidden h-[460px] lg:h-[520px] group ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(1,23,62,0.35)] hover:shadow-[0_40px_80px_-25px_rgba(7,31,82,0.45)] transition-shadow duration-500"
```

- [ ] **Step 2: `featured-tours.client.tsx` (línea 85)**

```tsx
        className="block relative aspect-[5/8] rounded-3xl overflow-hidden bg-night-deep ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(11,25,41,0.4)] hover:shadow-[0_40px_80px_-25px_rgba(2,62,138,0.45)] transition-shadow duration-500"
```
→
```tsx
        className="block relative aspect-[5/8] rounded-3xl overflow-hidden bg-night-deep ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(1,23,62,0.4)] hover:shadow-[0_40px_80px_-25px_rgba(7,31,82,0.45)] transition-shadow duration-500"
```

- [ ] **Step 3: Verificar**

Run: `grep -n "rgba(11,25,41\|rgba(2,62,138" src/components/sections/destinations.client.tsx src/components/sections/featured-tours.client.tsx`
Expected: sin salida.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/destinations.client.tsx src/components/sections/featured-tours.client.tsx
git commit -m "fix(shadows): actualizar rgba hardcodeado de sombras a navy nuevo"
```

---

### Task 8: Verificación final integral

**Files:** ninguno (solo lectura/verificación).

**Interfaces:** ninguna.

- [ ] **Step 1: Grep de clases/tokens dorados en todo `src/` (excluye contenido/copy)**

Run: `grep -rn "\-gold\b\|color-gold" src`
Expected: sin salida. (Si aparece algo en `src/lib/destinations-en/rainbow-mountain.ts` con la palabra "gold" como texto en inglés describiendo colores minerales del Vinicunca, eso es contenido legítimo, no un token de diseño — no es un fallo de esta verificación.)

- [ ] **Step 2: Grep de hex/rgba viejos en todo `src/` (excepto `globals.css`, que ya tiene los valores nuevos)**

Run:
```bash
grep -rln "#0B1929\|#060F1C\|#0077B6\|#023E8A\|#C8901E\|#E8B043" src --include=*.tsx --include=*.ts | grep -v globals.css
grep -rlnE "rgba\(\s*(11,\s*25,\s*41|6,\s*15,\s*28|0,\s*119,\s*182|2,\s*62,\s*138|200,\s*144,\s*30|232,\s*176,\s*67)" src --include=*.tsx --include=*.ts --include=*.css | grep -v globals.css
```
Expected: ambos comandos sin salida.

- [ ] **Step 3: Build de producción**

Run: `npm run build`
Expected: build termina sin errores (mismo gate usado en las fases anteriores del sitio).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: sin errores nuevos introducidos por este cambio (los únicos archivos tocados son de estilos/color, no debería haber warnings de tipos ni imports).

- [ ] **Step 5: Checklist visual final con el dev server**

Run: `npm run dev`, recorrer:
- `/es` — navbar (transparente sobre hero + sólido al hacer scroll), botón "Reservar" naranja, footer navy.
- `/es/tours` y una ficha de tour — tarjetas, badges de precio, botón "Reservar ahora" del widget naranja.
- `/es/reservar/<slug>` — flujo de checkout, botón final "Enviar solicitud" naranja.
- `/admin/login` — wordmark navy/naranja.
- `/admin` (logueado) — sidebar, checkboxes de tours/blog/import con acento naranja.
- `/opengraph-image`, `/es/blog/<slug>/opengraph-image`, `/es/tours/<slug>/opengraph-image` — navy + naranja, legible.

Expected: en ningún punto queda un rastro de azul medio (`#0077B6`) ni dorado — todo el navy es oscuro tipo logo, y el naranja aparece solo donde este plan lo puso (botones de reservar, wordmark, iconos/badges puntuales). Cerrar el dev server al terminar.

- [ ] **Step 6: Commit final (si el Step 5 no requirió cambios) o commits correctivos**

Si el checklist visual no encontró nada que corregir, no hay nada que commitear en este task (los commits ya se hicieron en las Tareas 1-7). Si se encontró algo, corregirlo, volver a correr Steps 3-4, y commitear con:

```bash
git add -A
git commit -m "fix(theme): ajuste final tras verificacion visual de paleta navy/naranja"
```

---

### Task 9: Corregir contraste turquoise-sobre-night detectado en el review final

**Contexto (agregado tras el review de todo el branch, no estaba en el spec original):** el spec solo midió contraste de cada color nuevo contra blanco (tabla "Paleta nueva"), nunca turquoise-contra-night entre sí. Al acercar los valores de `night` y `turquoise` en la Tarea 1, el contraste `turquoise` vs `night` cayó de 3.64:1 (ya bajo, pero pasaba AA large-text) a **1.75:1** (ilegible). Esto afecta ~13 usos repartidos en 5 archivos donde `text-turquoise`/`bg-turquoise` aparece sobre un fondo `night`/`night-deep` sólido o casi sólido — el mismo tipo de regresión de contraste que ya ocurrió dos veces antes en este proyecto (Fase 4a, Fase 4b-1), documentada en la memoria del proyecto.

Verificado por cálculo directo:
- `turquoise` (`#123E8C`) vs `night` (`#01173E`): **1.75:1**
- `turquoise` (`#123E8C`) vs `night-deep` (`#000C24`): **1.94:1**
- `flame` (`#FD4707`) vs `night` (`#01173E`): **5.10:1** (pasa AA) — reemplazo correcto para texto turquoise sobre night.
- Blanco vs `turquoise` (`#123E8C`) fill: **10.03:1** (pasa AA) — reemplazo correcto para texto `night` sobre un fill turquoise.

**Files:**
- Modify: `src/components/blog/post-cta.tsx:17,22,34,41`
- Modify: `src/app/[locale]/(public)/tours/[slug]/page.tsx:153,160`
- Modify: `src/app/[locale]/(public)/destinos/[slug]/page.tsx:135,140,376`
- Modify: `src/app/not-found.tsx:31,35`
- Modify: `src/app/admin/blog/import-panel.tsx:73,134`

**Interfaces:**
- Consumes: tokens `--color-flame` (Tarea 2) y los valores repintados de `--color-turquoise`/`--color-night` (Tarea 1).
- Produces: ninguno consumido por tareas posteriores — última tarea del plan.

Dos patrones de arreglo, ambos ya usados en otras partes del código (no se inventa un patrón nuevo):

**Patrón A — texto/ícono `night` sobre un fill `turquoise` (botón o badge, el fill toca directamente al texto, sin importar qué hay detrás):** cambiar `text-night` → `text-white` en el mismo elemento que tiene `bg-turquoise`. No se toca el fill ni el hover del fill.

**Patrón B — texto `turquoise` (o `hover:text-turquoise`) posado sobre un fondo `night`/`night-deep` sólido o con overlay que termina en `night`:** cambiar `text-turquoise` → `text-flame` (y `hover:text-turquoise` → `hover:text-flame`).

- [ ] **Step 1: Confirmar las 13 líneas actuales antes de editar**

Run:
```bash
grep -n "text-night" src/app/admin/blog/import-panel.tsx | grep -n "bg-turquoise"
```
(o simplemente abrir cada archivo en las líneas indicadas abajo — todas fueron confirmadas por lectura directa del archivo, no por búsqueda de patrón, así que el número de línea es la fuente de verdad).

- [ ] **Step 2: Patrón A — 4 sitios, `text-night` → `text-white`**

`src/app/admin/blog/import-panel.tsx:73` (botón "Extrayendo…"/submit del scraper, dentro de una tarjeta `bg-gradient-to-br from-night to-night-deep`):
```tsx
          className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-deep text-night px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 text-sm shrink-0"
```
→
```tsx
          className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-deep text-white px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 text-sm shrink-0"
```

`src/app/admin/blog/import-panel.tsx:134` (botón "Usar este contenido →", misma tarjeta oscura):
```tsx
              className="flex-1 bg-turquoise hover:bg-turquoise-deep text-night px-4 py-2.5 rounded-xl font-semibold transition text-sm"
```
→
```tsx
              className="flex-1 bg-turquoise hover:bg-turquoise-deep text-white px-4 py-2.5 rounded-xl font-semibold transition text-sm"
```

`src/app/[locale]/(public)/destinos/[slug]/page.tsx:376` (badge circular con flecha, tarjeta de destino):
```tsx
          <span className="grid place-items-center w-8 h-8 rounded-full bg-turquoise text-night">
```
→
```tsx
          <span className="grid place-items-center w-8 h-8 rounded-full bg-turquoise text-white">
```

`src/components/blog/post-cta.tsx:34` (botón principal "Ver los tours"/"Browse tours" de la tarjeta CTA del blog, sobre `bg-night`):
```tsx
            className="group inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-night font-semibold text-sm sm:text-base hover:bg-turquoise-deep hover:shadow-soft transition"
```
→
```tsx
            className="group inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold text-sm sm:text-base hover:bg-turquoise-deep hover:shadow-soft transition"
```

- [ ] **Step 3: Patrón B — 9 sitios, `text-turquoise`/`hover:text-turquoise`/`hover:border-turquoise` → `flame`**

`src/components/blog/post-cta.tsx:17` (eyebrow "¿Listo para la aventura?", tarjeta `bg-night`):
```tsx
        <span className="font-semibold text-turquoise text-2xl">
```
→
```tsx
        <span className="font-semibold text-flame text-2xl">
```

`src/components/blog/post-cta.tsx:22` (span "guías locales"/"local guides" dentro del h2 blanco, misma tarjeta):
```tsx
          <span className="text-turquoise">
```
→
```tsx
          <span className="text-flame">
```

`src/components/blog/post-cta.tsx:41` (botón secundario "Escríbenos"/"Ask us anything", borde+texto blanco que en hover pasaba a turquoise — ambos, borde y texto, cambian a flame para que sigan siendo del mismo color entre sí):
```tsx
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-white/85 text-sm sm:text-base hover:border-turquoise hover:text-turquoise transition"
```
→
```tsx
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-white/85 text-sm sm:text-base hover:border-flame hover:text-flame transition"
```

`src/app/[locale]/(public)/tours/[slug]/page.tsx:153` (link "volver a tours" sobre el overlay `from-night/60 via-night/30 to-night` del hero de la ficha de tour):
```tsx
              className="inline-flex items-center gap-2 text-white/70 hover:text-turquoise text-sm mb-4 sm:mb-6 transition group w-fit"
```
→
```tsx
              className="inline-flex items-center gap-2 text-white/70 hover:text-flame text-sm mb-4 sm:mb-6 transition group w-fit"
```

`src/app/[locale]/(public)/tours/[slug]/page.tsx:160` (etiqueta de categoría del tour, mismo hero, se posa sobre la parte sólida `to-night` del overlay):
```tsx
              <span className="font-semibold text-turquoise text-xl sm:text-2xl">
```
→
```tsx
              <span className="font-semibold text-flame text-xl sm:text-2xl">
```

`src/app/[locale]/(public)/destinos/[slug]/page.tsx:135` (link "volver a destinos", mismo patrón de hero oscuro):
```tsx
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-turquoise text-sm mb-4 transition w-fit"
```
→
```tsx
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-flame text-sm mb-4 transition w-fit"
```

`src/app/[locale]/(public)/destinos/[slug]/page.tsx:140` (etiqueta de región, mismo hero):
```tsx
          <span className="font-semibold text-turquoise text-xl sm:text-2xl">
```
→
```tsx
          <span className="font-semibold text-flame text-xl sm:text-2xl">
```

`src/app/not-found.tsx:31` ("Oops, te perdiste en los Andes", sobre `bg-night` + overlay `from-night/60 via-night/50 to-night` encima de una foto al 40% de opacidad):
```tsx
        <div className="text-turquoise text-xl md:text-2xl font-semibold mb-2">
```
→
```tsx
        <div className="text-flame text-xl md:text-2xl font-semibold mb-2">
```

`src/app/not-found.tsx:35` (el "0" de "404", mismo fondo):
```tsx
          4<span className="text-turquoise">0</span>4
```
→
```tsx
          4<span className="text-flame">0</span>4
```

- [ ] **Step 4: Verificar que no queda ningún `text-turquoise`/`bg-turquoise`+`text-night` en los 5 archivos sobre fondo oscuro**

Run:
```bash
grep -n "text-turquoise\b\|bg-turquoise.*text-night" src/components/blog/post-cta.tsx "src/app/[locale]/(public)/tours/[slug]/page.tsx" "src/app/[locale]/(public)/destinos/[slug]/page.tsx" src/app/not-found.tsx src/app/admin/blog/import-panel.tsx
```
Expected: sin salida (todas las apariciones de `text-turquoise` bare y de `bg-turquoise ... text-night` en estos 5 archivos ya fueron migradas; los usos de `text-turquoise-deep`, `bg-turquoise/NN`, `hover:bg-turquoise` con `hover:text-white`, etc. que quedaron sin tocar en Tareas anteriores no entran en este grep porque no calzan el patrón exacto).

- [ ] **Step 5: `npm run build` y confirmación visual**

Run: `npm run build` — debe compilar sin errores.

Run: `npm run dev`, abrir `/es/blog/<slug>` (tarjeta CTA al final del post), `/es/tours/<slug>` (categoría + link "volver" del hero), `/es/destinos/<slug>` (región + link "volver" + badge de precio en tarjetas relacionadas), una URL inexistente como `/es/no-existe` (página 404), y `/admin/blog/new` (panel de importar desde URL).
Expected: en cada uno, el texto/ícono que antes se veía turquesa apagado sobre fondo oscuro ahora se ve en naranja (`flame`) claramente legible, y los botones que antes tenían texto oscuro casi invisible sobre fondo turquesa ahora tienen texto blanco legible. Cerrar el dev server al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/post-cta.tsx "src/app/[locale]/(public)/tours/[slug]/page.tsx" "src/app/[locale]/(public)/destinos/[slug]/page.tsx" src/app/not-found.tsx src/app/admin/blog/import-panel.tsx
git commit -m "fix(a11y): corregir contraste turquoise-sobre-night detectado en review final"
```
