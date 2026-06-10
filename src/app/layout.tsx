import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteUrl } from "@/lib/seo/site-url";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const SITE = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Danfer Tours Cusco · Tours premium en Machu Picchu y Valle Sagrado",
    template: "%s · Danfer Tours Cusco",
  },
  description:
    "Operador turístico oficial en Cusco. Tours guiados a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay. Reserva con confianza, guías locales certificados.",
  keywords: [
    "tours Cusco",
    "tours Machu Picchu",
    "Camino Inca",
    "Valle Sagrado",
    "Rainbow Mountain",
    "Laguna Humantay",
    "agencia de viajes Cusco",
    "tours Peru",
    "Danfer Tours",
  ],
  authors: [{ name: "Danfer Tours Cusco" }],
  creator: "Danfer Tours Cusco",
  publisher: "Danfer Tours Cusco",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    // hreflang/canonical reales se definen por página (buildAlternates).
    // Aquí solo el canonical raíz por defecto para rutas que no lo sobreescriban.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    alternateLocale: "en_US",
    url: SITE,
    siteName: "Danfer Tours Cusco",
    title: "Danfer Tours Cusco · Tours premium en Machu Picchu y Valle Sagrado",
    description:
      "Operador turístico oficial en Cusco. Tours guiados a Machu Picchu, Valle Sagrado, Camino Inca y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danfer Tours Cusco · Tours premium en Machu Picchu",
    description: "Tours guiados a Machu Picchu, Valle Sagrado, Camino Inca y más.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Rellenar cuando tengamos Search Console / Bing Webmaster
    // google: "...",
    // other: { "p:domain_verify": "..." },  // Pinterest
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Locale real de la request (middleware next-intl). En /en el html debe
  // declarar lang="en" — Google usa lang + hreflang para indexar el inglés.
  // Para /admin (fuera del árbol [locale]) cae al default "es".
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* Resource hints para el media externo del hero (LCP móvil) */}
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://videos.pexels.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
