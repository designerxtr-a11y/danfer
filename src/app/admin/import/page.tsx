import { createAdminClient } from "@/lib/supabase/admin";
import { ImportClient } from "./import-client";

export default async function AdminImportPage() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: tours }] = await Promise.all([
    supabase.from("categories").select("id,name,slug").order("sort_order"),
    supabase.from("tours").select("id,slug,title").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl text-night">Importar contenido</h1>
      <p className="mt-1 mb-8 text-night/60">
        Trae tours y reseñas desde otros sitios web. Soporta:{" "}
        <span className="text-night/80">conde.travel · machupicchubuspackers · boletomachupicchu · supervallesagrado · intupacusco · tripadvisor</span>{" "}
        + sitios genéricos con Schema.org.
      </p>

      <ImportClient
        categories={(categories ?? []).map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name as { es: string; en?: string },
        }))}
        tours={(tours ?? []).map((t) => ({
          id: t.id,
          slug: t.slug,
          title: (t.title as { es: string; en?: string }).es,
        }))}
      />
    </div>
  );
}
