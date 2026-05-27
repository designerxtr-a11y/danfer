"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  PlayCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/2169307/2169307-hd_1920_1080_30fps.mp4";
const VIDEO_POSTER =
  "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop";

const destinationCards = [
  {
    country: "Perú",
    region: "Cusco",
    title: "Machu Picchu",
    rating: 4.9,
    reviews: 1840,
    days: "Full day",
    price: 380,
    img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Valle Sagrado",
    title: "Pisac & Ollanta",
    rating: 4.8,
    reviews: 920,
    days: "Full day",
    price: 195,
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Rainbow Mountain",
    rating: 4.7,
    reviews: 640,
    days: "Full day",
    price: 85,
    img: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=800&auto=format&fit=crop",
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className="relative h-screen min-h-[680px] max-h-[940px] w-full overflow-hidden bg-night"
    >
      {/* Background video */}
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
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/30 to-night/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent pointer-events-none" />

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: overlayOpacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 h-full grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center pt-24 pb-32"
      >
        {/* LEFT — text + CTA */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-white/70 mb-4"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              Cusco · Perú
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-hand text-gold text-2xl md:text-3xl"
          >
            Bienvenido al techo del mundo
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display font-bold leading-[0.95] text-white text-5xl md:text-6xl lg:text-7xl"
          >
            Viaja al{" "}
            <span className="text-gradient-gold italic font-normal">
              corazón
            </span>{" "}
            del Imperio Inca
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 max-w-xl text-white/75 leading-relaxed text-base md:text-lg"
          >
            Tours exclusivos por Machu Picchu, el Valle Sagrado y rutas
            ancestrales. Guías locales certificados, grupos pequeños,
            experiencias que cambian vidas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <a
              href="#tours"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-night font-semibold transition hover:bg-gold-bright hover:shadow-glow"
            >
              Reservar tour
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </a>
            <button className="flex items-center gap-3 text-white/85 hover:text-gold transition group">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-white/15 border border-white/20 group-hover:scale-110 transition">
                <PlayCircle className="w-5 h-5 text-gold" />
              </span>
              <span className="text-sm uppercase tracking-wider">Ver video</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 hidden md:flex items-center gap-5 flex-wrap"
          >
            <span className="text-white/45 text-[10px] uppercase tracking-[0.3em]">
              Destinos
            </span>
            {[
              "Machu Picchu",
              "Valle Sagrado",
              "Rainbow Mountain",
              "Camino Inca",
            ].map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 text-white/75 text-xs hover:text-gold transition cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-gold" />
                {d}
              </span>
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

          {destinationCards.map((d, i) => (
            <FloatingCard key={d.title} destination={d} index={i} />
          ))}

          {/* Nav + counter */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
            <button
              aria-label="Anterior"
              className="bg-white/10 hover:bg-gold border border-white/20 hover:border-gold w-11 h-11 rounded-full grid place-items-center text-white hover:text-night backdrop-blur transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-display text-white text-sm tabular-nums">
              <span className="text-gold">01</span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/60">03</span>
            </div>
            <button
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
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex items-center justify-between flex-wrap gap-3">
          <BottomStat value="8,500+" label="Viajeros felices" />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="12+" label="Años de experiencia" />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="35" label="Tours únicos" />
          <span className="w-px h-7 bg-white/15 hidden md:block" />
          <BottomStat value="100%" label="Guías certificados" />

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
      <div className="font-display text-xl font-bold text-white leading-tight">
        {value}
      </div>
      <div className="text-[10px] text-white/55 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function FloatingCard({
  destination,
  index,
}: {
  destination: (typeof destinationCards)[number];
  index: number;
}) {
  // Overlapping cluster — front card prominent, others peeking behind
  const positions = [
    { top: "10%", left: "0%", rotate: -6, z: 30, scale: 1 },
    { top: "0%", left: "35%", rotate: 5, z: 20, scale: 0.92 },
    { top: "32%", left: "44%", rotate: -3, z: 10, scale: 0.85 },
  ];
  const pos = positions[index];
  const floatDuration = 5 + index * 0.7;
  const floatRange = 10 + index * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      animate={{
        opacity: 1,
        y: [0, -floatRange, 0],
        rotate: pos.rotate,
        scale: pos.scale,
      }}
      transition={{
        opacity: { delay: 0.5 + index * 0.15, duration: 0.9 },
        rotate: { delay: 0.5 + index * 0.15, duration: 0.9 },
        scale: { delay: 0.5 + index * 0.15, duration: 0.9 },
        y: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
          delay: 1 + index * 0.3,
        },
      }}
      whileHover={{ scale: pos.scale * 1.05, rotate: 0, zIndex: 50, y: -12 }}
      style={{ top: pos.top, left: pos.left, zIndex: pos.z }}
      className="absolute w-60 cursor-pointer group"
    >
      <div className="relative w-full h-[340px] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        {/* Image */}
        <Image
          src={destination.img}
          alt={`${destination.title}, ${destination.region}, ${destination.country} — tour con Danfer Tours Cusco`}
          fill
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="240px"
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
      </div>
    </motion.div>
  );
}
