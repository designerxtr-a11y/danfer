"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Email inválido" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert(
      { email, source: "footer", is_active: true, locale: "es" },
      { onConflict: "email" }
    );

  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
