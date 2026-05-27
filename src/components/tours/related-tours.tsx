import { FeaturedToursCarousel } from "@/components/sections/featured-tours.client";
import type { TourWithCategory } from "@/types/database";

export function RelatedTours({ tours }: { tours: TourWithCategory[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-t border-night/8">
      <div className="mb-12">
        <span className="font-hand text-gold text-2xl">También te puede gustar</span>
        <h2 className="mt-2 font-display text-4xl md:text-5xl text-night">
          Otros tours en la región
        </h2>
      </div>
      <FeaturedToursCarousel tours={tours} />
    </section>
  );
}
