"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function togglePublished(id: string, current: boolean) {
  const supabase = createAdminClient();
  await supabase
    .from("tours")
    .update({ is_published: !current })
    .eq("id", id);
  revalidatePath("/admin/tours");
  revalidatePath("/");
  revalidatePath("/tours");
}

export async function toggleFeatured(id: string, current: boolean) {
  const supabase = createAdminClient();
  await supabase
    .from("tours")
    .update({ is_featured: !current })
    .eq("id", id);
  revalidatePath("/admin/tours");
  revalidatePath("/");
}

export async function deleteTour(id: string) {
  const supabase = createAdminClient();
  await supabase.from("tours").delete().eq("id", id);
  revalidatePath("/admin/tours");
  revalidatePath("/");
  revalidatePath("/tours");
}

interface TourInput {
  id?: string;
  slug: string;
  category_id: string | null;
  title_es: string;
  title_en: string;
  short_desc_es: string;
  short_desc_en: string;
  description_es: string;
  description_en: string;
  cover_image: string;
  gallery: string[];
  duration_days: number;
  duration_label_es: string;
  duration_label_en: string;
  difficulty: string;
  max_group_size: number;
  altitude_max: number | null;
  price_usd: number;
  price_pen: number | null;
  discount_pct: number;
  highlights: string[];
  includes: string[];
  excludes: string[];
  what_to_bring: string[];
  faqs: { q: { es: string; en?: string }; a: { es: string; en?: string } }[];
  coordinates: { lat: number; lng: number; zoom?: number } | null;
  is_published: boolean;
  is_featured: boolean;
}

export async function saveTour(input: TourInput) {
  const supabase = createAdminClient();

  const payload = {
    slug: input.slug,
    category_id: input.category_id,
    title: { es: input.title_es, en: input.title_en },
    short_desc: { es: input.short_desc_es, en: input.short_desc_en },
    description: { es: input.description_es, en: input.description_en },
    cover_image: input.cover_image,
    gallery: input.gallery.map((url) => ({ url, alt: input.title_es })),
    duration_days: input.duration_days,
    duration_label: { es: input.duration_label_es, en: input.duration_label_en },
    difficulty: input.difficulty,
    max_group_size: input.max_group_size,
    altitude_max: input.altitude_max,
    price_usd: input.price_usd,
    price_pen: input.price_pen,
    discount_pct: input.discount_pct,
    highlights: input.highlights,
    includes: input.includes,
    excludes: input.excludes,
    what_to_bring: input.what_to_bring,
    faqs: input.faqs,
    coordinates: input.coordinates,
    is_published: input.is_published,
    is_featured: input.is_featured,
  };

  if (input.id) {
    const { error } = await supabase
      .from("tours")
      .update(payload)
      .eq("id", input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("tours").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/tours");
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath(`/tours/${input.slug}`);
  redirect("/admin/tours");
}
