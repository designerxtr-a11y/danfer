import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, MapPin, Calendar, Users, Clock } from "lucide-react";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";
import { PassportUpload } from "./passport-upload";
import { PaypalButton } from "./paypal-button";
import { QUOTES, quoteTotal, quotePaypalCharge } from "./quotes-data";

interface PageProps {
  params: Promise<{ token: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const quote = QUOTES[token];
  return {
    title: quote ? `Your ${quote.destination} quote` : "Quote",
    // Private link shared directly with one client — must not be indexed.
    robots: { index: false, follow: false },
  };
}

export default async function QuotePage({ params }: PageProps) {
  const { token } = await params;
  const quote = QUOTES[token];
  if (!quote) notFound();

  const settings = await getSettings();
  const wa = normalizeWhatsApp(settings.whatsapp);
  const total = quoteTotal(quote);
  const paypalCharge = quotePaypalCharge(quote);
  const paypalFee = Math.round((paypalCharge - total) * 100) / 100;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const waMessage = `Hi! I'd like to confirm my ${quote.destination} quote (${quote.dates}) for ${quote.travelers} people.`;
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="bg-cream">
      <section className="max-w-3xl mx-auto px-5 pt-10 pb-6">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div>
            <p className="font-display text-gold tracking-widest text-sm uppercase">
              Travel Quote
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-night mt-2">
              Hi {quote.clientName}, here&rsquo;s your quote
            </h1>
            <p className="text-night/70 mt-3">
              Thanks for your interest — here are the details for your {quote.destination} trip.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
            <Image
              src={quote.heroImage}
              alt={quote.heroImageAlt}
              fill
              priority
              sizes="(min-width: 640px) 384px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-night/10 border border-night/10 rounded-2xl overflow-hidden">
          <InfoCell icon={<MapPin className="w-4 h-4" />} label="Destination" value={quote.destination} />
          <InfoCell icon={<Calendar className="w-4 h-4" />} label="Dates" value={quote.dates} />
          <InfoCell icon={<Clock className="w-4 h-4" />} label="Duration" value={quote.duration} />
          <InfoCell icon={<Users className="w-4 h-4" />} label="Travelers" value={String(quote.travelers)} />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-10">
        <div className="bg-white rounded-3xl shadow-card border border-night/8 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-night/10">
              <div className="min-w-0">
                <h2 className="font-bold text-xl text-night">{quote.itemLabel}</h2>
                <p className="text-sm text-night/60 mt-1 max-w-md">{quote.itemDetail}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-night">
                  {quote.currency}
                  {quote.pricePerPerson}
                </div>
                <div className="text-xs text-night/50">per person</div>
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-5">
              <span className="font-bold text-night">Total &middot; {quote.travelers} travelers</span>
              <span className="font-display text-3xl text-gold">
                {quote.currency}
                {total}
              </span>
            </div>
          </div>

          <div className="bg-cream/60 border-t border-night/10 px-6 sm:px-8 py-5">
            <div className="flex items-baseline justify-between text-sm text-night/60">
              <span>Trip total</span>
              <span>
                {quote.currency}
                {total.toFixed(2)}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-sm text-night/60 mt-1.5">
              <span>PayPal processing fee</span>
              <span>
                +{quote.currency}
                {paypalFee.toFixed(2)}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-night/10">
              <span className="font-bold text-night text-sm">Total via PayPal</span>
              <span className="font-display text-2xl text-gold">
                {quote.currency}
                {paypalCharge.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 pb-10">
        <h3 className="font-bold text-lg text-night mb-3">Pay with PayPal</h3>
        {paypalClientId ? (
          <PaypalButton
            token={token}
            clientId={paypalClientId}
            chargeLabel={`${quote.currency}${paypalCharge.toFixed(2)}`}
          />
        ) : (
          <p className="text-sm text-rose-600">
            Payments aren&rsquo;t configured yet — please use WhatsApp below to confirm your booking.
          </p>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-5 pb-10">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg text-night mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" /> Included
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
              <X className="w-5 h-5 text-rose-600" /> Not included
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

      <section className="max-w-3xl mx-auto px-5 pb-10">
        <h3 className="font-bold text-lg text-night mb-1">Passport photo</h3>
        <p className="text-sm text-night/60 mb-4 max-w-xl">
          To book your tourist train ticket and hotel reservation, we need a photo of your passport.
        </p>
        <PassportUpload token={token} />
      </section>

      <section className="max-w-3xl mx-auto px-5 pb-16">
        <p className="text-sm text-night/60 mb-6 max-w-xl">{quote.note}</p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gold px-6 sm:px-7 py-3 sm:py-3.5 text-night font-semibold text-sm sm:text-base transition hover:bg-gold-bright hover:shadow-glow"
        >
          Confirm on WhatsApp →
        </a>
      </section>
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
