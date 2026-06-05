"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Star, Clock, Users, Flame } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CategoryWithTours } from "@/lib/queries/categories";
import { t, type Locale } from "@/types/database";
import { tr } from "@/lib/i18n/messages";

export function DestinationsTabs({
  categories,
  locale,
}: {
  categories: CategoryWithTours[];
  locale: Locale;
}) {
  const m = tr(locale);
  const [active, setActive] = useState(categories[0].id);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-14">
        {categories.map((cat) => {
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`group relative font-hand text-3xl md:text-5xl transition px-3 ${
                isActive ? "text-gold" : "text-night/35 hover:text-night/70"
              }`}
            >
              <span className="relative">
                {t(cat.name, locale)}
                {isActive && (
                  <motion.div
                    layoutId="destinationUnderline"
                    className="absolute -bottom-1 inset-x-0 h-[3px] bg-gradient-to-r from-gold to-gold-bright rounded-full"
                  />
                )}
              </span>
              <span
                className={`absolute -top-2 -right-3 text-[10px] uppercase tracking-widest font-display font-bold transition ${
                  isActive ? "text-gold opacity-100" : "opacity-0"
                }`}
              >
                {String(cat.tours.length).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-5 gap-5"
        >
          {/* Featured (left, big) */}
          {current.tours[0] && (
            <Link
              href={`/tours/${current.tours[0].slug}`}
              className="lg:col-span-3 relative rounded-3xl overflow-hidden h-[460px] lg:h-[520px] group ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(11,25,41,0.35)] hover:shadow-[0_40px_80px_-25px_rgba(200,144,30,0.45)] transition-shadow duration-500"
            >
              <Image
                src={current.tours[0].cover_image}
                alt={t(current.tours[0].title, locale)}
                fill
                sizes="(min-width:1024px) 60vw, 100vw"
                className="object-cover group-hover:scale-105 transition duration-[1400ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/20" />

              {/* Top row: popular pill + rating */}
              <div className="absolute top-5 inset-x-5 flex items-start justify-between">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-gold to-gold-bright text-night text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <Flame className="w-3 h-3" />
                  {locale === "en" ? "Most popular" : "Más popular"}
                </div>
                {current.tours[0].reviews_count > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full bg-night/60 border border-white/15 px-3 py-1.5 text-xs text-white">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="font-semibold">
                      {current.tours[0].rating.toFixed(1)}
                    </span>
                    <span className="text-white/55">
                      ({current.tours[0].reviews_count})
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 text-white/70 text-[11px] uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {t(current.tours[0].duration_label, locale)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gold" />
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold" />
                      {m.tourDetail.upTo} {current.tours[0].max_group_size}
                    </span>
                  </div>
                  <h3 className="font-display text-4xl lg:text-5xl text-white max-w-md leading-[1.05]">
                    {t(current.tours[0].title, locale)}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/55">
                      {m.booking.from}
                    </span>
                    <span className="font-display text-3xl text-gold font-bold leading-none">
                      US${current.tours[0].price_usd.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gold grid place-items-center group-hover:rotate-45 group-hover:scale-110 transition duration-500 shadow-glow shrink-0">
                  <ArrowUpRight className="w-6 h-6 text-night" />
                </div>
              </div>

              {/* Gold ring on hover */}
              <div className="absolute inset-0 rounded-3xl ring-2 ring-gold/0 group-hover:ring-gold/60 transition-all duration-300 pointer-events-none" />
            </Link>
          )}

          {/* Side list (right) — premium vertical mini cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {current.tours.slice(1, 4).map((tour, i) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="group relative flex items-stretch gap-4 bg-white hover:bg-paper border border-night/5 hover:border-gold/40 rounded-2xl p-3 transition shadow-soft hover:shadow-card overflow-hidden"
              >
                {/* Tour number */}
                <div className="absolute top-3 right-3 font-display text-[10px] text-night/30 tabular-nums">
                  0{i + 2}
                </div>

                <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={tour.cover_image}
                    alt={t(tour.title, locale)}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
                  {tour.reviews_count > 0 && (
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white text-[10px] font-semibold drop-shadow-md">
                      <Star className="w-2.5 h-2.5 fill-gold text-gold" />
                      {tour.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-night/50 mb-1">
                      {t(tour.duration_label, locale)}
                    </div>
                    <h4 className="font-display text-base lg:text-lg text-night leading-tight line-clamp-2 group-hover:text-gold transition">
                      {t(tour.title, locale)}
                    </h4>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-night/45">
                        {m.booking.from}
                      </span>
                      <div className="font-display text-lg text-gold font-bold leading-none">
                        US${tour.price_usd.toFixed(0)}
                      </div>
                    </div>
                    <span className="grid place-items-center w-7 h-7 rounded-full bg-night/5 group-hover:bg-gold transition">
                      <ArrowUpRight className="w-3.5 h-3.5 text-night/50 group-hover:text-night transition" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* CTA — crece (flex-1) para rellenar el alto: la columna nunca
                queda vacía aunque la categoría tenga pocos tours. */}
            <Link
              href="/tours"
              className="group relative flex-1 min-h-[64px] overflow-hidden rounded-2xl bg-night text-white grid place-items-center px-6 py-4 text-center ring-1 ring-night/10 hover:ring-gold/50 transition-all"
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gold/15 blur-2xl pointer-events-none" />
              <span className="relative inline-flex items-center gap-2 font-display text-lg lg:text-xl">
                {locale === "en" ? "See all tours" : "Ver todos los tours"}
                <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </span>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
