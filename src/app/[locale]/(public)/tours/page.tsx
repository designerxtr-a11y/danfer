import { getAllTours } from "@/lib/queries/tours";
import { createClient } from "@/lib/supabase/server";
import { ToursPageClient } from "./page.client";
import type { Category, Locale } from "@/types/database";
import { JsonLd } from "@/components/seo/json-ld";
import {
  tourListSchema,
  toursAggregateOfferSchema,
  categoryServiceSchema,
  breadcrumbSchema,
} from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { tr } from "@/lib/i18n/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<import("next").Metadata> {
  const { locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const title =
    lc === "en"
      ? "All Cusco Tours · Machu Picchu, Inca Trail & more"
      : "Todos los tours en Cusco";
  const description =
    lc === "en"
      ? "Complete catalog of Cusco tours: Machu Picchu, Sacred Valley, Inca Trail, Rainbow Mountain. Filter by price, duration and difficulty. Live availability."
      : "Catálogo completo de tours en Cusco: Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain. Filtra por precio, duración y dificultad. Disponibilidad en vivo.";
  return {
    title,
    description,
    alternates: buildAlternates("/tours", lc),
    openGraph: {
      title:
        lc === "en"
          ? "All Cusco Tours · Danfer Tours"
          : "Todos los tours en Cusco · Danfer Tours",
      description:
        lc === "en"
          ? "Complete catalog with live availability and verified reviews."
          : "Catálogo completo con disponibilidad en vivo y reseñas verificadas.",
      locale: ogLocale(lc),
    },
  };
}

export default async function ToursIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const mx = tr(lc);
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
      { name: mx.breadcrumbs.home, url: "/" },
      { name: mx.breadcrumbs.tours, url: "/tours" },
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
    <div className="pt-24 md:pt-32">
      <JsonLd data={schemas} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 md:mb-12">
        <Breadcrumbs
          items={[
            { name: mx.breadcrumbs.home, url: "/" },
            { name: mx.breadcrumbs.tours, url: "/tours" },
          ]}
          className="mb-4"
        />
        <span className="font-hand text-gold text-2xl">
          {tours.length} {lc === "en" ? "experiences" : "experiencias"}
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-7xl text-night max-w-3xl leading-[1.05]">
          {lc === "en" ? "All our tours in " : "Todos nuestros tours en "}
          <span className="text-gradient-gold italic">Cusco</span>
        </h1>
      </section>
      <ToursPageClient tours={tours} categories={cats} />
    </div>
  );
}
