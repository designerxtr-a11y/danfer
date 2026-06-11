import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";

/**
 * Tarjeta de conversión al final de cada post — el blog es donde aterriza
 * el tráfico orgánico y antes terminaba sin un camino visual a la reserva.
 */
export function PostCta({ locale }: { locale: "es" | "en" }) {
  const en = locale === "en";
  return (
    <aside className="mt-14 relative overflow-hidden rounded-3xl bg-night px-6 py-10 sm:px-10 sm:py-12 text-center">
      {/* Glow decorativo, mismo lenguaje visual del hero */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <span className="font-hand text-gold text-2xl">
          {en ? "Ready for the adventure?" : "¿Listo para la aventura?"}
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-4xl text-white leading-tight">
          {en ? "Experience it with " : "Vívelo con "}
          <span className="text-gradient-gold italic">
            {en ? "local guides" : "guías locales"}
          </span>
        </h2>
        <p className="mt-3 text-white/65 text-sm sm:text-base max-w-xl mx-auto">
          {en
            ? "Certified guides, small groups and everything arranged for you: tickets, trains and transport. Operating in Cusco for 12 years."
            : "Guías certificados, grupos pequeños y todo resuelto por ti: entradas, trenes y transporte. 12 años operando en Cusco."}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-night font-semibold text-sm sm:text-base hover:bg-gold-bright hover:shadow-glow transition"
          >
            {en ? "Browse tours" : "Ver los tours"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-white/85 text-sm sm:text-base hover:border-gold hover:text-gold transition"
          >
            <MessageCircle className="w-4 h-4" />
            {en ? "Ask us anything" : "Escríbenos"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
