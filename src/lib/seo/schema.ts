import type { TourWithCategory, Review, FAQ } from "@/types/database";
import { t } from "@/types/database";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";
const ORG_NAME = "Danfer Tours Cusco";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness", "TouristInformationCenter"],
    "@id": `${SITE}/#organization`,
    name: ORG_NAME,
    alternateName: ["Danfer Tours", "Danfer Cusco", "Danfer Travel"],
    legalName: "Danfer Tours Cusco S.A.C.",
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/icon`,
      width: 512,
      height: 512,
    },
    image: `${SITE}/opengraph-image`,
    description:
      "Operador turístico oficial en Cusco con 12 años de experiencia. Tours guiados a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay. Guías locales certificados, grupos pequeños, reservas con confianza.",
    slogan: "Viaja al corazón del Imperio Inca",
    foundingDate: "2014-01-01",
    foundingLocation: {
      "@type": "Place",
      name: "Cusco, Perú",
    },
    telephone: "+51-984-123-456",
    email: "hola@danfertourscusco.com",
    priceRange: "$$",
    currenciesAccepted: ["USD", "PEN", "EUR"],
    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Visa",
      "Mastercard",
      "American Express",
      "PayPal",
      "Bank Transfer",
    ],
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/danfertourscusco",
      "https://www.facebook.com/danfertourscusco",
      "https://www.tiktok.com/@danfertourscusco",
    ],
    areaServed: [
      {
        "@type": "Place",
        name: "Cusco, Perú",
        geo: {
          "@type": "GeoCoordinates",
          latitude: -13.5183,
          longitude: -71.9781,
        },
      },
      { "@type": "Place", name: "Machu Picchu, Perú" },
      { "@type": "Place", name: "Valle Sagrado de los Incas, Perú" },
      { "@type": "Place", name: "Camino Inca, Perú" },
      { "@type": "Place", name: "Rainbow Mountain (Vinicunca), Perú" },
      { "@type": "Place", name: "Laguna Humantay, Perú" },
    ],
    knowsAbout: [
      "Machu Picchu tours",
      "Inca Trail trekking",
      "Sacred Valley tours",
      "Cusco day trips",
      "Rainbow Mountain hike",
      "Humantay Lake",
      "Peruvian Andes adventure",
      "Inca civilization",
      "High-altitude trekking",
    ],
    award: [
      "TripAdvisor Travelers' Choice 2025",
      "Certificación oficial DIRCETUR Cusco",
    ],
    memberOf: {
      "@type": "Organization",
      name: "Cámara Nacional de Turismo del Perú (CANATUR)",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Operador Turístico Autorizado",
      recognizedBy: {
        "@type": "Organization",
        name: "DIRCETUR Cusco / MINCETUR",
      },
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+51-984-123-456",
        contactType: "customer service",
        areaServed: ["PE", "US", "ES", "MX", "AR", "CL", "CO"],
        availableLanguage: ["Spanish", "English", "Quechua"],
      },
      {
        "@type": "ContactPoint",
        email: "hola@danfertourscusco.com",
        contactType: "reservations",
        availableLanguage: ["Spanish", "English"],
      },
    ],
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
/**
 * Place / TouristAttraction — para que cada destino tenga su propia entidad
 * en Google Knowledge Graph y aparezca con foto + descripción.
 */
export function placeSchema(opts: {
  slug: string;
  name: string;
  description: string;
  image?: string;
  lat?: number;
  lng?: number;
  altitude?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["TouristAttraction", "Place"],
    "@id": `${SITE}/destinos/${opts.slug}#place`,
    name: opts.name,
    description: opts.description,
    ...(opts.image && { image: opts.image }),
    ...(opts.lat &&
      opts.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: opts.lat,
          longitude: opts.lng,
          ...(opts.altitude && { elevation: `${opts.altitude}m` }),
        },
      }),
    isAccessibleForFree: false,
    publicAccess: true,
    touristType: ["Adventure", "Cultural", "Eco-tourism", "Historical"],
    includedInDataCatalog: { "@id": `${SITE}/#organization` },
  };
}

/**
 * Place schemas pre-armados para los destinos top de Cusco —
 * meterlos en homepage + página /destinos / páginas de categoría.
 */
