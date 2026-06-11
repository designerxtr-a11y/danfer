import { ImageResponse } from "next/og";
import { fetchBrandingImage } from "@/lib/branding-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  // Favicon subido desde /admin/settings (Identidad visual); si no hay,
  // se genera la "D" dorada de siempre.
  const uploaded = await fetchBrandingImage("favicon");
  if (uploaded) return uploaded;

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
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: -1,
          borderRadius: 6,
          fontFamily: "serif",
        }}
      >
        D
      </div>
    ),
    size
  );
}
