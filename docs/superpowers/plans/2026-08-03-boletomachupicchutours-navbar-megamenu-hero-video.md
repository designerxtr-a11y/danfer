# boletomachupicchutours.com — Navbar mega-menú + video hero en mobile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar al navbar de boletomachupicchutours.com un mega-menú con dropdowns tipo cuscoperu.com (7 categorías, contenido 100% real — sin tours/paquetes inventados) y mostrar el video del hero también en mobile (hoy solo corre en desktop).

**Architecture:** El código vive en el repo `C:\xampp\htdocs\boletomachupicchutours` (Next.js App Router). `layout.tsx` (server component) hace las queries de datos (categorías+tours, destinos) y arma un array `navItems` ya resuelto (strings, no objetos localizados) que pasa como prop a `Navbar` (client component) — mismo patrón que ya usa hoy para `logoUrl`. `Navbar` no conoce Supabase ni `destinations-content.ts`, solo renderiza `navItems`. El hero pasa de mostrar video solo en desktop a mostrarlo en todos los breakpoints, revelándolo con fade-in recién cuando arranca a reproducir de verdad (no antes), para que la `<Image>` optimizada siga siendo el elemento de LCP.

**Tech Stack:** Next.js App Router, React (client components `"use client"`), Tailwind CSS (tokens ya fijados en Fase 4a: `turquoise`/`turquoise-deep`/`night`/`background`/`shadow-soft`), Framer Motion (`motion`, `AnimatePresence`), lucide-react, Supabase (`getCategoriesWithTours`), contenido estático (`listDestinations`).

## Global Constraints

- No crear tours, paquetes ni páginas nuevas — todo el contenido del mega-menú sale de datos/páginas que ya existen (spec: `2026-08-03-boletomachupicchutours-navbar-megamenu-hero-video-design.md`).
- Sin `--color-gold` fuera del wordmark del logo; sin `font-display`/`font-hand` (reglas ya fijadas en Fase 4a/4b-1, este trabajo las reutiliza tal cual, no las reabre).
- Botones/badges con fondo propio → blanco sólido + texto `turquoise-deep`, nunca turquesa-sobre-turquesa (regla de Fase 4a/4b-1).
- Sin infraestructura de test automatizado en este proyecto (no hay jest/vitest/playwright configurado) — la verificación de cada tarea es `npm run build` + revisión visual manual en `npm run dev` + `grep` dirigido, igual que en los specs/plans anteriores de este mismo proyecto.
- Repo de trabajo para todos los archivos de código: `C:\xampp\htdocs\boletomachupicchutours` (los specs/plans se guardan en el repo hermano `cuscotours-v2`, el código no).

## Nota sobre una decisión técnica que se desvía del spec

El spec dejó como "pendiente de verificar" si existe una variante liviana del video de Pexels para mobile, con un fallback de comprimir el archivo actual. Al preparar este plan se intentó descargar el MP4 actual para comprimirlo (`ffmpeg` sí está disponible) — Pexels devuelve `403 Forbidden` en descargas por script (con o sin User-Agent/Referer de navegador) y no hay `yt-dlp` ni `python` instalados en este entorno para un intento más robusto. En vez de bloquear la tarea en eso, la Tarea 2 usa el **mismo archivo de video ya en producción para todos los breakpoints**, pero cambia CUÁNDO se hace visible: hoy el video reemplaza a la imagen por breakpoint (CSS puro); con este cambio el video se revela con fade-in solo cuando el evento `onPlaying` confirma que ya está reproduciendo de verdad, así la `<Image>` optimizada (`priority`, `fetchPriority="high"`) sigue siendo el elemento que pinta primero (LCP) en todos los tamaños de pantalla, y el video no se descarga hasta que el `IntersectionObserver` ya existente decide reproducirlo (cuando el hero entra en viewport). El costo de datos del MP4 1080p en mobile queda como una decisión aceptada, no resuelta con un archivo más liviano — si `npm run build`'s reporte de performance o una medición real (PageSpeed/Lighthouse) after-deploy muestra que es un problema, se puede retomar como una tarea aparte con el archivo descargado manualmente desde un navegador.

