# boletomachupicchutours.com — Fase 4b-1: Hero + Stats (rediseño visual) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar `hero.tsx` y `stats.tsx` del sistema dorado/"night" al sistema turquesa/blanco, primera sub-fase de "Fase 4b: Home" (ver spec `docs/superpowers/specs/2026-08-03-boletomachupicchutours-fase4b1-hero-stats-design.md`).

**Architecture:** Todo el trabajo ocurre en `C:\xampp\htdocs\boletomachupicchutours` (Fase 4a ya en producción). Son 2 archivos (`hero.tsx`, `stats.tsx`), cada uno con sub-componentes internos (`BottomStat`/`FloatingCard` en hero; `Stat`/`PolaroidGallery` en stats) — no hay archivos nuevos.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, framer-motion.

## Global Constraints

- Sin framework de tests — verificación manual: `npx tsc --noEmit`, `npm run build`, revisión visual en `npm run dev`, `grep` de clases viejas.
- No se fabrica contenido — solo estilo, no se toca copy/textos ni datos.
- `--color-gold` **no tiene excepción en estos 2 archivos** (a diferencia de navbar/footer, que conservan el wordmark del logo) — el grep final debe dar 0 resultados de gold en ambos archivos.
- Overlay del hero: `night` → `turquoise-deep` con opacidad ~10 puntos más alta en cada capa (turquoise-deep es ~10× más claro que night en luminancia — mismo ajuste que evitó repetir la regresión de contraste de Fase 4a).
- `text-night`/`text-night/NN` en `stats.tsx` **no se elimina** — esa sección tiene fondo claro (`bg-stone`), así que `night` como color de texto oscuro sigue siendo la elección correcta ahí (regla ya establecida: `night` deja de usarse como *background*, no como color de texto sobre fondo claro). Solo `hero.tsx` migra `night` por completo, porque ahí sí era background/overlay.
- Botones con fondo propio (CTA, flechas del carrusel, mini-botón de cada tarjeta, badge de rating) → `bg-white` + `text-turquoise-deep`, NO `bg-turquoise` — evita repetir el bug de Fase 4a donde un botón turquesa con hover turquesa-deep se funde con un fondo turquesa-deep.
- Detalles decorativos sobre las FOTOS de las tarjetas (no sobre el overlay turquesa uniforme) sí pueden usar turquesa como accent (el ring de hover de cada `FloatingCard`).
- El hover dorado del navbar en su estado transparente (`!solid`, sobre el hero — sin tocar desde Fase 4a) se mantiene sin cambios: queda confirmado como permanente, no se toca en esta sub-fase tampoco.

---

### Task 1: Hero — recolorear y tipografía

**Files:**
- Modify: `src/components/sections/hero.tsx`

**Interfaces:** ninguna — `Hero({ cardImages, cardTexts })` no cambia de firma; `BottomStat`/`FloatingCard` tampoco cambian sus props.

**Depende de:** ninguna.

- [ ] **Step 1: Reemplazar el contenido completo de `hero.tsx`**

```tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useI18n } from "@/lib/i18n/provider";
import {
  ArrowRight,
  Star,
  PlayCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HERO_CARD_DEFAULTS, type HeroCard } from "@/lib/hero-cards";
import type { HeroCardText } from "@/lib/queries/settings";

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/2169307/2169307-hd_1920_1080_30fps.mp4";
const VIDEO_POSTER =
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop";

// Chips de destinos enlazados (anchor descriptivo + transfiere PageRank a /destinos)
const destinationChips = [
  { label: "Machu Picchu", slug: "machu-picchu" },
  { label: "Valle Sagrado", slug: "valle-sagrado" },
  { label: "Rainbow Mountain", slug: "rainbow-mountain" },
  { label: "Camino Inca", slug: "camino-inca" },
];

export function Hero({
  cardImages,
  cardTexts,
}: {
  /** Fotos subidas desde /admin/settings, por slug; fallback a las de stock. */
  cardImages?: Partial<Record<string, string>>;
  /** Texto/precio editados en /admin/settings; campo vacío = default. */
  cardTexts?: Partial<Record<string, HeroCardText>>;
}) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { m, locale } = useI18n();
  // Carrusel de las floating cards: `active` define cuál queda al frente.
  const [active, setActive] = useState(0);
  const cards = HERO_CARD_DEFAULTS.map((c): HeroCard => {
    const o = cardTexts?.[c.slug] ?? {};
    return {
      ...c,
      title: o.title || c.title,
      region: o.region || c.region,
      days: o.days || c.days,
      price: o.price || c.price,
      rating: o.rating || c.rating,
      reviews: o.reviews || c.reviews,
      img: cardImages?.[c.slug] || c.img,
    };
  });
  const cardCount = cards.length;
  const goPrev = () => setActive((a) => (a - 1 + cardCount) % cardCount);
  const goNext = () => setActive((a) => (a + 1) % cardCount);
  // Keyword visible sobre el H1 (refuerza "tours en Cusco / Machu Picchu" on-page)
  const keyword =
    locale === "en"
      ? "Cusco & Machu Picchu Tours"
      : "Tours en Cusco y Machu Picchu";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const el = ref.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[620px] sm:min-h-[680px] max-h-[940px] w-full overflow-hidden bg-turquoise-deep"
    >
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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-turquoise-deep/65 via-turquoise-deep/25 to-turquoise-deep/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-turquoise-deep/70 via-transparent to-transparent pointer-events-none" />

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: overlayOpacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-full grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center pt-20 sm:pt-24 pb-28 sm:pb-32"
      >
        {/* LEFT — text + CTA */}
        <div>
          {/* Eyebrow con keyword visible (sin opacity:0 → pinta de inmediato, LCP) */}
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-white/80 mb-4"
          >
            <span className="h-px w-8 bg-white/60" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              {keyword}
            </span>
          </motion.div>

          <motion.span
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-lg md:text-xl font-semibold tracking-wide"
          >
            {m.hero.eyebrow}
          </motion.span>

          {/* H1: sin opacity:0 ni delay → es el LCP, debe pintar al primer frame */}
          <motion.h1
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-bold leading-[0.95] text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {m.hero.title_a}{" "}
            <span className="text-white italic font-normal">
              {m.hero.title_emphasis}
            </span>{" "}
            {m.hero.title_b}
          </motion.h1>

          <motion.p
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 sm:mt-6 max-w-xl text-white/80 leading-relaxed text-sm sm:text-base md:text-lg"
          >
            {m.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-white px-5 sm:px-7 py-3 sm:py-3.5 text-turquoise-deep font-semibold text-sm sm:text-base transition hover:bg-white/90"
            >
              {m.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <button className="flex items-center gap-3 text-white/85 hover:text-white transition group">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-white/15 border border-white/20 group-hover:scale-110 transition">
                <PlayCircle className="w-5 h-5 text-white" />
              </span>
              <span className="text-sm uppercase tracking-wider">
                {m.hero.videoCta}
              </span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 hidden md:flex items-center gap-5 flex-wrap"
          >
            <span className="text-white/70 text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              {m.sections.destinations.eyebrow}
            </span>
            {destinationChips.map((d) => (
              <Link
                key={d.slug}
                href={`/destinos/${d.slug}`}
                className="inline-flex items-center gap-1.5 text-white/90 text-xs font-medium hover:text-white transition drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
              >
                <MapPin className="w-3 h-3 text-white/70" />
                {d.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — floating destination cards */}
        <div className="relative h-[500px] hidden lg:block">
          {/* Decorative glow ring behind cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[15%] right-[5%] w-32 h-32 rounded-full border border-white/20 pointer-events-none" />

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute -top-2 right-4 z-40 flex items-center gap-2 text-white"
          >
            <span className="text-sm font-semibold uppercase tracking-wider">Top destinos</span>
            <span className="text-2xl">↘</span>
          </motion.div>

          {cards.map((d, i) => (
            <FloatingCard
              key={d.slug}
              destination={d}
              index={i}
              posIndex={(i - active + cardCount) % cardCount}
            />
          ))}

          {/* Nav + counter */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Anterior"
              className="bg-white/10 hover:bg-white border border-white/20 hover:border-white w-11 h-11 rounded-full grid place-items-center text-white hover:text-turquoise-deep backdrop-blur transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-white text-sm font-semibold tabular-nums">
              <span className="text-white font-bold">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/60">
                {String(cardCount).padStart(2, "0")}
              </span>
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente"
              className="bg-white/10 hover:bg-white border border-white/20 hover:border-white w-11 h-11 rounded-full grid place-items-center text-white hover:text-turquoise-deep backdrop-blur transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-turquoise-deep/90"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
          <BottomStat value="6" label={m.sections.stats.tours} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="4" label={m.sections.stats.destinations} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="100%" label={m.sections.stats.certifiedGuides} />

          <div className="hidden lg:flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest">
            <span>Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-px h-5 bg-gradient-to-b from-white/40 to-transparent"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function BottomStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-base sm:text-xl font-bold text-white leading-tight">
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] text-white/55 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function FloatingCard({
  destination,
  index,
  posIndex,
}: {
  destination: HeroCard;
  index: number;
  posIndex: number;
}) {
  // Overlapping cluster — front card prominent, others peeking behind.
  // `posIndex` (no `index`) decide la posición, para que las flechas roten
  // qué card queda al frente.
  const positions = [
    { top: "10%", left: "0%", rotate: -6, z: 30, scale: 1 },
    { top: "0%", left: "35%", rotate: 5, z: 20, scale: 0.92 },
    { top: "32%", left: "44%", rotate: -3, z: 10, scale: 0.85 },
  ];
  const pos = positions[posIndex];
  const floatDuration = 5 + posIndex * 0.7;
  const floatRange = 10 + posIndex * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      animate={{
        opacity: 1,
        y: [0, -floatRange, 0],
        rotate: pos.rotate,
        scale: pos.scale,
        top: pos.top,
        left: pos.left,
      }}
      transition={{
        opacity: { delay: 0.5 + index * 0.15, duration: 0.9 },
        // Sin delay de entrada en estas → al pulsar las flechas las cards
        // se reordenan al instante (suave), no con ~0.5s de retardo.
        rotate: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        top: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        left: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        y: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
          delay: 1 + index * 0.3,
        },
      }}
      whileHover={{ scale: pos.scale * 1.05, rotate: 0, zIndex: 50, y: -12 }}
      style={{ zIndex: pos.z }}
      className="absolute w-60 cursor-pointer group"
    >
      <Link
        href={`/destinos/${destination.slug}`}
        aria-label={`${destination.title} — ${destination.region}, ${destination.country}`}
        className="relative block w-full h-[340px] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        {/* Image */}
        <Image
          src={destination.img}
          alt={`${destination.title}, ${destination.region}, ${destination.country} — tour con Boleto Machu Picchu Tours`}
          fill
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          // La tarjeta es vertical (240×340) pero el optimizador escala por
          // ANCHO: con sizes=240px una foto apaisada llega de ~256×170 y se
          // estira a 340px de alto → borrosa. 480px da margen para el
          // recorte vertical + pantallas 2x.
          sizes="480px"
        />

        {/* Dark gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-turquoise-deep/50 via-transparent to-turquoise-deep/95" />

        {/* Top row: location + rating */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="text-white text-[10px] uppercase tracking-[0.25em] drop-shadow-lg">
            <div className="opacity-75">{destination.country}</div>
            <div className="font-semibold mt-0.5">{destination.region}</div>
          </div>
          {destination.reviews > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] text-turquoise-deep shadow-lg">
              <Star className="w-3 h-3 fill-turquoise-deep text-turquoise-deep" />
              <span className="font-bold">{destination.rating}</span>
            </div>
          )}
        </div>

        {/* Bottom: title + meta */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-wider mb-2">
            <span>{destination.days}</span>
            {destination.reviews > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{destination.reviews}+ reseñas</span>
              </>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
            {destination.title}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/55">
                Desde
              </div>
              <div className="text-xl font-bold text-white">
                US$ {destination.price}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-white text-turquoise-deep shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Turquoise accent border that appears on hover — está sobre la
            foto de la tarjeta, no sobre el overlay turquesa del hero, así
            que sí puede usar turquesa como accent sin perder contraste. */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-turquoise/0 group-hover:ring-turquoise/60 transition-all duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores nuevos relacionados a `hero.tsx`.

- [ ] **Step 3: Verificación visual**

```bash
npm run dev
```

Abrir `http://localhost:3000/es`. Expected: el hero tiene un overlay **azul turquesa oscuro** sobre la foto/video (no negro/navy), el botón "Ver tours" (CTA) es **blanco sólido con texto turquesa oscuro** (no dorado), las 3 tarjetas flotantes muestran un badge de rating blanco (no dorado) cuando hay reseñas, el precio "Desde US$X" en blanco, y al pasar el mouse sobre una tarjeta aparece un anillo turquesa (no dorado) alrededor de la foto. Las flechas de navegación del carrusel se vuelven blancas con texto turquesa oscuro al hover. La barra de stats inferior (6 tours / 4 destinos / 100%) se lee bien sobre el fondo turquesa oscuro. Detener el server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat(design): hero turquesa/agencia (Fase 4b-1)"
```

---

### Task 2: Stats — recolorear y tipografía

**Files:**
- Modify: `src/components/sections/stats.tsx`

**Interfaces:** ninguna — `Stats({ polaroidImages })`, `Stat`, `PolaroidGallery` no cambian de firma.

**Depende de:** ninguna (independiente de Task 1).

- [ ] **Step 1: Reemplazar el contenido completo de `stats.tsx`**

```tsx
"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Compass, Globe2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const stats = [
  { icon: Compass, value: 6, labelKey: "tours" as const, suffix: "" },
  { icon: Globe2, value: 4, labelKey: "destinations" as const, suffix: "" },
  { icon: ShieldCheck, value: 100, labelKey: "certifiedGuides" as const, suffix: "%" },
];

