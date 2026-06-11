import { getSettings } from "@/lib/queries/settings";

/**
 * Imagen de marca subida en Ajustes → Identidad visual, como data URI para
 * incrustarla en un ImageResponse (los iconos la re-encuadran en lienzo
 * cuadrado: el upload puede ser un logo rectangular). Devuelve null si no
 * hay imagen o falla la descarga — el caller cae al icono generado.
 */
export async function fetchBrandingImageDataUri(
  kind: "favicon" | "logo"
): Promise<string | null> {
  try {
    const settings = await getSettings();
    const url =
      kind === "favicon"
        ? settings.branding?.favicon_url || settings.branding?.logo_url
        : settings.branding?.logo_url || settings.branding?.favicon_url;
    if (!url) return null;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const type = res.headers.get("Content-Type") ?? "image/png";
    const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${base64}`;
  } catch {
    return null;
  }
}
