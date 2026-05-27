import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Danfer Tours Cusco",
    short_name: "Danfer Tours",
    description:
      "Tours premium en Cusco, Machu Picchu, Valle Sagrado y Camino Inca.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0B1929",
    orientation: "portrait",
    lang: "es-PE",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    categories: ["travel", "tourism"],
  };
}
