import type { Locale } from "@/types/database";

/** Texto de UI por idioma. Si falta `ja`, cae a `en`. */
export function L<T>(locale: Locale, v: { es: T; en: T; ja?: T }): T {
  if (locale === "ja") return v.ja ?? v.en;
  return v[locale];
}

/** Normaliza el segmento [locale] a un Locale soportado (desconocido → es). */
export function toLocale(locale: string | undefined | null): Locale {
  return locale === "en" || locale === "ja" ? locale : "es";
}
