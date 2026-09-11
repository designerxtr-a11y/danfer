import { ArrowRight, MountainSnow } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedTours } from "@/lib/queries/tours";
import { tr } from "@/lib/i18n/messages";
import type { Locale } from "@/types/database";
import { FeaturedToursGrid } from "./featured-tours.client";

export async function FeaturedTours() {
  const featured = await getFeaturedTours(6);
  // Mostramos filas completas (la grilla es de 3 columnas): 6, o si no llega,
  // 3 — así nunca queda una tarjeta huérfana sola en la última fila.
  const tours = featured.length >= 6 ? featured.slice(0, 6) : featured.slice(0, 3);
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
        <div className="mb-10 max-w-2xl">
          <span className="flex items-center gap-2 font-hand text-gold text-2xl sm:text-3xl">
            <MountainSnow className="w-6 h-6" />
            {locale === "en" ? "Unforgettable, guaranteed" : "Inolvidables, garantizado"}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-night leading-[1.02]">
            {m.sections.featured.title_a}{" "}
            <span className="text-gradient-gold italic font-normal">
              {m.sections.featured.title_emphasis}
            </span>
          </h2>
        </div>

        <FeaturedToursGrid tours={tours} locale={locale} />

        <div className="mt-12 text-center">
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-night font-semibold text-sm hover:bg-gold-bright hover:shadow-glow transition"
          >
            {locale === "en" ? "View all tours" : "Ver todos los tours"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
