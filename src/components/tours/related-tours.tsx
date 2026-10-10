"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TourCard } from "@/components/sections/featured-tours.client";
import { tr } from "@/lib/i18n/messages";
import type { TourWithCategory } from "@/types/database";

export function RelatedTours({ tours, en = false }: { tours: TourWithCategory[]; en?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const locale = en ? "en" : "es";
  const m = tr(locale);

  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-night/8">
      <div className="mb-8 md:mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="font-hand text-gold text-2xl">{en ? "You may also like" : "También te puede gustar"}</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
            {en ? "More tours in the region" : "Otros tours en la región"}
          </h2>
        </div>
        {tours.length > 1 && (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              onClick={() => scroll(-1)}
              aria-label={en ? "Previous" : "Anterior"}
              className="w-11 h-11 rounded-full border border-night/15 hover:border-gold hover:text-gold grid place-items-center transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label={en ? "Next" : "Siguiente"}
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
