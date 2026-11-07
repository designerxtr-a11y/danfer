import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CalendarCheck, ShieldCheck, Ticket } from "lucide-react";
import { L, toLocale } from "@/lib/i18n/pick";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { TripadvisorRating } from "@/components/tours/tripadvisor-badge";
import type { Locale } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { Mp2027Booking } from "./booking";

// Las fechas con pre-reservas pagadas se marcan en el calendario. ISR: se
// regenera al pagar (revalidatePath en la captura) y como red cada 10 min.
export const revalidate = 600;

/** Viajeros con pago confirmado por fecha de 2027 (solo conteos, sin datos personales). */
async function bookedDates(): Promise<Record<string, number>> {
  const { data } = await createAdminClient()
    .from("bookings")
    .select("travel_date, travelers")
    .eq("payment_status", "paid")
    .gte("travel_date", "2027-01-01")
    .lte("travel_date", "2027-12-31");
  const out: Record<string, number> = {};
  for (const b of data ?? []) out[b.travel_date] = (out[b.travel_date] ?? 0) + (b.travelers ?? 1);
  return out;
}

const PATH = "/disponibilidad-machu-picchu-2027";

const TITLE = {
  es: "Machu Picchu 2027: Disponibilidad y Entradas",
  en: "Machu Picchu 2027: Availability & Tickets",
  ja: "マチュピチュ2027：空き状況とチケット",
};

function faqs(lc: Locale) {
  return [
    {
      q: L(lc, { es: "¿Cuándo abre la venta de entradas 2027?", en: "When do 2027 tickets go on sale?", ja: "2027年のチケットはいつ発売されますか？" }),
      a: L(lc, {
        es: "El Ministerio de Cultura suele abrir la venta del año siguiente a mediados de diciembre. Con la pre-reserva compramos tu entrada apenas abra, antes de que se agoten las rutas más pedidas.",
        en: "Peru's Ministry of Culture usually opens next year's sales in mid-December. With a pre-booking we buy your ticket as soon as sales open, before the most popular routes sell out.",
        ja: "ペルー文化省は通常12月中旬に翌年分の販売を開始します。事前予約なら、人気ルートが売り切れる前に販売開始と同時にチケットを購入します。",
      }),
    },
    {
      q: L(lc, { es: "¿Qué pasa si no hay cupo en mi fecha?", en: "What if my date isn't available?", ja: "希望日に空きがない場合は？" }),
      a: L(lc, {
        es: "Te ofrecemos la fecha, ruta u hora más cercana. Si ninguna te sirve, te devolvemos el 100% de tu pago.",
        en: "We'll offer the closest date, route or time. If none works for you, we refund 100% of your payment.",
        ja: "一番近い日付・ルート・時間をご提案します。ご都合が合わない場合は全額返金いたします。",
      }),
    },
    {
      q: L(lc, { es: "¿Qué ruta me conviene?", en: "Which route should I choose?", ja: "どのルートがおすすめですか？" }),
      a: L(lc, {
        es: "Para la primera visita, la Ruta 2A (clásica): tiene la foto postal y recorre los templos principales. Si quieres subir una montaña, elige 3A (Huayna Picchu) o 1A (Montaña Machupicchu).",
        en: "For a first visit, Route 2A (classic): it has the postcard photo and covers the main temples. To climb a mountain, choose 3A (Huayna Picchu) or 1A (Machupicchu Mountain).",
        ja: "初めてならルート2A（クラシック）がおすすめです。絵はがきの景色と主要な神殿をめぐれます。山に登りたい方は3A（ワイナピチュ）か1A（マチュピチュ山）をお選びください。",
      }),
    },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const lc = toLocale(locale);
  return {
    title: { absolute: `${L(lc, TITLE)} · Danfer Tours` },
    description: L(lc, {
      es: "Calendario 2027 de Machu Picchu: elige fecha, ruta y hora, y pre-reserva tu entrada con tour (Full Day, 2D/1N o con Valle Sagrado) antes de que abra la venta oficial. Pago seguro por PayPal.",
      en: "Machu Picchu 2027 calendar: pick your date, route and time and pre-book your ticket with a tour (Full Day, 2D/1N or with the Sacred Valley) before official sales open. Secure PayPal payment.",
      ja: "マチュピチュ2027カレンダー：日付・ルート・時間を選び、公式販売開始前にツアー付きチケット（日帰り・1泊2日・聖なる谷付き）を事前予約。PayPalで安全にお支払い。",
    }),
    alternates: buildAlternates(PATH, lc, { jaAvailable: true }),
    openGraph: { locale: ogLocale(lc) },
  };
}

export default async function Mp2027Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lc = toLocale(locale);
  const [settings, booked] = await Promise.all([getSettings(), bookedDates()]);
  const crumbs = [
    { name: L(lc, { es: "Inicio", en: "Home", ja: "ホーム" }), url: "/" },
    { name: L(lc, { es: "Disponibilidad 2027", en: "Availability 2027", ja: "2027年の空き状況" }), url: PATH },
  ];
  const faqList = faqs(lc);

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(faqList)]} />

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={crumbs} className="mb-4" />
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 text-night px-4 py-1.5 text-sm font-semibold">
            <Ticket className="w-4 h-4 text-gold" />
            {L(lc, { es: "Pre-reserva abierta", en: "Pre-booking open", ja: "事前予約受付中" })}
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl text-night leading-tight">
            {L(lc, TITLE)}
          </h1>
          <p className="mt-4 text-night/65 text-lg max-w-2xl mx-auto">
            {L(lc, {
              es: "Asegura tu fecha todo el 2027.",
              en: "Secure your date anytime in 2027.",
              ja: "2027年のご希望日を今すぐ確保。",
            })}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-night/70">
            <TripadvisorRating locale={lc} />
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {L(lc, { es: "Reembolso 100% si no hay cupo", en: "100% refund if unavailable", ja: "空きがなければ全額返金" })}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold" />
              {L(lc, { es: "Operador autorizado MINCETUR", en: "MINCETUR-licensed operator", ja: "MINCETUR認可の旅行会社" })}
            </span>
          </div>
        </div>

        <Mp2027Booking
          locale={lc}
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}
          whatsapp={normalizeWhatsApp(settings.whatsapp)}
          booked={booked}
        />

        <section className="mt-16">
          <h2 className="font-display text-2xl sm:text-3xl text-night mb-5">
            {L(lc, { es: "Preguntas frecuentes", en: "Frequently asked questions", ja: "よくある質問" })}
          </h2>
          <div className="space-y-3">
            {faqList.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-night/10 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-night list-none">{f.q}</summary>
                <p className="mt-3 text-night/65">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
