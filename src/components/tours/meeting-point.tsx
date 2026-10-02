import { ExternalLink, MapPin } from "lucide-react";

// Every tour starts from Cusco's main square, so the map is fixed there.
// Google's keyless embed avoids depending on a Mapbox token.
const PLACE = "Plaza de Armas, Cusco, Perú";
const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(PLACE)}&z=17&output=embed`;
const LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLACE)}`;

export function MeetingPoint({ en }: { en: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-night/8 bg-white">
      <iframe
        src={EMBED_URL}
        title={en ? "Map of the Plaza de Armas, Cusco" : "Mapa de la Plaza de Armas de Cusco"}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[320px] w-full border-0"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="font-semibold text-night">Plaza de Armas, Cusco</p>
            <p className="text-sm text-night/60">
              {en
                ? "Hotel pickup in Cusco's historic center."
                : "Recojo en tu hotel del centro histórico de Cusco."}
            </p>
          </div>
        </div>
        <a
          href={LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
        >
          {en ? "Open in Google Maps" : "Abrir en Google Maps"}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
