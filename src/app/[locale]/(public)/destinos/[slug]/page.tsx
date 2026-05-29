import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Mountain,
  MapPin,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DESTINATIONS,
  getDestinationBySlug,
} from "@/lib/destinations-content";
import { getAllTours } from "@/lib/queries/tours";
import type { TourWithCategory } from "@/types/database";
import { t, type Locale } from "@/types/database";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  placeSchema,
  faqSchema,
  tourListSchema,
} from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { tr } from "@/lib/i18n/messages";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

export async function generateStaticParams() {
  return Object.keys(DESTINATIONS).map((slug) => ({ slug }));
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<import("next").Metadata> {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const d = getDestinationBySlug(slug, lc);
  if (!d) return {};
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: buildAlternates(`/destinos/${d.slug}`, lc),
    openGraph: {
      title: d.metaTitle,
      description: d.metaDescription,
      url: `/destinos/${d.slug}`,
      type: "website",
      locale: ogLocale(lc),
      images: [
        { url: d.hero.image, width: 1920, height: 1080, alt: d.hero.imageAlt },
      ],
    },
  };
}

function matchTours(
  allTours: TourWithCategory[],
  destination: (typeof DESTINATIONS)[string],
  lc: Locale
): TourWithCategory[] {
  return allTours.filter((tour) => {
    const title = t(tour.title, lc);
    const catSlug = tour.category?.slug ?? "";
    if (destination.tourCategorySlugs.some((s) => catSlug === s)) return true;
    return destination.tourTitleMatchers.some((rx) => rx.test(title));
  });
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const mx = tr(lc);
  const destination = getDestinationBySlug(slug, lc);
  if (!destination) notFound();

  const allTours = await getAllTours();
  const matchingTours = matchTours(allTours, destination, lc);
  const related = destination.relatedSlugs
    .map((s) => getDestinationBySlug(s, lc))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const crumbs = [
    { name: mx.breadcrumbs.home, url: "/" },
    { name: mx.breadcrumbs.destinations, url: "/destinos" },
    { name: destination.name, url: `/destinos/${destination.slug}` },
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    placeSchema({
      slug: destination.slug,
      name: destination.name,
      description: destination.intro.slice(0, 500),
      image: destination.hero.image,
      lat: destination.geo.lat,
      lng: destination.geo.lng,
      altitude: destination.geo.altitudeM,
    }),
    ...(matchingTours.length > 0 ? [tourListSchema(matchingTours)] : []),
    faqSchema(destination.faq),
  ];

  return (
    <article className="pt-24">
      <JsonLd data={schemas} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={crumbs} className="mb-3" />
      </div>

      {/* Hero */}
      <section className="relative h-[55vh] sm:h-[60vh] min-h-[380px] sm:min-h-[420px] w-full overflow-hidden">
        <Image
          src={destination.hero.image}
          alt={destination.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/30" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <Link
            href="/destinos"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-gold text-sm mb-4 transition w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            {lc === "en" ? "All destinations" : "Todos los destinos"}
          </Link>
          <span className="font-hand text-gold text-xl sm:text-2xl">
            {destination.region}, Perú
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[1.02] max-w-4xl">
            {destination.h1}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/75 max-w-3xl">
            {destination.tagline}
          </p>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="bg-stone border-b border-night/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
          {destination.quickFacts.map((f) => (
            <div key={f.label} className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-night/45 truncate">
                {f.label}
              </div>
              <div className="mt-0.5 font-display text-xs sm:text-sm text-night font-semibold break-words">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-base sm:text-lg md:text-xl text-night/75 leading-relaxed first-letter:font-display first-letter:text-4xl sm:first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:text-gold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
          {destination.intro}
        </p>
      </section>

      {/* Matching tours */}
      {matchingTours.length > 0 && (
        <section
          id="tours"
          className="bg-stone py-14 md:py-20 px-4 sm:px-6 border-y border-night/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="font-hand text-gold text-2xl">
                  {lc === "en" ? "Book now" : "Reserva ahora"}
                </span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl md:text-5xl text-night leading-[1.05]">
                  {lc === "en" ? "Tours to " : "Tours a "}
                  <span className="text-gradient-gold italic">
                    {destination.shortName}
                  </span>
                </h2>
              </div>
              <p className="text-night/60 max-w-md">
                {lc === "en"
                  ? "Operated by Danfer Tours · Certified guides · Small groups · Book with confidence."
                  : "Operados por Danfer Tours · Guías certificados · Grupos pequeños · Reserva con confianza."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {matchingTours.slice(0, 6).map((tour) => (
                <TourMiniCard key={tour.id} tour={tour} lc={lc} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-night font-semibold hover:text-gold transition"
              >
                {lc === "en" ? "View all tours" : "Ver todos los tours"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sections (longform content) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20 space-y-12 md:space-y-14">
        {destination.sections.map((s, i) => (
          <div key={s.id} id={s.id} className="speakable">
            <div className="flex items-center gap-3 text-night/50 mb-3 text-[11px] uppercase tracking-[0.3em]">
              <span className="text-gold font-display font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-gold" />
              {destination.region}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night leading-tight">
              {s.title}
            </h2>
            <div
              className="mt-4 text-night/75 leading-relaxed prose-styled"
              // s.body uses **bold** markdown — we render minimal formatting client-side via regex
              dangerouslySetInnerHTML={{
                __html: s.body
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-night font-semibold">$1</strong>'
                  )
                  .replace(/\n\n/g, "</p><p class='mt-4'>")
                  .replace(/^/, "<p>")
                  .concat("</p>"),
              }}
            />
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="bg-stone py-14 md:py-20 px-4 sm:px-6 border-t border-night/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-hand text-gold text-2xl">
              {lc === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl md:text-5xl text-night">
              {lc === "en" ? "About " : "Sobre "}
              {destination.shortName}
            </h2>
          </div>
          <div className="space-y-3">
            {destination.faq.map((qa, i) => (
              <details
                key={i}
                className="group bg-white border border-night/8 rounded-2xl shadow-soft overflow-hidden"
              >
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-4 hover:bg-paper transition">
                  <h3 className="font-display text-lg text-night leading-snug">
                    {qa.q}
                  </h3>
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-gold/10 text-gold shrink-0 group-open:rotate-45 transition">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-night/70 leading-relaxed">
                  {qa.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related destinations */}
      {related.length > 0 && (
        <section className="py-14 md:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span className="font-hand text-gold text-2xl">
                {lc === "en" ? "Keep exploring" : "Sigue explorando"}
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl md:text-5xl text-night">
                {lc === "en" ? "Other destinations in Cusco" : "Otros destinos del Cusco"}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/destinos/${r.slug}`}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-night/10 shadow-card hover:shadow-glow transition"
                >
                  <Image
                    src={r.hero.image}
                    alt={r.hero.imageAlt}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-widest mb-2">
                      <MapPin className="w-3 h-3 text-gold" />
                      {r.region}, Perú
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      <Mountain className="w-3 h-3 text-gold" />
                      {r.geo.altitudeM} msnm
                    </div>
                    <h3 className="font-display text-2xl text-white">
                      {r.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/65 line-clamp-2">
                      {r.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function TourMiniCard({ tour, lc }: { tour: TourWithCategory; lc: Locale }) {
  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group block relative aspect-[4/5] rounded-3xl overflow-hidden bg-night-deep ring-1 ring-night/10 shadow-soft hover:shadow-glow transition"
    >
      <Image
        src={tour.cover_image}
        alt={t(tour.title, lc)}
        fill
        sizes="(min-width:1024px) 33vw, 50vw"
        className="object-cover group-hover:scale-110 transition duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/10" />
      <div className="absolute top-4 right-4 rounded-full bg-night/60 border border-white/15 px-3 py-1 text-xs text-white flex items-center gap-1.5">
        <Calendar className="w-3 h-3 text-gold" />
        {t(tour.duration_label, lc)}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-xl text-white leading-tight">
          {t(tour.title, lc)}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/55">
              {lc === "en" ? "From" : "Desde"}
            </div>
            <div className="font-display text-xl font-bold text-gold leading-none">
              US${finalPrice.toFixed(0)}
            </div>
          </div>
          <span className="grid place-items-center w-8 h-8 rounded-full bg-gold text-night">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

