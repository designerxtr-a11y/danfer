import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contacto · Danfer Tours Cusco",
  description:
    "Contáctanos para diseñar tu viaje a Machu Picchu, Valle Sagrado o Camino Inca. Atención por WhatsApp, email o en nuestra oficina en Cusco.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="font-hand text-gold text-2xl">Hablemos</span>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-night">
            Diseñemos tu viaje{" "}
            <span className="text-gradient-gold italic">juntos</span>
          </h1>
          <p className="mt-4 text-night/60 max-w-xl mx-auto">
            Cuéntanos qué quieres vivir y te respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          <ContactForm />

          <aside className="space-y-6">
            <InfoCard
              icon={MessageCircle}
              title="WhatsApp"
              value="+51 984 123 456"
              href="https://wa.me/51984123456"
              hint="Respuesta más rápida"
            />
            <InfoCard
              icon={Mail}
              title="Email"
              value="hola@danfertourscusco.com"
              href="mailto:hola@danfertourscusco.com"
            />
            <InfoCard
              icon={Phone}
              title="Teléfono"
              value="+51 984 123 456"
              href="tel:+51984123456"
            />
            <InfoCard
              icon={MapPin}
              title="Oficina"
              value="Av. El Sol 314"
              hint="Cusco · 08000 · Perú"
            />
            <div className="bg-stone border border-night/8 rounded-2xl p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-wider text-night/50">
                  Horario
                </div>
                <div className="text-night/80 text-sm mt-1">
                  Lunes a Sábado · 8am – 8pm (Hora de Lima)
                </div>
                <div className="text-night/60 text-xs mt-0.5">
                  Soporte 24/7 durante tu tour
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  hint,
  href,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
      <div>
        <div className="text-xs uppercase tracking-wider text-night/50">{title}</div>
        <div className="text-night font-medium">{value}</div>
        {hint && <div className="text-night/50 text-xs mt-0.5">{hint}</div>}
      </div>
    </>
  );

  const cls =
    "bg-white border border-night/8 rounded-2xl p-5 flex items-start gap-3 hover:shadow-soft hover:border-gold/40 transition";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
