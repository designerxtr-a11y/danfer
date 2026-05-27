"use server";

import { pickAdapter, fetchHtml, type ScrapedTour, type ScrapedReview } from "@/lib/scrapers";
import { createAdminClient } from "@/lib/supabase/admin";
import { importImages } from "@/lib/scrapers/image-importer";
import { revalidatePath } from "next/cache";

// =====================================================
// 1) Scrape: fetch URL or parse pasted HTML
// =====================================================

interface ScrapeInput {
  url: string;
  html?: string;            // optional, if user pasted HTML
  mode: "tour" | "reviews";
}

interface ScrapeResult {
  ok: boolean;
  error?: string;
  adapter?: string;
  tour?: ScrapedTour;
  reviews?: ScrapedReview[];
}

export async function scrape({ url, html, mode }: ScrapeInput): Promise<ScrapeResult> {
  try {
    const adapter = pickAdapter(url);
    const sourceHtml = html && html.length > 1000 ? html : await fetchHtml(url);

    if (mode === "reviews") {
      if (!adapter.parseReviews) {
        return { ok: false, error: `${adapter.name} no soporta reseñas. Usa TripAdvisor.` };
      }
      const reviews = adapter.parseReviews(sourceHtml, url);
      return { ok: true, adapter: adapter.name, reviews };
    }

    const tour = adapter.parseTour(sourceHtml, url);
    if (!tour) return { ok: false, error: "No se pudo extraer el tour." };

    return { ok: true, adapter: adapter.name, tour };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// =====================================================
// 2) Save scraped tour to DB (after user edits in UI)
// =====================================================

export async function saveScrapedTour(
  input: ScrapedTour & { category_id?: string | null; downloadImages?: boolean }
) {
  const supabase = createAdminClient();

  // 1. Optionally download external images to our Supabase Storage
  let coverImage = input.cover_image;
  let gallery = input.gallery;

  if (input.downloadImages && input.cover_image) {
    const imported = await importImages(
      [input.cover_image, ...input.gallery],
      input.slug
    );
    if (imported.length > 0) {
      coverImage = imported[0];
      gallery = imported.slice(1);
    }
  }

  // 2. Create the tour
  const { data: created, error } = await supabase
    .from("tours")
    .insert({
      slug: input.slug,
      category_id: input.category_id ?? null,
      title: { es: input.title },
      short_desc: input.short_desc ? { es: input.short_desc } : null,
      description: input.description ? { es: input.description } : null,
      cover_image: coverImage,
      gallery: gallery.map((url) => ({ url, alt: input.title })),
      duration_days: input.duration_days ?? 1,
      duration_label: input.duration_label
        ? { es: input.duration_label }
        : { es: "1 día" },
      difficulty: input.difficulty ?? "moderate",
      max_group_size: input.max_group_size ?? 12,
      altitude_max: input.altitude_max ?? null,
      price_usd: input.price_usd ?? 0,
      price_pen: input.price_pen ?? null,
      highlights: input.highlights,
      includes: input.includes,
      excludes: input.excludes,
      what_to_bring: input.what_to_bring,
      is_published: false,
      is_featured: false,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  // 3. Insert itinerary
  if (input.itinerary.length > 0 && created) {
    await supabase.from("tour_itinerary").insert(
      input.itinerary.map((d) => ({
        tour_id: created.id,
        day_number: d.day_number,
        title: { es: d.title },
        description: d.description ? { es: d.description } : null,
        meals: d.meals,
        accommodation: d.accommodation ? { es: d.accommodation } : null,
      }))
    );
  }

  revalidatePath("/admin/tours");
  return { ok: true, id: created?.id };
}

// =====================================================
// 3) Save scraped reviews
// =====================================================

export async function saveScrapedReviews(
  tourId: string,
  reviews: ScrapedReview[]
) {
  const supabase = createAdminClient();

  if (reviews.length === 0) return { ok: true, count: 0 };

  const { error } = await supabase.from("reviews").insert(
    reviews.map((r) => ({
      tour_id: tourId,
      author_name: r.author_name,
      author_country: r.author_country,
      rating: Math.max(1, Math.min(5, Math.round(r.rating))),
      title: r.title,
      body: r.body,
      is_verified: true,
      is_published: true,
      created_at: r.published_at ?? new Date().toISOString(),
    }))
  );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/tours");
  return { ok: true, count: reviews.length };
}
