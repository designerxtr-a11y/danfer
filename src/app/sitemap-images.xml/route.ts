import { createAdminClient } from "@/lib/supabase/admin";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface GalleryImage {
  url: string;
  alt: string;
}

interface TourRow {
  slug: string;
  title: { es: string; en?: string };
  cover_image: string;
  gallery: GalleryImage[] | null;
  short_desc: { es: string; en?: string } | null;
}

interface PostRow {
  slug: string;
  title: { es: string; en?: string };
  cover_image: string | null;
  excerpt: { es: string; en?: string } | null;
}

export async function GET() {
  const supabase = createAdminClient();
  const [{ data: tours }, { data: posts }] = await Promise.all([
    supabase
      .from("tours")
      .select("slug,title,cover_image,gallery,short_desc")
      .eq("is_published", true),
    supabase
      .from("blog_posts")
      .select("slug,title,cover_image,excerpt")
      .eq("is_published", true),
  ]);

  const urls: string[] = [];

  // Tour pages: cover + gallery
  for (const t of (tours ?? []) as TourRow[]) {
    const images: { loc: string; title: string; caption?: string }[] = [];
    if (t.cover_image) {
      images.push({
        loc: t.cover_image,
        title: t.title.es,
        caption: t.short_desc?.es,
      });
    }
    for (const g of t.gallery ?? []) {
      if (g.url) images.push({ loc: g.url, title: g.alt || t.title.es });
    }
    if (images.length === 0) continue;
    urls.push(
      `<url><loc>${SITE}/tours/${t.slug}</loc>${images
        .map(
          (img) =>
            `<image:image><image:loc>${xmlEscape(img.loc)}</image:loc>` +
            `<image:title>${xmlEscape(img.title)}</image:title>` +
            (img.caption
              ? `<image:caption>${xmlEscape(img.caption)}</image:caption>`
              : "") +
            `</image:image>`
        )
        .join("")}</url>`
    );
  }

  // Blog posts: cover
  for (const p of (posts ?? []) as PostRow[]) {
    if (!p.cover_image) continue;
    urls.push(
      `<url><loc>${SITE}/blog/${p.slug}</loc>` +
        `<image:image><image:loc>${xmlEscape(p.cover_image)}</image:loc>` +
        `<image:title>${xmlEscape(p.title.es)}</image:title>` +
        (p.excerpt?.es
          ? `<image:caption>${xmlEscape(p.excerpt.es)}</image:caption>`
          : "") +
        `</image:image></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
