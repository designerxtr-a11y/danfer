import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { t, type Tour } from "@/types/database";

/**
 * Recuadro de tour para insertar a mitad de un post desde el markdown:
 *
 *   <TourCta slug="machu-picchu-2d-1n" />
 *
 * Foto, duración y precio salen del catálogo (tabla tours), así que nunca
 * quedan desfasados del precio de la ficha. La página precarga los tours.
 */
export function TourCta({
  tour,
  locale,
  whatsapp,
  postTitle,
}: {
  tour: Tour;
  locale: "es" | "en";
  whatsapp: string;
  postTitle: string;
}) {
  const en = locale === "en";
  const title = t(tour.title, locale);
  const msg = en
    ? `Hi Danfer Tours, I read your article "${postTitle}" and I'm interested in the "${title}" tour.`
    : `Hola Danfer Tours, leí su artículo "${postTitle}" y me interesa el tour "${title}".`;
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  return (
    <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-night/10 bg-white shadow-card sm:flex">
      {tour.cover_image && (
        <div className="relative aspect-[16/9] sm:aspect-auto sm:w-56 shrink-0">
          <Image
            src={tour.cover_image}
            alt={title}
            fill
            sizes="(min-width:640px) 224px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {en ? "Recommended tour" : "Tour recomendado"}
        </p>
        <p className="mt-1 font-display text-xl sm:text-2xl text-night leading-snug">
          {title}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-night/65">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {t(tour.duration_label, locale)}
          </span>
          <span>
            {en ? "From " : "Desde "}
            <strong className="text-night">US${tour.price_usd}</strong>
            {en ? " per person" : " por persona"}
          </span>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-white font-semibold text-sm hover:brightness-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            {en ? "Book on WhatsApp" : "Reservar por WhatsApp"}
          </a>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-night/15 px-5 py-2.5 text-night font-semibold text-sm hover:border-gold hover:text-gold transition"
          >
            {en ? "See the tour" : "Ver el tour"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
