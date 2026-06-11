"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type SettingValue = string | number | boolean | object | null;

// Campos editables de una tarjeta del hero. Vacío → undefined (JSON lo
// omite al guardar) → el frontend cae al default del código.
function heroCardFields(formData: FormData, prefix: string) {
  const txt = (k: string) =>
    String(formData.get(`${prefix}_${k}`) || "").trim() || undefined;
  const num = (k: string) => {
    const raw = String(formData.get(`${prefix}_${k}`) || "").replace(",", ".");
    const n = Number(raw);
    return raw && Number.isFinite(n) && n > 0 ? n : undefined;
  };
  return {
    title: txt("title"),
    region: txt("region"),
    days: txt("days"),
    price: num("price"),
    rating: num("rating"),
    reviews: num("reviews"),
  };
}

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
    {
      key: "branding",
      value: {
        logo_url: String(formData.get("logo_url") || ""),
        favicon_url: String(formData.get("favicon_url") || ""),
      },
    },
    {
      key: "hero_images",
      value: {
        "machu-picchu": String(formData.get("hero_img_machu_picchu") || ""),
        "valle-sagrado": String(formData.get("hero_img_valle_sagrado") || ""),
        "rainbow-mountain": String(
          formData.get("hero_img_rainbow_mountain") || ""
        ),
      },
    },
    {
      key: "hero_cards",
      value: {
        "machu-picchu": heroCardFields(formData, "hero_card_machu_picchu"),
        "valle-sagrado": heroCardFields(formData, "hero_card_valle_sagrado"),
        "rainbow-mountain": heroCardFields(
          formData,
          "hero_card_rainbow_mountain"
        ),
      },
    },
    {
      key: "stats_images",
      value: {
        polaroid_1: String(formData.get("stats_img_polaroid_1") || ""),
        polaroid_2: String(formData.get("stats_img_polaroid_2") || ""),
        polaroid_3: String(formData.get("stats_img_polaroid_3") || ""),
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
