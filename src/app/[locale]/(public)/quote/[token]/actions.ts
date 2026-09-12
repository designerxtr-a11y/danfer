"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export async function uploadPassportPhoto(token: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) return { ok: false as const, error: "No file selected" };
  if (file.size > MAX_SIZE) return { ok: false as const, error: "File is too large (max 8MB)" };
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return { ok: false as const, error: "Please upload a photo or PDF of your passport" };
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${token}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  // Private bucket — uploaded via the service role since the visitor is not
  // authenticated. Never exposed through a public URL.
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("client-documents")
    .upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
