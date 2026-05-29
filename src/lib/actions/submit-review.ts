"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Envío de reseña de PRIMERA MANO desde la página pública del tour.
 *
 * Se inserta con `is_published: false` → queda PENDIENTE de moderación: no se
 * muestra en la web ni cuenta para el aggregateRating/estrellas hasta que el
 * admin la apruebe en /admin/reviews. Esto mantiene el schema 100% legítimo
 * (solo reseñas reales y visibles alimentan las estrellas de Google).
 */
export async function submitTourReview(input: {
  tour_id: string;
  author_name: string;
  author_country?: string;
  rating: number;
  title?: string;
  body: string;
  website?: string; // honeypot: los humanos lo dejan vacío
}): Promise<{ ok: boolean; error?: string }> {
  // Honeypot: si un bot rellena el campo oculto, fingimos éxito y descartamos.
  if (input.website && input.website.trim().length > 0) {
    return { ok: true };
  }

  const author_name = (input.author_name ?? "").trim().slice(0, 80);
  const author_country = (input.author_country ?? "").trim().slice(0, 60);
  const title = (input.title ?? "").trim().slice(0, 120);
  const body = (input.body ?? "").trim().slice(0, 1500);
  const rating = Math.round(Number(input.rating));

  if (!input.tour_id) return { ok: false, error: "Tour no válido." };
  if (author_name.length < 2) return { ok: false, error: "Escribe tu nombre." };
  if (!Number.isFinite(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Elige una calificación de 1 a 5 estrellas." };
  if (body.length < 10)
    return {
      ok: false,
      error: "Cuéntanos un poco más sobre tu experiencia (mínimo 10 caracteres).",
    };

  const supabase = createAdminClient();

  // Verifica que el tour exista y esté publicado antes de aceptar la reseña.
  const { data: tour } = await supabase
    .from("tours")
    .select("id")
    .eq("id", input.tour_id)
    .eq("is_published", true)
    .maybeSingle();
  if (!tour) return { ok: false, error: "Tour no encontrado." };

  const { error } = await supabase.from("reviews").insert({
    tour_id: input.tour_id,
    author_name,
    author_country: author_country || null,
    rating,
    title: title || null,
    body,
    is_published: false, // pendiente de moderación
    is_verified: false,
  });

  if (error) {
    console.error("[submitTourReview]", error);
    return { ok: false, error: "No se pudo enviar la reseña. Inténtalo de nuevo." };
  }

  return { ok: true };
}
