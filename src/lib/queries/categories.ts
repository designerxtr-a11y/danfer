import { createClient } from "@/lib/supabase/server";
import type { Category, TourWithCategory } from "@/types/database";

export interface CategoryWithTours extends Category {
  tours: TourWithCategory[];
}

export async function getCategoriesWithTours(): Promise<CategoryWithTours[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, tours:tours(*, category:categories(slug, name))")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getCategoriesWithTours]", error);
    return [];
  }
  // Filter only published tours per category
  return ((data ?? []) as unknown as CategoryWithTours[]).map((cat) => ({
    ...cat,
    tours: cat.tours
      .filter((tour) => tour.is_published)
      .sort(
        (a, b) =>
          Number(b.is_featured) - Number(a.is_featured) ||
          b.bookings_count - a.bookings_count
      )
      .slice(0, 4),
  }));
}
