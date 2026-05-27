import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSettings() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .order("key");

  return (
    <div>
      <h1 className="font-display text-4xl text-night mb-2">Ajustes</h1>
      <p className="text-night/60 mb-8">
        Configuración general del sitio (próximamente con editor inline).
      </p>

      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone">
            <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Clave</th>
              <th className="px-6 py-3 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {settings?.map((s) => (
              <tr key={s.key} className="border-t border-night/5">
                <td className="px-6 py-3 font-mono text-night/70">{s.key}</td>
                <td className="px-6 py-3 text-night">
                  <code className="text-xs bg-stone px-2 py-1 rounded">
                    {JSON.stringify(s.value)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
