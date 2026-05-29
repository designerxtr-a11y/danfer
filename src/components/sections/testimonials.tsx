import { getLocale } from "next-intl/server";
import { getTopReviews } from "@/lib/queries/reviews";
import { tr } from "@/lib/i18n/messages";
import type { Locale } from "@/types/database";
import { TestimonialsCarousel } from "./testimonials.client";

export async function Testimonials() {
  const reviews = await getTopReviews(8);
  if (reviews.length === 0) return null;

  const locale = (await getLocale()) as Locale;
  const m = tr(locale);

  return (
    <section id="reviews" className="relative py-20 md:py-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-hand text-gold text-2xl">{m.sections.testimonials.eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-7xl text-night">
            {m.sections.testimonials.title_a}{" "}
            <span className="text-gradient-gold italic">{m.sections.testimonials.title_emphasis}</span>
          </h2>
        </div>
        <TestimonialsCarousel reviews={reviews} locale={locale} />
      </div>
    </section>
  );
}
