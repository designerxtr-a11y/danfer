import type { Locale } from "@/types/database";

/** Texto de UI por idioma. Si falta `ja`, cae a `en`. */
export function L<T>(locale: Locale, v: { es: T; en: T; ja?: T }): T {
  if (locale === "ja") return v.ja ?? v.en;
  return v[locale];
}
