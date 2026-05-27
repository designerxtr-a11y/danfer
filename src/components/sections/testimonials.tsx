import { getTopReviews } from "@/lib/queries/reviews";
import { TestimonialsCarousel } from "./testimonials.client";

export async function Testimonials() {
  const reviews = await getTopReviews(8);
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="relative py-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="font-hand text-gold text-2xl">Reseñas verificadas</span>
          <h2 className="mt-2 font-display text-5xl md:text-7xl text-night">
            Lo que dicen <span className="text-gradient-gold italic">nuestros viajeros</span>
          </h2>
        </div>
        <TestimonialsCarousel reviews={reviews} />
      </div>
    </section>
  );
}