---

### Task 1: Nuevas etiquetas de navegación en el bundle de i18n

**Files:**
- Modify: `src/lib/i18n/messages.ts:1-92` (bloque `es`) y `src/lib/i18n/messages.ts:93-183` (bloque `en`)

**Interfaces:**
- Produces: nuevas claves en `Messages["nav"]` (`machuPicchuTours`, `cuscoTours`, `caminoIncaTrekking`, `vacacionesPeru`, `conocePeru`, `queHacer`, `infoUtil`, `viewAll`, `aboutUs`, `contact`, `terms`, `cancellation`, `privacy`), consumidas por la Tarea 3 (`layout.tsx`) vía `tr(locale).nav.*`.

- [ ] **Step 1: Agregar las claves nuevas al objeto `nav` en español**

En `src/lib/i18n/messages.ts`, dentro de `messages.es.nav` (líneas 3-8), reemplazar:

```ts
    nav: {
      tours: "Tours",
      destinations: "Destinos",
      blog: "Blog",
      reviews: "Reseñas",
    },
```

por:

```ts
    nav: {
      tours: "Tours",
      destinations: "Destinos",
      blog: "Blog",
      reviews: "Reseñas",
      machuPicchuTours: "Machu Picchu Tours",
      cuscoTours: "Cusco Tours",
      caminoIncaTrekking: "Camino Inca y Trekking",
      vacacionesPeru: "Vacaciones Perú",
      conocePeru: "Conoce Perú",
      queHacer: "Qué Hacer",
      infoUtil: "Info Útil",
      viewAll: "Ver todos",
      aboutUs: "Sobre nosotros",
      contact: "Contacto",
      terms: "Términos y condiciones",
      cancellation: "Política de cancelación",
      privacy: "Política de privacidad",
    },
```

- [ ] **Step 2: Agregar las claves nuevas al objeto `nav` en inglés**

En el mismo archivo, dentro de `messages.en.nav` (líneas 94-99), reemplazar:

```ts
    nav: {
      tours: "Tours",
      destinations: "Destinations",
      blog: "Blog",
      reviews: "Reviews",
    },
```

por:

```ts
    nav: {
      tours: "Tours",
      destinations: "Destinations",
      blog: "Blog",
      reviews: "Reviews",
      machuPicchuTours: "Machu Picchu Tours",
      cuscoTours: "Cusco Tours",
      caminoIncaTrekking: "Inca Trail & Trekking",
      vacacionesPeru: "Peru Vacations",
      conocePeru: "Discover Peru",
      queHacer: "Things to Do",
      infoUtil: "Useful Info",
      viewAll: "View all",
      aboutUs: "About us",
      contact: "Contact",
      terms: "Terms & conditions",
      cancellation: "Cancellation policy",
      privacy: "Privacy policy",
    },
```

- [ ] **Step 3: Verificar que compila**

Run (desde `C:\xampp\htdocs\boletomachupicchutours`): `npm run build`
Expected: build exitoso, sin errores nuevos (el objeto `messages` es `as const`; agregar claves a ambos locales por igual no rompe el tipo `Messages`, y nada las consume todavía).

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/messages.ts
git commit -m "feat(i18n): agregar etiquetas de navegación para el mega-menú"
```

---

### Task 2: Video del hero visible en mobile (sin comprometer LCP)

**Files:**
- Modify: `src/components/sections/hero.tsx:44-45` (nuevo estado), `src/components/sections/hero.tsx:96-119` (Image + video)

**Interfaces:**
- No consume ni produce nada usado por otras tareas de este plan — cambio autocontenido en `hero.tsx`.

- [ ] **Step 1: Agregar estado `videoReady`**

En `src/components/sections/hero.tsx`, justo debajo de (línea 45):

```ts
  const [active, setActive] = useState(0);
```

agregar:

```ts
  const [videoReady, setVideoReady] = useState(false);
