import Image from "next/image";
import Link from "next/link";
import { Shield, Award, Heart, Mountain, Users, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sobre nosotros · Danfer Tours Cusco",
  description:
    "Conoce a Danfer Tours Cusco: operador turístico autorizado por MINCETUR con +12 años creando experiencias únicas en Machu Picchu, Valle Sagrado y Camino Inca.",
  alternates: { canonical: "/sobre-nosotros" },
};

const values = [
  {
    icon: Mountain,
    title: "Operador local",
    body: "Nacimos en Cusco. Conocemos cada piedra, cada altura y cada secreto del imperio.",
  },
  {
    icon: Award,
    title: "Autorizados MINCETUR",
    body: "Operador turístico oficial registrado. Guías licenciados y certificados.",
  },
  {
    icon: Heart,
    title: "Turismo responsable",
    body: "Trabajamos con comunidades andinas. 10% de cada reserva va a proyectos locales.",
  },
  {
    icon: Shield,
    title: "Reserva segura",
    body: "Pago protegido, cancelación gratis hasta 7 días antes, confirmación instantánea.",
  },
];

const milestones = [
  { year: "2012", text: "Fundación en Cusco con 2 guías y 1 minivan" },
  { year: "2016", text: "Primer permiso oficial de Camino Inca" },
  { year: "2019", text: "+5,000 viajeros felices · rating 4.9 en TripAdvisor" },
  { year: "2022", text: "Expansión a Puno, Arequipa y Selva de Madre de Dios" },
  { year: "2025", text: "Lanzamiento de plataforma de reservas en vivo" },
];

export default function SobreNosotrosPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 mb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="font-hand text-gold text-2xl">Nuestra historia</span>
          <h1 className="mt-2 font-display text-5xl md:text-7xl text-night leading-[1.05]">
            Hechos en{" "}
            <span className="text-gradient-gold italic">Cusco</span>, para el
            mundo
          </h1>
          <p className="mt-6 text-night/70 text-lg leading-relaxed">
            En <strong>Danfer Tours Cusco</strong> creemos que viajar al Perú es
            mucho más que ver Machu Picchu — es despertar a 3,400 metros, sentir
            la coca en los labios, escuchar a un guía quechua contar la historia
            de su abuelo. Por eso diseñamos cada itinerario como si fuera para
            un amigo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-night hover:bg-gold text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Explorar tours
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="text-night/70 hover:text-gold text-sm transition"
            >
              Hablar con nosotros →
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop"
            alt="Equipo Danfer Tours en el Valle Sagrado"
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-stone py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-hand text-gold text-2xl">Por qué nosotros</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-night">
              Cuatro razones para confiar
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white border border-night/8 rounded-2xl p-6 hover:shadow-card transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 grid place-items-center mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-display text-xl text-night">{v.title}</h3>
                  <p className="mt-2 text-night/65 text-sm leading-relaxed">{v.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <span className="font-hand text-gold text-2xl">Nuestro camino</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl text-night">
            13 años descubriendo el Perú
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-3 bottom-3 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative pl-20">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gold text-white font-display font-bold text-sm grid place-items-center shadow-glow">
                  {m.year.slice(2)}
                </div>
                <div className="bg-white border border-night/8 rounded-2xl p-5 shadow-soft">
                  <div className="font-display text-xs text-gold uppercase tracking-widest mb-1">
                    {m.year}
                  </div>
                  <p className="text-night">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-night text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-12 text-center">
          <Stat icon={Users} value="8,500+" label="Viajeros felices" />
          <Stat icon={Sparkles} value="35" label="Rutas exclusivas" />
          <Stat icon={Mountain} value="4.9" label="Rating TripAdvisor" />
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-night">
          ¿Listo para tu próximo viaje?
        </h2>
        <p className="mt-4 text-night/65 text-lg">
          Diseñamos cada itinerario contigo. Cuéntanos qué quieres vivir.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-white px-7 py-3.5 rounded-full font-semibold transition"
          >
            Ver tours
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white border border-night/10 hover:border-gold text-night px-7 py-3.5 rounded-full font-semibold transition"
          >
            Diseñar mi viaje
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
      <div className="font-display text-5xl font-bold text-white">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-widest text-white/60">
        {label}
      </div>
    </div>
  );
}
