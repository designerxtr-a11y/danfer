import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

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
