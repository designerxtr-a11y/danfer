import { getLocale } from "next-intl/server";
import { getCategoriesWithTours } from "@/lib/queries/categories";
import { tr } from "@/lib/i18n/messages";
import type { Locale } from "@/types/database";
import { DestinationsTabs } from "./destinations.client";

export async function Destinations() {
  const categories = await getCategoriesWithTours();
  if (categories.length === 0) return null;

  const locale = (await getLocale()) as Locale;
  const m = tr(locale);

  return (
    <section
      id="destinations"
      className="relative py-20 md:py-32 overflow-hidden bg-stone"
    >
      {/* Decorative background */}
      <div className="absolute top-20 -left-32 w-[420px] h-[420px] rounded-full bg-turquoise/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-[420px] h-[420px] rounded-full bg-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-gold/20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-night/60 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              {locale === "en" ? "Explore Cusco" : "Explora Cusco"}
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <span className="font-hand text-gold text-2xl">
            {locale === "en" ? "From the Andes to the jungle" : "De los Andes a la selva"}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-night leading-[1.02]">
            {m.sections.destinations.title_a}{" "}
            <span className="text-gradient-gold italic font-normal">
              {m.sections.destinations.title_emphasis}
            </span>
          </h2>
          <p className="mt-5 text-night/60 max-w-xl mx-auto leading-relaxed">
            {m.sections.destinations.subtitle}
          </p>
        </div>
        <DestinationsTabs categories={categories} locale={locale} />
      </div>
    </section>
  );
}
