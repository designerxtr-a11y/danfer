import { notFound } from "next/navigation";
import { L, toLocale } from "@/lib/i18n/pick";
import { getTourBySlug } from "@/lib/queries/tours";
import { t, type Locale } from "@/types/database";
import { CheckoutForm } from "./checkout-form";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Shield, Zap, RotateCcw } from "lucide-react";
import { buildAlternates } from "@/lib/seo/alternates";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ date?: string; travelers?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<import("next").Metadata> {
  const { slug, locale } = await params;
  const lc: Locale = toLocale(locale);
  return {
    title: L(lc, { es: "Reservar tu tour", en: "Book your tour", ja: "ツアーを予約する" }),
    robots: { index: false },
    alternates: buildAlternates(`/reservar/${slug}`, lc, { jaAvailable: true }),
  };
}

export default async function ReservarPage({ params, searchParams }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const lc: Locale = toLocale(locale);
  const { date, travelers } = await searchParams;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const initialTravelers = travelers ? parseInt(travelers) : 2;
  const initialDate = date ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="pt-28 pb-24 bg-stone min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href={`/tours/${tour.slug}`}
          className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          {L(lc, { es: "Volver al tour", en: "Back to tour", ja: "ツアーに戻る" })}
        </Link>

        <h1 className="font-display text-4xl md:text-5xl text-night mb-2">
          {L(lc, { es: "Solicita tu reserva", en: "Request your tour", ja: "ツアーをリクエスト" })}
        </h1>
        <p className="text-night/60 mb-10">
          {L(lc, { es: "Envía tu solicitud y un asesor te contactará con el precio y la disponibilidad.", en: "Send your request and an advisor will get back to you with the price and availability.", ja: "リクエストを送信すると、担当者が料金と空き状況をご連絡します。" })}
        </p>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <CheckoutForm
            tourId={tour.id}
            tourTitle={t(tour.title, lc)}
            tourSlug={tour.slug}
            initialDate={initialDate}
            initialTravelers={initialTravelers}
            maxGroupSize={tour.max_group_size}
          />

          {/* Summary sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={tour.cover_image}
                  alt={t(tour.title, lc)}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-night">
                  {t(tour.title, lc)}
                </h3>
                <p className="text-sm text-night/60 mt-1">
                  {t(tour.duration_label, lc)} · {tour.max_group_size}{" "}
                  {L(lc, { es: "máx", en: "max", ja: "最大" })}
                </p>

                <div className="mt-6 pt-6 border-t border-night/8 space-y-2 text-sm text-night/70">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold" />
                    {L(lc, { es: "Sin pago por adelantado", en: "No upfront payment", ja: "前払い不要" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold" />
                    {L(lc, { es: "Respuesta rápida por WhatsApp/email", en: "Fast reply via WhatsApp/email", ja: "WhatsApp・メールで迅速に返信" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-gold" />
                    {L(lc, { es: "Cancela gratis hasta 7 días antes", en: "Free cancellation up to 7 days before", ja: "7日前まで無料キャンセル" })}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
