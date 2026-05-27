import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { TourForm, type TourFormInitial } from "../../_tour-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: tour }, { data: categories }] = await Promise.all([
    supabase.from("tours").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id,name").order("sort_order"),
  ]);

  if (!tour) notFound();

  return (
    <div>
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-4 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Tours
      </Link>
      <h1 className="font-display text-4xl text-night mb-2">
        Editar tour
      </h1>
      <p className="text-night/60 mb-8 font-mono text-sm">/{tour.slug}</p>
      <TourForm
        initial={tour as TourFormInitial}
        categories={(categories ?? []) as { id: string; name: { es: string; en?: string } }[]}
      />
    </div>
  );
}
