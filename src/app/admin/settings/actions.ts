"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type SettingValue = string | number | boolean | object | null;

export async function updateSetting(
  key: string,
  value: SettingValue
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) return { error: error.message };

  // Revalida toda la app — settings impactan layout/footer/whatsapp/etc
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateSettingsForm(
  formData: FormData
): Promise<{ ok: true } | { error: string }> {
  const updates: { key: string; value: SettingValue }[] = [
    { key: "site_name", value: String(formData.get("site_name") || "") },
    {
      key: "contact_email",
      value: String(formData.get("contact_email") || ""),
    },
    {
      key: "contact_phone",
      value: String(formData.get("contact_phone") || ""),
    },
    { key: "whatsapp", value: String(formData.get("whatsapp") || "") },
    {
      key: "address",
      value: {
        es: String(formData.get("address_es") || ""),
        en: String(formData.get("address_en") || ""),
      },
    },
    {
      key: "site_tagline",
      value: {
        es: String(formData.get("tagline_es") || ""),
        en: String(formData.get("tagline_en") || ""),
      },
    },
    {
      key: "social",
      value: {
        instagram: String(formData.get("social_instagram") || ""),
        facebook: String(formData.get("social_facebook") || ""),
        tiktok: String(formData.get("social_tiktok") || ""),
      },
    },
  ];

  const supabase = createAdminClient();
  for (const u of updates) {
    const { error } = await supabase
      .from("settings")
      .upsert({ key: u.key, value: u.value }, { onConflict: "key" });
    if (error) return { error: `${u.key}: ${error.message}` };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true };
}
