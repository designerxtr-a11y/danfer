// Private, single-use travel quotes. Not linked from anywhere on the site —
// only shared directly with the client. Not meant to replace the real
// tours/bookings data model; each entry is a one-off, hand-built quote.
//
// Shared between the page (display) and the PayPal server actions (source
// of truth for the amount to charge — never trust a price from the client).
export interface Quote {
  clientName: string;
  destination: string;
  heroImage: string;
  heroImageAlt: string;
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

export const QUOTES: Record<string, Quote> = {
  "emmanuel-champagne": {
    clientName: "Emmanuel",
    destination: "Machu Picchu",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Machu Picchu citadel",
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

export function quoteTotal(quote: Quote): number {
  return quote.pricePerPerson * quote.travelers;
}

// PayPal "receive payments for goods/services" rate on this account: 5.4% +
// $0.30 USD (varies by the payer's country / domestic vs international).
// Grossed up so the business still nets the full quote total after PayPal
// takes its cut: charge * (1 - rate) - fixed = base  =>  charge = (base + fixed) / (1 - rate)
export const PAYPAL_FEE_RATE = 0.054;
export const PAYPAL_FEE_FIXED = 0.3;

export function quotePaypalCharge(quote: Quote): number {
  const base = quoteTotal(quote);
  const charge = (base + PAYPAL_FEE_FIXED) / (1 - PAYPAL_FEE_RATE);
  return Math.round(charge * 100) / 100;
}
