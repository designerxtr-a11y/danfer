import { createAdminClient } from "@/lib/supabase/admin";
import { TourForm } from "../_tour-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewTourPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("sort_order");

  return (
    <div>
      <Link
        href="/admin/tours"
        className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-4 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Tours
      </Link>
      <h1 className="font-display text-4xl text-night mb-8">Nuevo tour</h1>
      <TourForm categories={(categories ?? []) as { id: string; name: { es: string; en?: string } }[]} />
    </div>
  );
}
