// Tipos manuales del schema (luego generamos con supabase gen types)

export type Locale = "es" | "en";
export type Localized = { es: string; en?: string };

export type Difficulty = "easy" | "moderate" | "challenging" | "expert";

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description: Localized | null;
  cover_image: string | null;
  icon: string | null;
  sort_order: number;
}

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface FAQ {
  q: Localized;
  a: Localized;
}

export interface Coordinates {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface Tour {
  id: string;
  slug: string;
  category_id: string | null;
  title: Localized;
  subtitle: Localized | null;
  short_desc: Localized | null;
  description: Localized | null;
  cover_image: string;
  gallery: GalleryImage[];
  video_url: string | null;
  duration_days: number;
  duration_label: Localized;
  difficulty: Difficulty;
  max_group_size: number;
  min_age: number;
  altitude_max: number | null;
  price_usd: number;
  price_pen: number | null;
  discount_pct: number;
  highlights: LocalizedList;
  includes: LocalizedList;
  excludes: LocalizedList;
  what_to_bring: LocalizedList;
  faqs: FAQ[];
  meta_title?: Localized | null;
  meta_description?: Localized | null;
  coordinates: Coordinates | null;
  rating: number;
  reviews_count: number;
  bookings_count: number;
  is_featured: boolean;
  is_published: boolean;
}

export interface TourWithCategory extends Tour {
  category: Pick<Category, "slug" | "name"> | null;
}

export interface Review {
  id: string;
  tour_id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

// Helper para obtener texto localizado con fallback
export function t(field: Localized | null | undefined, locale: Locale = "es"): string {
  if (!field) return "";
  return field[locale] ?? field.es ?? "";
}

/** Tour list field: legacy Spanish-only array, or one list per language. */
export type LocalizedList = string[] | { es: string[]; en?: string[] };

export function tList(list: LocalizedList | null | undefined, locale: Locale = "es"): string[] {
  if (!list) return [];
  if (Array.isArray(list)) return list;
  return (list[locale]?.length ? list[locale] : list.es) ?? [];
}
