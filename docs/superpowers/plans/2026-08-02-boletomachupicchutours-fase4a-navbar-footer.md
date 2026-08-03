# boletomachupicchutours.com — Fase 4a: Navbar + Footer (rediseño visual) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el chrome global del sitio (navbar + footer) del sistema visual dorado/"night" al nuevo sistema turquesa/blanco tipo agencia, primera sub-fase de Fase 4 (ver spec `docs/superpowers/specs/2026-08-02-boletomachupicchutours-fase4-rediseno-visual-design.md`).

**Architecture:** Todo el trabajo ocurre en el repo `C:\xampp\htdocs\boletomachupicchutours` (rama propia, Fases 1-3 ya en producción). Son solo 2 archivos de componentes (`navbar.tsx`, `footer.tsx`); no se tocan tokens en `globals.css` porque `--color-turquoise`/`--color-turquoise-deep` ya existen — el cambio es de **qué clases de Tailwind se usan dónde**, no de qué colores existen.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (tokens vía `@theme` en `globals.css`), framer-motion.

## Global Constraints

- Sin framework de tests (`package.json` solo tiene `dev/build/start/lint`) — verificación manual: `npx tsc --noEmit`, `npm run build`, revisión visual en `npm run dev`, y `grep` de las clases viejas.
- No se fabrica contenido: esta sub-fase es solo estilo, no toca copy/textos.
- El panel `/admin` está fuera de alcance — no se toca.
- El sitio sigue `noindex` — esta sub-fase no toca `robots.ts` ni `layout.tsx`.
- `--color-gold` no desaparece del todo: queda como acento aislado en el wordmark del logo (`text-gradient-gold`) — es la única excepción intencional, documentada en cada task.
- El navbar transparente sobre el hero (`!solid`, home sin scroll) **no cambia su hover de texto en esta sub-fase** (link principal + íconos sociales siguen en `hover:text-gold` solo en esa rama) porque su contraste depende del fondo de `hero.tsx`, que es una sub-fase futura (4b). Elementos autocontenidos que no dependen del fondo detrás (ring del selector de idioma, botón CTA con su propio fondo) sí se migran a turquesa en ambos estados.

---

### Task 1: Navbar — recolorear y tipografía

**Files:**
- Modify: `src/components/layout/navbar.tsx`

**Interfaces:** ninguna — el componente no cambia su firma (`Navbar({ logoUrl }: { logoUrl?: string })`), solo clases de Tailwind.

**Depende de:** ninguna.

- [ ] **Step 1: Reemplazar el contenido completo de `navbar.tsx`**

Reemplaza el archivo completo por (los cambios respecto al original: L96/L229 pierden `font-display` — ya tienen `font-bold`, no hace falta agregar nada; L144/155 los rings del selector de idioma en la barra (fondo conocido, blanco o borde translúcido) pasan de `ring-gold` a `ring-turquoise`; L120 (link principal) y L167/176/185 (íconos sociales) se vuelven condicionales por `solid` — turquesa cuando el navbar es sólido (fondo blanco conocido), **gold sin cambios** cuando es transparente sobre el hero (fondo aún no migrado, se revisa en Fase 4b); L193/286 el botón CTA pasa de dorado a turquesa con texto blanco (es un botón con fondo propio, no depende de lo que hay detrás); L221 el fondo del menú móvil pasa de `bg-night/95` a `bg-turquoise-deep/95`; L272 pierde `font-display`, gana `font-bold`, y su hover pasa de `hover:text-gold` a `hover:opacity-70` porque ya es blanco puro sobre el nuevo fondo turquesa-deep del menú — un hover a turquesa ahí no se notaría; L306/317 los rings activos del selector de idioma **dentro del menú móvil** pasan a blancos por la misma razón de contraste; L330/339/348 los íconos sociales del menú móvil usan el mismo `hover:opacity-70`):

