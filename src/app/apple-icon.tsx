import { ImageResponse } from "next/og";
import { fetchBrandingImageDataUri } from "@/lib/branding-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  // Icono subido desde /admin/settings; si no hay, la "D" generada.
  // iOS no soporta transparencia en iconos → siempre fondo blanco sólido.
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
            padding: 14,
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
          fontSize: 110,
          fontWeight: 900,
          letterSpacing: -3,
          fontFamily: "serif",
        }}
      >
        D
      </div>
    ),
    size
  );
}
