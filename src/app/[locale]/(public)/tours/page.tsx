import { getAllTours } from "@/lib/queries/tours";
import { createClient } from "@/lib/supabase/server";
import { ToursPageClient } from "./page.client";
import type { Category } from "@/types/database";
import { JsonLd } from "@/components/seo/json-ld";
import {
  tourListSchema,
  toursAggregateOfferSchema,
  categoryServiceSchema,
  breadcrumbSchema,
} from "@/lib/seo/schema";

export const metadata = {
  title: "Todos los tours en Cusco",
  description:
    "Catálogo completo de tours en Cusco: Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain. Filtra por precio, duración y dificultad. Disponibilidad en vivo.",
  alternates: { canonical: "/tours" },
  openGraph: {
    title: "Todos los tours en Cusco · Danfer Tours",
    description:
      "Catálogo completo con disponibilidad en vivo y reseñas verificadas.",
  },
};

export default async function ToursIndexPage() {
  const supabase = await createClient();
  const [tours, { data: categories }] = await Promise.all([
    getAllTours(),
    supabase
      .from("categories")
      .select("id,slug,name,description,cover_image,icon,sort_order")
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  const cats = (categories ?? []) as Category[];

  const schemas = [
    breadcrumbSchema([
      { name: "Inicio", url: "/" },
      { name: "Tours", url: "/tours" },
    ]),
    tourListSchema(tours),
    toursAggregateOfferSchema(tours),
    ...cats.map((c) =>
      categoryServiceSchema({
        slug: c.slug,
        name: c.name,
        description: c.description,
      })
    ),
  ].filter(Boolean) as object[];

  return (
    <div className="pt-32">
      <JsonLd data={schemas} />
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <span className="font-hand text-gold text-2xl">
          {tours.length} experiencias
        </span>
        <h1 className="mt-2 font-display text-5xl md:text-7xl text-night max-w-3xl leading-[1.05]">
          Todos nuestros{" "}
          <span className="text-gradient-gold italic">tours</span>
        </h1>
      </section>
      <ToursPageClient tours={tours} categories={cats} />
    </div>
  );
}