export function topDestinationsSchemas() {
  return [
    placeSchema({
      slug: "machu-picchu",
      name: "Machu Picchu",
      description:
        "Ciudadela inca del siglo XV, Patrimonio de la Humanidad por la UNESCO y una de las 7 Maravillas del Mundo Moderno. Ubicada a 2,430 msnm en la región Cusco, Perú.",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1600",
      lat: -13.1631,
      lng: -72.545,
      altitude: 2430,
    }),
    placeSchema({
      slug: "camino-inca",
      name: "Camino Inca a Machu Picchu",
      description:
        "Ruta trekking ancestral de 43 km que conecta Cusco con Machu Picchu a través de los Andes peruanos. Considerada una de las mejores caminatas del mundo.",
      image:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600",
      lat: -13.4,
      lng: -72.5,
      altitude: 4215,
    }),
    placeSchema({
      slug: "valle-sagrado",
      name: "Valle Sagrado de los Incas",
      description:
        "Valle fértil del río Urubamba con sitios arqueológicos como Pisac, Ollantaytambo y Chinchero. Centro agrícola y espiritual del Imperio Inca.",
      lat: -13.3167,
      lng: -72.0833,
      altitude: 2800,
    }),
    placeSchema({
      slug: "rainbow-mountain",
      name: "Montaña de 7 Colores (Vinicunca)",
      description:
        "Cumbre andina a 5,200 msnm con franjas de mineral coloreadas naturalmente — rojo, ocre, turquesa y dorado. Una de las atracciones más fotografiadas del Perú.",
      lat: -13.8694,
      lng: -71.3022,
      altitude: 5200,
    }),
    placeSchema({
      slug: "laguna-humantay",
      name: "Laguna Humantay",
      description:
        "Laguna glaciar de aguas turquesa a 4,200 msnm, al pie del nevado Salkantay. Trekking de un día desde Cusco.",
      lat: -13.3458,
      lng: -72.6261,
      altitude: 4200,
    }),
  ];
}

/**
 * Course schema — para tours multi-día (Camino Inca, Salkantay 5D, etc).
 * Google los muestra en Education / Course rich results y también ayuda en
 * queries tipo "curso/guía de Camino Inca".
 */
export function courseSchema(tour: TourWithCategory) {
  if (tour.duration_days < 2) return null; // solo multi-día
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE}/tours/${tour.slug}#course`,
    name: t(tour.title),
    description: t(tour.description) || t(tour.short_desc) || "",
    provider: { "@id": `${SITE}/#organization` },
    courseMode: "onsite",
    educationalLevel: "Beginner to Advanced",
    inLanguage: ["es", "en"],
    teaches: tour.highlights.slice(0, 8),
    timeRequired: `P${tour.duration_days}D`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: "Cusco, Perú",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cusco",
          addressCountry: "PE",
        },
      },
      duration: `P${tour.duration_days}D`,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE}/tours/${tour.slug}`,
      priceCurrency: "USD",
      price:
        tour.discount_pct > 0
          ? (tour.price_usd * (1 - tour.discount_pct / 100)).toFixed(2)
          : tour.price_usd.toFixed(2),
      availability: "https://schema.org/InStock",
      category: "TravelTour",
    },
  };
}

/**
 * BlogPosting / Article schema — el `Article` que tienes embebido en
 * blog/[slug] es minimal; este lo reemplaza con todos los campos que Google
 * pide para rich results de noticias / blog.
 */
export function blogPostingSchema(opts: {
  slug: string;
  title: string;
  excerpt: string;
  bodyText?: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  authorName?: string | null;
  authorAvatar?: string | null;
  readMinutes?: number;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE}/blog/${opts.slug}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/blog/${opts.slug}`,
    },
    headline: opts.title.slice(0, 110),
    description: opts.excerpt,
    ...(opts.bodyText && { articleBody: opts.bodyText.slice(0, 2000) }),
    ...(opts.coverImage && {
      image: {
        "@type": "ImageObject",
        url: opts.coverImage,
        width: 1600,
        height: 900,
      },
    }),
    datePublished: opts.publishedAt ?? new Date().toISOString(),
    dateModified: opts.updatedAt ?? opts.publishedAt ?? new Date().toISOString(),
    author: {
      "@type": "Person",
      name: opts.authorName ?? ORG_NAME,
      ...(opts.authorAvatar && { image: opts.authorAvatar }),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: ORG_NAME,
      logo: { "@type": "ImageObject", url: `${SITE}/icon` },
    },
    inLanguage: "es-PE",
    isPartOf: { "@id": `${SITE}/#website` },
    ...(opts.tags &&
      opts.tags.length > 0 && {
        keywords: opts.tags.join(", "),
        articleSection: opts.tags[0],
      }),
    ...(opts.readMinutes && {
      timeRequired: `PT${opts.readMinutes}M`,
      wordCount: opts.readMinutes * 200,
    }),
  };
}

/**
 * HowTo schema — para guías paso a paso ("Cómo aclimatarse en Cusco",
 * "Cómo prepararse para el Camino Inca"). Sale en SERP como tarjeta
 * expandible con cada paso.
 */
export function howToSchema(opts: {
  name: string;
  description: string;
  totalTimeISO?: string;
  steps: { name: string; text: string; image?: string }[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.image && { image: opts.image }),
    ...(opts.totalTimeISO && { totalTime: opts.totalTimeISO }),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image && { image: s.image }),
    })),
  };
}

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
