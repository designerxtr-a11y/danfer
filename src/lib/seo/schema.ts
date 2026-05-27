import type { TourWithCategory, Review, FAQ } from "@/types/database";
import { t } from "@/types/database";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";
const ORG_NAME = "Danfer Tours Cusco";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE}/#organization`,
    name: ORG_NAME,
    legalName: "Danfer Tours Cusco S.A.C.",
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/og-image.jpg`,
    description:
      "Operador turístico oficial en Cusco. Tours guiados a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y más.",
    telephone: "+51-984-123-456",
    email: "hola@danfertourscusco.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. El Sol 314",
      addressLocality: "Cusco",
      addressRegion: "Cusco",
      postalCode: "08000",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.5183,
      longitude: -71.9781,
    },
    sameAs: [
      "https://www.instagram.com/danfertourscusco",
      "https://www.facebook.com/danfertourscusco",
      "https://www.tiktok.com/@danfertourscusco",
    ],
    areaServed: {
      "@type": "Place",
      name: "Cusco, Perú",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: ORG_NAME,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: ["es-PE", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/tours?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
    })),
  };
}

export function tourSchema(tour: TourWithCategory, reviews: Review[] = []) {
  const title = t(tour.title);
  const description = t(tour.description) || t(tour.short_desc) || "";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE}/tours/${tour.slug}#product`,
    name: title,
    description,
    image: [tour.cover_image, ...tour.gallery.map((g) => g.url)].slice(0, 6),
    brand: { "@type": "Brand", name: ORG_NAME },
    sku: tour.slug,
    category: tour.category ? t(tour.category.name) : "Tours",
    offers: {
      "@type": "Offer",
      url: `${SITE}/tours/${tour.slug}`,
      priceCurrency: "USD",
      price:
        tour.discount_pct > 0
          ? (tour.price_usd * (1 - tour.discount_pct / 100)).toFixed(2)
          : tour.price_usd.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE}/#organization` },
      validFrom: new Date().toISOString(),
    },
    ...(tour.reviews_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tour.rating.toFixed(1),
        reviewCount: tour.reviews_count,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
        },
        author: { "@type": "Person", name: r.author_name },
        reviewBody: r.body ?? r.title ?? "",
        datePublished: r.created_at.slice(0, 10),
      })),
    }),
  };

  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${SITE}/tours/${tour.slug}#trip`,
    name: title,
    description,
    image: tour.cover_image,
    touristType: ["Adventure", "Cultural"],
    provider: { "@id": `${SITE}/#organization` },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.duration_days,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE}/tours/${tour.slug}`,
      priceCurrency: "USD",
      price: tour.price_usd.toFixed(2),
    },
  };

  return [productSchema, tripSchema];
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function tourFaqsSchema(faqs: FAQ[]) {
  if (faqs.length === 0) return null;
  return faqSchema(faqs.map((f) => ({ q: t(f.q), a: t(f.a) })));
}

/**
 * VideoObject — para que Google indexe el video del hero en Google Videos.
 * Subir thumbnail/poster real cuando esté disponible.
 */
export function heroVideoSchema(opts?: {
  contentUrl?: string;
  thumbnailUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${SITE}/#hero-video`,
    name: "Danfer Tours Cusco · Viaja al corazón del Imperio Inca",
    description:
      "Sobrevuela los Andes peruanos y desciende a Machu Picchu, el Valle Sagrado y las rutas ancestrales del Imperio Inca con guías locales certificados.",
    thumbnailUrl: [
      opts?.thumbnailUrl ||
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop",
    ],
    uploadDate: "2026-01-01T00:00:00+00:00",
    contentUrl:
      opts?.contentUrl ||
      "https://videos.pexels.com/video-files/2169307/2169307-hd_1920_1080_30fps.mp4",
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: "es-PE",
  };
}

/**
 * ItemList — el carrusel de tours en /tours sale en Google con thumbnails,
 * precios y ratings (carousel rich result).
 */
