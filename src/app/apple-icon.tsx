import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