```tsx
"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.72 3.72 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.88 5.88 0 0 0 1.38 2.13 5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
);

const TikTokIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.74a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1.84-.12Z" />
  </svg>
);

const PeruFlag = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 6 4" {...p}>
    <rect width="2" height="4" fill="#D91023" />
    <rect x="2" width="2" height="4" fill="#fff" />
    <rect x="4" width="2" height="4" fill="#D91023" />
  </svg>
);

const USFlag = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 7 5" {...p}>
    {Array.from({ length: 13 }).map((_, i) => (
      <rect
        key={i}
        y={(i * 5) / 13}
        width="7"
        height={5 / 13}
        fill={i % 2 ? "#fff" : "#B22234"}
      />
    ))}
    <rect width="3" height={(5 * 7) / 13} fill="#3C3B6E" />
  </svg>
);

export function Navbar({ logoUrl }: { logoUrl?: string }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));
  const { m, locale, setLocale } = useI18n();

  // El navbar es transparente con texto blanco SOLO en el home (que tiene el
  // hero oscuro detrás). En el resto de páginas el fondo es claro, así que el
  // texto blanco quedaría invisible → forzamos el estilo sólido (texto oscuro).
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  // Bloquea scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { label: m.nav.tours, href: "/tours" },
    { label: m.nav.destinations, href: "/destinos" },
    { label: m.nav.blog, href: "/blog" },
    { label: m.nav.reviews, href: "/#reviews" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-background/85 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Boleto Machu Picchu Tours — inicio"
          className="text-2xl font-bold tracking-wider"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Boleto Machu Picchu Tours"
              width={180}
              height={48}
              priority
              className="h-10 w-auto object-contain"
            />
          ) : (
            <>
              <span className="text-gradient-gold">BOLETO MP</span>
              <span className={solid ? "text-night" : "text-white"}>TOURS</span>
            </>
          )}
        </Link>

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

        <div
          className={`flex items-center gap-4 ${
            solid ? "text-night/70" : "text-white/85"
          }`}
        >
          <div
            className={`hidden md:flex items-center gap-0.5 rounded-full p-0.5 border transition ${
              solid ? "border-night/15" : "border-white/30"
            }`}
          >
            <button
              onClick={() => locale !== "es" && setLocale("es")}
              aria-label="Español"
              className={`grid place-items-center w-7 h-7 rounded-full transition ${
                locale === "es"
                  ? "ring-2 ring-turquoise"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <PeruFlag className="w-4 h-3 rounded-sm" />
            </button>
            <button
              onClick={() => locale !== "en" && setLocale("en")}
              aria-label="English"
              className={`grid place-items-center w-7 h-7 rounded-full transition ${
                locale === "en"
                  ? "ring-2 ring-turquoise"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <USFlag className="w-4 h-3 rounded-sm" />
            </button>
          </div>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de Boleto Machu Picchu Tours"
            className={`hidden md:block transition ${solid ? "hover:text-turquoise" : "hover:text-gold"}`}
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Boleto Machu Picchu Tours"
            className={`hidden md:block transition ${solid ? "hover:text-turquoise" : "hover:text-gold"}`}
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Boleto Machu Picchu Tours"
            className={`hidden md:block transition ${solid ? "hover:text-turquoise" : "hover:text-gold"}`}
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* CTA de reserva — el navbar no tenía acción primaria visible */}
          <Link
            href="/tours"
            className="hidden md:inline-flex items-center rounded-full bg-turquoise px-5 py-2 text-white text-sm font-semibold hover:bg-turquoise-deep hover:shadow-soft transition"
          >
            {locale === "en" ? "Book now" : "Reservar"}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className={`md:hidden grid place-items-center w-10 h-10 rounded-full border transition ${
              solid
                ? "border-night/15 text-night"
                : "border-white/30 text-white"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-turquoise-deep/95 backdrop-blur-md md:hidden flex flex-col"
          >
            {/* Top bar inside menu */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                aria-label="Boleto Machu Picchu Tours — inicio"
                className="text-2xl font-bold tracking-wider"
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Boleto Machu Picchu Tours"
                    width={180}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <>
                    <span className="text-gradient-gold">BOLETO MP</span>
                    <span className="text-white">TOURS</span>
                  </>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="grid place-items-center w-10 h-10 rounded-full border border-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
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
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquoise px-7 py-3.5 text-white font-semibold hover:bg-turquoise-deep transition"
                >
                  {locale === "en" ? "Book your tour" : "Reservar tu tour"}
                </Link>
              </motion.div>
            </motion.nav>

            {/* Footer of mobile menu: lang + social */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="px-8 py-6 border-t border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 rounded-full p-0.5 border border-white/20">
                <button
                  onClick={() => locale !== "es" && setLocale("es")}
                  aria-label="Español"
                  className={`grid place-items-center w-8 h-8 rounded-full transition ${
                    locale === "es"
                      ? "ring-2 ring-white"
                      : "opacity-50"
                  }`}
                >
                  <PeruFlag className="w-5 h-3.5 rounded-sm" />
                </button>
                <button
                  onClick={() => locale !== "en" && setLocale("en")}
                  aria-label="English"
                  className={`grid place-items-center w-8 h-8 rounded-full transition ${
                    locale === "en"
                      ? "ring-2 ring-white"
                      : "opacity-50"
                  }`}
                >
                  <USFlag className="w-5 h-3.5 rounded-sm" />
                </button>
              </div>
              <div className="flex items-center gap-5 text-white/80">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok de Boleto Machu Picchu Tours"
                  className="hover:opacity-70 transition"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de Boleto Machu Picchu Tours"
                  className="hover:opacity-70 transition"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Boleto Machu Picchu Tours"
                  className="hover:opacity-70 transition"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores nuevos relacionados a `navbar.tsx`.

- [ ] **Step 3: Verificación visual**

```bash
npm run dev
```

Abrir `http://localhost:3000/es/sobre-nosotros` (página con navbar "solid" desde el inicio, fondo blanco). Expected: logo "BOLETO MP" en gradiente dorado + "TOURS" en texto oscuro, links de nav en gris oscuro que se ponen **turquesa** al pasar el mouse, botón "Reservar" con fondo **turquesa sólido** y texto blanco (no dorado). Abrir en móvil (o achicar la ventana) y tocar el botón de menú hamburguesa: el overlay de pantalla completa debe verse en **azul turquesa oscuro** (no negro/navy), con el botón "Reservar tu tour" turquesa. Detener el server (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "feat(design): navbar turquesa/agencia (Fase 4a)"
```

---

### Task 2: Footer — recolorear y tipografía

**Files:**
- Modify: `src/components/layout/footer.tsx`

**Interfaces:** ninguna — el componente sigue siendo `Footer()` (async server component), sin cambios de props ni de las funciones `getFooterData`/arrays `destinations`/`company`/`legal`.

**Depende de:** ninguna (independiente de Task 1).

- [ ] **Step 1: Reemplazar el contenido completo de `footer.tsx`**

Reemplaza el archivo completo por (cambios respecto al original: fondo `bg-night-deep` → `bg-turquoise-deep`; los 3 íconos de la trust strip (Award/Shield/Clock) pasan de `text-gold` a `text-white/70`; todos los `font-display` de encabezados `h4` se quitan y ganan `font-semibold` — antes no tenían peso explícito, ahora lo necesitan al perder la serif; todos los `hover:text-gold` de links pasan a `hover:text-white` porque el fondo ya es un color saturado (turquesa oscuro) y turquesa-sobre-turquesa no se notaría — blanco sí contrasta; el precio (`text-gold/60`) pasa a `text-white/50`; el link "Ver todos los tours →" pierde `text-gold` y pasa a `text-white`; el corazón "♥" pasa de `text-gold` a `text-white`; el logo (`text-gradient-gold` + `font-display font-bold` → solo `font-bold`) mantiene el gradiente dorado como único acento aislado permitido):

```tsx
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Award, Shield, Clock } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSettings, publicPhone, normalizeWhatsApp } from "@/lib/queries/settings";
import { t, type Locale } from "@/types/database";
import { siteUrl } from "@/lib/seo/site-url";

interface TourLite {
  slug: string;
  title: { es: string; en?: string };
  price_usd: number;
  bookings_count: number;
}
interface CategoryLite {
  slug: string;
  name: { es: string; en?: string };
  sort_order: number;
}

async function getFooterData() {
  try {
    const supabase = createAdminClient();
    const [{ data: tours }, { data: categories }] = await Promise.all([
      supabase
        .from("tours")
        .select("slug,title,price_usd,bookings_count")
        .eq("is_published", true)
        .order("bookings_count", { ascending: false })
        .limit(8),
      supabase
        .from("categories")
        .select("slug,name,sort_order")
        .eq("is_published", true)
        .order("sort_order"),
    ]);
    return {
      tours: (tours ?? []) as TourLite[],
      categories: (categories ?? []) as CategoryLite[],
    };
  } catch {
    return { tours: [], categories: [] };
  }
}

const destinations = [
  { es: "Machu Picchu", en: "Machu Picchu", href: "/destinos/machu-picchu" },
  { es: "Camino Inca", en: "Inca Trail", href: "/destinos/camino-inca" },
  { es: "Valle Sagrado", en: "Sacred Valley", href: "/destinos/valle-sagrado" },
  {
    es: "Rainbow Mountain",
    en: "Rainbow Mountain",
    href: "/destinos/rainbow-mountain",
  },
  { es: "Laguna Humantay", en: "Humantay Lake", href: "/destinos/laguna-humantay" },
  { es: "Todos los destinos", en: "All destinations", href: "/destinos" },
];

const company = [
  { es: "Sobre nosotros", en: "About us", href: "/sobre-nosotros" },
  { es: "Blog de viajes", en: "Travel blog", href: "/blog" },
  { es: "Reseñas verificadas", en: "Verified reviews", href: "/#reviews" },
  { es: "Contacto", en: "Contact", href: "/contacto" },
];

const legal = [
  { es: "Términos", en: "Terms", href: "/terminos" },
  { es: "Privacidad", en: "Privacy", href: "/privacidad" },
  { es: "Cancelación", en: "Cancellation", href: "/cancelacion" },
];

const SITE = siteUrl();

export async function Footer() {
  const [{ tours, categories }, locale, settings] = await Promise.all([
    getFooterData(),
    getLocale(),
    getSettings(),
  ]);
  const lc = (locale === "en" ? "en" : "es") as Locale;
  const en = lc === "en";
  const phone = publicPhone(settings);

  return (
    <footer
      className="bg-turquoise-deep border-t border-white/5 mt-32"
      itemScope
      itemType="https://schema.org/TravelAgency"
    >
      {/* Trust strip */}
      <div className="border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/55 text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-white/70" />
            {en ? "Authorized tour operator" : "Operador turístico autorizado"}
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white/70" />
            {en ? "Book with confidence" : "Reservas con confianza"}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/70" />
            {en ? "Real experience in Cusco" : "Experiencia real en Cusco"}
          </span>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="text-3xl font-bold tracking-wider block"
            >
              <span className="text-gradient-gold">BOLETO MP</span>
              <span className="text-white">TOURS</span>
            </Link>
            <p
              className="mt-4 text-white/60 text-sm leading-relaxed max-w-sm"
              itemProp="description"
            >
              {en
                ? "Official tour operator in Cusco, Peru. Premium tours to Machu Picchu, the Sacred Valley, the Inca Trail, Rainbow Mountain and Humantay Lake. Certified local guides, small groups, book with confidence."
                : "Operador turístico oficial en Cusco, Perú. Tours premium a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay. Guías locales certificados, grupos pequeños, reservas con confianza."}
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-white/70">
              <a
                href="mailto:hola@boletomachupicchutours.com"
                className="flex items-center gap-2 hover:text-white transition"
                itemProp="email"
              >
                <Mail className="w-4 h-4" />
                hola@boletomachupicchutours.com
              </a>
              {phone && (
                <a
                  href={`tel:${normalizeWhatsApp(phone)}`}
                  className="flex items-center gap-2 hover:text-white transition"
                  itemProp="telephone"
                >
                  <Phone className="w-4 h-4" />
                  {phone}
                </a>
              )}
              <div
                className="flex items-start gap-2"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <span itemProp="addressLocality">Cusco</span>,{" "}
                  <span itemProp="addressCountry">{en ? "Peru" : "Perú"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-2">
                {en ? "Opening hours" : "Horario de atención"}
              </h4>
              <div className="text-xs text-white/55 space-y-0.5">
                <div>{en ? "Mon-Fri" : "Lun-Vie"} · 8:00 - 20:00</div>
                <div>{en ? "Saturday" : "Sábado"} · 9:00 - 18:00</div>
                <div>{en ? "Sunday" : "Domingo"} · 9:00 - 14:00</div>
              </div>
            </div>
          </div>

          {/* Tours top vendidos */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold text-white mb-4">
              {en ? "Best-selling tours" : "Tours más vendidos"}
            </h4>
            <ul className="space-y-2.5">
              {tours.slice(0, 6).map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="group flex items-center justify-between gap-3 text-white/60 text-sm hover:text-white transition"
                  >
                    <span className="truncate">{t(tour.title, lc)}</span>
                    <span className="text-[10px] text-white/50 shrink-0">
                      US${tour.price_usd.toFixed(0)}
                    </span>
                  </Link>
                </li>
              ))}
              {tours.length === 0 &&
                destinations.slice(0, 6).map((d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      className="text-white/60 text-sm hover:text-white transition"
                    >
                      {en ? d.en : d.es}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/tours"
                  className="text-white text-xs uppercase tracking-widest font-semibold mt-2 inline-block hover:underline"
                >
                  {en ? "View all tours →" : "Ver todos los tours →"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías + Destinos */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-4">
              {en ? "By category" : "Por categoría"}
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tours?category=${cat.slug}`}
                    className="text-white/60 text-sm hover:text-white transition"
                  >
                    {t(cat.name, lc)}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold text-white mt-8 mb-3 uppercase tracking-widest">
              {en ? "Destinations" : "Destinos"}
            </h4>
            <ul className="space-y-2">
              {destinations.slice(0, 5).map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="text-white/50 text-xs hover:text-white transition"
                  >
                    {en ? d.en : d.es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa + newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold text-white mb-4">
              {en ? "Company" : "Empresa"}
            </h4>
            <ul className="space-y-2.5 mb-8">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-white/60 text-sm hover:text-white transition"
                  >
                    {en ? c.en : c.es}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold text-white mb-3">Newsletter</h4>
            <p className="text-white/55 text-xs mb-4">
              {en
                ? "Exclusive deals and new routes straight to your inbox."
                : "Ofertas exclusivas y nuevas rutas en tu email."}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <div>
            © {new Date().getFullYear()}{" "}
            <span itemProp="name">Boleto Machu Picchu Tours</span> ·{" "}
            {en ? "Made with" : "Hecho con"}{" "}
            <span className="text-white">♥</span>{" "}
            {en ? "in Cusco, Peru" : "en Cusco, Perú"}
          </div>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-white transition"
              >
                {en ? l.en : l.es}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35">
            Visa · MC · Amex · PayPal
          </div>
        </div>
      </div>

      {/* Hidden semantic links for crawlers */}
      <link itemProp="url" href={SITE} />
    </footer>
  );
}
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores nuevos relacionados a `footer.tsx`.

- [ ] **Step 3: Verificación visual**

```bash
npm run dev
```

Abrir cualquier página pública (ej. `http://localhost:3000/es/sobre-nosotros`) y bajar hasta el footer. Expected: fondo del footer en **azul turquesa oscuro** (no negro/navy), logo con gradiente dorado + "TOURS" blanco, los 3 íconos de la trust strip (candado/escudo/reloj) en blanco translúcido (no dorado), todos los links de las columnas cambian a **blanco sólido** al pasar el mouse (no dorado), el precio junto a cada tour en gris claro. Detener el server.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "feat(design): footer turquesa/agencia (Fase 4a)"
```

---

### Task 3: Verificación final de la sub-fase

**Depende de:** Tasks 1-2 completos.

- [ ] **Step 1: Build de producción**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run build
```

Expected: build exitoso, sin errores de TypeScript ni de Next.js.

- [ ] **Step 2: Grep de clases viejas — deben haber desaparecido**

```bash
grep -n "bg-gold\b\|ring-gold\|bg-night-deep\|bg-night/95\|font-display\|shadow-glow" src/components/layout/navbar.tsx src/components/layout/footer.tsx
```

Expected: sin resultados (el CTA pasó a `bg-turquoise`/`hover:bg-turquoise-deep`, los rings a `ring-turquoise`/`ring-white`, el fondo del footer y del menú móvil a `turquoise-deep`, y no queda ningún `font-display`/`shadow-glow`).

- [ ] **Step 3: Grep de las excepciones intencionales — deben seguir existiendo**

```bash
grep -n "text-gradient-gold\|text-night\|hover:text-gold" src/components/layout/navbar.tsx src/components/layout/footer.tsx
```

Expected: 3 líneas con `text-gradient-gold` (2 en `navbar.tsx`, 1 en `footer.tsx` — el wordmark del logo, único acento dorado permitido), varias líneas con `text-night`/`border-night` en `navbar.tsx` (estados "solid" del navbar sobre fondo claro — texto oscuro legítimo, no es un fondo), y 4 líneas con `hover:text-gold` en `navbar.tsx` (el link principal + los 3 íconos sociales, únicamente en su rama `!solid` — el estado transparente sobre el hero, deliberadamente no tocado en esta sub-fase, ver Global Constraints).

- [ ] **Step 4: Recorrido visual completo**

```bash
npm run dev
```

Recorrer 2-3 páginas distintas (`/es`, `/es/sobre-nosotros`, `/es/tours`) revisando navbar y footer en cada una. Expected: navbar y footer consistentes en turquesa/blanco en todas, menú móvil probado en al menos una página. Detener el server.

- [ ] **Step 5: Push (si el usuario lo confirma)**

Solo tras confirmación explícita del usuario, siguiendo el mismo patrón de Fases 1 y 3 (este repo no tiene remoto Git configurado — el "deploy" es vía `vercel --prod`, no vía git push).

---

## Self-Review

**Spec coverage:** sección "Componentes y páginas afectadas" del spec (grupo "Global": `navbar.tsx`, `footer.tsx`) → Tasks 1-2. Sección "Paleta de color" (turquesa como primario, gold reducido a acento aislado) → aplicado en ambos tasks. Sección "Tipografía" (sin `font-display`/`font-hand`) → aplicado en ambos tasks (footer no tenía `font-hand`, solo `font-display`). Sección "Reseñas y confianza" → sin cambios en esta sub-fase (footer no tiene reseñas, solo trust strip textual, ya revisada en Fase 3).

**Placeholder scan:** sin TBD/TODO. Ambos archivos se reemplazan completos, código real en cada step.

**Type consistency:** `Navbar({ logoUrl }: { logoUrl?: string })` y `Footer()` no cambian de firma — ambos siguen siendo consumidos igual por el layout que los importa (no listado aquí porque no se modifica).

**Nota para la siguiente sub-fase (4b — Home):** el estado `!solid` del navbar (transparente sobre el hero) sigue usando `hover:text-gold` sin tocar — cuando se rediseñe `hero.tsx`, revisar si ese hover necesita pasar a turquesa también, dependiendo de qué fondo quede detrás del navbar transparente.
