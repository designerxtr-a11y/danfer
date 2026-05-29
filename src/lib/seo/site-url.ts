// Resolución robusta de la URL canónica del sitio.
const PROD_FALLBACK = "https://danfertourscusco.com";

/**
 * Devuelve la URL base canónica del sitio.
 *
 * Ignora valores de localhost / IP local / vacíos para que PRODUCCIÓN nunca
 * emita `http://localhost:3000` en sitemap, robots, canonical, hreflang ni
 * JSON-LD. (Bug real: `NEXT_PUBLIC_SITE_URL` estaba en localhost y, al ser una
 * var NEXT_PUBLIC, se incrustaba en el build de Vercel → Google recibía URLs
 * a localhost = sitemap inservible e indexación rota.)
 *
 * Solo respeta NEXT_PUBLIC_SITE_URL si es una URL http(s) real y no-local;
 * en cualquier otro caso usa el dominio de producción.
 */
export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (
    env &&
    /^https?:\/\//i.test(env) &&
    !/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/i.test(env)
  ) {
    return env;
  }
  return PROD_FALLBACK;
}
