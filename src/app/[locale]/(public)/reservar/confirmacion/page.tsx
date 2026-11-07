import { createAdminClient } from "@/lib/supabase/admin";
import { L, toLocale } from "@/lib/i18n/pick";
import { CheckCircle2, Calendar, Users, Mail, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { t, type Locale } from "@/types/database";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}

export const metadata = {
  title: "Reserva confirmada",
  robots: { index: false },
};

export default async function ConfirmacionPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lc: Locale = toLocale(locale);
  const { code } = await searchParams;

  if (!code) {
    return (
      <div className="pt-32 min-h-screen grid place-items-center">
        <p className="text-night/60">
          {L(lc, { es: "Código de reserva inválido.", en: "Invalid booking code.", ja: "予約コードが無効です。" })}
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, tour:tours(slug, title, cover_image)")
    .eq("booking_code", code)
    .maybeSingle();

  if (!booking) {
    return (
      <div className="pt-32 min-h-screen grid place-items-center">
        <p className="text-night/60">
          {L(lc, { es: "No encontramos esa reserva.", en: "We couldn't find that booking.", ja: "予約が見つかりませんでした。" })}
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-stone min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="font-display text-5xl text-night">
            {L(lc, { es: "¡Reserva creada!", en: "Booking created!", ja: "予約を受け付けました！" })}
          </h1>
          <p className="mt-3 text-night/60">
            {lc === "ja" ? (
              <>
                詳細を{" "}
                <span className="text-night font-medium">
                  {booking.customer_email}
                </span>
                {" "}にお送りしました。数時間以内にお支払い方法のメールが届きます。
              </>
            ) : lc === "en" ? (
              <>
                We sent the details to{" "}
                <span className="text-night font-medium">
                  {booking.customer_email}
                </span>
                . In the next few hours you'll receive an email with payment
                instructions.
              </>
            ) : (
              <>
                Te enviamos los detalles a{" "}
                <span className="text-night font-medium">
                  {booking.customer_email}
                </span>
                . En las próximas horas recibirás un email con las instrucciones
                de pago.
              </>
            )}
          </p>
        </div>

        <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
          <div className="bg-night text-white px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-60">
                {L(lc, { es: "Código de reserva", en: "Booking code", ja: "予約コード" })}
              </div>
              <div className="font-mono text-2xl font-bold">{booking.booking_code}</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-medium">
              {booking.status}
            </span>
          </div>

          <div className="p-6 space-y-5">
            <Row
              icon={<Calendar className="w-4 h-4 text-gold" />}
              label="Tour"
              value={booking.tour ? t(booking.tour.title, lc) : "—"}
            />
            <Row
              icon={<Calendar className="w-4 h-4 text-gold" />}
              label={L(lc, { es: "Fecha de salida", en: "Departure date", ja: "出発日" })}
              value={new Date(booking.travel_date + "T00:00:00").toLocaleDateString(
                L(lc, { es: "es-PE", en: "en-US", ja: "ja-JP" }),
                {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                }
              )}
            />
            <Row
              icon={<Users className="w-4 h-4 text-gold" />}
              label={L(lc, { es: "Viajeros", en: "Travelers", ja: "人数" })}
              value={`${booking.travelers} ${
                lc === "ja"
                  ? "名"
                  : lc === "en"
                  ? booking.travelers === 1
                    ? "person"
                    : "people"
                  : booking.travelers === 1
                  ? "persona"
                  : "personas"
              }`}
            />
            <Row
              icon={<Mail className="w-4 h-4 text-gold" />}
              label={L(lc, { es: "Contacto", en: "Contact", ja: "お問い合わせ" })}
              value={booking.customer_email}
            />

            <div className="pt-4 border-t border-night/8 flex items-baseline justify-between">
              <span className="text-night/70">
                {L(lc, { es: "Total a pagar", en: "Total to pay", ja: "お支払い合計" })}
              </span>
              <span className="font-display text-3xl text-night font-bold">
                {booking.currency} {Number(booking.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button className="flex items-center gap-2 bg-white border border-night/10 hover:border-gold text-night px-5 py-2.5 rounded-full text-sm transition shadow-soft">
            <Download className="w-4 h-4" />
            {L(lc, { es: "Descargar PDF", en: "Download PDF", ja: "PDFをダウンロード" })}
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-gold hover:bg-gold-bright text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
          >
            {L(lc, { es: "Volver al sitio", en: "Back to site", ja: "サイトに戻る" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-night/50">{label}</div>
        <div className="text-night font-medium">{value}</div>
      </div>
    </div>
  );
}
