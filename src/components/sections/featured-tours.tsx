import { ArrowRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedTours } from "@/lib/queries/tours";
import { tr } from "@/lib/i18n/messages";
import type { Locale } from "@/types/database";
import { FeaturedToursCarousel } from "./featured-tours.client";

export async function FeaturedTours() {
  const tours = await getFeaturedTours(6);
  const locale = (await getLocale()) as Locale;
  const m = tr(locale);

  if (tours.length === 0) {
    return (
      <section id="tours" className="py-32 px-6 bg-stone">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-hand text-gold text-2xl">Próximamente</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl text-night">
            Aún no hay tours destacados
          </h2>
          <p className="mt-4 text-night/60">
            Crea tus primeros tours en el panel admin y márcalos como
            destacados (<code>is_featured = true</code>) para que aparezcan aquí.
          </p>
          <a
            href="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-night px-6 py-3 text-white text-sm font-semibold hover:bg-gold transition"
          >
            Ir al admin
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="tours"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-turquoise/6 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-night/60 mb-3">
              <span className="h-px w-8 bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.3em]">
                {m.sections.featured.eyebrow}
              </span>
            </div>
            <span className="font-hand text-gold text-2xl">
              {locale === "en" ? "Unforgettable, guaranteed" : "Inolvidables, garantizado"}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-night leading-[1.02]">
              {m.sections.featured.title_a}{" "}
              <span className="text-gradient-gold italic font-normal">
                {m.sections.featured.title_emphasis}
              </span>
            </h2>
          </div>
          <div className="flex flex-col md:items-end gap-4">
            <p className="text-night/60 max-w-sm">
              {m.sections.featured.subtitle}
            </p>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 text-night font-semibold text-sm hover:text-gold transition"
            >
              {locale === "en" ? "View all tours" : "Ver todos los tours"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        <FeaturedToursCarousel tours={tours} locale={locale} />
      </div>
    </section>
  );
}
