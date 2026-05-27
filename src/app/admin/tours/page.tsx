import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil, Star } from "lucide-react";
import { t } from "@/types/database";
import { ToursTableActions } from "./table-actions";

export default async function AdminToursList() {
  const supabase = createAdminClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*, category:categories(name)")
    .order("is_featured", { ascending: false })
    .order("bookings_count", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-night">Tours</h1>
          <p className="mt-1 text-night/60">
            {tours?.length ?? 0} tours en total. Edita, publica o crea nuevos.
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 bg-night hover:bg-gold text-white px-5 py-2.5 rounded-full font-medium transition shadow-soft"
        >
          <Plus className="w-4 h-4" />
          Nuevo tour
        </Link>
      </div>

      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone">
            <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Tour</th>
              <th className="px-6 py-3 font-medium">Categoría</th>
              <th className="px-6 py-3 font-medium">Precio</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Reservas</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {tours?.map((tour) => (
              <tr key={tour.id} className="border-t border-night/5 hover:bg-stone/40">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone shrink-0">
                      {tour.cover_image && (
                        <Image
                          src={tour.cover_image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-night">{t(tour.title)}</div>
                      <div className="text-xs text-night/50 font-mono">
                        /{tour.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-night/70">
                  {tour.category ? t(tour.category.name) : "—"}
                </td>
                <td className="px-6 py-3 text-night font-medium">
                  US${tour.price_usd}
                </td>
                <td className="px-6 py-3 text-night/70">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    {Number(tour.rating).toFixed(1)} ({tour.reviews_count})
                  </span>
                </td>
                <td className="px-6 py-3 text-night/70">{tour.bookings_count}</td>
                <td className="px-6 py-3">
                  <ToursTableActions
                    id={tour.id}
                    isPublished={tour.is_published}
                    isFeatured={tour.is_featured}
                    title={t(tour.title)}
                  />
                </td>
                <td className="px-6 py-3 text-right">
                  <Link
                    href={`/admin/tours/${tour.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-gold hover:underline"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
