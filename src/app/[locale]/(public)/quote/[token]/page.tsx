import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, MapPin, Calendar, Users, Clock } from "lucide-react";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";
import { PassportUpload } from "./passport-upload";
import { PaypalButton } from "./paypal-button";
import { QUOTES, quoteTotal, quotePaypalCharge, depositAmount, itemSubtotal } from "./quotes-data";

const COPY = {
  en: {
    travelQuote: "Travel Quote",
    hi: (name: string) => `Hi ${name}, here's your quote`,
    thanks: (destination: string) =>
      `Thanks for your interest — here are the details for your ${destination} trip.`,
    destination: "Destination",
    dates: "Dates",
    duration: "Duration",
    travelers: "Travelers",
    itinerary: "Itinerary",
    included: "Included",
    notIncluded: "Not included",
    passportTitle: "Passport or ID photo",
    passportBody: "To book your tourist train ticket and hotel reservation, we need a photo of each traveler's passport or ID.",
    quoteDetail: "Quote detail",
    flatFee: "flat fee",
    total: "Total",
    tripTotal: "Trip total",
    depositDue: (pct: number) => `Deposit due now (${pct}%)`,
    paypalFee: "PayPal fee",
    totalViaPaypal: "Total via PayPal",
    balanceDue: (amount: string) => `Remaining balance of ${amount} is paid in person on arrival.`,
    paymentsNotReady: "Payments aren't configured yet — please use WhatsApp to confirm your booking.",
    confirmWhatsapp: "Confirm on WhatsApp →",
    waMessage: (destination: string, dates: string, travelers: number) =>
      `Hi! I'd like to confirm my ${destination} quote (${dates}) for ${travelers} people.`,
  },
  es: {
    travelQuote: "Cotización de viaje",
    hi: (name: string) => `Hola ${name}, esta es tu cotización`,
    thanks: (destination: string) =>
      `Gracias por tu interés — aquí están los detalles de tu viaje a ${destination}.`,
    destination: "Destino",
    dates: "Fechas",
    duration: "Duración",
    travelers: "Pasajeros",
    itinerary: "Itinerario",
    included: "Incluye",
    notIncluded: "No incluye",
    passportTitle: "Foto de pasaporte o DNI",
    passportBody: "Para reservar tu tren turístico y el hotel, necesitamos una foto del pasaporte o DNI de cada pasajero.",
    quoteDetail: "Detalle de la cotización",
    flatFee: "tarifa fija",
    total: "Total",
    tripTotal: "Total del viaje",
    depositDue: (pct: number) => `Depósito a pagar ahora (${pct}%)`,
    paypalFee: "Comisión PayPal",
    totalViaPaypal: "Total vía PayPal",
    balanceDue: (amount: string) => `El saldo restante de ${amount} se paga en persona al llegar.`,
    paymentsNotReady: "Los pagos aún no están configurados — escríbenos por WhatsApp para confirmar tu reserva.",
    confirmWhatsapp: "Confirmar por WhatsApp →",
    waMessage: (destination: string, dates: string, travelers: number) =>
      `Hola! Quisiera confirmar mi cotización de ${destination} (${dates}) para ${travelers} personas.`,
  },
};

