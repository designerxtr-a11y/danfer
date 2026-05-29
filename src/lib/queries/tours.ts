import { createClient } from "@/lib/supabase/server";
import type { Tour, TourWithCategory, Review } from "@/types/database";

export async function getFeaturedTours(limit = 6): Promise<TourWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*, category:categories(slug, name)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("bookings_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedTours]", error);
    return [];
  }
  return (data ?? []) as unknown as TourWithCategory[];
}

export async function getAllTours(): Promise<TourWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*, category:categories(slug, name)")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("bookings_count", { ascending: false });

  if (error) {
    console.error("[getAllTours]", error);
    return [];
  }
  return (data ?? []) as unknown as TourWithCategory[];
}

export async function getTourBySlug(
  slug: string
): Promise<TourWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*, category:categories(slug, name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[getTourBySlug]", error);
    return null;
  }
  return data as unknown as TourWithCategory | null;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  title: { es: string; en?: string };
  description: { es: string; en?: string } | null;
  meals: string[];
  accommodation: { es: string; en?: string } | null;
  image: string | null;
}

export async function getTourItinerary(tourId: string): Promise<ItineraryDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tour_itinerary")
    .select("*")
    .eq("tour_id", tourId)
    .order("day_number", { ascending: true });

  if (error) {
    console.error("[getTourItinerary]", error);
    return [];
  }
  return (data ?? []) as unknown as ItineraryDay[];
}

export interface AvailableDate {
  date: string;
  total_spots: number;
  booked_spots: number;
  price_override: number | null;
}

export async function getTourAvailability(
  tourId: string,
  limit = 90
): Promise<AvailableDate[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tour_availability")
    .select("date,total_spots,booked_spots,price_override")
    .eq("tour_id", tourId)
    .eq("status", "open")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[getTourAvailability]", error);
    return [];
  }
  return data ?? [];
}

export async function getRelatedTours(
  tourId: string,
  categoryId: string | null,
  limit = 3
): Promise<TourWithCategory[]> {
  const supabase = await createClient();
  const q = supabase
    .from("tours")
    .select("*, category:categories(slug, name)")
    .eq("is_published", true)
    .neq("id", tourId)
    .limit(limit);

  if (categoryId) q.eq("category_id", categoryId);

  const { data, error } = await q;
  if (error) {
    console.error("[getRelatedTours]", error);
    return [];
  }
  return (data ?? []) as unknown as TourWithCategory[];
}

export async function getTourReviews(tourId: string, limit = 6): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("tour_id", tourId)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getTourReviews]", error);
    return [];
  }
  return data ?? [];
}

/**
 * Estadística REAL de reseñas (conteo + promedio) calculada desde la tabla
 * `reviews`, NO desde las columnas tour.rating / tour.reviews_count (seed).
 * Es la fuente de verdad para el aggregateRating del schema y para los números
 * visibles, de modo que SIEMPRE coincidan y nunca declaren reseñas inexistentes.
 * Si no hay reseñas publicadas reales devuelve count 0 → no se muestran estrellas.
 */
export async function getTourReviewStats(
  tourId: string
): Promise<{ count: number; avg: number }> {
  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("reviews")
    .select("rating", { count: "exact" })
    .eq("tour_id", tourId)
    .eq("is_published", true);

  if (error || !data) {
    console.error("[getTourReviewStats]", error);
    return { count: 0, avg: 0 };
  }
  const c = count ?? data.length;
  const avg =
    c > 0 ? data.reduce((s, r) => s + (r.rating ?? 0), 0) / c : 0;
  return { count: c, avg: Math.round(avg * 10) / 10 };
}
