import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { listDestinations } from "@/lib/destinations-content";
import { siteUrl } from "@/lib/seo/site-url";

const SITE = siteUrl();

type Entry = MetadataRoute.Sitemap[number];

// Fecha estable para páginas sin updated_at propio (evita que cambie en cada build,
// lo que volvía poco fiable la señal de frescura para Google).
const STATIC_LASTMOD = new Date("2026-05-27");

function withLangs(
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"] = "weekly",
  lastModified: Date = STATIC_LASTMOD
): Entry {
  return {
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        es: `${SITE}${path}`,
        en: `${SITE}/en${path}`,
        "x-default": `${SITE}${path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [{ data: tours }, { data: categories }, { data: posts }] = await Promise.all([
    supabase
      .from("tours")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false }),
    supabase
      .from("categories")
      .select("slug")
      .eq("is_published", true),
    supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    withLangs("/", 1.0, "daily"),
    withLangs("/tours", 0.9, "daily"),
    withLangs("/destinos", 0.9, "weekly"),
    withLangs("/blog", 0.8, "weekly"),
    withLangs("/sobre-nosotros", 0.5, "monthly"),
    withLangs("/contacto", 0.4, "yearly"),
    withLangs("/terminos", 0.3, "yearly"),
    withLangs("/privacidad", 0.3, "yearly"),
    withLangs("/cancelacion", 0.3, "yearly"),
  ];

  const destinationPages: MetadataRoute.Sitemap = listDestinations().map((d) =>
    withLangs(`/destinos/${d.slug}`, 0.85, "weekly")
  );

  const tourPages: MetadataRoute.Sitemap = (tours ?? []).map((tour) =>
    withLangs(`/tours/${tour.slug}`, 0.8, "weekly", new Date(tour.updated_at))
  );

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat) =>
    withLangs(`/tours?category=${cat.slug}`, 0.7, "weekly")
  );

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p) =>
    withLangs(
      `/blog/${p.slug}`,
      0.7,
      "monthly",
      new Date(p.updated_at ?? p.published_at ?? Date.now())
    )
  );

  return [
    ...staticPages,
    ...destinationPages,
    ...tourPages,
    ...categoryPages,
    ...blogPages,
  ];
}
