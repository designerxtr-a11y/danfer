import Image from "next/image";
import { L, toLocale } from "@/lib/i18n/pick";
import { Link } from "@/i18n/navigation";
import { Shield, Award, Heart, Mountain, Users, Route, ArrowRight } from "lucide-react";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import type { Locale } from "@/types/database";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<import("next").Metadata> {
  const { locale } = await params;
  const lc: Locale = toLocale(locale);
  const title =
    L(lc, { es: "Sobre nosotros · Danfer Tours Cusco", en: "About us · Danfer Tours Cusco" });
  const description =
    L(lc, { es: "Conoce a Danfer Tours Cusco: operador turístico autorizado por MINCETUR con +12 años creando experiencias únicas en Machu Picchu, Valle Sagrado y Camino Inca.", en: "Meet Danfer Tours Cusco: a tour operator authorized by MINCETUR with 12+ years creating unique experiences in Machu Picchu, the Sacred Valley and the Inca Trail." });
  return {
    title,
    description,
    alternates: buildAlternates("/sobre-nosotros", lc),
    openGraph: {
      title,
      description,
      locale: ogLocale(lc),
    },
  };
}

const values = [
  {
    icon: Mountain,
    title: { es: "Operador local", en: "Local operator" },
    body: {
      es: "Nacimos en Cusco. Conocemos cada piedra, cada altura y cada secreto del imperio.",
      en: "We were born in Cusco. We know every stone, every altitude and every secret of the empire.",
    },
  },
  {
    icon: Award,
    title: { es: "Autorizados MINCETUR", en: "MINCETUR authorized" },
    body: {
      es: "Operador turístico oficial registrado. Guías licenciados y certificados.",
      en: "Officially registered tour operator. Licensed and certified guides.",
    },
  },
  {
    icon: Heart,
    title: { es: "Turismo responsable", en: "Responsible tourism" },
    body: {
      es: "Trabajamos con comunidades andinas. 10% de cada reserva va a proyectos locales.",
      en: "We work with Andean communities. 10% of every booking goes to local projects.",
    },
  },
  {
    icon: Shield,
    title: { es: "Reserva segura", en: "Secure booking" },
    body: {
      es: "Pago protegido, cancelación gratis hasta 7 días antes, confirmación instantánea.",
      en: "Protected payment, free cancellation up to 7 days before, instant confirmation.",
    },
  },
];

const milestones = [
  {
    year: "2012",
    text: {
      es: "Fundación en Cusco con 2 guías y 1 minivan",
      en: "Founded in Cusco with 2 guides and 1 minivan",
    },
  },
  {
    year: "2016",
    text: {
      es: "Primer permiso oficial de Camino Inca",
      en: "First official Inca Trail permit",
    },
  },
  {
    year: "2019",
    text: {
      es: "+5,000 viajeros felices · rating 4.9 en TripAdvisor",
      en: "5,000+ happy travelers · 4.9 rating on TripAdvisor",
    },
  },
  {
    year: "2022",
    text: {
      es: "Expansión a Puno, Arequipa y Selva de Madre de Dios",
      en: "Expansion to Puno, Arequipa and the Madre de Dios jungle",
    },
  },
  {
    year: "2025",
    text: {
      es: "Lanzamiento de plataforma de reservas en vivo",
      en: "Launch of the live booking platform",
    },
  },
];

