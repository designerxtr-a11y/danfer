import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/queries/blog";
import { t, type Locale } from "@/types/database";

export const alt = "Blog de Danfer Tours Cusco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const post = await getPostBySlug(slug);
  if (!post) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }

  const title = t(post.title, lc);
  const tag = post.tags[0];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        lc === "en" ? "en-US" : "es-PE",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Inter, system-ui",
          background: "#0B1929",
        }}
      >
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(11,25,41,0.88) 0%, rgba(11,25,41,0.45) 100%)",
          }}
        />

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
              {tag ?? "Blog"}
            </div>
          </div>

          <h1
            style={{
              fontSize: title.length > 60 ? 60 : 76,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1020,
            }}
          >
            {title}
          </h1>

          <div style={{ display: "flex", gap: 30, fontSize: 22 }}>
            {date && <span style={{ color: "#E8B043" }}>{date}</span>}
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              {post.read_minutes} {lc === "en" ? "min read" : "min de lectura"}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
