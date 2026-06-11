import { getSettings } from "@/lib/queries/settings";

/**
 * Si el admin subió un favicon/logo en Ajustes → Identidad visual, lo sirve
 * proxied (mismo origen, cacheado). Devuelve null si no hay imagen subida
 * o si falla la descarga — el caller cae al icono generado por código.
 */
export async function fetchBrandingImage(
  kind: "favicon" | "logo"
): Promise<Response | null> {
  try {
    const settings = await getSettings();
    const url =
      kind === "favicon"
        ? settings.branding?.favicon_url || settings.branding?.logo_url
        : settings.branding?.logo_url || settings.branding?.favicon_url;
    if (!url) return null;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    return new Response(await res.arrayBuffer(), {
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "image/png",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return null;
  }
}
