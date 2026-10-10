"use client";

import type { Locale } from "@/types/database";

// Barra fija inferior en móvil: precio + botón que lleva al widget de reserva.
// El id lo usa el botón flotante de WhatsApp para subir y no taparla.
export function MobileBookingBar({
  priceUsd,
  locale = "es",
}: {
  priceUsd: number;
  locale?: Locale;
}) {
  const en = locale === "en";
  return (
    <div
      id="mobile-booking-bar"
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-night/10 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
    >
      <div className="leading-tight">
        <span className="text-xs text-night/55">{en ? "From" : "Desde"}</span>
        <div>
          <span className="font-display text-2xl text-gold font-bold">
            US${priceUsd.toFixed(0)}
          </span>
          <span className="ml-1 text-xs text-night/60">{en ? "/ person" : "/ persona"}</span>
        </div>
      </div>
      <button
        onClick={() =>
          document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="rounded-full bg-gold hover:bg-gold-bright text-white font-semibold px-7 py-3 transition"
      >
        {en ? "Book now" : "Reservar"}
      </button>
    </div>
  );
}
