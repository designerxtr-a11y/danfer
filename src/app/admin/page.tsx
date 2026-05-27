import { createAdminClient } from "@/lib/supabase/admin";
import { Map, Calendar, DollarSign, Users, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { t } from "@/types/database";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    { count: toursCount },
    { count: bookingsCount },
    { count: reviewsCount },
    { count: inquiriesCount },
    { data: recentBookings },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("tours").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("bookings")
      .select("*, tour:tours(title)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("bookings")
      .select("total_amount,payment_status")
      .eq("payment_status", "paid"),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, b) => sum + Number(b.total_amount), 0) ?? 0;

  const stats = [
    {
      label: "Tours activos",
      value: toursCount ?? 0,
      icon: Map,
      color: "from-gold to-terracotta",
      href: "/admin/tours",
    },
    {
      label: "Reservas totales",
      value: bookingsCount ?? 0,
      icon: Calendar,
      color: "from-turquoise to-turquoise-deep",
      href: "/admin/bookings",
    },
    {
      label: "Ingresos pagados",
      value: `US$ ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-700",
      href: "/admin/bookings",
    },
    {
      label: "Consultas nuevas",
      value: inquiriesCount ?? 0,
      icon: Users,
      color: "from-rose-500 to-rose-700",
      href: "/admin/inquiries",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-night">Dashboard</h1>
        <p className="mt-1 text-night/60">
          Resumen general de la operación.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-night/8 rounded-2xl p-6 hover:shadow-card transition group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center mb-4`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-display text-3xl text-night font-bold">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-night/60 group-hover:text-gold transition">
                {s.label} →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-night/8 flex items-center justify-between">
          <h2 className="font-display text-xl text-night flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            Reservas recientes
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-gold hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {!recentBookings || recentBookings.length === 0 ? (
          <div className="px-6 py-12 text-center text-night/40">
            Aún no hay reservas.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Código</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Tour</th>
                <th className="px-6 py-3 font-medium">Fecha viaje</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-t border-night/5 hover:bg-stone/50">
                  <td className="px-6 py-3 font-mono text-night/70">
                    {b.booking_code}
                  </td>
                  <td className="px-6 py-3 text-night">{b.customer_name}</td>
                  <td className="px-6 py-3 text-night/70">
                    {b.tour ? t(b.tour.title) : "—"}
                  </td>
                  <td className="px-6 py-3 text-night/70">
                    {new Date(b.travel_date).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-6 py-3 font-medium text-night">
                    US${Number(b.total_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
    completed: "bg-blue-100 text-blue-800",
    refunded: "bg-night/10 text-night/70",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] ?? "bg-night/10 text-night/70"
      }`}
    >
      {status}
    </span>
  );
}
