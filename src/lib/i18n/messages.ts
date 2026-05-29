export const messages = {
  es: {
    nav: {
      tours: "Tours",
      destinations: "Destinos",
      blog: "Blog",
      reviews: "Reseñas",
    },
    hero: {
      eyebrow: "Descubre el Perú",
      title_a: "Viaja al",
      title_emphasis: "corazón",
      title_b: "del Imperio Inca",
      subtitle:
        "Tours exclusivos por Machu Picchu, el Valle Sagrado y rutas ancestrales. Experiencias auténticas con guías locales que conocen cada piedra del imperio.",
      cta: "Reservar tour",
      videoCta: "Ver video",
      stats_travelers: "Viajeros felices",
      stats_rating: "Rating TripAdvisor",
      stats_tours: "Tours únicos",
    },
    sections: {
      stats: {
        years: "Años de experiencia",
        travelers: "Viajeros felices",
        routes: "Rutas exclusivas",
      },
      featured: {
        eyebrow: "Experiencias inolvidables",
        title_a: "Nuestros tours",
        title_emphasis: "más vendidos",
        subtitle:
          "Diseñados con guías locales certificados, transporte privado y atención de viajero exigente. Disponibilidad en vivo.",
      },
      destinations: {
        eyebrow: "Destinos",
        title_a: "Explora por",
        title_emphasis: "región",
        subtitle:
          "Desde la ciudadela sagrada hasta los nevados andinos — cada destino es una historia.",
      },
      testimonials: {
        eyebrow: "Reseñas verificadas",
        title_a: "Lo que dicen",
        title_emphasis: "nuestros viajeros",
      },
    },
    booking: {
      from: "Desde",
      perPerson: "por persona",
      date: "Fecha de salida",
      travelers: "Viajeros",
      person: "persona",
      people: "personas",
      total: "Total",
      reserve: "Reservar ahora",
      securePayment: "Pago seguro",
      instant: "Confirmación instantánea",
    },
    common: {
      backToTours: "Volver a tours",
      loadMore: "Cargar más",
      learnMore: "Conoce más",
      next: "Siguiente",
      prev: "Anterior",
    },
    tourDetail: {
      about: "Sobre el tour",
      highlights: "Lo más destacado",
      itinerary: "Itinerario",
      startPoint: "Punto de inicio",
      reviewsCount: "reseñas",
      upTo: "Hasta",
      masl: "msnm",
    },
    breadcrumbs: {
      home: "Inicio",
      tours: "Tours",
      destinations: "Destinos",
      blog: "Blog",
    },
    difficulty: {
      easy: "Fácil",
      moderate: "Moderado",
      challenging: "Exigente",
      expert: "Experto",
    },
  },
  en: {
    nav: {
      tours: "Tours",
      destinations: "Destinations",
      blog: "Blog",
      reviews: "Reviews",
    },
    hero: {
      eyebrow: "Discover Peru",
      title_a: "Travel to the",
      title_emphasis: "heart",
      title_b: "of the Inca Empire",
      subtitle:
        "Exclusive tours through Machu Picchu, the Sacred Valley, and ancestral routes. Authentic experiences with local guides who know every stone of the empire.",
      cta: "Book tour",
      videoCta: "Watch video",
      stats_travelers: "Happy travelers",
      stats_rating: "TripAdvisor rating",
      stats_tours: "Unique tours",
    },
    sections: {
      stats: {
        years: "Years of experience",
        travelers: "Happy travelers",
        routes: "Exclusive routes",
      },
      featured: {
        eyebrow: "Unforgettable experiences",
        title_a: "Our",
        title_emphasis: "best-selling tours",
        subtitle:
          "Designed with certified local guides, private transport and attention to detail. Live availability.",
      },
      destinations: {
        eyebrow: "Destinations",
        title_a: "Explore by",
        title_emphasis: "region",
        subtitle:
          "From the sacred citadel to the Andean snow peaks — every destination is a story.",
      },
      testimonials: {
        eyebrow: "Verified reviews",
        title_a: "What our",
        title_emphasis: "travelers say",
      },
    },
    booking: {
      from: "From",
      perPerson: "per person",
      date: "Departure date",
      travelers: "Travelers",
      person: "person",
      people: "people",
      total: "Total",
      reserve: "Book now",
      securePayment: "Secure payment",
      instant: "Instant confirmation",
    },
    common: {
      backToTours: "Back to tours",
      loadMore: "Load more",
      learnMore: "Learn more",
      next: "Next",
      prev: "Previous",
    },
    tourDetail: {
      about: "About the tour",
      highlights: "Highlights",
      itinerary: "Itinerary",
      startPoint: "Starting point",
      reviewsCount: "reviews",
      upTo: "Up to",
      masl: "m.a.s.l.",
    },
    breadcrumbs: {
      home: "Home",
      tours: "Tours",
      destinations: "Destinations",
      blog: "Blog",
    },
    difficulty: {
      easy: "Easy",
      moderate: "Moderate",
      challenging: "Challenging",
      expert: "Expert",
    },
  },
} as const;

export type Locale = keyof typeof messages;
export type Messages = (typeof messages)[Locale];

/** Bundle de mensajes para el locale dado (uso en Server Components, SSG-safe). */
export function tr(locale: Locale) {
  return messages[locale];
}
