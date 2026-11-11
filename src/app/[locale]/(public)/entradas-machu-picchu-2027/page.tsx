import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { L, toLocale } from "@/lib/i18n/pick";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import type { Locale } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { Mp2027Booking } from "./booking";
import { PACKAGES } from "@/lib/mp2027/data";
import { siteUrl } from "@/lib/seo/site-url";

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

const PATH = "/entradas-machu-picchu-2027";

const TITLE = {
  es: "Disponibilidad Machu Picchu 2027: Calendario y Entradas",
  en: "Machu Picchu 2027 Availability: Calendar & Tickets",
  ja: "マチュピチュ2027空き状況：カレンダーとチケット予約",
};

const H1 = {
  es: "Compra ya tus entradas a Machu Picchu 2027",
  en: "Get your Machu Picchu 2027 tickets now",
  ja: "マチュピチュ2027のチケットを今すぐ確保",
};

function faqs(lc: Locale) {
  return [
    {
      q: L(lc, { es: "¿Cómo ver la disponibilidad de Machu Picchu 2027?", en: "How can I check Machu Picchu 2027 availability?", ja: "マチュピチュ2027の空き状況はどう確認しますか？" }),
      a: L(lc, {
        es: "En el calendario de esta página: elige el mes y verás cada día en verde si hay cupos, en naranja si quedan pocos y en rojo si está agotado. Son los cupos de pre-reserva de Danfer Tours; la venta oficial del Ministerio de Cultura para 2027 aún no abre.",
        en: "On the calendar on this page: choose a month and each day shows green if spots are open, orange if few are left and red if sold out. These are Danfer Tours pre-booking spots; the Ministry of Culture's official 2027 sale has not opened yet.",
        ja: "このページのカレンダーで確認できます。月を選ぶと、空きがある日は緑、残りわずかな日はオレンジ、満席の日は赤で表示されます。表示はDanfer Toursの事前予約枠で、文化省の2027年公式販売はまだ始まっていません。",
      }),
    },
    {
      q: L(lc, { es: "¿Cuánto cuesta el tour a Machu Picchu 2027?", en: "How much is the Machu Picchu 2027 tour?", ja: "マチュピチュ2027ツアーの料金は？" }),
      a: L(lc, {
        es: "Full Day US$320, 2 días / 1 noche US$380 y 2 días / 1 noche con Valle Sagrado US$420, por persona. Todos incluyen tren turístico ida y vuelta, bus de subida y bajada, entrada a Machu Picchu y guía; los de 2 días incluyen una noche de hotel en Aguas Calientes con desayuno.",
        en: "Full Day US$320, 2 days / 1 night US$380, and 2 days / 1 night with the Sacred Valley US$420, per person. All include the round-trip tourist train, the bus up and down, the Machu Picchu entry ticket and a guide; the 2-day options include one hotel night in Aguas Calientes with breakfast.",
        ja: "日帰りUS$320、1泊2日US$380、聖なる谷付き1泊2日US$420（1名あたり）。いずれも往復の観光列車、往復バス、マチュピチュ入場券、ガイド付き。1泊2日プランにはアグアスカリエンテスのホテル1泊（朝食付き）が含まれます。",
      }),
    },
    {
      q: L(lc, { es: "¿Cuándo abre la venta de entradas 2027?", en: "When do 2027 tickets go on sale?", ja: "2027年のチケットはいつ発売されますか？" }),
      a: L(lc, {
        es: "El Ministerio de Cultura aún no anuncia la fecha oficial. Como referencia, la venta de 2026 abrió el 17 de noviembre de 2025. Con la pre-reserva compramos tu entrada apenas abra, antes de que se agoten las rutas más pedidas.",
        en: "Peru's Ministry of Culture has not announced the official date yet. For reference, 2026 sales opened on November 17, 2025. With a pre-booking we buy your ticket as soon as sales open, before the most popular routes sell out.",
        ja: "ペルー文化省はまだ公式の発売日を発表していません。参考までに、2026年分は2025年11月17日に発売されました。事前予約なら、人気ルートが売り切れる前に販売開始と同時にチケットを購入します。",
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
    title: { absolute: L(lc, TITLE) },
    description: L(lc, {
      es: "Disponibilidad Machu Picchu 2027 día por día: elige fecha, ruta y hora, y reserva tu entrada con tour desde US$320. Reembolso del 100% si no hay cupo.",
      en: "Machu Picchu 2027 availability day by day: pick your date, route and time, and book your ticket with a tour from US$320. 100% refund if unavailable.",
      ja: "マチュピチュ2027の空き状況を日ごとに確認。日付・ルート・時間を選び、ツアー付きチケットをUS$320から予約。空きがなければ全額返金。",
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
    { name: L(lc, { es: "Entradas 2027", en: "Tickets 2027", ja: "2027年チケット" }), url: PATH },
  ];
  const faqList = faqs(lc);
  // Momento en que se leyeron las reservas pagadas (la página se regenera cada 10 min).
  const updatedLabel = new Date().toLocaleString(lc === "es" ? "es-PE" : lc === "ja" ? "ja-JP" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  });

  const prices = PACKAGES.map((p) => p.price);
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: L(lc, TITLE),
    description: L(lc, {
      es: "Tour a Machu Picchu 2027 con entrada, tren turístico, bus y guía. Pre-reserva por fecha, ruta y hora.",
      en: "Machu Picchu 2027 tour with entry ticket, tourist train, bus and guide. Pre-booking by date, route and time.",
      ja: "入場券・観光列車・バス・ガイド付きのマチュピチュ2027ツアー。日付・ルート・時間を指定して事前予約。",
    }),
    image: `${siteUrl()}/images/rutas-mp/1b.jpg`,
    brand: { "@type": "Organization", name: "Danfer Tours Cusco" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: "https://schema.org/PreOrder",
      url: `${siteUrl()}${lc === "es" ? "" : `/${lc}`}${PATH}`,
    },
  };

  return (
    <div className="pb-16 md:pb-24">
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(faqList), offerSchema]} />

      <Mp2027Booking
        locale={lc}
        paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}
        whatsapp={normalizeWhatsApp(settings.whatsapp)}
        booked={booked}
        updatedLabel={updatedLabel}
        title={L(lc, H1)}
        subtitle={L(lc, {
          es: "Disponibilidad 2027 día por día. Elige tu fecha y asegura tu entrada con tour.",
          en: "2027 availability day by day. Pick your date and secure your ticket with a tour.",
          ja: "2027年の空き状況を日ごとに確認。日付を選んでツアー付きチケットを確保。",
        })}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6">
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