export function Stats({
  polaroidImages,
}: {
  /** Fotos subidas desde /admin/settings; fallback a las de stock. */
  polaroidImages?: Partial<Record<"polaroid_1" | "polaroid_2" | "polaroid_3", string>>;
}) {
  const { m, locale } = useI18n();
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 bg-stone">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <div className="grid grid-cols-3 gap-6 mb-12">
            {stats.map((s, i) => (
              <Stat
                key={s.labelKey}
                {...s}
                label={m.sections.stats[s.labelKey]}
                delay={i * 0.15}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-night/70 leading-relaxed max-w-md"
          >
            {locale === "en" ? (
              <>
                We design itineraries for curious travelers: from the citadel of
                Machu Picchu at dawn to shamanic hikes through sacred valleys.
                The first 50 bookings of the month get{" "}
                <span className="text-turquoise font-semibold">15% off</span>.
              </>
            ) : (
              <>
                Diseñamos itinerarios para viajeros curiosos: desde la ciudadela
                de Machu Picchu al amanecer, hasta caminatas chamánicas por
                valles sagrados. Los primeros 50 reservantes del mes obtienen{" "}
                <span className="text-turquoise font-semibold">15% de descuento</span>.
              </>
            )}
          </motion.p>

          <div className="mt-8">
            <button className="text-turquoise hover:text-turquoise-deep text-sm font-medium underline-offset-4 hover:underline transition">
              {m.common.learnMore} →
            </button>
          </div>
        </div>

        <div className="relative h-[500px] hidden lg:block">
          <PolaroidGallery images={polaroidImages} />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  suffix,
  delay,
}: {
  icon: typeof Compass;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    }
  }, [inView, value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <Icon className="w-6 h-6 text-turquoise mx-auto mb-3" />
      <div className="flex items-baseline justify-center gap-0.5">
        <motion.span className="text-3xl sm:text-4xl md:text-5xl font-bold text-night">
          {rounded}
        </motion.span>
        <span className="text-2xl sm:text-3xl font-bold text-turquoise">{suffix}</span>
      </div>
      <div className="mt-2 text-xs text-night/60 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

const polaroids = [
  {
    key: "polaroid_1" as const,
    src: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=600&auto=format&fit=crop",
    rotate: -7,
    top: "0%",
    left: "2%",
  },
  {
    key: "polaroid_2" as const,
    src: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&auto=format&fit=crop",
    rotate: 5,
    top: "24%",
    left: "42%",
  },
  {
    key: "polaroid_3" as const,
    src: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600&auto=format&fit=crop",
    rotate: -5,
    top: "47%",
    left: "8%",
  },
];

function PolaroidGallery({
  images,
}: {
  images?: Partial<Record<"polaroid_1" | "polaroid_2" | "polaroid_3", string>>;
}) {
  return (
    <>
      {polaroids.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: i * 0.18, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.05, zIndex: 50 }}
          style={{ top: p.top, left: p.left }}
          className="absolute w-56 polaroid rounded-sm cursor-pointer"
        >
          <Image
            src={images?.[p.key] || p.src}
            alt=""
            width={224}
            height={224}
            // 448 y no 224: el recorte cuadrado de una foto apaisada + DPR 2x
            // necesita más ancho del optimizador o llega borrosa (ver hero).
            sizes="448px"
            loading="lazy"
            className="w-full h-56 object-cover rounded-sm"
          />
        </motion.div>
      ))}

      {/* Label que cierra el espacio vacío inferior-derecho (antes era una
          firma manuscrita en font-hand — sin script, se convierte en un
          label uppercase, mismo patrón que los demás eyebrows del sitio) */}
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-6 right-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-turquoise pointer-events-none drop-shadow-sm"
      >
        Cusco, Perú
      </motion.span>
    </>
  );
}
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores nuevos relacionados a `stats.tsx`.

