import { FeaturedToursGrid } from "@/components/sections/featured-tours.client";
import type { TourWithCategory } from "@/types/database";

export function RelatedTours({ tours, en = false }: { tours: TourWithCategory[]; en?: boolean }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-night/8">
      <div className="mb-10 md:mb-12">
        <span className="font-hand text-gold text-2xl">{en ? "You may also like" : "También te puede gustar"}</span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
          {en ? "More tours in the region" : "Otros tours en la región"}
        </h2>
      </div>
      <FeaturedToursGrid tours={tours} locale={en ? "en" : "es"} />
    </section>
  );
}