export function tourListSchema(tours: TourWithCategory[]) {
  if (tours.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/tours#itemlist`,
    name: "Tours en Cusco",
    numberOfItems: tours.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: tours.map((tour, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/tours/${tour.slug}`,
      name: t(tour.title),
      image: tour.cover_image,
    })),
  };
}

/**
 * AggregateOffer — rango de precios del catálogo. Google lo usa para mostrar
 * "from US$XX" en SERP.
 */
export function toursAggregateOfferSchema(tours: TourWithCategory[]) {
  if (tours.length === 0) return null;
  const prices = tours.map((tour) =>
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd
  );
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "@id": `${SITE}/tours#aggregate-offer`,
    priceCurrency: "USD",
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: tours.length,
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE}/#organization` },
  };
}

/**
 * Service — Google interpreta cada categoría como un servicio del operador.
 * Útil para queries "servicios turísticos en Cusco".
 */
export function categoryServiceSchema(
  category: { slug: string; name: { es: string; en?: string }; description?: { es: string; en?: string } | null }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/tours?category=${category.slug}#service`,
    serviceType: t(category.name),
    name: t(category.name),
    description: category.description ? t(category.description) : undefined,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: {
      "@type": "Place",
      name: "Cusco, Perú",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Tourists",
    },
  };
}

/**
 * Speakable — partes del contenido optimizadas para asistentes de voz
 * (Google Assistant lee títulos y resúmenes en voz alta).
 */
export function speakableSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/#webpage`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
    url: SITE,
    isPartOf: { "@id": `${SITE}/#website` },
  };
}

/**
 * FAQ del homepage — preguntas de cola larga frecuentes en SERP de Cusco.
 * Cuando matchea una query, Google muestra los Q&A directamente.
 */
export function homepageFaqSchema() {
  return faqSchema([
    {
      q: "¿Cuál es la mejor época para visitar Machu Picchu?",
      a: "La temporada seca, de mayo a septiembre, es ideal: días soleados, cielos despejados y baja probabilidad de lluvia. Junio y julio son los meses con mayor afluencia turística — reserva con 2-3 meses de anticipación. De diciembre a marzo es temporada de lluvias con vegetación más verde pero el Camino Inca cierra en febrero por mantenimiento.",
    },
    {
      q: "¿Cuánto cuesta un tour a Machu Picchu desde Cusco?",
      a: "Un tour Full Day a Machu Picchu desde Cusco con Danfer Tours cuesta desde US$380 por persona, incluyendo transporte en tren panorámico, entrada a la ciudadela, guía profesional bilingüe y almuerzo buffet en Aguas Calientes. El Camino Inca de 4 días desde US$750.",
    },
    {
      q: "¿Cuántos días se necesitan para conocer Cusco y Machu Picchu?",
      a: "Lo recomendable son 5-7 días: 1-2 días de aclimatación en Cusco, 1 día en el Valle Sagrado, 2 días para Machu Picchu (con noche en Aguas Calientes opcional) y 1-2 días para destinos extra como Rainbow Mountain o Laguna Humantay.",
    },
    {
      q: "¿Es seguro hacer el Camino Inca?",
      a: "Sí, el Camino Inca es seguro cuando se hace con operador autorizado por el SERNANP. Danfer Tours cuenta con permisos oficiales, guías certificados con formación en primeros auxilios y altitud, y porteadores con seguro. Los grupos son de máximo 16 personas.",
    },
    {
      q: "¿Cómo evito el mal de altura (soroche) en Cusco?",
      a: "Llega con tiempo: 1-2 días en Cusco (3,400 msnm) antes de actividades exigentes. Hidrátate constantemente, evita alcohol las primeras 24h, come ligero, mastica hoja de coca o toma mate de coca. Si haces Rainbow Mountain o Camino Inca, aclimátate al menos 48 horas en Cusco.",
    },
    {
      q: "¿Qué incluye un tour a Rainbow Mountain?",
      a: "El tour Full Day a la Montaña de 7 Colores (Vinicunca) incluye recojo del hotel a las 4am, desayuno y almuerzo, transporte privado a Cusipata, guía profesional y entrada al sendero (5,200 msnm). Llevar ropa térmica, protector solar, agua y pasaporte.",
    },
    {
      q: "¿Necesito visa para visitar Perú?",
      a: "La mayoría de países (UE, EE.UU., Canadá, Reino Unido, Australia, latinoamericanos) NO necesitan visa para estancias turísticas de hasta 183 días. Solo se requiere pasaporte vigente con al menos 6 meses de validez al ingreso.",
    },
    {
      q: "¿Puedo reservar el tour con cuánta anticipación?",
      a: "Para Machu Picchu y tours regulares recomendamos 2-4 semanas de anticipación. Para Camino Inca 3-6 meses (los cupos del SERNANP son limitados a 500 personas/día incluyendo porteadores). En temporada alta (junio-agosto) reserva con la máxima anticipación posible.",
    },
  ]);
}
