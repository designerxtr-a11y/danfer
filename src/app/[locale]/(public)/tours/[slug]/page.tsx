import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  ChevronLeft, Star, Clock, Mountain, Users, MapPin, Check, Zap, ScrollText,
  ClipboardCheck, CircleHelp, Flag, Backpack, Info, BadgeCheck,
} from "lucide-react";
import {
  getTourBySlug,
  getTourItinerary,
  getTourAvailability,
  getTourReviews,
  getTourReviewStats,
  getRelatedTours,
} from "@/lib/queries/tours";
import { t, tList, type Locale } from "@/types/database";
import { tr } from "@/lib/i18n/messages";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { TourGallery } from "@/components/tours/tour-gallery";
import { TourItinerary } from "@/components/tours/tour-itinerary";
import { TourFaqs } from "@/components/tours/tour-faqs";
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
import { MobileBookingBar } from "@/components/tours/mobile-booking-bar";
import { RelatedTours } from "@/components/tours/related-tours";
import { TourHeaderGallery } from "@/components/tours/tour-header-gallery";
import { TourQuickFacts } from "@/components/tours/tour-quick-facts";
import { TourTabs, type TourTab } from "@/components/tours/tour-tabs";
import { FeaturedReview, ExpertCard } from "@/components/tours/tour-sidebar-extras";
import { TourRouteMap } from "@/components/tours/tour-route-map";
import { CertificationsStrip } from "@/components/tours/certifications-strip";
import { TripadvisorRating } from "@/components/tours/tripadvisor-badge";
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

  const title = t(tour.meta_title, lc) || t(tour.title, lc);
  const description =
    t(tour.meta_description, lc) ||
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
      getRelatedTours(tour.id, tour.category_id, 6),
      getTourReviewStats(tour.id),
      getSettings(),
    ]);

  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  const faqLd = tourFaqsSchema(tour.faqs ?? [], lc);
  const courseLd = courseSchema(tour, lc);
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
    ...tourSchema(tour, reviews, reviewStats, lc),
    breadcrumbSchema(crumbs),
    ...(faqLd ? [faqLd] : []),
    ...(courseLd ? [courseLd] : []),
  ];

  // Fotos sin duplicados (portada + galería). Con 3+ se usa el mosaico.
  const images = [
    { url: tour.cover_image, alt: t(tour.title, lc) },
    ...tour.gallery,
  ].filter((img, i, arr) => img.url && arr.findIndex((x) => x.url === img.url) === i);
  const mosaic = images.length >= 3;
  const en = lc === "en";
  const title = t(tour.title, lc);
  const intro = t(tour.short_desc, lc) || t(tour.subtitle, lc);
  const importantInfo = tour.important_info ? tList(tour.important_info, lc) : [];
  const whatToBring = tList(tour.what_to_bring, lc);
  const highlights = tList(tour.highlights, lc);
  const includes = tList(tour.includes, lc);
  const excludes = tList(tour.excludes, lc);

  const tabs: TourTab[] = [
    {
      id: "resumen",
      label: en ? "Overview" : "Resumen",
      icon: <Zap />,
      content: (
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-night mb-5">
              {mx.tourDetail.about}
            </h2>
            <div
              className="prose prose-neutral max-w-none prose-lg [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-night/75 [&_p]:leading-relaxed [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-night/75 [&_li]:my-1 [&_a]:text-gold [&_a]:underline [&_strong]:text-night"
              dangerouslySetInnerHTML={{ __html: t(tour.description, lc) }}
            />
          </div>
          {highlights.length > 0 && (
            <div>
              <h3 className="font-display text-2xl text-night mb-5">{mx.tourDetail.highlights}</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-night/80">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-1" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    ...(itinerary.length > 0
      ? [{
          id: "itinerario",
          label: en ? "Itinerary" : "Itinerario",
          icon: <ScrollText />,
          content: <TourItinerary days={itinerary} locale={lc} />,
        }]
      : []),
    ...(includes.length > 0 || excludes.length > 0
      ? [{
          id: "incluye",
          label: en ? "Included" : "Incluye",
          icon: <ClipboardCheck />,
          content: (
            <>
              <h2 className="font-display text-2xl sm:text-3xl text-night mb-6">
                {en ? `What's included and not included in the ${title} tour` : `Qué incluye y qué no incluye el tour ${title}`}
              </h2>
              <TourIncludes includes={includes} excludes={excludes} whatToBring={[]} en={en} />
            </>
          ),
        }]
      : []),
    ...(tour.faqs && tour.faqs.length > 0
      ? [{
          id: "preguntas",
          label: en ? "FAQ" : "Preguntas frecuentes",
          icon: <CircleHelp />,
          content: <TourFaqs faqs={tour.faqs} locale={lc} />,
        }]
      : []),
    ...(importantInfo.length > 0
      ? [{
          id: "info",
          label: en ? "Useful info" : "Información útil",
          icon: <Flag />,
          content: (
            <TabList
              heading={en ? `Important information for the ${title} tour` : `Información importante del tour ${title}`}
              items={importantInfo}
              icon={<Info className="w-4 h-4 text-gold shrink-0 mt-1" />}
            />
          ),
        }]
      : []),
    ...(whatToBring.length > 0
      ? [{
          id: "que-llevar",
          label: en ? "What to bring" : "Qué llevar",
          icon: <Backpack />,
          content: (
            <TabList
              heading={en ? `What to bring on the ${title} tour` : `Qué llevar al tour ${title}`}
              items={whatToBring}
              icon={<Check className="w-4 h-4 text-gold shrink-0 mt-1" />}
            />
          ),
        }]
      : []),
  ];

  const quickFacts = (
    <TourQuickFacts
      duration={t(tour.duration_label, lc)}
      type={tour.category ? t(tour.category.name, lc) : null}
      difficulty={mx.difficulty[tour.difficulty]}
      groupSize={tour.max_group_size}
      locale={lc}
    />
  );

  const titleBlock = (
    <div>
      {tour.category && (
        <span className="font-hand text-gold text-xl sm:text-2xl">{t(tour.category.name, lc)}</span>
      )}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-night leading-[1.1] mt-1">
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <TripadvisorRating locale={lc} />
        <span className="hidden sm:block w-px h-4 bg-night/15" />
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-night/75">
          <BadgeCheck className="w-4 h-4 text-gold" />
          {en ? "Certified local guides" : "Guías locales certificados"}
        </span>
        <span className="hidden sm:block w-px h-4 bg-night/15" />
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-night/75">
          <MapPin className="w-4 h-4 text-gold" />
          {en ? "Local operator in Cusco" : "Operador local en Cusco"}
        </span>
      </div>
      {intro && <p className="mt-5 text-night/70 text-base sm:text-lg leading-relaxed">{intro}</p>}
    </div>
  );

  return (
    <div className="pt-24">
      <JsonLd data={schemas} />
      {/* Visible breadcrumbs (matches the BreadcrumbList schema above) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3">
        <Breadcrumbs items={crumbs} />
      </div>

      {mosaic ? (
        /* Cabecera en mosaico + título sobre fondo claro */
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <TourHeaderGallery images={images} locale={lc} />
        </section>
      ) : (
        /* Hero con portada (tours con menos de 3 fotos) */
        <section className="relative h-[60vh] sm:h-[70vh] min-h-[420px] sm:min-h-[500px] w-full overflow-hidden">
          <Image
            src={tour.cover_image}
            alt={title}
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
              {title}
            </h1>
            {tour.subtitle && (
              <p className="mt-3 sm:mt-4 text-base sm:text-xl text-white/70 max-w-2xl">
                {t(tour.subtitle, lc)}
              </p>
            )}

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
      )}

      {/* Main content + sticky booking */}
      <section
        className={`max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10 lg:gap-12 ${
          mosaic ? "pt-6 md:pt-8 pb-10 md:pb-12" : "py-10 md:py-12"
        }`}
      >
        <div className="lg:col-span-2 space-y-10 min-w-0">
          {/* En modo mosaico el título va en la columna izquierda, así la reserva arranca a su altura */}
          {mosaic && titleBlock}
          {quickFacts}

          {/* Galería en el contenido solo en modo hero (en mosaico ya está arriba) */}
          {!mosaic && tour.gallery.length > 0 && <TourGallery images={images} />}

          <TourTabs tabs={tabs} />

          {/* Reviews — solo si hay reseñas reales (number coincide con schema) */}
          {reviewStats.count > 0 && (
            <TourReviews
              reviews={reviews}
              avgRating={reviewStats.avg}
              total={reviewStats.count}
              en={en}
            />
          )}

          {/* Formulario de reseña de primera mano — siempre visible, para
              recolectar reseñas reales que (tras moderar) generan estrellas. */}
          <ReviewForm tourId={tour.id} lc={lc} />
        </div>

        {/* Sticky booking sidebar */}
        <aside id="reservar" className="lg:sticky lg:top-28 lg:self-start scroll-mt-24 space-y-5">
          <BookingWidget
            tourId={tour.id}
            tourSlug={tour.slug}
            tourTitle={title}
            durationLabel={t(tour.duration_label, lc)}
            priceUsd={finalPrice}
            originalPrice={tour.discount_pct > 0 ? tour.price_usd : null}
            maxGroupSize={tour.max_group_size}
            availability={availability}
            whatsapp={normalizeWhatsApp(settings.whatsapp)}
            locale={lc}
          />
          <FeaturedReview review={reviews[0] ?? null} locale={lc} />
          <ExpertCard whatsapp={normalizeWhatsApp(settings.whatsapp)} tourTitle={title} locale={lc} />
        </aside>
      </section>

      {tour.route_map_url && <TourRouteMap url={tour.route_map_url} title={title} locale={lc} />}

      {/* Related */}
      {related.length > 0 && <RelatedTours tours={related} en={en} />}

      <CertificationsStrip locale={lc} />

      <MobileBookingBar priceUsd={finalPrice} locale={lc} />
      {/* Espacio para que la barra fija no tape el final de la página en móvil */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}

function TabList({ heading, items, icon }: { heading: string; items: string[]; icon: React.ReactNode }) {
  return (
    <>
      <h2 className="font-display text-2xl sm:text-3xl text-night mb-6">{heading}</h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-night/80">
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Divider() {
  return <span className="hidden sm:inline-block w-px h-4 bg-white/20" />;
}
