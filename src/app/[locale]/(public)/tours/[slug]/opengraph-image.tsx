import { ImageResponse } from "next/og";
import { getTourBySlug } from "@/lib/queries/tours";
import { t } from "@/types/database";

export const alt = "Tour en Cusco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const tour = await getTourBySlug(params.slug);
  if (!tour) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }

  const title = t(tour.title);
  const price =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Inter, system-ui",
        }}
      >
        {/* Background cover image */}
        <img
          src={tour.cover_image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(11,25,41,0.85) 0%, rgba(11,25,41,0.4) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 70,
            color: "#fff",
            width: "100%",
          }}
        >
          {/* Top: logo + badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#E8B043", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>DANFER</span>
              <span style={{ color: "#fff", fontWeight: 800, letterSpacing: 3, fontSize: 24 }}>TOURS</span>
            </div>
            {tour.category && (
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 18px",
                  borderRadius: 999,
                  fontSize: 18,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {t(tour.category.name)}
              </div>
            )}
          </div>

          {/* Middle: title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h1
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.02,
                margin: 0,
                maxWidth: 1000,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom: stats + price */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: 30, fontSize: 22 }}>
              <span style={{ color: "#E8B043" }}>
                ★ {tour.rating.toFixed(1)} ({tour.reviews_count})
              </span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                {t(tour.duration_label)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>
                DESDE
              </span>
              <span style={{ fontSize: 60, fontWeight: 800, color: "#E8B043" }}>
                US${price.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
