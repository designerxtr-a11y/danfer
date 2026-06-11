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
      { src: "/icon", sizes: "96x96", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    categories: ["travel", "tourism"],
  };
}
