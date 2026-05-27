import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsers() {
  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl text-night mb-2">Usuarios</h1>
      <p className="text-night/60 mb-8">
        Cuentas registradas. {profiles?.length ?? 0} en total.
      </p>

      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone">
            <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Nombre</th>
              <th className="px-6 py-3 font-medium">Teléfono</th>
              <th className="px-6 py-3 font-medium">Idioma</th>
              <th className="px-6 py-3 font-medium">Admin</th>
              <th className="px-6 py-3 font-medium">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p) => (
              <tr key={p.id} className="border-t border-night/5">
                <td className="px-6 py-3 text-night">{p.full_name || "—"}</td>
                <td className="px-6 py-3 text-night/70">{p.phone || "—"}</td>
                <td className="px-6 py-3 text-night/70 uppercase text-xs">
                  {p.locale}
                </td>
                <td className="px-6 py-3">
                  {p.is_admin ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gold/15 text-gold font-medium">
                      ADMIN
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-6 py-3 text-night/60">
                  {new Date(p.created_at).toLocaleDateString("es-PE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
