import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Map, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Página no encontrada · Danfer Tours Cusco",
  description:
    "La página que buscas no existe. Explora nuestros tours a Machu Picchu, Valle Sagrado y Camino Inca, o contáctanos.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-night">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-turquoise/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
        <div className="font-hand text-gold text-3xl md:text-4xl mb-2">
          Oops, te perdiste en los Andes
        </div>
        <h1 className="font-display text-7xl md:text-9xl font-bold leading-none">
          4<span className="text-gradient-gold italic">0</span>4
        </h1>
        <p className="mt-6 text-white/75 text-lg leading-relaxed max-w-md mx-auto">
          La página que buscas no existe o fue movida. Pero no te preocupes —
          tenemos muchas rutas por explorar.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-night px-6 py-3 rounded-full font-semibold transition"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            <Map className="w-4 h-4" />
            Ver tours
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition"
          >
            <MessageCircle className="w-4 h-4" />
            Contactar
          </Link>
        </div>

        {/* Suggested links */}
        <div className="mt-16">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            Quizás buscabas
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Machu Picchu", href: "/destinos/machu-picchu" },
              { label: "Camino Inca", href: "/destinos/camino-inca" },
              { label: "Valle Sagrado", href: "/destinos/valle-sagrado" },
              { label: "Rainbow Mountain", href: "/destinos/rainbow-mountain" },
              { label: "Blog", href: "/blog" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-gold hover:text-night border border-white/10 hover:border-gold text-white/80 text-sm px-4 py-2 rounded-full transition"
              >
                {l.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
