import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSpamInquiry } from "@/lib/spam";

export default async function AdminInquiries({
  searchParams,
}: {
  searchParams: Promise<{ spam?: string }>;
}) {
  const { spam } = await searchParams;
  const showSpam = spam === "1";
  const supabase = createAdminClient();
  const { data: all } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  const spamCount = (all ?? []).filter(isSpamInquiry).length;
  const data = (all ?? []).filter((i) => isSpamInquiry(i) === showSpam);

  return (
    <div>
      <h1 className="font-display text-4xl text-night mb-2">Consultas</h1>
      <p className="text-night/60 mb-8">
        {showSpam ? "Spam detectado automáticamente (no se borra)." : "Mensajes desde el formulario de contacto del sitio."}{" "}
        {spamCount > 0 && (
          <Link href={showSpam ? "/admin/inquiries" : "/admin/inquiries?spam=1"} className="underline hover:text-gold">
            {showSpam ? "Volver a las consultas" : `Ver spam oculto (${spamCount})`}
          </Link>
        )}
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
                  <td className="px-6 py-3 text-night/70 max-w-md">
                    <details>
                      <summary className="cursor-pointer truncate">{i.message}</summary>
                      <p className="mt-2 whitespace-pre-wrap text-night">{i.message}</p>
                      {i.phone && <p className="mt-1 text-xs text-night/50">Tel: {i.phone}</p>}
                    </details>
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
