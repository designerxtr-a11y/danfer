import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Star, Clock, Mountain, Users, MapPin } from "lucide-react";
import {
  getTourBySlug,
  getTourItinerary,
  getTourAvailability,
  getTourReviews,
  getRelatedTours,
} from "@/lib/queries/tours";
import { t } from "@/types/database";
import { TourGallery } from "@/components/tours/tour-gallery";
import { TourItinerary } from "@/components/tours/tour-itinerary";
import { TourFaqs } from "@/components/tours/tour-faqs";
import { TourMap } from "@/components/tours/tour-map";
import { JsonLd } from "@/components/seo/json-ld";
import { tourSchema, breadcrumbSchema, tourFaqsSchema } from "@/lib/seo/schema";
import { TourIncludes } from "@/components/tours/tour-includes";
import { TourReviews } from "@/components/tours/tour-reviews";
import { BookingWidget } from "@/components/tours/booking-widget";
import { RelatedTours } from "@/components/tours/related-tours";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("tours")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((t) => ({ slug: t.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  const title = t(tour.title);
  const description =
    t(tour.short_desc) ||
    t(tour.subtitle) ||
    `Tour guiado a ${title} en Cusco. Reserva con Danfer Tours, operador oficial.`;

  return {
    title,
    description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: `${title} · Danfer Tours Cusco`,
      description,
      url: `/tours/${tour.slug}`,
      type: "website",
      images: [
        {
          url: tour.cover_image,
          width: 1600,
          height: 900,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [tour.cover_image],
    },
  };
}

const difficultyLabel: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderado",
  challenging: "Exigente",
  expert: "Experto",
};

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const [itinerary, availability, reviews, related] = await Promise.all([
    getTourItinerary(tour.id),
    getTourAvailability(tour.id),
    getTourReviews(tour.id, 8),
    getRelatedTours(tour.id, tour.category_id, 3),
  ]);

  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  const faqLd = tourFaqsSchema(tour.faqs ?? []);
  const schemas = [
    ...tourSchema(tour, reviews),
    breadcrumbSchema([
      { name: "Inicio", url: "/" },
      { name: "Tours", url: "/tours" },
      ...(tour.category
        ? [{ name: t(tour.category.name), url: `/tours?category=${tour.category.slug}` }]
        : []),
      { name: t(tour.title), url: `/tours/${tour.slug}` },
    ]),
    ...(faqLd ? [faqLd] : []),
  ];

  return (
    <div className="pt-24">
      <JsonLd data={schemas} />
      {/* Hero with cover */}
        <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={tour.cover_image}
            alt={t(tour.title)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night" />

          <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-6 pb-16">
            <Link
              href="/#tours"
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold text-sm mb-6 transition group w-fit"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
              Volver a tours
            </Link>

            {tour.category && (
              <span className="font-hand text-gold text-2xl">
                {t(tour.category.name)}
              </span>
            )}
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] max-w-4xl mt-2">
              {t(tour.title)}
            </h1>
            {tour.subtitle && (
              <p className="mt-4 text-xl text-white/70 max-w-2xl">
                {t(tour.subtitle)}
              </p>
            )}

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-gold text-gold" />
                <span className="font-semibold text-white">{tour.rating.toFixed(1)}</span>
                <span className="text-white/60">({tour.reviews_count} reseñas)</span>
              </div>
              <Divider />
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t(tour.duration_label)}
              </span>
              <Divider />
              <span className="flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                {difficultyLabel[tour.difficulty]}
              </span>
              <Divider />
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Hasta {tour.max_group_size}
              </span>
              {tour.altitude_max && (
                <>
                  <Divider />
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {tour.altitude_max.toLocaleString()} msnm
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Main content + sticky booking */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {/* Gallery */}
            {tour.gallery.length > 0 && (
              <TourGallery
                images={[
                  { url: tour.cover_image, alt: t(tour.title) },
                  ...tour.gallery,
                ]}
              />
            )}

            {/* Overview */}
            <div>
              <h2 className="font-display text-4xl text-night mb-6">Sobre el tour</h2>
              <div
                className="prose prose-neutral max-w-none prose-lg [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-night/75 [&_p]:leading-relaxed [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-night/75 [&_li]:my-1 [&_a]:text-gold [&_a]:underline [&_strong]:text-night"
                dangerouslySetInnerHTML={{ __html: t(tour.description) }}
              />
            </div>

            {/* Highlights */}
            {tour.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-4xl text-night mb-6">
                  Lo más destacado
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {tour.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-night/80"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <TourItinerary days={itinerary} />
            )}

            {/* Includes / Excludes */}
            <TourIncludes
              includes={tour.includes}
              excludes={tour.excludes}
              whatToBring={tour.what_to_bring}
            />

            {/* FAQs */}
            {tour.faqs && tour.faqs.length > 0 && (
              <TourFaqs faqs={tour.faqs} />
            )}

            {/* Map */}
            {tour.coordinates && (
              <div>
                <h2 className="font-display text-4xl text-night mb-6">
                  Punto de inicio
                </h2>
                <TourMap coordinates={tour.coordinates} title={t(tour.title)} />
              </div>
            )}

            {/* Reviews */}
            <TourReviews
              reviews={reviews}
              avgRating={tour.rating}
              total={tour.reviews_count}
            />
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingWidget
              tourId={tour.id}
              tourSlug={tour.slug}
              tourTitle={t(tour.title)}
              priceUsd={finalPrice}
              originalPrice={tour.discount_pct > 0 ? tour.price_usd : null}
              maxGroupSize={tour.max_group_size}
              availability={availability}
            />
          </aside>
        </section>

      {/* Related */}
      {related.length > 0 && <RelatedTours tours={related} />}
    </div>
  );
}

function Divider() {
  return <span className="w-px h-4 bg-white/20" />;
}
