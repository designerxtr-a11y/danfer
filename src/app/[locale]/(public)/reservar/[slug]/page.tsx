import { notFound } from "next/navigation";
import { getTourBySlug } from "@/lib/queries/tours";
import { t } from "@/types/database";
import { CheckoutForm } from "./checkout-form";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Shield, Zap, RotateCcw } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; travelers?: string }>;
}

export const metadata = {
  title: "Reservar tu tour",
  robots: { index: false },
};

export default async function ReservarPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { date, travelers } = await searchParams;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const initialTravelers = travelers ? parseInt(travelers) : 2;
  const initialDate = date ?? new Date().toISOString().slice(0, 10);
  const finalPrice =
    tour.discount_pct > 0
      ? tour.price_usd * (1 - tour.discount_pct / 100)
      : tour.price_usd;

  return (
    <div className="pt-28 pb-24 bg-stone min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href={`/tours/${tour.slug}`}
          className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al tour
        </Link>

        <h1 className="font-display text-4xl md:text-5xl text-night mb-2">
          Confirma tu reserva
        </h1>
        <p className="text-night/60 mb-10">
          Estás a un paso de vivir una experiencia inolvidable.
        </p>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <CheckoutForm
            tourId={tour.id}
            tourTitle={t(tour.title)}
            tourSlug={tour.slug}
            priceUsd={finalPrice}
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
                  alt={t(tour.title)}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-night">
                  {t(tour.title)}
                </h3>
                <p className="text-sm text-night/60 mt-1">
                  {t(tour.duration_label)} · {tour.max_group_size} máx
                </p>

                <div className="mt-6 pt-6 border-t border-night/8 space-y-2 text-sm text-night/70">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold" />
                    Pago 100% seguro (SSL)
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold" />
                    Confirmación inmediata
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-gold" />
                    Cancela gratis hasta 7 días antes
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
