import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    globalNotFound: true,
    // Fotos de pasaporte de /quote suben por server action (default 1MB).
    // Vercel corta en 4.5MB por request; el cliente además comprime la foto.
    serverActions: { bodySizeLimit: "4mb" },
  },
  // Ya no hay favicon.ico estático (era el placeholder del template y los
  // navegadores lo preferían sobre el /icon dinámico de Ajustes). Los
  // navegadores igual piden /favicon.ico a ciegas → mandarlos al dinámico.
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
