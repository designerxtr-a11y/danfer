"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Star,
  Clock,
  Mountain,
  Users,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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

export function FeaturedToursCarousel({
  tours,
  locale = "es",
}: {
  tours: TourWithCategory[];
  locale?: Locale;
}) {
  const m = tr(locale);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = tours.length;

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (!card) return;
    // Center the card in the viewport so it matches `snap-center`; otherwise
    // mandatory snap fights the programmatic scroll and snaps back to the
    // current card (arrows appear to do nothing). offsetLeft for both the card
    // and the scroller share the same offsetParent, so the difference is the
    // card's position inside the scroller's scroll area.
    const target =
      card.offsetLeft - el.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  };

  const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const handleNext = () => scrollToIndex(Math.min(total - 1, activeIndex + 1));

  // Track active card via scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const child = c as HTMLElement;
          const cardCenter = child.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(cardCenter - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActiveIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative">
      {/* Controls row */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 text-night/60">
          <span className="font-hand text-gold text-2xl">
            {locale === "en" ? "Swipe" : "Desliza"}
          </span>
          <span className="text-gold text-xl">→</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-display text-night text-sm tabular-nums">
            <span className="text-gold font-bold">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-night/30 mx-1">/</span>
            <span className="text-night/60">
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label={m.common.prev}
            className="w-12 h-12 rounded-full border border-night/15 hover:border-gold hover:bg-gold hover:text-night text-night/60 grid place-items-center transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === total - 1}
            aria-label={m.common.next}
            className="w-12 h-12 rounded-full border border-night/15 hover:border-gold hover:bg-gold hover:text-night text-night/60 grid place-items-center transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll-snap carousel */}
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tours.map((tour, i) => (
          <TourCard
            key={tour.id}
            tour={tour}
            index={i}
            isBestseller={i === 0}
            locale={locale}
            m={m}
          />
        ))}
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {tours.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={locale === "en" ? `Go to tour ${i + 1}` : `Ir al tour ${i + 1}`}
            className={`h-1 rounded-full transition-all ${
              i === activeIndex
                ? "w-10 bg-gold"
                : "w-2 bg-night/20 hover:bg-night/40"
            }`}
          />
        ))}
      </div>
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
