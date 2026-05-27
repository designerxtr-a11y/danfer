import { createAdminClient } from "@/lib/supabase/admin";
import { t } from "@/types/database";
import { BookingsTable } from "./table";

export default async function AdminBookings() {
  const supabase = createAdminClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, tour:tours(slug,title)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-night">Reservas</h1>
        <p className="mt-1 text-night/60">
          {bookings?.length ?? 0} reservas recientes (últimas 100).
        </p>
      </div>

      <BookingsTable
        bookings={(bookings ?? []).map((b) => ({
          ...b,
          tourTitle: b.tour ? t(b.tour.title) : "—",
        }))}
      />
    </div>
  );
}
