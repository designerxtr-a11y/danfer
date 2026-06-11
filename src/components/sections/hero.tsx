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
      className="relative h-screen min-h-[620px] sm:min-h-[680px] max-h-[940px] w-full overflow-hidden bg-night"
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
      <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/15 to-night/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-transparent pointer-events-none" />

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
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              {keyword}
            </span>
          </motion.div>

          <motion.span
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-hand text-gold text-2xl md:text-3xl"
          >
            {m.hero.eyebrow}
          </motion.span>

          {/* H1: sin opacity:0 ni delay → es el LCP, debe pintar al primer frame */}
          <motion.h1
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display font-bold leading-[0.95] text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {m.hero.title_a}{" "}
            <span className="text-gradient-gold italic font-normal">
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
              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gold px-5 sm:px-7 py-3 sm:py-3.5 text-night font-semibold text-sm sm:text-base transition hover:bg-gold-bright hover:shadow-glow"
            >
              {m.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <button className="flex items-center gap-3 text-white/85 hover:text-gold transition group">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-white/15 border border-white/20 group-hover:scale-110 transition">
                <PlayCircle className="w-5 h-5 text-gold" />
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
                className="inline-flex items-center gap-1.5 text-white/90 text-xs font-medium hover:text-gold transition drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
              >
                <MapPin className="w-3 h-3 text-gold" />
                {d.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — floating destination cards */}
        <div className="relative h-[500px] hidden lg:block">
          {/* Decorative glow ring behind cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[15%] right-[5%] w-32 h-32 rounded-full border border-gold/30 pointer-events-none" />

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute -top-2 right-4 z-40 flex items-center gap-2 text-gold"
          >
            <span className="font-hand text-xl">Top destinos</span>
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
              className="bg-white/10 hover:bg-gold border border-white/20 hover:border-gold w-11 h-11 rounded-full grid place-items-center text-white hover:text-night backdrop-blur transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-display text-white text-sm tabular-nums">
              <span className="text-gold">
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
              className="bg-white/10 hover:bg-gold border border-white/20 hover:border-gold w-11 h-11 rounded-full grid place-items-center text-white hover:text-night backdrop-blur transition"
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
          alt={`${destination.title}, ${destination.region}, ${destination.country} — tour con Danfer Tours Cusco`}
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
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night/95" />

        {/* Top row: location + rating */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="text-white text-[10px] uppercase tracking-[0.25em] drop-shadow-lg">
            <div className="opacity-75">{destination.country}</div>
            <div className="font-semibold mt-0.5">{destination.region}</div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-bright px-2.5 py-1 text-[11px] text-night shadow-lg">
            <Star className="w-3 h-3 fill-night text-night" />
            <span className="font-bold">{destination.rating}</span>
          </div>
        </div>

        {/* Bottom: title + meta */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-wider mb-2">
            <span>{destination.days}</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>{destination.reviews}+ reseñas</span>
          </div>
          <h3 className="font-display text-2xl text-white leading-tight drop-shadow-md">
            {destination.title}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/55">
                Desde
              </div>
              <div className="font-display text-xl font-bold text-gold">
                US$ {destination.price}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-gold text-night shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Gold accent border that appears on hover */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-gold/0 group-hover:ring-gold/60 transition-all duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
