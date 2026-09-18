// Private, single-use travel quotes. Not linked from anywhere on the site —
// only shared directly with the client. Not meant to replace the real
// tours/bookings data model; each entry is a one-off, hand-built quote.
//
// Shared between the page (display) and the PayPal server actions (source
// of truth for the amount to charge — never trust a price from the client).
export interface ItineraryStop {
  day: string;
  timeLabel: string;
  title: string;
  desc: string;
  photo: string;
  photoAlt: string;
}

export interface QuoteItem {
  label: string;
  detail?: string;
  unitPrice: number;
  /** false = flat fee for the group (e.g. a shared transfer), not per traveler. Defaults to true. */
  perTraveler?: boolean;
}

export interface Quote {
  lang: "en" | "es";
  clientName: string;
  destination: string;
  heroImage: string;
  heroImageAlt: string;
  dates: string;
  duration: string;
  travelers: number;
  currency: string;
  itinerary: ItineraryStop[];
  items: QuoteItem[];
  includes: string[];
  excludes: string[];
  note: string;
  /** PayPal only supports quotes priced in USD — omit for other currencies. */
  acceptsPaypal: boolean;
  /** % of the total charged via PayPal now; the rest is paid in person on arrival. Omit for full payment (100%). */
  depositPercent?: number;
}

export const QUOTES: Record<string, Quote> = {
  "emmanuel-champagne": {
    lang: "en",
    clientName: "Emmanuel",
    destination: "Machu Picchu",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Machu Picchu citadel",
    dates: "Nov 16 – 17, 2026",
    duration: "2 days / 1 night",
    travelers: 2,
    currency: "$",
    acceptsPaypal: true,
    depositPercent: 50,
    itinerary: [],
    items: [
      {
        label: "Machu Picchu · 2D/1N",
        detail:
          "Tourist train, bus, Machu Picchu entrance ticket, guided tour, hotel near Aguas Calientes with breakfast included, and return transfer to Cusco.",
        unitPrice: 280,
      },
    ],
    includes: [
      "Tourist train (Ollantaytambo–Aguas Calientes)",
      "Bus up and down to the citadel",
      "Machu Picchu entrance ticket",
      "Professional guide",
      "1 night hotel near Aguas Calientes, breakfast included",
      "Return transfer, Ollantaytambo–Cusco (drop-off near the Plaza de Armas)",
    ],
    excludes: ["Meals not specified", "Tips", "Personal expenses", "Travel insurance"],
    note: "Departure is at 8 am to catch the train to Machu Picchu. Rate valid for the dates above, subject to confirmation of train and entrance ticket availability at the time of booking. The entrance ticket is for Circuit 2A, the most in-demand circuit, so picking it up in person can mean a 1-2 hour queue depending on how busy it is. A 50% deposit is required to confirm the booking (train tickets and hotel reservation).",
  },

  "victor-cueva": {
    lang: "es",
    clientName: "Victor",
    destination: "Cusco & Machu Picchu",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Machu Picchu",
    dates: "22 – 25 oct, 2026",
    duration: "4 días / 3 noches",
    travelers: 3,
    currency: "S/",
    acceptsPaypal: false,
    itinerary: [
      {
        day: "Día 1 · 22 oct",
        timeLabel: "1–6 pm",
        title: "Llegada + City Tour",
        desc: "Coricancha, Qenqo, Pucapucara, Sacsahuamán y Tambomachay. Incluye bus y guía profesional.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Qorikancha, Cusco",
      },
      {
        day: "Día 2 · 23 oct",
        timeLabel: "7 am–7 pm",
        title: "Valle Sagrado VIP",
        desc: "Chincheros, Moray, Salineras de Maras y Ollantaytambo. Incluye bus, guía y almuerzo buffet.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
        photoAlt: "Mercado artesanal de Pisac, Valle Sagrado",
      },
      {
        day: "Día 3–4 · 24–25 oct",
        timeLabel: "2,430 msnm",
        title: "Machu Picchu · 2D/1N",
        desc: "Tren local ida/vuelta, transporte Cusco–Ollantaytambo–Cusco, bus de subida/bajada, hotel, entrada y guía profesional. Retorno a Cusco el día 25.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
        photoAlt: "Machu Picchu",
      },
    ],
    items: [
      { label: "City Tour Cusco", unitPrice: 30 },
      { label: "Valle Sagrado VIP", unitPrice: 80 },
      {
        label: "Machu Picchu 2D/1N",
        detail: "Tren local, bus, hotel, entrada y guía profesional",
        unitPrice: 320,
      },
      { label: "Traslado aeropuerto", detail: "Solo recojo, tarifa fija", unitPrice: 30, perTraveler: false },
    ],
    includes: [
      "City Tour: bus y guía profesional",
      "Valle Sagrado VIP: bus, guía y almuerzo buffet",
      "Machu Picchu: entrada, bus de subida/bajada, guía, tren local, hotel y transporte Cusco–Ollantaytambo–Cusco",
      "Traslado aeropuerto: solo recojo",
    ],
    excludes: [
      "Boleto Turístico del Cusco, general (S/70 p.p.)",
      "Alimentación no especificada",
      "Propinas",
      "Gastos personales",
      "Seguro de viaje",
    ],
    note: "Precios en soles (S/) por persona, tarifa nacional. Sujeto a confirmación de disponibilidad de tren y entradas al reservar. Boleto Turístico del Cusco (S/70 p.p.) requerido aparte para Sacsahuamán, Qenqo, Pucapucara, Tambomachay, Chinchero y Moray.",
  },
};

export function itemSubtotal(item: QuoteItem, travelers: number): number {
  return item.perTraveler === false ? item.unitPrice : item.unitPrice * travelers;
}

export function quoteTotal(quote: Quote): number {
  return quote.items.reduce((sum, item) => sum + itemSubtotal(item, quote.travelers), 0);
}

// Portion of the total charged via PayPal now — the rest is paid in person
// on arrival. Defaults to the full total when depositPercent is omitted.
export function depositAmount(quote: Quote): number {
  const pct = quote.depositPercent ?? 100;
  return Math.round(quoteTotal(quote) * pct) / 100;
}

// PayPal "receive payments for goods/services" rate on this account: 5.4% +
// $0.30 USD (varies by the payer's country / domestic vs international).
// Grossed up so the business still nets the deposit amount after PayPal
// takes its cut: charge * (1 - rate) - fixed = base  =>  charge = (base + fixed) / (1 - rate)
export const PAYPAL_FEE_RATE = 0.054;
export const PAYPAL_FEE_FIXED = 0.3;

export function quotePaypalCharge(quote: Quote): number {
  const base = depositAmount(quote);
  const charge = (base + PAYPAL_FEE_FIXED) / (1 - PAYPAL_FEE_RATE);
  return Math.round(charge * 100) / 100;
}
