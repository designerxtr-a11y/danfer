import { createAdminClient } from "@/lib/supabase/admin";

export interface SiteSettings {
  site_name: string;
  site_tagline: { es: string; en?: string };
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  address: { es: string; en?: string };
  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  branding: {
    /** Logo principal (navbar, schema). PNG/SVG con fondo transparente. */
    logo_url?: string;
    /** Favicon (pestañas, Google). PNG cuadrado ≥512px. */
    favicon_url?: string;
  };
}

const DEFAULTS: SiteSettings = {
  site_name: "Danfer Tours Cusco",
  site_tagline: { es: "Descubre el corazón del Imperio Inca" },
  contact_email: "hola@danfertourscusco.com",
  contact_phone: "+51 984 123 456",
  whatsapp: "+51984123456",
  address: { es: "Av. El Sol 314, Cusco, Perú" },
  social: {
    instagram: "@danfertourscusco",
    facebook: "danfertourscusco",
    tiktok: "@danfertourscusco",
  },
  branding: {},
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("settings").select("key,value");
    const map = new Map((data ?? []).map((r) => [r.key, r.value]));
    return {
      site_name: (map.get("site_name") as string) ?? DEFAULTS.site_name,
      site_tagline:
        (map.get("site_tagline") as SiteSettings["site_tagline"]) ??
        DEFAULTS.site_tagline,
      contact_email:
        (map.get("contact_email") as string) ?? DEFAULTS.contact_email,
      contact_phone:
        (map.get("contact_phone") as string) ?? DEFAULTS.contact_phone,
      whatsapp: (map.get("whatsapp") as string) ?? DEFAULTS.whatsapp,
      address:
        (map.get("address") as SiteSettings["address"]) ?? DEFAULTS.address,
      social:
        (map.get("social") as SiteSettings["social"]) ?? DEFAULTS.social,
      branding:
        (map.get("branding") as SiteSettings["branding"]) ?? DEFAULTS.branding,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Devuelve el número de WhatsApp en formato wa.me (sin + ni espacios). */
export function normalizeWhatsApp(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

// Dígitos del teléfono placeholder por defecto (+51 984 123 456). Si el campo
// "Teléfono visible" sigue con este valor, NO lo usamos (es falso → daña NAP).
const PLACEHOLDER_PHONE_DIGITS = "51984123456";

/**
 * Teléfono público "real" como fuente única de verdad para NAP/SEO local.
 * Usa `contact_phone` si está configurado y no es el placeholder; si no,
 * cae al número de WhatsApp (que el usuario sí suele configurar). Devuelve
 * cadena vacía si ninguno es real (así el JSON-LD lo omite en vez de mentir).
 */
export function publicPhone(s: SiteSettings): string {
  const cp = (s.contact_phone || "").trim();
  if (cp && normalizeWhatsApp(cp) !== PLACEHOLDER_PHONE_DIGITS) return cp;
  const wa = (s.whatsapp || "").trim();
  if (wa && normalizeWhatsApp(wa) !== PLACEHOLDER_PHONE_DIGITS) return wa;
  return "";
}