- [ ] **Step 3: Verificación visual**

```bash
npm run dev
```

Abrir `http://localhost:3000/es` y bajar hasta la sección de stats (después del hero). Expected: los 3 íconos (brújula/globo/escudo) y el "%" del tercer número en **turquesa** (no dorado), el texto resaltado "15% de descuento" en turquesa, el botón "Saber más →" en turquesa, y el label "Cusco, Perú" junto a las polaroids como texto uppercase turquesa (ya no en cursiva/script). Detener el server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/stats.tsx
git commit -m "feat(design): stats turquesa/agencia (Fase 4b-1)"
```

---

### Task 3: Verificación final de la sub-fase

**Depende de:** Tasks 1-2 completos.

- [ ] **Step 1: Build de producción**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run build
```

Expected: build exitoso, sin errores de TypeScript ni de Next.js.

- [ ] **Step 2: Grep — sin gold/font-display/font-hand/shadow-glow en ninguno de los 2 archivos**

```bash
grep -n "gold\|font-display\|font-hand\|shadow-glow" src/components/sections/hero.tsx src/components/sections/stats.tsx
```

Expected: sin resultados — a diferencia de navbar/footer, estos 2 archivos no tienen ninguna excepción de "logo" pendiente, así que ni siquiera queda un `text-gradient-gold`.

