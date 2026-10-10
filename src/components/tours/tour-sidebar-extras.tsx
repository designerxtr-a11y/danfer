import { MessageCircle, Star, ThumbsUp } from "lucide-react";
import { FACEBOOK_REVIEWS } from "@/lib/facebook-reviews";
import type { Locale, Review } from "@/types/database";

/**
 * Reseña destacada: la más reciente del tour (con su rating real). Si el tour
 * aún no tiene, una recomendación de Facebook — sin estrellas, porque
 * Facebook no las da.
 */
export function FeaturedReview({ review, locale = "es" }: { review: Review | null; locale?: Locale }) {
  const en = locale === "en";
  const fb = review ? null : FACEBOOK_REVIEWS[0];
  const name = review?.author_name ?? fb?.author_name;
  const body = review?.body ?? review?.title ?? fb?.body;
  if (!name || !body) return null;

  return (
    <div className="bg-white border border-night/8 rounded-3xl p-5 sm:p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-terracotta grid place-items-center font-display text-lg font-bold text-white">
          {name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-night text-sm truncate">{name}</p>
          {review ? (
            <span className="flex gap-0.5" aria-label={`${review.rating}/5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-gold text-gold" : "text-night/15"}`} />
              ))}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-[#1877F2]">
              <ThumbsUp className="w-3 h-3" />
              {en ? "Recommends us on Facebook" : "Nos recomienda en Facebook"}
            </span>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm italic text-night/70 leading-relaxed line-clamp-5">“{body}”</p>
    </div>
  );
}

/** Tarjeta "habla con un experto" con WhatsApp precargado con el tour. */
export function ExpertCard({
  whatsapp,
  tourTitle,
  locale = "es",
}: {
  whatsapp: string;
  tourTitle: string;
  locale?: Locale;
}) {
  const en = locale === "en";
  const msg = en
    ? `Hi Danfer Tours! 👋 I have some questions about the "${tourTitle}" tour.`
    : `¡Hola Danfer Tours! 👋 Tengo unas consultas sobre el tour "${tourTitle}".`;
  return (
    <div className="bg-white border border-night/8 rounded-3xl p-5 sm:p-6 shadow-soft">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-gold">
        {en ? "Need local advice?" : "¿Necesitas ayuda local?"}
      </p>
      <p className="mt-1 font-display text-xl text-night">
        {en ? "Talk to a Cusco expert" : "Habla con un experto en Cusco"}
      </p>
      <p className="mt-2 text-sm text-night/65">
        {en
          ? "We help you with acclimatization, private departures and group discounts."
          : "Te ayudamos con la aclimatación, salidas privadas y descuentos para grupos."}
      </p>
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#128C4B] hover:underline"
      >
        <MessageCircle className="w-4 h-4" />
        {en ? "Message us on WhatsApp" : "Escríbenos por WhatsApp"}
      </a>
    </div>
  );
}