interface PageProps {
  params: Promise<{ token: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const quote = QUOTES[token];
  if (!quote) return { title: "Quote", robots: { index: false, follow: false } };

  const title =
    quote.lang === "es"
      ? `Cotización para ${quote.clientName} — ${quote.destination}`
      : `Quote for ${quote.clientName} — ${quote.destination}`;
  const description =
    quote.lang === "es"
      ? `Cotización privada de viaje: ${quote.destination}, ${quote.dates}.`
      : `Private travel quote: ${quote.destination}, ${quote.dates}.`;

  return {
    title,
    description,
    // Private link shared directly with one client — must not be indexed,
    // but still gets its own title/image so the WhatsApp preview isn't the
    // site's generic marketing card.
    robots: { index: false, follow: false },
    openGraph: { title, description, images: [quote.heroImage] },
    twitter: { card: "summary_large_image", title, description, images: [quote.heroImage] },
  };
}

export default async function QuotePage({ params }: PageProps) {
  const { token } = await params;
  const quote = QUOTES[token];
  if (!quote) notFound();
  const t = COPY[quote.lang];

  const settings = await getSettings();
  const wa = normalizeWhatsApp(settings.whatsapp);
  const total = quoteTotal(quote);
  const deposit = depositAmount(quote);
  const isPartialDeposit = (quote.depositPercent ?? 100) < 100;
  const paypalCharge = quote.acceptsPaypal ? quotePaypalCharge(quote) : deposit;
  const paypalFee = Math.round((paypalCharge - deposit) * 100) / 100;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const waMessage = t.waMessage(quote.destination, quote.dates, quote.travelers);
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="bg-cream">
      <div className="max-w-5xl mx-auto px-5 pt-24 md:pt-28 pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:gap-10 lg:items-start">
        <div className="min-w-0">
          <section className="pb-6">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <p className="font-display text-gold tracking-widest text-sm uppercase">
                  {t.travelQuote}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl text-night mt-2">
                  {t.hi(quote.clientName)}
                </h1>
                <p className="text-night/70 mt-3">{t.thanks(quote.destination)}</p>
              </div>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
                <Image
                  src={quote.heroImage}
                  alt={quote.heroImageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 384px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-night/10 border border-night/10 rounded-2xl overflow-hidden">
              <InfoCell icon={<MapPin className="w-4 h-4" />} label={t.destination} value={quote.destination} />
              <InfoCell icon={<Calendar className="w-4 h-4" />} label={t.dates} value={quote.dates} />
              <InfoCell icon={<Clock className="w-4 h-4" />} label={t.duration} value={quote.duration} />
              <InfoCell icon={<Users className="w-4 h-4" />} label={t.travelers} value={String(quote.travelers)} />
            </div>
          </section>

          {quote.itinerary.length > 0 && (
            <section className="pt-10">
              <h2 className="font-bold text-lg text-night mb-4">{t.itinerary}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quote.itinerary.map((stop) => (
                  <div
                    key={stop.day}
                    className="rounded-2xl border border-night/10 overflow-hidden bg-white"
                  >
                    <div className="relative h-36">
                      <Image
                        src={stop.photo}
                        alt={stop.photoAlt}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 340px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-gold">
                          {stop.day}
                        </span>
                        <span className="font-mono text-[10px] text-night/50 whitespace-nowrap">
                          {stop.timeLabel}
                        </span>
                      </div>
                      <h3 className="font-bold text-night mt-1">{stop.title}</h3>
                      <p className="text-sm text-night/70 mt-1">{stop.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="py-10">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg text-night mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" /> {t.included}
                </h3>
                <ul className="space-y-2">
                  {quote.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-night/75 text-sm">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg text-night mb-3 flex items-center gap-2">
                  <X className="w-5 h-5 text-rose-600" /> {t.notIncluded}
                </h3>
                <ul className="space-y-2">
                  {quote.excludes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-night/75 text-sm">
                      <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="pb-10">
            <h3 className="font-bold text-lg text-night mb-1">{t.passportTitle}</h3>
            <p className="text-sm text-night/60 mb-4 max-w-xl">{t.passportBody}</p>
            <PassportUpload token={token} travelers={quote.travelers} lang={quote.lang} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 mt-2 lg:mt-0">
          <div className="bg-white rounded-3xl shadow-card border border-night/8 overflow-hidden">
            <div className="p-6">
              <h2 className="font-bold text-lg text-night">{t.quoteDetail}</h2>
              <div className="mt-4 space-y-3">
                {quote.items.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="text-night font-semibold">{item.label}</div>
                      {item.detail && <div className="text-night/55 text-xs mt-0.5">{item.detail}</div>}
                      <div className="text-night/50 text-xs mt-0.5">
                        {quote.currency}
                        {item.unitPrice}
                        {item.perTraveler === false ? ` (${t.flatFee})` : ` × ${quote.travelers}`}
                      </div>
                    </div>
                    <div className="font-semibold text-night shrink-0">
                      {quote.currency}
                      {itemSubtotal(item, quote.travelers)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline justify-between pt-4 mt-4 border-t border-night/10">
                <span className="font-bold text-night text-sm">
                  {t.total} &middot; {quote.travelers}
                </span>
                <span className="font-display text-2xl text-gold">
                  {quote.currency}
                  {total}
                </span>
              </div>
            </div>

            {quote.acceptsPaypal && (
              <>
                <div className="bg-cream/60 border-t border-night/10 px-6 py-5">
                  <div className="flex items-baseline justify-between text-sm text-night/60">
                    <span>{t.tripTotal}</span>
                    <span>
                      {quote.currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                  {isPartialDeposit && (
                    <div className="flex items-baseline justify-between text-sm text-night/60 mt-1.5">
                      <span>{t.depositDue(quote.depositPercent!)}</span>
                      <span>
                        {quote.currency}
                        {deposit.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between text-sm text-night/60 mt-1.5">
                    <span>{t.paypalFee}</span>
                    <span>
                      +{quote.currency}
                      {paypalFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-night/10">
                    <span className="font-bold text-night text-sm">{t.totalViaPaypal}</span>
                    <span className="font-display text-2xl text-gold">
                      {quote.currency}
                      {paypalCharge.toFixed(2)}
                    </span>
                  </div>
                  {isPartialDeposit && (
                    <p className="text-xs text-night/50 mt-2">
                      {t.balanceDue(`${quote.currency}${(total - deposit).toFixed(2)}`)}
                    </p>
                  )}
                </div>

                <div className="px-6 py-6 border-t border-night/10">
                  {paypalClientId ? (
                    <PaypalButton
                      token={token}
                      clientId={paypalClientId}
                      chargeLabel={`${quote.currency}${paypalCharge.toFixed(2)}`}
                    />
                  ) : (
                    <p className="text-sm text-rose-600">{t.paymentsNotReady}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-night/50 mt-4">{quote.note}</p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 flex items-center justify-center gap-2 rounded-full bg-night px-6 py-3 text-cream font-semibold text-sm transition hover:bg-night-deep"
          >
            {t.confirmWhatsapp}
          </a>
        </aside>
      </div>
    </main>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-cream px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-night/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className="font-bold text-night text-sm">{value}</div>
    </div>
  );
}