```

- [ ] **Step 2: Mostrar el video en todos los breakpoints, revelado con fade-in solo cuando reproduce de verdad**

Reemplazar el bloque (líneas 96-119):

```tsx
      {/* Background: en móvil imagen estática (el MP4 1080p externo penaliza
          LCP/datos justo donde llega el tráfico orgánico); el video solo en md+ */}
      <Image
        src={VIDEO_POSTER}
        alt=""
        aria-hidden
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 object-cover md:hidden"
      />
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />
```

por:

```tsx
      {/* La <Image> de next/image es el primer paint (LCP) en todos los
          breakpoints; el <video> se revela con fade-in recién cuando
          `onPlaying` confirma que ya está reproduciendo, así nunca compite
          con la imagen optimizada por el puntaje de LCP. */}
      <Image
        src={VIDEO_POSTER}
        alt=""
        aria-hidden
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 object-cover"
      />
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onPlaying={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      />
```

- [ ] **Step 3: Verificar visualmente en mobile y desktop**

Run: `npm run dev` (desde `C:\xampp\htdocs\boletomachupicchutours`)

En el navegador, abrir `http://localhost:3000/es` con las devtools en modo responsive (ej. iPhone 12, 390×844):
Expected: al cargar se ve primero la foto fija (mismo frame que el poster), y en 1-2 segundos el video empieza a reproducirse (nubes/montañas en movimiento) reemplazando la foto con un fundido suave. Repetir en tamaño desktop (≥1024px de ancho): mismo comportamiento, video reproduciéndose.
Expected adicional: al hacer scroll para que el hero salga de la pantalla y volver a subir, el video se pausa y reanuda (comportamiento ya existente del `IntersectionObserver`, no debe haberse roto).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat(hero): mostrar el video de fondo tambien en mobile"
```

---

### Task 3: Mega-menú de escritorio — tipos, datos reales y dropdowns en el navbar

**Files:**
- Modify: `src/components/layout/navbar.tsx:1-127` (imports, tipos nuevos, props, estado, `<nav>` de escritorio)
- Modify: `src/app/[locale]/(public)/layout.tsx` (fetch de datos + construcción de `navItems`)

**Interfaces:**
- Consumes: `getCategoriesWithTours(): Promise<CategoryWithTours[]>` (`@/lib/queries/categories`), `listDestinations(locale: string): DestinationContent[]` (`@/lib/destinations-content`), `t(field: Localized, locale: Locale): string` (`@/types/database`), `tr(locale: Locale): Messages` (`@/lib/i18n/messages`).
- Produces: tipos `NavLinkItem`, `NavMegaItem`, `NavItem` y prop `Navbar({ logoUrl, navItems }: { logoUrl?: string; navItems: NavItem[] })`, exportados desde `navbar.tsx` — la Tarea 4 (menú mobile) y `layout.tsx` dependen de estos nombres exactos.

- [ ] **Step 1: Agregar imports nuevos en `navbar.tsx`**

En `src/components/layout/navbar.tsx`, reemplazar las líneas 1-8:

```tsx
"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
```

por:

```tsx
"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
```

- [ ] **Step 2: Definir los tipos `NavItem` y exportarlos**

En el mismo archivo, justo antes de `export function Navbar({ logoUrl }: { logoUrl?: string }) {` (línea 51 en el archivo actual), agregar:

```tsx
export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavLinkItem {
  type: "link";
  label: string;
  href: string;
}

export interface NavMegaItem {
  type: "mega";
  label: string;
  items: NavSubItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export type NavItem = NavLinkItem | NavMegaItem;
```

- [ ] **Step 3: Cambiar la firma de `Navbar` para recibir `navItems` y quitar el array `links` hardcodeado**

Reemplazar:

```tsx
export function Navbar({ logoUrl }: { logoUrl?: string }) {
```

por:

```tsx
export function Navbar({
  logoUrl,
  navItems,
}: {
  logoUrl?: string;
  navItems: NavItem[];
}) {
```

El array `links` (`const links = [...]`, líneas 74-79 del archivo actual) **se deja tal cual por ahora** — el overlay mobile lo sigue usando hasta la Tarea 4, que lo reemplaza por `navItems` y recién ahí lo elimina. Si se borra en este paso, el build queda roto hasta la Tarea 4.

- [ ] **Step 4: Agregar el estado del dropdown (hover-intent con delay de cierre)**

En el cuerpo de `Navbar`, justo debajo de la línea `const [mobileOpen, setMobileOpen] = useState(false);`, agregar:

```tsx
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);
```

- [ ] **Step 5: Reemplazar el `<nav>` de escritorio para renderizar links y mega-menús**

Reemplazar:

```tsx
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                solid ? "text-night/70 hover:text-turquoise" : "text-white/85 hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
```

por:

```tsx
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) =>
            item.type === "link" ? (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm transition-colors ${
                  solid ? "text-night/70 hover:text-turquoise" : "text-white/85 hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(i)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={openIndex === i}
                  className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                    solid ? "text-night/70 hover:text-turquoise" : "text-white/85 hover:text-gold"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64 z-50"
                    >
                      <div className="rounded-2xl bg-background shadow-soft border border-night/10 p-3">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block rounded-lg px-3 py-2 text-sm text-night/80 hover:bg-turquoise/10 hover:text-turquoise-deep transition"
                          >
                            {sub.label}
                          </Link>
                        ))}
                        {item.viewAllHref && (
                          <Link
                            href={item.viewAllHref}
                            className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-turquoise hover:text-turquoise-deep transition"
                          >
                            {item.viewAllLabel ?? item.label}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}
        </nav>
```

- [ ] **Step 6: Armar `navItems` con datos reales en `layout.tsx`**

En `src/app/[locale]/(public)/layout.tsx`, reemplazar el archivo completo por:

```tsx
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar, type NavItem } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { I18nProvider } from "@/lib/i18n/provider";
import { tr, type Locale } from "@/lib/i18n/messages";
import { getSettings, normalizeWhatsApp, publicPhone } from "@/lib/queries/settings";
import { getCategoriesWithTours } from "@/lib/queries/categories";
import { listDestinations } from "@/lib/destinations-content";
import { t } from "@/types/database";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, settings] = await Promise.all([params, getSettings()]);
  const typedLocale: Locale = locale === "en" ? "en" : "es";
  const mx = tr(typedLocale);

  const [categories, destinations] = await Promise.all([
    getCategoriesWithTours(),
    Promise.resolve(listDestinations(typedLocale)),
  ]);

  const catBySlug = (slug: string) => categories.find((c) => c.slug === slug);
  const toTourLinks = (slugs: string[]) =>
    slugs
      .flatMap((slug) => catBySlug(slug)?.tours ?? [])
      .map((tour) => ({
        label: t(tour.title, typedLocale),
        href: `/tours/${tour.slug}`,
      }));

  const allNavItems: NavItem[] = [
    {
      type: "mega",
      label: mx.nav.machuPicchuTours,
      items: toTourLinks(["machu-picchu"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    {
      type: "mega",
      label: mx.nav.cuscoTours,
      items: toTourLinks(["valle-sagrado"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    {
      type: "mega",
      label: mx.nav.caminoIncaTrekking,
      items: toTourLinks(["camino-inca", "aventura"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    { type: "link", label: mx.nav.vacacionesPeru, href: "/tours" },
    {
      type: "mega",
      label: mx.nav.conocePeru,
      items: destinations.map((d) => ({
        label: d.name,
        href: `/destinos/${d.slug}`,
      })),
      viewAllHref: "/destinos",
      viewAllLabel: mx.nav.viewAll,
    },
    { type: "link", label: mx.nav.queHacer, href: "/blog" },
    {
      type: "mega",
      label: mx.nav.infoUtil,
      items: [
        { label: mx.nav.aboutUs, href: "/sobre-nosotros" },
        { label: mx.nav.contact, href: "/contacto" },
        { label: mx.nav.reviews, href: "/#reviews" },
        { label: mx.nav.terms, href: "/terminos" },
        { label: mx.nav.cancellation, href: "/cancelacion" },
        { label: mx.nav.privacy, href: "/privacidad" },
      ],
    },
  ];

  const navItems = allNavItems.filter(
    (item) => item.type === "link" || item.items.length > 0
  );

  return (
    <I18nProvider initialLocale={typedLocale}>
      {/* Organization + WebSite en TODAS las páginas públicas: los schemas de
          tours/blog/destinos referencian #organization por @id y Google no
          resuelve referencias entre páginas — el nodo debe ir inline. */}
      <JsonLd
        data={[
          organizationSchema(publicPhone(settings), settings.branding?.logo_url),
          websiteSchema(),
        ]}
      />
      <SmoothScroll>
        <Navbar logoUrl={settings.branding?.logo_url || undefined} navItems={navItems} />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <WhatsAppButton phone={normalizeWhatsApp(settings.whatsapp)} />
    </I18nProvider>
  );
}
```

- [ ] **Step 7: Verificar que compila**

Run: `npm run build`
Expected: build exitoso, sin errores. `links` sigue declarado y en uso (por el overlay mobile, sin tocar todavía), y `navItems` ya llega correctamente tipado desde `layout.tsx`.

- [ ] **Step 8: Verificación visual del mega-menú de escritorio**

Run: `npm run dev`, abrir `http://localhost:3000/es` en un viewport de escritorio (≥1024px).
Expected:
- El navbar muestra 7 items: Machu Picchu Tours, Cusco Tours, Camino Inca y Trekking, Vacaciones Perú, Conoce Perú, Qué Hacer, Info Útil.
- Pasar el mouse sobre "Machu Picchu Tours" abre un panel blanco con los tours de esa categoría (título real del tour, no un slug) y un link "Ver todos" al final.
- Pasar el mouse sobre "Conoce Perú" muestra los 5 destinos (Machu Picchu, Camino Inca, Valle Sagrado, Rainbow Mountain, Laguna Humantay).
- "Vacaciones Perú" y "Qué Hacer" no tienen flecha de dropdown y navegan directo a `/tours` y `/blog` respectivamente al hacer click.
- Mover el mouse desde el trigger hacia el panel (en diagonal) no cierra el dropdown de golpe.
- Repetir en `http://localhost:3000/en`: mismos 7 items mostrando las etiquetas en inglés (Machu Picchu Tours, Cusco Tours, Inca Trail & Trekking, Peru Vacations, Discover Peru, Things to Do, Useful Info).

- [ ] **Step 9: Commit**

```bash
git add src/components/layout/navbar.tsx "src/app/[locale]/(public)/layout.tsx"
git commit -m "feat(navbar): mega-menu de escritorio con categorias reales tipo cuscoperu"
```

---

### Task 4: Menú mobile — acordeones para los items con dropdown

**Files:**
- Modify: `src/components/layout/navbar.tsx` (estado `mobileOpenIndex`, sección `<motion.nav>` del overlay mobile)

**Interfaces:**
- Consumes: `NavItem`, `NavMegaItem`, `NavLinkItem`, prop `navItems` (Tarea 3, mismo archivo).

- [ ] **Step 1: Agregar estado para qué acordeón está abierto en mobile**

Justo debajo de la línea `const [mobileOpen, setMobileOpen] = useState(false);`, agregar:

```tsx
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
```

- [ ] **Step 2: Eliminar el array `links` (ya sin uso una vez hecho el Step 3) y el `m` que solo él usaba**

Eliminar por completo el bloque, dejado intacto desde antes de la Tarea 3:

```tsx
  const links = [
    { label: m.nav.tours, href: "/tours" },
    { label: m.nav.destinations, href: "/destinos" },
    { label: m.nav.blog, href: "/blog" },
    { label: m.nav.reviews, href: "/#reviews" },
  ];
```

`m` (de `const { m, locale, setLocale } = useI18n();`) no se usa en ningún otro lugar de `navbar.tsx` — al borrar `links` queda sin uso. Reemplazar esa línea:

```tsx
  const { m, locale, setLocale } = useI18n();
```

por:

```tsx
  const { locale, setLocale } = useI18n();
```

- [ ] **Step 3: Reemplazar la lista de links del overlay mobile por `navItems` con acordeones**

Reemplazar el bloque `<motion.nav>` (que hoy mapea `links`):

```tsx
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex-1 flex flex-col justify-center px-8 gap-2"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-4xl font-bold text-white hover:opacity-70 transition py-3 border-b border-white/10"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + links.length * 0.06 }}
              >
                <Link
                  href="/tours"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold hover:opacity-90 transition"
                >
                  {locale === "en" ? "Book your tour" : "Reservar tu tour"}
                </Link>
              </motion.div>
            </motion.nav>
```

por:

```tsx
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex-1 flex flex-col justify-center px-8 gap-2 overflow-y-auto"
            >
              {navItems.map((item, i) =>
                item.type === "link" ? (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-3xl font-bold text-white hover:opacity-70 transition py-3 border-b border-white/10"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="border-b border-white/10"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileOpenIndex((cur) => (cur === i ? null : i))
                      }
                      className="w-full flex items-center justify-between text-3xl font-bold text-white hover:opacity-70 transition py-3"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-6 h-6 shrink-0 transition-transform ${
                          mobileOpenIndex === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileOpenIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden flex flex-col gap-1 pb-3"
                        >
                          {item.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="text-base text-white/80 hover:text-white transition py-2 pl-1"
                            >
                              {sub.label}
                            </Link>
                          ))}
                          {item.viewAllHref && (
                            <Link
                              href={item.viewAllHref}
                              onClick={() => setMobileOpen(false)}
                              className="text-base font-semibold text-white py-2 pl-1"
                            >
                              {item.viewAllLabel ?? item.label} →
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + navItems.length * 0.06 }}
              >
                <Link
                  href="/tours"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold hover:opacity-90 transition"
                >
                  {locale === "en" ? "Book your tour" : "Reservar tu tour"}
                </Link>
              </motion.div>
            </motion.nav>
```

Nota: el tamaño de fuente de los items de primer nivel baja de `text-4xl` a `text-3xl` — con 4 items cabía holgado, con 7 (algunos expandibles) `text-4xl` se sentía apretado en pantallas chicas durante la verificación visual.

- [ ] **Step 4: Verificar que compila sin referencias colgantes a `links`**

Run: `npm run build`
Expected: build exitoso, sin errores de "links is not defined" ni variables sin usar.

- [ ] **Step 5: Verificación visual del menú mobile**

Run: `npm run dev`, abrir `http://localhost:3000/es` con devtools en modo responsive (<768px), tocar el botón de hamburguesa.
Expected:
- El overlay a pantalla completa muestra los 7 items.
- Tocar "Machu Picchu Tours" expande un acordeón con los tours de esa categoría (sin navegar); tocar de nuevo lo colapsa.
- Tocar "Vacaciones Perú" navega directo a `/tours` y cierra el overlay (no es acordeón).
- Todo el contenido es alcanzable con scroll si la lista expandida no entra en la pantalla.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "feat(navbar): acordeones para el mega-menu en el overlay mobile"
```

---

## Verificación final del branch

- [ ] `npm run build` limpio desde cero (`rm -rf .next && npm run build` si se quiere descartar caché).
- [ ] `grep -rn "text-gold\|font-display\|font-hand" src/components/layout/navbar.tsx src/components/sections/hero.tsx` — sin resultados nuevos fuera del wordmark del logo (que ya usaba `text-gradient-gold`, no tocado por este plan).
- [ ] Clickear cada link nuevo del mega-menú (desktop y mobile) en `/es` y `/en` y confirmar que ninguno da 404: cada tour de Machu Picchu Tours/Cusco Tours/Camino Inca y Trekking, cada destino de Conoce Perú, `/tours`, `/blog`, `/destinos`, `/#reviews`, `/sobre-nosotros`, `/contacto`, `/terminos`, `/cancelacion`, `/privacidad`.
