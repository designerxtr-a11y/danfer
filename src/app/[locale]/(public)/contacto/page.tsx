import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata = {
  title: "Contacto · Danfer Tours Cusco",
  description:
    "Contáctanos para diseñar tu viaje a Machu Picchu, Valle Sagrado o Camino Inca. Atención por WhatsApp, email o en nuestra oficina en Cusco.",
  alternates: { canonical: "/contacto" },
};

export const revalidate = 300;

export default async function ContactoPage() {
  const settings = await getSettings();
  const waNumber = normalizeWhatsApp(settings.whatsapp);
  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Contacto", url: "/contacto" },
  ];

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={[breadcrumbSchema(crumbs)]} />

      <section className="max-w-6xl mx-auto px-6">
        <Breadcrumbs items={crumbs} className="mb-4" />
        <div className="text-center mb-14">
          <span className="font-hand text-gold text-2xl">Hablemos</span>
          <h1 className="mt-2 font-display text-5xl md:text-6xl text-night">
            Diseñemos tu viaje{" "}
            <span className="text-gradient-gold italic">juntos</span>
          </h1>
          <p className="mt-4 text-night/60 max-w-xl mx-auto">
            Cuéntanos qué quieres vivir y te respondemos en menos de 24 horas —
            o escríbenos por WhatsApp para respuesta inmediata.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          <ContactForm />

          <aside className="space-y-4">
            <InfoCard
              icon={MessageCircle}
              title="WhatsApp"
              value={settings.contact_phone}
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                "Hola Danfer Tours! 👋 Quiero información sobre un tour."
              )}`}
              hint="Respuesta inmediata · recomendado"
              highlight
            />
            <InfoCard
              icon={Mail}
              title="Email"
              value={settings.contact_email}
              href={`mailto:${settings.contact_email}`}
              hint="Respondemos en <24h"
            />
            <InfoCard
              icon={Phone}
              title="Teléfono"
              value={settings.contact_phone}
              href={`tel:${normalizeWhatsApp(settings.contact_phone)}`}
            />
            <InfoCard
              icon={MapPin}
              title="Oficina en Cusco"
              value={settings.address?.es ?? "Av. El Sol 314, Cusco"}
              hint="Atención presencial con cita"
            />
            <div className="bg-stone border border-night/8 rounded-2xl p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-wider text-night/50">
                  Horario de atención
                </div>
                <div className="text-night/80 text-sm mt-1.5 space-y-0.5">
                  <div>Lun – Vie · 8:00 – 20:00</div>
                  <div>Sábado · 9:00 – 18:00</div>
                  <div>Domingo · 9:00 – 14:00</div>
                </div>
                <div className="text-night/55 text-xs mt-2">
                  Hora de Lima (GMT-5) · Soporte 24/7 durante tu tour
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-16">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="font-hand text-gold text-xl">Encuéntranos</span>
              <h2 className="font-display text-2xl md:text-3xl text-night mt-1">
                Av. El Sol 314, Cusco
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Av.+El+Sol+314,+Cusco,+Perú"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-night/70 hover:text-gold text-sm transition"
            >
              Abrir en Google Maps →
            </a>
          </div>
          <div className="rounded-3xl overflow-hidden ring-1 ring-night/10 shadow-soft">
            <iframe
              src="https://www.google.com/maps?q=Av.+El+Sol+314,+Cusco,+Per%C3%BA&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la oficina Danfer Tours Cusco"
            />
          </div>
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
  highlight,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  hint?: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <>
      <div
        className={`grid place-items-center w-10 h-10 rounded-full shrink-0 ${
          highlight ? "bg-[#25D366]/15" : "bg-gold/10"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${highlight ? "text-[#25D366]" : "text-gold"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-night/50">
          {title}
        </div>
        <div className="text-night font-medium truncate">{value}</div>
        {hint && (
          <div className="text-night/50 text-xs mt-0.5">{hint}</div>
        )}
      </div>
    </>
  );

  const cls = `bg-white border rounded-2xl p-4 flex items-center gap-4 transition ${
    highlight
      ? "border-[#25D366]/30 hover:border-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.1)]"
      : "border-night/8 hover:border-gold/40 hover:shadow-soft"
  }`;

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
