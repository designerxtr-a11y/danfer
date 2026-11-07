import Image from "next/image";
import type { Locale } from "@/types/database";
import { L } from "@/lib/i18n/pick";

/** Sección "La ruta" con la imagen del mapa del tour (solo si existe). */
export function TourRouteMap({ url, title, locale = "es" }: { url: string; title: string; locale?: Locale }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-5 gap-8 items-center">
      <div className="md:col-span-2">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-gold">
          {L(locale, { es: "La ruta", en: "The route", ja: "ルート" })}
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl text-night">
          {L(locale, { es: `Mapa del tour ${title}`, en: `${title} map`, ja: `${title}の地図` })}
        </h2>
      </div>
      <div className="md:col-span-3 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card bg-white">
        <Image
          src={url}
          alt={L(locale, { es: `Mapa de la ruta del tour ${title}`, en: `${title} route map`, ja: `${title}のルートマップ` })}
          fill
          sizes="(min-width:768px) 60vw, 100vw"
          className="object-contain"
        />
      </div>
    </section>
  );
}
