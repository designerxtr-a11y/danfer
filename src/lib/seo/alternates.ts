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
 * @param opts.enAvailable false cuando el contenido NO tiene traducción EN
 *   (p.ej. post de blog solo-ES): /en sirve el texto español por fallback,
 *   así que es un duplicado → canonical a la URL ES y sin hreflang en.
 *   Evita "Duplicate without user-selected canonical" en Search Console.
 */
export function buildAlternates(
  path: string,
  locale: string,
  opts: { enAvailable?: boolean; jaAvailable?: boolean } = {}
): Metadata["alternates"] {
  const { enAvailable = true, jaAvailable = false } = opts;
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  const esUrl = clean || "/";
  const enUrl = `/en${clean}`; // clean "" -> "/en"
  const jaUrl = `/ja${clean}`;
  // /ja sin traducción propia muestra el texto EN (o ES) por fallback: es un
  // duplicado, así que canonicaliza a esa versión y no se anuncia como ja.
  const fallbackUrl = enAvailable ? enUrl : esUrl;
  const canonical =
    locale === "ja"
      ? jaAvailable
        ? jaUrl
        : fallbackUrl
      : locale === "en" && enAvailable
        ? enUrl
        : esUrl;
  return {
    canonical,
    languages: {
      es: esUrl,
      ...(enAvailable && { en: enUrl }),
      ...(jaAvailable && { ja: jaUrl }),
      "x-default": esUrl,
    },
  };
}

/** og:locale correcto a partir del locale del segmento. */
export function ogLocale(locale: string): string {
  return locale === "en" ? "en_US" : locale === "ja" ? "ja_JP" : "es_PE";
}
