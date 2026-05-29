import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site-url";

const SITE = siteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/reservar/confirmacion",
          "/en/reservar/confirmacion",
        ],
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`, `${SITE}/sitemap-images.xml`],
  };
}
