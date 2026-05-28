import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tours", "/tours/*"],
        disallow: ["/admin", "/admin/*", "/api/*", "/reservar/confirmacion"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`, `${SITE}/sitemap-images.xml`],
    host: SITE,
  };
}
