import type { Metadata } from "next";

/**
 * Construye canonical + hreflang (es / en / x-default) coherentes con el
 * esquema del sitemap (ES en la raíz, EN bajo /en). El canonical es
 * self-referencing por idioma para que /en no se autocanonicalice a ES.
 *
 * Rutas relativas: metadataBase (definido en app/layout.tsx) las absolutiza.
 *
 * @param path  ruta ES sin prefijo de idioma, p.ej. "/tours/machu-picchu" o "/"
 * @param locale "es" | "en" (del segmento [locale])
 */
export function buildAlternates(
  path: string,
  locale: string
): Metadata["alternates"] {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  const esUrl = clean || "/";
  const enUrl = `/en${clean}`; // clean "" -> "/en"
  return {
    canonical: locale === "en" ? enUrl : esUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      "x-default": esUrl,
    },
  };
}

/** og:locale correcto a partir del locale del segmento. */
export function ogLocale(locale: string): string {
  return locale === "en" ? "en_US" : "es_PE";
}