export default async function SobreNosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lc: Locale = toLocale(locale);
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 md:mb-24 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div>
          <span className="font-hand text-gold text-2xl">
            {L(lc, { es: "Nuestra historia", en: "Our story" })}
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-7xl text-night leading-[1.05]">
            {lc !== "es" ? (
              <>
                Made in{" "}
                <span className="text-gradient-gold italic">Cusco</span>, for the
                world
              </>
            ) : (
              <>
                Hechos en{" "}
                <span className="text-gradient-gold italic">Cusco</span>, para el
                mundo
              </>
            )}
          </h1>
          <p className="mt-6 text-night/70 text-lg leading-relaxed">
            {lc !== "es" ? (
              <>
                At <strong>Danfer Tours Cusco</strong> we believe that traveling
                to Peru is much more than seeing Machu Picchu — it's waking up at
                3,400 meters, tasting coca on your lips, listening to a Quechua
                guide tell the story of his grandfather. That's why we design
                every itinerary as if it were for a friend.
              </>
            ) : (
              <>
                En <strong>Danfer Tours Cusco</strong> creemos que viajar al Perú
                es mucho más que ver Machu Picchu — es despertar a 3,400 metros,
                sentir la coca en los labios, escuchar a un guía quechua contar la
                historia de su abuelo. Por eso diseñamos cada itinerario como si
                fuera para un amigo.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-night hover:bg-gold text-white px-6 py-3 rounded-full font-semibold transition"
            >
              {L(lc, { es: "Explorar tours", en: "Explore tours" })}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="text-night/70 hover:text-gold text-sm transition"
            >
              {L(lc, { es: "Hablar con nosotros →", en: "Talk to us →" })}
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop"
            alt={
              L(lc, { es: "Equipo Danfer Tours en el Valle Sagrado", en: "Danfer Tours team in the Sacred Valley" })
            }
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-stone py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-hand text-gold text-2xl">
              {L(lc, { es: "Por qué nosotros", en: "Why us" })}
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
              {L(lc, { es: "Cuatro razones para confiar", en: "Four reasons to trust us" })}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title.es}
                  className="bg-white border border-night/8 rounded-2xl p-6 hover:shadow-card transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 grid place-items-center mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-display text-xl text-night">{L(lc, v.title)}</h3>
                  <p className="mt-2 text-night/65 text-sm leading-relaxed">{L(lc, v.body)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-14">
          <span className="font-hand text-gold text-2xl">
            {L(lc, { es: "Nuestro camino", en: "Our journey" })}
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
            {L(lc, { es: "13 años descubriendo el Perú", en: "13 years discovering Peru" })}
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 sm:left-6 top-3 bottom-3 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative pl-14 sm:pl-20">
                <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold text-white font-display font-bold text-xs sm:text-sm grid place-items-center shadow-glow">
                  {m.year.slice(2)}
                </div>
                <div className="bg-white border border-night/8 rounded-2xl p-4 sm:p-5 shadow-soft">
                  <div className="font-display text-xs text-gold uppercase tracking-widest mb-1">
                    {m.year}
                  </div>
                  <p className="text-night">{L(lc, m.text)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-night text-white py-14 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 sm:gap-12 text-center">
          <Stat
            icon={Users}
            value="8,500+"
            label={L(lc, { es: "Viajeros felices", en: "Happy travelers" })}
          />
          <Stat
            icon={Route}
            value="35"
            label={L(lc, { es: "Rutas exclusivas", en: "Exclusive routes" })}
          />
          <Stat
            icon={Mountain}
            value="4.9"
            label={L(lc, { es: "Rating TripAdvisor", en: "TripAdvisor rating" })}
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-night">
          {L(lc, { es: "¿Listo para tu próximo viaje?", en: "Ready for your next trip?" })}
        </h2>
        <p className="mt-4 text-night/65 text-lg">
          {L(lc, { es: "Diseñamos cada itinerario contigo. Cuéntanos qué quieres vivir.", en: "We design every itinerary with you. Tell us what you want to experience." })}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-white px-7 py-3.5 rounded-full font-semibold transition"
          >
            {L(lc, { es: "Ver tours", en: "View tours" })}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white border border-night/10 hover:border-gold text-night px-7 py-3.5 rounded-full font-semibold transition"
          >
            {L(lc, { es: "Diseñar mi viaje", en: "Plan my trip" })}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string;
  label: string;
}) {
  return (
    <div>
      <Icon className="w-6 h-6 text-gold mx-auto mb-3" />
      <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-widest text-white/60">
        {label}
      </div>
    </div>
  );
}