- [ ] **Step 3: Grep — `night` como background debe haber desaparecido de `hero.tsx`; en `stats.tsx` debe seguir como color de texto**

```bash
grep -n "night" src/components/sections/hero.tsx src/components/sections/stats.tsx
```

Expected: **0 resultados en `hero.tsx`** (todo era background/overlay, migró completo a `turquoise-deep`); **3 resultados en `stats.tsx`** (`text-night/70`, `text-night`, `text-night/60` — texto oscuro legítimo sobre el fondo claro `bg-stone`, no se toca).

- [ ] **Step 4: Recorrido visual completo**

```bash
npm run dev
```

Abrir `/es` y revisar hero + stats juntos, en escritorio y en una ventana angosta (móvil). Expected: consistente en turquesa/blanco en ambas secciones, sin restos de dorado/navy. Revisar también que el navbar transparente (arriba del hero, antes de hacer scroll) se siga viendo bien — su hover dorado en ese estado es intencional y no se toca en esta sub-fase (ver Global Constraints). Detener el server.

- [ ] **Step 5: Push (si el usuario lo confirma)**

Solo tras confirmación explícita del usuario — este repo no tiene remoto Git configurado, el "deploy" es vía `vercel --prod`.

---

## Self-Review

**Spec coverage:** las 7 reglas del spec (`2026-08-03-boletomachupicchutours-fase4b1-hero-stats-design.md`) están aplicadas: overlay turquesa con opacidad subida (Task 1, sección "Gradient overlays" + `FloatingCard`), botones con fondo propio → blanco/turquoise-deep (Task 1: CTA, flechas, mini-botón, badge de rating), texto suelto sobre la foto → blanco (Task 1: eyebrow, chips, contador, precio), ring turquesa sobre las fotos de las tarjetas (Task 1: `FloatingCard` borde final), badge de rating sin excepción dorada (Task 1), tipografía sin `font-display`/`font-hand` en ningún lado incluida la firma reconvertida (Task 1 + Task 2), stats.tsx directo a turquesa sin problema de contraste (Task 2).

**Placeholder scan:** sin TBD/TODO. Ambos archivos se reemplazan completos, código real en cada step.

**Type consistency:** `Hero({ cardImages, cardTexts })`, `BottomStat({ value, label })`, `FloatingCard({ destination, index, posIndex })`, `Stats({ polaroidImages })`, `Stat({ icon, value, label, suffix, delay })`, `PolaroidGallery({ images })` — ninguna firma cambia respecto al archivo original; ambos consumidores (`page.tsx`, que no está en este diff) siguen funcionando sin cambios.
