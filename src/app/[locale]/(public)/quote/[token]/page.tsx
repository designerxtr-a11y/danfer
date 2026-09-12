import { notFound } from "next/navigation";
import { Check, X, MapPin, Calendar, Users, Clock } from "lucide-react";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";

// Private, single-use travel quotes. Not linked from anywhere on the site —
// only shared directly with the client. Not meant to replace the real
// tours/bookings data model; each entry is a one-off, hand-built quote.
interface Quote {
  clientName: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  currency: string;
  pricePerPerson: number;
  itemLabel: string;
  itemDetail: string;
  includes: string[];
  excludes: string[];
  note: string;
}

const QUOTES: Record<string, Quote> = {
  "emmanuel-champagne": {
    clientName: "Emmanuel",
    destination: "Machu Picchu",
    dates: "Nov 15 – 18, 2026",
    duration: "2 days / 1 night",
    travelers: 2,
    currency: "$",
    pricePerPerson: 280,
    itemLabel: "Machu Picchu · 2D/1N",
    itemDetail:
      "Tourist train, bus, Machu Picchu entrance ticket, guided tour, and a hotel near Aguas Calientes with breakfast included.",
    includes: [
      "Tourist train, round trip (Ollantaytambo–Aguas Calientes)",
      "Bus up and down to the citadel",
      "Machu Picchu entrance ticket",
      "Professional guide",
      "1 night hotel near Aguas Calientes, breakfast included",
    ],
    excludes: ["Meals not specified", "Tips", "Personal expenses", "Travel insurance"],
    note: "Rate valid for the dates above, subject to confirmation of train and entrance ticket availability at the time of booking.",
  },
};

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
  const total = quote.pricePerPerson * quote.travelers;
  const waMessage = `Hi! I'd like to confirm my ${quote.destination} quote (${quote.dates}) for ${quote.travelers} people.`;
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="bg-cream">
      <section className="max-w-3xl mx-auto px-5 pt-14 pb-6">
        <p className="font-display text-gold tracking-widest text-sm uppercase">
          Travel Quote
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-night mt-2">
          Hi {quote.clientName}, here&rsquo;s your quote
        </h1>
        <p className="text-night/70 mt-3 max-w-xl">
          Thanks for your interest — here are the details for your {quote.destination} trip.
        </p>
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
        </div>
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
