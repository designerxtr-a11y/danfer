import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { L, toLocale } from "@/lib/i18n/pick";
import { ContactForm } from "./contact-form";
import { getSettings, normalizeWhatsApp, publicPhone } from "@/lib/queries/settings";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
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
    L(lc, { es: "Contacto · Danfer Tours Cusco", en: "Contact · Danfer Tours Cusco", ja: "お問い合わせ · Danfer Tours Cusco" });
  const description =
    L(lc, { es: "Contáctanos para diseñar tu viaje a Machu Picchu, Valle Sagrado o Camino Inca. Atención por WhatsApp, email o en nuestra oficina en Cusco.", en: "Contact us to plan your trip to Machu Picchu, the Sacred Valley or the Inca Trail. Reach us via WhatsApp, email or at our office in Cusco.", ja: "マチュピチュ、聖なる谷、インカ道への旅のご相談はお気軽に。WhatsApp、メール、クスコのオフィスで承ります。" });
  return {
    title,
    description,
    alternates: buildAlternates("/contacto", lc, { jaAvailable: true }),
    openGraph: {
      title,
      description,
      locale: ogLocale(lc),
    },
  };
}

export const revalidate = 300;

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lc: Locale = toLocale(locale);
  const settings = await getSettings();
  const waNumber = normalizeWhatsApp(settings.whatsapp);
  const phone = publicPhone(settings);
  const crumbs = [
    { name: L(lc, { es: "Inicio", en: "Home", ja: "ホーム" }), url: "/" },
    { name: L(lc, { es: "Contacto", en: "Contact", ja: "お問い合わせ" }), url: "/contacto" },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <JsonLd data={[breadcrumbSchema(crumbs)]} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={crumbs} className="mb-4" />
        <div className="text-center mb-10 md:mb-14">
          <span className="font-hand text-gold text-2xl">
            {L(lc, { es: "Hablemos", en: "Let's talk", ja: "ご相談ください" })}
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl text-night">
            {lc === "ja" ? (
              <>
                <span className="text-gradient-gold">一緒に</span>旅の計画を立てましょう
              </>
            ) : lc === "en" ? (
              <>
                Let&apos;s plan your trip{" "}
                <span className="text-gradient-gold italic">together</span>
              </>
            ) : (
              <>
                Diseñemos tu viaje{" "}
                <span className="text-gradient-gold italic">juntos</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-night/60 max-w-xl mx-auto">
            {L(lc, { es: "Cuéntanos qué quieres vivir y te respondemos en menos de 24 horas — o escríbenos por WhatsApp para respuesta inmediata.", en: "Tell us what you want to experience and we'll reply within 24 hours — or message us on WhatsApp for an instant response.", ja: "体験したいことをお知らせください。24時間以内にお返事します。すぐに返事が欲しい場合はWhatsAppでご連絡ください。" })}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-10">
          <ContactForm />

          <aside className="space-y-4">
            <InfoCard
              icon={MessageCircle}
              title="WhatsApp"
              value={settings.whatsapp}
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                L(lc, { es: "Hola Danfer Tours! 👋 Quiero información sobre un tour.", en: "Hi Danfer Tours! 👋 I'd like information about a tour." })
              )}`}
              hint={
                L(lc, { es: "Respuesta inmediata · recomendado", en: "Instant response · recommended", ja: "すぐに返信・おすすめ" })
              }
              highlight
            />
            <InfoCard
              icon={Mail}
              title="Email"
              value={settings.contact_email}
              href={`mailto:${settings.contact_email}`}
              hint={L(lc, { es: "Respondemos en <24h", en: "We reply in <24h", ja: "24時間以内に返信" })}
            />
            <InfoCard
              icon={Phone}
              title={L(lc, { es: "Teléfono", en: "Phone", ja: "電話" })}
              value={phone}
              href={`tel:${normalizeWhatsApp(phone)}`}
            />
            <InfoCard
              icon={MapPin}
              title={L(lc, { es: "Oficina en Cusco", en: "Office in Cusco", ja: "クスコのオフィス" })}
              value={
                (lc === "es" ? settings.address?.es : settings.address?.en) ??
                settings.address?.es ??
                "Av. El Sol 314, Cusco"
              }
              hint={
                L(lc, { es: "Atención presencial con cita", en: "In-person service by appointment", ja: "ご来店は予約制です" })
              }
            />
            <div className="bg-stone border border-night/8 rounded-2xl p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-wider text-night/50">
                  {L(lc, { es: "Horario de atención", en: "Opening hours", ja: "営業時間" })}
                </div>
                <div className="text-night/80 text-sm mt-1.5 space-y-0.5">
                  <div>{L(lc, { es: "Lun – Vie", en: "Mon – Fri", ja: "月〜金" })} · 8:00 – 20:00</div>
                  <div>{L(lc, { es: "Sábado", en: "Saturday", ja: "土曜日" })} · 9:00 – 18:00</div>
                  <div>{L(lc, { es: "Domingo", en: "Sunday", ja: "日曜日" })} · 9:00 – 14:00</div>
                </div>
                <div className="text-night/55 text-xs mt-2">
                  {L(lc, { es: "Hora de Lima (GMT-5) · Soporte 24/7 durante tu tour", en: "Lima time (GMT-5) · 24/7 support during your tour", ja: "リマ時間（GMT-5）・ツアー中は24時間サポート" })}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-12 md:mt-16">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="font-hand text-gold text-xl">
                {L(lc, { es: "Encuéntranos", en: "Find us", ja: "アクセス" })}
              </span>
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
              {L(lc, { es: "Abrir en Google Maps →", en: "Open in Google Maps →", ja: "Googleマップで開く →" })}
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
              title={
                L(lc, { es: "Mapa de la oficina Danfer Tours Cusco", en: "Danfer Tours Cusco office map", ja: "Danfer Tours Cuscoオフィスの地図" })
              }
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
