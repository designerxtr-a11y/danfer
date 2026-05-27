// Tipos comunes de scrapers

export interface ScrapedTour {
  source_url: string;
  source_domain: string;
  slug: string;                  // sugerido, editable
  title: string;
  subtitle?: string;
  short_desc?: string;
  description?: string;
  cover_image?: string;
  gallery: string[];             // URLs absolutas
  duration_days?: number;
  duration_label?: string;
  difficulty?: "easy" | "moderate" | "challenging" | "expert";
  max_group_size?: number;
  altitude_max?: number;
  price_usd?: number;
  price_pen?: number;
  highlights: string[];
  includes: string[];
  excludes: string[];
  what_to_bring: string[];
  itinerary: ScrapedItineraryDay[];
}

export interface ScrapedItineraryDay {
  day_number: number;
  title: string;
  description?: string;
  meals: string[];               // ["breakfast", "lunch", "dinner"]
  accommodation?: string;
}

export interface ScrapedReview {
  author_name: string;
  author_country?: string;
  rating: number;
  title?: string;
  body?: string;
  published_at?: string;         // ISO date
}

export interface ScraperAdapter {
  name: string;
  matches: (url: string) => boolean;
  parseTour: (html: string, url: string) => ScrapedTour | null;
  parseReviews?: (html: string, url: string) => ScrapedReview[];
}
