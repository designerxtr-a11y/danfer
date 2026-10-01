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
  /** When true, the page shows a canceled notice instead of the quote. */
  canceled?: boolean;
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
    canceled: true,
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

  "alejandra-zuniga": {
    lang: "es",
    clientName: "Alejandra",
    destination: "Cusco & Machu Picchu",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Machu Picchu",
    dates: "21 – 24 dic, 2026",
    duration: "4 días / 3 noches",
    travelers: 2,
    currency: "$",
    acceptsPaypal: true,
    depositPercent: 50,
    itinerary: [
      {
        day: "Día 1 · 21 dic",
        timeLabel: "1–6 pm",
        title: "Llegada + City Tour",
        desc: "Coricancha, Qenqo, Pucapucara, Sacsahuamán y Tambomachay. Incluye bus y guía profesional.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Qorikancha, Cusco",
      },
      {
        day: "Día 2 · 22 dic",
        timeLabel: "Desde 7 am",
        title: "Valle Sagrado + tren a Aguas Calientes",
        desc: "Chincheros, Moray, Salineras de Maras y Ollantaytambo, con almuerzo buffet. Desde Ollantaytambo, tren turístico a Aguas Calientes y noche de hotel con desayuno.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
        photoAlt: "Mercado artesanal de Pisac, Valle Sagrado",
      },
      {
        day: "Día 3 · 23 dic",
        timeLabel: "2,430 msnm",
        title: "Machu Picchu + retorno a Cusco",
        desc: "Bus de subida a la ciudadela y visita guiada por Machu Picchu. Retorno en el tren del mediodía a Ollantaytambo y traslado a Cusco el mismo día.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
        photoAlt: "Machu Picchu",
      },
      {
        day: "Día 4 · 24 dic",
        timeLabel: "Día libre",
        title: "Tours opcionales a elegir",
        desc: "Walking Tour, Tranvía, Tour Místico o Valle Sur: tú eliges el que más te guste.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Cusco",
      },
    ],
    items: [
      { label: "City Tour Cusco", unitPrice: 15 },
      { label: "Valle Sagrado VIP", unitPrice: 125 },
      {
        label: "Machu Picchu 2D/1N",
        detail:
          "Tren turístico ida y vuelta, bus, entrada, guía profesional, hotel en Aguas Calientes con desayuno y traslado de retorno a Cusco",
        unitPrice: 280,
      },
    ],
    includes: [
      "City Tour: bus y guía profesional",
      "Valle Sagrado VIP: bus, guía y almuerzo buffet",
      "Machu Picchu: tren turístico (Ollantaytambo–Aguas Calientes, ida y vuelta), bus de subida/bajada, entrada, guía profesional, 1 noche de hotel en Aguas Calientes con desayuno y traslado de retorno Ollantaytambo–Cusco",
    ],
    excludes: [
      "Boleto Turístico del Cusco (BTC), se compra aparte",
      "Tours opcionales del día 24",
      "Alimentación no especificada",
      "Propinas",
      "Gastos personales",
      "Seguro de viaje",
    ],
    note: "Precios en dólares (US$) por persona. Tarifa válida para las fechas indicadas, sujeta a confirmación de disponibilidad de tren y entradas al reservar (diciembre es temporada alta). Para asegurar tu ingreso a Machu Picchu, cuyos cupos son limitados en temporada alta, se requiere un adelanto del 50%: te entregamos tu ingreso desde ya, el saldo se completa al llegar a Cusco y ahí te entregamos tus trenes y tours. El Boleto Turístico del Cusco se compra aparte y es necesario para Sacsahuamán, Qenqo, Pucapucara, Tambomachay, Chinchero y Moray.",
  },

  "viajero-noviembre": {
    lang: "es",
    clientName: "viajero",
    destination: "Cusco & Machu Picchu",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Ciudadela de Machu Picchu",
    dates: "14 – 17 nov, 2026",
    duration: "4 días / 3 noches",
    travelers: 3,
    currency: "$",
    acceptsPaypal: true,
    depositPercent: 50,
    itinerary: [
      {
        day: "Día 1 · 14 nov",
        timeLabel: "1–6 pm",
        title: "Llegada + City Tour",
        desc: "Coricancha, Qenqo, Pucapucara, Sacsahuamán y Tambomachay. Incluye bus y guía profesional.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Qorikancha, Cusco",
      },
      {
        day: "Día 2 · 15 nov",
        timeLabel: "Desde 7 am",
        title: "Valle Sagrado + tren a Aguas Calientes",
        desc: "Chincheros, Moray, Salineras de Maras y Ollantaytambo, con almuerzo buffet. Desde Ollantaytambo, tren turístico a Aguas Calientes y noche de hotel con desayuno.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
        photoAlt: "Mercado artesanal de Pisac, Valle Sagrado",
      },
      {
        day: "Día 3 · 16 nov",
        timeLabel: "2,430 msnm",
        title: "Machu Picchu + retorno a Cusco",
        desc: "Bus de subida a la ciudadela y visita guiada por Machu Picchu. Tren de regreso a Ollantaytambo y traslado a Cusco el mismo día.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
        photoAlt: "Machu Picchu",
      },
      {
        day: "Día 4 · 17 nov",
        timeLabel: "Desde 4:30 am",
        title: "Laguna Humantay",
        desc: "Caminata hasta la laguna glaciar de aguas turquesa, a 4,200 msnm, con el nevado Salkantay de fondo. Incluye transporte, guía, desayuno y almuerzo buffet.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/laguna-humantay/1781143602424-rc9fi8.jpg",
        photoAlt: "Laguna Humantay",
      },
    ],
    items: [
      { label: "City Tour Cusco", unitPrice: 15 },
      { label: "Valle Sagrado VIP", unitPrice: 32 },
      {
        label: "Machu Picchu 2D/1N",
        detail:
          "Tren turístico ida y vuelta, bus, entrada, guía profesional, hotel cerca de Aguas Calientes con desayuno y traslado de retorno a Cusco",
        unitPrice: 280,
      },
      { label: "Laguna Humantay", unitPrice: 35 },
    ],
    includes: [
      "City Tour: bus y guía profesional",
      "Valle Sagrado VIP: bus, guía y almuerzo buffet",
      "Machu Picchu: tren turístico (Ollantaytambo–Aguas Calientes, ida y vuelta), bus de subida/bajada, entrada, guía profesional, 1 noche de hotel cerca de Aguas Calientes con desayuno y traslado de retorno Ollantaytambo–Cusco",
      "Laguna Humantay: transporte, guía, desayuno, almuerzo buffet y entrada",
    ],
    excludes: [
      "Boleto Turístico del Cusco (BTC), se compra aparte",
      "Alimentación no especificada",
      "Caballo y alquiler de bastones (opcionales)",
      "Propinas",
      "Gastos personales",
      "Seguro de viaje",
    ],
    note: "Precios en dólares (US$) por persona. Tarifa válida para las fechas indicadas, sujeta a confirmación de disponibilidad de tren y entradas al reservar. Se requiere un adelanto del 50% para confirmar la reserva (boletos de tren y reserva del hotel). El Boleto Turístico del Cusco se compra aparte y es necesario para Sacsahuamán, Qenqo, Pucapucara, Tambomachay, Chinchero y Moray.",
  },

  "viajero-rd-noviembre": {
    lang: "es",
    clientName: "viajero",
    destination: "Cusco, Machu Picchu & Lima",
    heroImage:
      "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
    heroImageAlt: "Ciudadela de Machu Picchu",
    dates: "1 – 10 nov, 2026",
    duration: "10 días / 9 noches",
    travelers: 2,
    currency: "$",
    acceptsPaypal: true,
    depositPercent: 50,
    itinerary: [
      {
        day: "Día 1 · 1 nov",
        timeLabel: "1–6 pm",
        title: "Llegada a Cusco + City Tour",
        desc: "Coricancha, Qenqo, Pucapucara, Sacsahuamán y Tambomachay. Un día suave para aclimatarse. Incluye bus y guía profesional.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Qorikancha, Cusco",
      },
      {
        day: "Día 2 · 2 nov",
        timeLabel: "7 am–7 pm",
        title: "Valle Sagrado VIP",
        desc: "Chinchero, Moray, Salineras de Maras y Ollantaytambo. Incluye bus, guía y almuerzo buffet.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/valle-sagrado-1789099156026.webp",
        photoAlt: "Valle Sagrado de los Incas",
      },
      {
        day: "Días 3–4 · 3–4 nov",
        timeLabel: "2,430 msnm",
        title: "Machu Picchu · 2D/1N",
        desc: "Traslado Cusco–Ollantaytambo y tren turístico a Aguas Calientes, con 1 noche de hotel y desayuno. Al día siguiente subes en bus a la ciudadela y haces la visita guiada por el Circuito 2A, el más completo. Por la tarde regresas en tren a Ollantaytambo y en transporte a Cusco.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/machu-picchu-1789092177202.webp",
        photoAlt: "Machu Picchu",
      },
      {
        day: "Día 5 · 5 nov",
        timeLabel: "4:30 am–5 pm",
        title: "Laguna Humantay",
        desc: "Caminata a la laguna turquesa, a 4,200 msnm, al pie del nevado Salkantay. Incluye transporte, guía, desayuno y almuerzo buffet.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/laguna-humantay/1781143602424-rc9fi8.jpg",
        photoAlt: "Laguna Humantay",
      },
      {
        day: "Día 6 · 6 nov",
        timeLabel: "5,036 msnm",
        title: "Montaña de 7 Colores",
        desc: "Salida de madrugada hacia Vinicunca y caminata a la montaña de colores. Incluye transporte, guía, desayuno y almuerzo buffet.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/hero/rainbow-mountain-1789091035693.webp",
        photoAlt: "Montaña de 7 Colores, Vinicunca",
      },
      {
        day: "Día 7 · 7 nov",
        timeLabel: "Libre",
        title: "Día libre · tours opcionales",
        desc: "Walking Tour, Tranvía, Valle Sur o el Tour Místico, la mejor forma de cerrar Cusco con broche de oro.",
        photo:
          "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/quotes/city-tour-cusco.jpg",
        photoAlt: "Cusco",
      },
    ],
    items: [
      { label: "City Tour Cusco", detail: "Bus y guía profesional", unitPrice: 15 },
      { label: "Valle Sagrado VIP", detail: "Bus, guía y almuerzo buffet", unitPrice: 125 },
      {
        label: "Machu Picchu 2D/1N",
        detail:
          "Entrada Circuito 2A, tren turístico Ollantaytambo–Aguas Calientes ida y vuelta, bus de subida/bajada, guía, hotel con desayuno y transporte desde/hasta Cusco",
        unitPrice: 280,
      },
      { label: "Laguna Humantay", detail: "Transporte, guía, desayuno y almuerzo buffet", unitPrice: 35 },
      { label: "Montaña de 7 Colores", detail: "Transporte, guía, desayuno y almuerzo buffet", unitPrice: 35 },
    ],
    includes: [
      "Transporte turístico compartido para todas las excursiones",
      "Guía profesional en cada excursión (grupo compartido; guía privado a pedido)",
      "Valle Sagrado VIP: almuerzo buffet",
      "Laguna Humantay y Montaña de 7 Colores: desayuno y almuerzo buffet",
      "Machu Picchu: entrada Circuito 2A, tren turístico (Ollantaytambo–Aguas Calientes, ida y vuelta), bus Aguas Calientes–Machu Picchu–Aguas Calientes, 1 noche de hotel con desayuno y transporte desde/hasta Cusco",
    ],
    excludes: [
      "Vuelos internacionales y nacionales",
      "Hoteles en Cusco y Lima",
      "Traslados de aeropuerto (Cusco y Lima)",
      "Servicios en Lima (se cotizan por separado)",
      "Boleto Turístico del Cusco (BTC), se compra aparte",
      "Cenas y comidas no indicadas, más el almuerzo en Machu Picchu",
      "Caballo y bastones en Humantay y 7 Colores (opcionales)",
      "Tours opcionales del día libre",
      "Propinas, gastos personales y seguro de viaje",
    ],
    note: "Precios en dólares (US$) por persona; el total mostrado es para 2 pasajeros (para 1 pasajero: US$490, adelanto US$245). Noviembre es temporada de alta demanda: el adelanto del 50% asegura tu ingreso a Machu Picchu, que te entregamos desde ya; el saldo se completa al llegar a Cusco. Cambios de fecha sin costo hasta 72 horas antes, según disponibilidad. Entradas y trenes no son reembolsables; si cancelamos nosotros o el clima lo impide, reprogramamos sin costo o devolvemos la parte no realizada. Oficina: Av. El Sol 314, Cusco. Operador autorizado por MINCETUR.",
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
