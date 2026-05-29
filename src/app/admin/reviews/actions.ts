"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupa } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin(): Promise<boolean> {
  const userClient = await createServerSupa();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return false;
  const { data: profile } = await userClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return !!profile?.is_admin;
}

type NewReview = {
  tour_id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
};

/**
 * Importa reseñas en lote desde texto pegado. Una reseña por línea, campos
 * separados por "|":
 *   tour_slug | rating(1-5) | nombre | país | YYYY-MM-DD | texto de la reseña
 * Líneas vacías o que empiezan con "#" se ignoran.
 */
export async function bulkImportReviews(raw: string): Promise<{
  ok: boolean;
  inserted?: number;
  errors?: string[];
  error?: string;
}> {
  if (!(await assertAdmin())) return { ok: false, error: "Sin permiso" };

  const supabase = createAdminClient();
  const { data: tours } = await supabase.from("tours").select("id,slug");
  const slugToId = new Map((tours ?? []).map((t) => [t.slug as string, t.id as string]));

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  const rows: NewReview[] = [];
  const errors: string[] = [];

  lines.forEach((line, idx) => {
    const n = idx + 1;
    const parts = line.split("|");
    if (parts.length < 5) {
      errors.push(`Línea ${n}: faltan campos (usa tour | rating | nombre | país | fecha | texto)`);
      return;
    }
    const slug = parts[0].trim();
    const ratingStr = parts[1].trim();
    const name = parts[2].trim();
    const country = parts[3].trim();
    const dateStr = parts[4].trim();
    const body = parts.slice(5).join("|").trim();

    const tourId = slugToId.get(slug);
    if (!tourId) {
      errors.push(`Línea ${n}: el tour "${slug}" no existe`);
      return;
    }
    const rating = parseInt(ratingStr, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push(`Línea ${n}: rating "${ratingStr}" inválido (debe ser 1-5)`);
      return;
    }
    if (!name) {
      errors.push(`Línea ${n}: falta el nombre`);
      return;
    }
    const created_at =
      dateStr && !isNaN(Date.parse(dateStr))
        ? new Date(dateStr).toISOString()
        : new Date().toISOString();

    rows.push({
      tour_id: tourId,
      author_name: name,
      author_country: country || null,
      rating,
      title: null,
      body: body || null,
      is_published: true,
      is_verified: true, // reseñas reales importadas por el admin
      created_at,
    });
  });

  if (rows.length === 0) {
    return { ok: false, error: "No se encontró ninguna reseña válida.", errors };
  }

  const { error } = await supabase.from("reviews").insert(rows);
  if (error) return { ok: false, error: error.message, errors };

  revalidatePath("/admin/reviews");
  return { ok: true, inserted: rows.length, errors };
}

/** Alta de una sola reseña desde el formulario. */
export async function addReview(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!(await assertAdmin())) return { ok: false, error: "Sin permiso" };

  const tour_id = String(formData.get("tour_id") ?? "");
  const author_name = String(formData.get("author_name") ?? "").trim();
  const author_country = String(formData.get("author_country") ?? "").trim();
  const rating = parseInt(String(formData.get("rating") ?? "5"), 10);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "").trim();

  if (!tour_id) return { ok: false, error: "Selecciona un tour" };
  if (!author_name) return { ok: false, error: "Falta el nombre" };
  if (isNaN(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Rating inválido" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").insert({
    tour_id,
    author_name,
    author_country: author_country || null,
    rating,
    title: title || null,
    body: body || null,
    is_published: true,
    is_verified: true,
    created_at:
      dateStr && !isNaN(Date.parse(dateStr))
        ? new Date(dateStr).toISOString()
        : new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function setReviewPublished(
  id: string,
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  if (!(await assertAdmin())) return { ok: false, error: "Sin permiso" };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_published: value })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function deleteReview(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await assertAdmin())) return { ok: false, error: "Sin permiso" };
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/reviews");
  return { ok: true };
}
