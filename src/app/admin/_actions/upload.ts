"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupa } from "@/lib/supabase/server";

export async function uploadImage(formData: FormData) {
  // Verify admin
  const userClient = await createServerSupa();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { ok: false as const, error: "Sin autenticación" };

  const { data: profile } = await userClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) return { ok: false as const, error: "Sin permiso" };

  const file = formData.get("file") as File | null;
  const bucket = String(formData.get("bucket") ?? "tour-images");
  const folder = String(formData.get("folder") ?? "general");

  if (!file) return { ok: false as const, error: "No file" };
  if (file.size > 8 * 1024 * 1024)
    return { ok: false as const, error: "Imagen muy grande" };

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
      cacheControl: "31536000",
    });

  if (error) return { ok: false as const, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true as const, url: data.publicUrl };
}
