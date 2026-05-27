import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminInquiries() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-4xl text-night mb-2">Consultas</h1>
      <p className="text-night/60 mb-8">
        Mensajes desde el formulario de contacto del sitio.
      </p>

      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        {!data || data.length === 0 ? (
          <div className="py-16 text-center text-night/40">
            Sin consultas todavía.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone">
              <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Mensaje</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.map((i) => (
                <tr key={i.id} className="border-t border-night/5">
                  <td className="px-6 py-3 text-night">{i.name}</td>
                  <td className="px-6 py-3 text-night/70">{i.email}</td>
                  <td className="px-6 py-3 text-night/70 max-w-md truncate">
                    {i.message}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">
                      {i.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-night/60">
                    {new Date(i.created_at).toLocaleDateString("es-PE")}
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
