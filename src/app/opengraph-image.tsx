import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Danfer Tours Cusco · Tours premium en Machu Picchu y Valle Sagrado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 70,
          background:
            "linear-gradient(135deg, #0B1929 0%, #060F1C 100%)",
          fontFamily: "Inter, system-ui",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(200,144,30,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,119,182,0.2), transparent 50%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#C8901E",
            }}
          >
            DANFER
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#FFFFFF",
            }}
          >
            TOURS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 30,
              color: "#C8901E",
              fontStyle: "italic",
            }}
          >
            Descubre el Perú
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            Viaja al corazón del Imperio Inca
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              marginTop: 20,
              maxWidth: 850,
            }}
          >
            Tours premium en Cusco · Machu Picchu · Valle Sagrado · Camino Inca
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>danfertourscusco.com</span>
          <span>★ 4.9 · 8,500+ viajeros</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
