import Image from "next/image";
import { ArrowRight, Mountain, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { listDestinations } from "@/lib/destinations-content";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, placeSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { tr } from "@/lib/i18n/messages";
import { type Locale } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<import("next").Metadata> {
  const { locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  return {
    title:
      lc === "en"
        ? "Destinations in Cusco · Tours by region · Danfer Tours"
        : "Destinos en Cusco · Tours por región · Danfer Tours",
    description:
      lc === "en"
        ? "Explore all of Cusco's tourist destinations with Danfer Tours: Machu Picchu, Inca Trail, Sacred Valley, Rainbow Mountain, Humantay Lake. Certified local guides."
        : "Explora todos los destinos turísticos del Cusco con Danfer Tours: Machu Picchu, Camino Inca, Valle Sagrado, Rainbow Mountain, Laguna Humantay. Guías locales certificados.",
    alternates: buildAlternates("/destinos", lc),
    openGraph: {
      title:
        lc === "en"
          ? "Destinations in Cusco · Danfer Tours"
          : "Destinos en Cusco · Danfer Tours",
      description:
        lc === "en"
          ? "Machu Picchu, Inca Trail, Sacred Valley, Rainbow Mountain, Humantay and more. Premium tours with an official operator."
          : "Machu Picchu, Camino Inca, Valle Sagrado, Rainbow Mountain, Humantay y más. Tours premium con operador oficial.",
      locale: ogLocale(lc),
    },
  };
}

export const revalidate = 86400;

export default async function DestinationsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const mx = tr(lc);
  const destinations = listDestinations(lc);

  const crumbs = [
    { name: mx.breadcrumbs.home, url: "/" },
    { name: mx.breadcrumbs.destinations, url: "/destinos" },
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Destinos turísticos en Cusco, Perú",
      description:
        "Catálogo de destinos del Cusco operados por Danfer Tours: Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay.",
      hasPart: destinations.map((d) =>
        placeSchema({
          slug: d.slug,
          name: d.name,
          description: d.tagline,
          image: d.hero.image,
          lat: d.geo.lat,
          lng: d.geo.lng,
          altitude: d.geo.altitudeM,
        })
      ),
    },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <JsonLd data={schemas} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 md:mb-12">
        <Breadcrumbs items={crumbs} className="mb-4" />
        <span className="font-hand text-gold text-2xl">
          {lc === "en"
            ? `${destinations.length} must-see destinations`
            : `${destinations.length} destinos imperdibles`}
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-7xl text-night max-w-4xl leading-[1.02]">
          {lc === "en" ? "Destinations in " : "Destinos en "}
          <span className="text-gradient-gold italic">Cusco</span>
        </h1>
        <p className="mt-6 text-night/65 max-w-2xl leading-relaxed">
          {lc === "en"
            ? "From the sacred citadel of Machu Picchu to the snow peaks of Salkantay and the multicolored mountains of Vinicunca — every destination in Cusco is a different story of the Inca Empire and the Peruvian Andes. We run daily tours to all the listed places, with certified local guides and small groups."
            : "Desde la ciudadela sagrada de Machu Picchu hasta los nevados de Salkantay y las montañas multicolores de Vinicunca — cada destino del Cusco es una historia diferente del Imperio Inca y los Andes peruanos. Operamos tours diarios a todos los lugares listados, con guías locales certificados y grupos pequeños."}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {destinations.map((d, i) => (
            <Link
              key={d.slug}
              href={`/destinos/${d.slug}`}
              className={`group relative rounded-3xl overflow-hidden ring-1 ring-night/10 shadow-card hover:shadow-glow transition ${
                i === 0
                  ? "sm:col-span-2 lg:col-span-2 aspect-[16/10]"
                  : "aspect-[4/5]"
              }`}
            >
              <Image
                src={d.hero.image}
                alt={d.hero.imageAlt}
                fill
                priority={i === 0}
                sizes={
                  i === 0
                    ? "(min-width:1024px) 66vw, 100vw"
                    : "(min-width:1024px) 33vw, 50vw"
                }
                className="object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />

              {i === 0 && (
                <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-gradient-to-r from-gold to-gold-bright text-night text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {lc === "en" ? "Destination #1" : "Destino #1"}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-widest mb-2">
                  <MapPin className="w-3 h-3 text-gold" />
                  {d.region}, Perú
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <Mountain className="w-3 h-3 text-gold" />
                  {d.geo.altitudeM} msnm
                </div>
                <h2
                  className={`font-display text-white leading-tight ${
                    i === 0 ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {d.name}
                </h2>
                <p className="mt-2 text-sm text-white/65 line-clamp-2">
                  {d.tagline}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-semibold">
                  {lc === "en" ? "Explore destination" : "Explorar destino"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
