import { createClient } from "@/lib/supabase/server";

export interface GlobalReview {
  id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  tour: {
    slug: string;
    title: { es: string; en?: string };
    cover_image: string;
  } | null;
}

export async function getTopReviews(limit = 8): Promise<GlobalReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id,author_name,author_country,rating,title,body,created_at,tour:tours(slug,title,cover_image)")
    .eq("is_published", true)
    .eq("rating", 5)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getTopReviews]", error);
    return [];
  }
  return (data ?? []) as unknown as GlobalReview[];
}
