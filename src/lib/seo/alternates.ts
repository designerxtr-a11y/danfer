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
  opts: { enAvailable?: boolean } = {}
): Metadata["alternates"] {
  const { enAvailable = true } = opts;
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  const esUrl = clean || "/";
  const enUrl = `/en${clean}`; // clean "" -> "/en"
  if (!enAvailable) {
    return {
      canonical: esUrl,
      languages: { es: esUrl, "x-default": esUrl },
    };
  }
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
