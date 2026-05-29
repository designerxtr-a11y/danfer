import { createAdminClient } from "@/lib/supabase/admin";
import { ReviewsClient } from "./reviews-client";

export default async function AdminReviewsPage() {
  const supabase = createAdminClient();
  const [{ data: tours }, { data: reviews }] = await Promise.all([
    supabase.from("tours").select("id,slug,title").order("created_at"),
    supabase
      .from("reviews")
      .select(
        "id,author_name,author_country,rating,title,body,is_published,created_at,tour:tours(slug,title)"
      )
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const tourList = (tours ?? []).map((t) => ({
    id: t.id as string,
    slug: t.slug as string,
    title: (t.title as { es: string; en?: string }).es,
  }));

  const reviewList = (reviews ?? []).map((r) => ({
    id: r.id as string,
    author_name: r.author_name as string,
    author_country: (r.author_country as string | null) ?? null,
    rating: r.rating as number,
    title: (r.title as string | null) ?? null,
    body: (r.body as string | null) ?? null,
    is_published: r.is_published as boolean,
    created_at: r.created_at as string,
    tourSlug:
      (r.tour as { slug?: string; title?: { es: string } } | null)?.slug ?? "",
    tourTitle:
      (r.tour as { slug?: string; title?: { es: string } } | null)?.title?.es ??
      "—",
  }));

  return (
    <div>
      <h1 className="font-display text-4xl text-night">Reseñas</h1>
      <p className="mt-1 mb-8 text-night/60 max-w-2xl">
        Importa tus reseñas <strong>reales</strong> (Google, TripAdvisor,
        WhatsApp). Al publicarlas, las estrellas aparecen en las páginas de tour
        y se vuelven elegibles para el rich snippet de Google.
      </p>
      <ReviewsClient tours={tourList} reviews={reviewList} />
    </div>
  );
}
