import { ImageResponse } from "next/og";
import { fetchBrandingImageDataUri } from "@/lib/branding-image";

// 96px = múltiplo de 48 (requisito de Google para favicons en resultados).
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default async function Icon() {
  // Favicon subido desde /admin/settings (Identidad visual); si no hay,
  // se genera la "D" dorada de siempre. El upload se encuadra en lienzo
  // cuadrado blanco: un logo rectangular aplastado a 16px es ilegible y
  // uno transparente oscuro desaparece en pestañas con tema oscuro.
  const uploaded = await fetchBrandingImageDataUri("favicon");
  if (uploaded) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            borderRadius: 12,
            padding: 6,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploaded}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1929 0%, #060F1C 100%)",
          color: "#E8B043",
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: -2,
          borderRadius: 18,
          fontFamily: "serif",
        }}
      >
        D
      </div>
    ),
    size
  );
}
