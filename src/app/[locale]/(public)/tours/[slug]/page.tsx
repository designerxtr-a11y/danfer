import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ChevronLeft, Star, Clock, Mountain, Users, MapPin } from "lucide-react";
import {
  getTourBySlug,
  getTourItinerary,
  getTourAvailability,
  getTourReviews,
  getTourReviewStats,
  getRelatedTours,
} from "@/lib/queries/tours";
import { t, type Locale } from "@/types/database";
import { tr } from "@/lib/i18n/messages";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { TourGallery } from "@/components/tours/tour-gallery";
import { TourItinerary } from "@/components/tours/tour-itinerary";
import { TourFaqs } from "@/components/tours/tour-faqs";
import { TourMapLazy } from "@/components/tours/tour-map-lazy";
import { JsonLd } from "@/components/seo/json-ld";
import {
  tourSchema,
  breadcrumbSchema,
  tourFaqsSchema,
  courseSchema,
} from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TourIncludes } from "@/components/tours/tour-includes";
import { TourReviews } from "@/components/tours/tour-reviews";
import { ReviewForm } from "@/components/tours/review-form";
import { BookingWidget } from "@/components/tours/booking-widget";
import { RelatedTours } from "@/components/tours/related-tours";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";

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
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  const title = t(tour.title, lc);
  const description =
    t(tour.short_desc, lc) ||
    t(tour.subtitle, lc) ||
    (lc === "en"
      ? `Guided ${title} tour in Cusco. Book with Danfer Tours, official operator.`
      : `Tour guiado a ${title} en Cusco. Reserva con Danfer Tours, operador oficial.`);

  return {
    title,
    description,
    alternates: buildAlternates(`/tours/${tour.slug}`, lc),
    openGraph: {
      title: `${title} · Danfer Tours Cusco`,
      description,
      url: lc === "en" ? `/en/tours/${tour.slug}` : `/tours/${tour.slug}`,
      type: "website",
      locale: ogLocale(lc),
      // og:image la genera opengraph-image.tsx (declararla aquí pisa la file
      // convention y la imagen brandeada con precio nunca se servía)
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const mx = tr(lc);
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const [itinerary, availability, reviews, related, reviewStats, settings] =
    await Promise.all([
      getTourItinerary(tour.id),
      getTourAvailability(tour.id),
      getTourReviews(tour.id, 8),
      getRelatedTours(tour.id, tour.category_id, 3),
      getTourReviewStats(tour.id),
      getSettings(),
    ]);

  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  const faqLd = tourFaqsSchema(tour.faqs ?? []);
  const courseLd = courseSchema(tour);
  const crumbs = [
    { name: mx.breadcrumbs.home, url: "/" },
    { name: mx.breadcrumbs.tours, url: "/tours" },
    ...(tour.category
      ? [
          {
            name: t(tour.category.name, lc),
            url: `/tours?category=${tour.category.slug}`,
          },
        ]
      : []),
    { name: t(tour.title, lc), url: `/tours/${tour.slug}` },
  ];
  const schemas = [
    ...tourSchema(tour, reviews, reviewStats),
    breadcrumbSchema(crumbs),
    ...(faqLd ? [faqLd] : []),
    ...(courseLd ? [courseLd] : []),
  ];

  return (
    <div className="pt-24">
      <JsonLd data={schemas} />
      {/* Visible breadcrumbs (matches the BreadcrumbList schema above) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3">
        <Breadcrumbs items={crumbs} />
      </div>
      {/* Hero with cover */}
        <section className="relative h-[60vh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px] w-full overflow-hidden">
          <Image
            src={tour.cover_image}
            alt={t(tour.title, lc)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night" />

          <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold text-sm mb-4 sm:mb-6 transition group w-fit"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
              {mx.common.backToTours}
            </Link>

            {tour.category && (
              <span className="font-hand text-gold text-xl sm:text-2xl">
                {t(tour.category.name, lc)}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-4xl mt-2">
              {t(tour.title, lc)}
            </h1>
            {tour.subtitle && (
              <p className="mt-3 sm:mt-4 text-base sm:text-xl text-white/70 max-w-2xl">
                {t(tour.subtitle, lc)}
              </p>
            )}

            {/* Quick stats */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-white/80 text-sm sm:text-base">
              {reviewStats.count > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                    <span className="font-semibold text-white">
                      {reviewStats.avg.toFixed(1)}
                    </span>
                    <span className="text-white/60">
                      ({reviewStats.count} {mx.tourDetail.reviewsCount})
                    </span>
                  </div>
                  <Divider />
                </>
              )}
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t(tour.duration_label, lc)}
              </span>
              <Divider />
              <span className="flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                {mx.difficulty[tour.difficulty]}
              </span>
              <Divider />
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {mx.tourDetail.upTo} {tour.max_group_size}
              </span>
              {tour.altitude_max && (
                <>
                  <Divider />
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {tour.altitude_max.toLocaleString()} {mx.tourDetail.masl}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Main content + sticky booking */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-16">
            {/* Gallery */}
            {tour.gallery.length > 0 && (
              <TourGallery
                images={[
                  { url: tour.cover_image, alt: t(tour.title, lc) },
                  ...tour.gallery,
                ]}
              />
            )}

            {/* Overview */}
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night mb-6">
                {mx.tourDetail.about}
              </h2>
              <div
                className="prose prose-neutral max-w-none prose-lg [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-night/75 [&_p]:leading-relaxed [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-night/75 [&_li]:my-1 [&_a]:text-gold [&_a]:underline [&_strong]:text-night"
                dangerouslySetInnerHTML={{ __html: t(tour.description, lc) }}
              />
            </div>

            {/* Highlights */}
            {tour.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night mb-6">
                  {mx.tourDetail.highlights}
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
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night mb-6">
                  {mx.tourDetail.startPoint}
                </h2>
                <TourMapLazy
                  coordinates={tour.coordinates}
                  title={t(tour.title, lc)}
                />
              </div>
            )}

            {/* Reviews — solo si hay reseñas reales (number coincide con schema) */}
            {reviewStats.count > 0 && (
              <TourReviews
                reviews={reviews}
                avgRating={reviewStats.avg}
                total={reviewStats.count}
              />
            )}

            {/* Formulario de reseña de primera mano — siempre visible, para
                recolectar reseñas reales que (tras moderar) generan estrellas. */}
            <ReviewForm tourId={tour.id} lc={lc} />
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingWidget
              tourId={tour.id}
              tourSlug={tour.slug}
              tourTitle={t(tour.title, lc)}
              priceUsd={finalPrice}
              originalPrice={tour.discount_pct > 0 ? tour.price_usd : null}
              maxGroupSize={tour.max_group_size}
              availability={availability}
              whatsapp={normalizeWhatsApp(settings.whatsapp)}
              locale={lc}
            />
          </aside>
        </section>

      {/* Related */}
      {related.length > 0 && <RelatedTours tours={related} />}
    </div>
  );
}

function Divider() {
  return <span className="hidden sm:inline-block w-px h-4 bg-white/20" />;
}
