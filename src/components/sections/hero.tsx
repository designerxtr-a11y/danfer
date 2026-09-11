"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { ArrowRight, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_CARD_DEFAULTS, type HeroCard } from "@/lib/hero-cards";
import type { HeroCardText } from "@/lib/queries/settings";

// Chips de destinos enlazados (anchor descriptivo + transfiere PageRank a /destinos)
const destinationChips = [
  { label: "Machu Picchu", slug: "machu-picchu" },
  { label: "Valle Sagrado", slug: "valle-sagrado" },
  { label: "Rainbow Mountain", slug: "rainbow-mountain" },
  { label: "Camino Inca", slug: "camino-inca" },
];

const AUTO_ADVANCE_MS = 3000;

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
  const { m, locale } = useI18n();
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
  const count = cards.length;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const current = cards[active % count];

  // Auto-avance: la tarjeta activa pasa a ser el fondo/título del hero.
  // `progress` (0-100) alimenta la barra de tiempo restante; se pausa con
  // el mouse sobre la fila de tarjetas sin reiniciar el conteo.
  useEffect(() => {
    if (count < 2) return;
    const tickMs = 50;
    let elapsedMs = 0;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      elapsedMs += tickMs;
      if (elapsedMs >= AUTO_ADVANCE_MS) {
        elapsedMs = 0;
        setActive((a) => (a + 1) % count);
        setProgress(0);
      } else {
        setProgress((elapsedMs / AUTO_ADVANCE_MS) * 100);
      }
    }, tickMs);
    return () => clearInterval(id);
  }, [count, active]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Keyword visible sobre el H1 (refuerza "tours en Cusco / Machu Picchu" on-page)
  const keyword =
    locale === "en"
      ? "Cusco & Machu Picchu Tours"
      : "Tours en Cusco y Machu Picchu";

  // Tarjetas "en cola": todas menos la activa, empezando por la siguiente
  // (la que sale de la cola al activarse reaparece al final tras el loop).
  const queue = [...cards.slice(active + 1), ...cards.slice(0, active)];

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[620px] sm:min-h-[680px] max-h-[940px] w-full overflow-hidden bg-night"
    >
      {/* Fondo: foto real de la tarjeta activa — entra agrandándose y
          desplazándose de derecha a izquierda (efecto "card opening"),
          igual sea por auto-avance o por clic, no un fundido plano. */}
      <AnimatePresence>
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, scale: 1.15, x: "6%" }}
          animate={{ opacity: 1, scale: 1, x: "0%" }}
          exit={{ opacity: 0, x: "-6%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={current.img}
            alt=""
            aria-hidden
            fill
            priority={active === 0}
            fetchPriority={active === 0 ? "high" : "auto"}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/15 to-night/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-transparent pointer-events-none" />

      {/* Barra de progreso hasta el próximo avance automático */}
      {count > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/10">
          <div
            className="h-full bg-gold"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: overlayOpacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-full flex items-center pt-20 sm:pt-24 pb-28 sm:pb-32"
      >
        <div className="max-w-2xl">
          {/* Eyebrow con keyword visible (fijo: no rota con las tarjetas, SEO) */}
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-white/80 mb-4"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              {keyword}
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={current.slug} initial="in" animate="in">
              <motion.span
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="font-hand text-gold text-2xl md:text-3xl"
              >
                {current.region}
              </motion.span>

              {/* H1: la primera tarjeta pinta sin opacity:0 → es el LCP */}
              <motion.h1
                initial={{ y: 18, opacity: active === 0 ? 1 : 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-display font-bold leading-[0.95] text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {current.title}
              </motion.h1>

              <motion.p
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-5 sm:mt-6 max-w-xl text-white/80 leading-relaxed text-sm sm:text-base md:text-lg"
              >
                {m.hero.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <Link
              href={`/destinos/${current.slug}`}
              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gold px-5 sm:px-7 py-3 sm:py-3.5 text-night font-semibold text-sm sm:text-base transition hover:bg-gold-bright hover:shadow-glow"
            >
              {m.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <div className="flex items-center gap-1 text-gold">
              <Star className="w-4 h-4 fill-gold" />
              <span className="text-white font-semibold text-sm">
                {current.rating}
              </span>
              <span className="text-white/60 text-xs">
                ({current.reviews}+)
              </span>
            </div>
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
                className="inline-flex items-center gap-1.5 text-white/90 text-xs font-medium hover:text-gold transition drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
              >
                <MapPin className="w-3 h-3 text-gold" />
                {d.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Fila recta de tarjetas "en cola" + controles — al hacer clic, esa
          tarjeta pasa a ser el fondo/título del hero (no navega). */}
      {count > 1 && (
        <div
          className="hidden lg:flex flex-col items-end gap-3 absolute z-20 bottom-24 sm:bottom-28 right-4 xl:right-10"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          <div className="flex gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {queue.map((d) => (
                <QueueCard
                  key={d.slug}
                  destination={d}
                  onSelect={() =>
                    setActive(cards.findIndex((c) => c.slug === d.slug))
                  }
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 text-white">
            <button
              type="button"
              onClick={() => setActive((a) => (a - 1 + count) % count)}
              aria-label="Anterior"
              className="w-9 h-9 rounded-full border border-white/25 hover:border-gold hover:text-gold grid place-items-center transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-display text-sm tabular-nums">
              <span className="text-gold">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/60">
                {String(count).padStart(2, "0")}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % count)}
              aria-label="Siguiente"
              className="w-9 h-9 rounded-full border border-white/25 hover:border-gold hover:text-gold grid place-items-center transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-night/85"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
          <BottomStat value="8,500+" label={m.hero.stats_travelers} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="12+" label={m.sections.stats.years} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="35" label={m.hero.stats_tours} />
          <span className="w-px h-7 bg-white/15 hidden md:block" />
          <BottomStat
            value="100%"
            label={locale === "en" ? "Certified guides" : "Guías certificados"}
          />

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
      <div className="font-display text-base sm:text-xl font-bold text-white leading-tight">
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] text-white/55 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function QueueCard({
  destination,
  onSelect,
}: {
  destination: HeroCard;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      layout
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Ver ${destination.title} — ${destination.region}, Perú`}
      className="group relative shrink-0 w-36 xl:w-44 h-52 xl:h-60 rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] cursor-pointer text-left"
    >
      <Image
        src={destination.img}
        alt=""
        aria-hidden
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="220px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent" />

      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-bright px-2 py-0.5 text-[10px] text-night shadow-lg">
        <Star className="w-2.5 h-2.5 fill-night text-night" />
        <span className="font-bold">{destination.rating}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-white/70 text-[9px] uppercase tracking-[0.2em]">
          {destination.region}
        </div>
        <div className="text-white text-sm font-bold leading-tight mt-1">
          {destination.title}
        </div>
        <div className="mt-1 text-[11px] text-gold font-semibold">
          Desde US$ {destination.price}
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-gold/0 group-hover:ring-gold/60 transition-all duration-300 pointer-events-none" />
    </motion.button>
  );
}
