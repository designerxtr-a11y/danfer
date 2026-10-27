import sharp from "sharp";
import type { ImageResponse } from "next/og";

// ImageResponse solo produce PNG, y con una foto de fondo pesa ~2 MB: WhatsApp
// suele no mostrar la vista previa con imágenes tan grandes. En JPEG queda en ~150 KB.
export async function ogJpeg(image: ImageResponse): Promise<Response> {
  const jpeg = await sharp(Buffer.from(await image.arrayBuffer()))
    .jpeg({ quality: 82 })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, immutable, no-transform, max-age=31536000",
    },
  });
}

// ImageResponse (satori) no soporta WebP, y todas las portadas en Supabase son
// .webp → la OG fallaba con "Unsupported image type: image/webp". Se descarga la
// portada y se convierte a JPEG ya recortada al tamaño de la OG.
// Devuelve null si algo falla: mejor una OG sin foto que una OG rota.
export async function coverDataUrl(
  url: string | null | undefined,
  width = 1200,
  height = 630
): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(width, height, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch (e) {
    console.error("[coverDataUrl]", url, e);
    return null;
  }
}
