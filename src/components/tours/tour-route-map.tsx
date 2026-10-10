import Image from "next/image";
import type { Locale } from "@/types/database";

/** Sección "La ruta" con la imagen del mapa del tour (solo si existe). */
export function TourRouteMap({ url, title, locale = "es" }: { url: string; title: string; locale?: Locale }) {
  const en = locale === "en";
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-5 gap-8 items-center">
      <div className="md:col-span-2">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-gold">
          {en ? "The route" : "La ruta"}
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl text-night">
          {en ? `${title} map` : `Mapa del tour ${title}`}
        </h2>
      </div>
      <div className="md:col-span-3 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card bg-white">
        <Image
          src={url}
          alt={en ? `${title} route map` : `Mapa de la ruta del tour ${title}`}
          fill
          sizes="(min-width:768px) 60vw, 100vw"
          className="object-contain"
        />
      </div>
    </section>
  );
}
