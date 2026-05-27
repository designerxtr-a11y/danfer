import type { Metadata } from "next";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";

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

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

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
    canonical: "/",
    languages: { "es-PE": "/", "en-US": "/" },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
