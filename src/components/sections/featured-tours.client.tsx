"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Star,
  Clock,
  Mountain,
  Users,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { TourWithCategory, Locale } from "@/types/database";
import { t } from "@/types/database";
import { tr } from "@/lib/i18n/messages";

const difficultyColor: Record<string, string> = {
  easy: "text-emerald-300",
  moderate: "text-amber-300",
  challenging: "text-orange-400",
  expert: "text-rose-400",
};

export function FeaturedToursGrid({
  tours,
  locale = "es",
}: {
  tours: TourWithCategory[];
  locale?: Locale;
}) {
  const m = tr(locale);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {tours.map((tour, i) => (
        <TourCard
          key={tour.id}
          tour={tour}
          index={i}
          isBestseller={i === 0}
          locale={locale}
          m={m}
          wrapperClassName="w-full group"
        />
      ))}
    </div>
  );
}

export function TourCard({
  tour,
  index,
  isBestseller,
  locale,
  m,
  wrapperClassName = "snap-center shrink-0 w-[300px] md:w-[340px] lg:w-[380px] group",
}: {
  tour: TourWithCategory;
  index: number;
  isBestseller: boolean;
  locale: Locale;
  m: ReturnType<typeof tr>;
  wrapperClassName?: string;
}) {
  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: Math.min(index, 6) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={wrapperClassName}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-night-deep ring-1 ring-night/10 shadow-[0_30px_60px_-25px_rgba(11,25,41,0.4)] hover:shadow-[0_40px_80px_-25px_rgba(200,144,30,0.45)] transition-shadow duration-500"
      >
        {/* Cover image */}
        <Image
          src={tour.cover_image}
          alt={t(tour.title, locale)}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 340px, 300px"
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/20" />

        {/* Discount ribbon (top-left, diagonal) */}
        {tour.discount_pct > 0 && (
          <div className="absolute top-5 -left-9 rotate-[-35deg] bg-gradient-to-r from-terracotta to-gold-bright text-white text-[10px] uppercase tracking-widest font-bold px-10 py-1 shadow-lg">
            -{tour.discount_pct}%
          </div>
        )}

        {/* Bestseller pill (only on first card) */}
        {isBestseller && (
          <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-gradient-to-r from-gold to-gold-bright text-night text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Flame className="w-3 h-3" />
            {locale === "en" ? "Best seller" : "Más vendido"}
          </div>
        )}

        {/* Top row: rating (solo si hay reseñas reales) */}
        {tour.reviews_count > 0 && (
          <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-night/60 border border-white/15 px-3 py-1.5 text-xs text-white">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-semibold">{tour.rating.toFixed(1)}</span>
            <span className="text-white/55">({tour.reviews_count})</span>
          </div>
        )}

        {!isBestseller && tour.category && (
          <span className="absolute top-5 left-5 rounded-full bg-night/60 border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/90 font-medium">
            {t(tour.category.name, locale)}
          </span>
        )}

        {/* Hover arrow */}
        <div className="absolute top-5 right-5 mt-14 opacity-0 group-hover:opacity-100 group-hover:mt-0 transition-all duration-500 delay-100">
          <div className="w-12 h-12 rounded-full bg-gold grid place-items-center shadow-glow">
            <ArrowUpRight className="w-5 h-5 text-night" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 inset-x-0 p-6 space-y-4">
          <div>
            <h3 className="font-display text-2xl lg:text-3xl text-white leading-[1.1]">
              {t(tour.title, locale)}
            </h3>
            {tour.subtitle && (
              <p className="mt-1.5 text-white/65 text-sm line-clamp-1">
                {t(tour.subtitle, locale)}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-[11px] text-white/70">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              {t(tour.duration_label, locale)}
            </span>
            <span
              className={`flex items-center gap-1.5 ${difficultyColor[tour.difficulty]}`}
            >
              <Mountain className="w-3.5 h-3.5" />
              {m.difficulty[tour.difficulty]}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gold" />
              {tour.max_group_size}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t border-white/10">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/50">
                {m.booking.from}
              </div>
              <div className="flex items-baseline gap-2">
                {tour.discount_pct > 0 && (
                  <span className="text-white/40 line-through text-sm">
                    US${tour.price_usd.toFixed(0)}
                  </span>
                )}
                <span className="font-display text-3xl text-gold font-bold leading-none">
                  US${finalPrice.toFixed(0)}
                </span>
              </div>
            </div>
            <span className="font-hand text-gold/80 text-lg leading-none">
              {m.booking.perPerson}
            </span>
          </div>
        </div>

        {/* Gold ring on hover */}
        <div className="absolute inset-0 rounded-3xl ring-2 ring-gold/0 group-hover:ring-gold/50 transition-all duration-300 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
