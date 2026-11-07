import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import type { Locale } from "@/types/database";

/**
 * Tarjeta de conversión al final de cada post — el blog es donde aterriza
 * el tráfico orgánico y antes terminaba sin un camino visual a la reserva.
 */
export function PostCta({
  locale,
  whatsappHref,
}: {
  locale: Locale;
  whatsappHref: string;
}) {
  return (
    <aside className="mt-14 relative overflow-hidden rounded-3xl bg-night px-6 py-10 sm:px-10 sm:py-12 text-center">
      {/* Glow decorativo, mismo lenguaje visual del hero */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <span className="font-hand text-gold text-2xl">
          {L(locale, { es: "¿Listo para la aventura?", en: "Ready for the adventure?", ja: "冒険の準備はできましたか？" })}
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-4xl text-white leading-tight">
          {L(locale, { es: "Vívelo con ", en: "Experience it with ", ja: "" })}
          <span className="text-gradient-gold italic">
            {L(locale, { es: "guías locales", en: "local guides", ja: "地元ガイドと一緒に体験しよう" })}
          </span>
        </h2>
        <p className="mt-3 text-white/65 text-sm sm:text-base max-w-xl mx-auto">
          {L(locale, { es: "Guías certificados, grupos pequeños y todo resuelto por ti: entradas, trenes y transporte. 12 años operando en Cusco.", en: "Certified guides, small groups and everything arranged for you: tickets, trains and transport. Operating in Cusco for 12 years.", ja: "認定ガイド、少人数制、チケット・列車・送迎もすべて手配します。クスコで12年の実績があります。" })}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-night font-semibold text-sm sm:text-base hover:bg-gold-bright hover:shadow-glow transition"
          >
            {L(locale, { es: "Ver los tours", en: "Browse tours", ja: "ツアーを見る" })}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-white/85 text-sm sm:text-base hover:border-gold hover:text-gold transition"
          >
            <MessageCircle className="w-4 h-4" />
            {L(locale, { es: "Escríbenos por WhatsApp", en: "Ask us on WhatsApp", ja: "WhatsAppで質問する" })}
          </a>
        </div>
      </div>
    </aside>
  );
}
