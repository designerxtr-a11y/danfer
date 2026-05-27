import { getCategoriesWithTours } from "@/lib/queries/categories";
import { DestinationsTabs } from "./destinations.client";

export async function Destinations() {
  const categories = await getCategoriesWithTours();
  if (categories.length === 0) return null;

  return (
    <section
      id="destinations"
      className="relative py-32 overflow-hidden bg-stone"
    >
      {/* Decorative background */}
      <div className="absolute top-20 -left-32 w-[420px] h-[420px] rounded-full bg-turquoise/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-[420px] h-[420px] rounded-full bg-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-gold/20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-night/60 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              Explora Cusco
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <span className="font-hand text-gold text-2xl">
            De los Andes a la selva
          </span>
          <h2 className="mt-2 font-display text-5xl md:text-6xl lg:text-7xl text-night leading-[1.02]">
            Explora por{" "}
            <span className="text-gradient-gold italic font-normal">región</span>
          </h2>
          <p className="mt-5 text-night/60 max-w-xl mx-auto leading-relaxed">
            Desde la ciudadela sagrada hasta los nevados andinos — cada destino
            es una historia que cambia vidas.
          </p>
        </div>
        <DestinationsTabs categories={categories} />
      </div>
    </section>
  );
}
