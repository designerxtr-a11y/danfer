"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard } from "@/components/sections/featured-tours.client";
import { tr } from "@/lib/i18n/messages";
import type { Locale, TourWithCategory } from "@/types/database";
import { L } from "@/lib/i18n/pick";

export function RelatedTours({ tours, locale = "es" }: { tours: TourWithCategory[]; locale?: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const m = tr(locale);

  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-night/8">
      <div className="mb-8 md:mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="font-hand text-gold text-2xl">{L(locale, { es: "También te puede gustar", en: "You may also like", ja: "こちらもおすすめ" })}</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
            {L(locale, { es: "Otros tours en la región", en: "More tours in the region", ja: "この地域のほかのツアー" })}
          </h2>
        </div>
        {tours.length > 1 && (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              onClick={() => scroll(-1)}
              aria-label={L(locale, { es: "Anterior", en: "Previous", ja: "前へ" })}
              className="w-11 h-11 rounded-full border border-night/15 hover:border-gold hover:text-gold grid place-items-center transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label={L(locale, { es: "Siguiente", en: "Next", ja: "次へ" })}
              className="w-11 h-11 rounded-full bg-gold hover:bg-gold-bright text-white grid place-items-center transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tours.map((tour, i) => (
          <TourCard key={tour.id} tour={tour} index={i} isBestseller={false} locale={locale} m={m} />
        ))}
      </div>
    </section>
  );
}
