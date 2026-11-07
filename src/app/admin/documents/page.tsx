import { createAdminClient } from "@/lib/supabase/admin";
import { QUOTES } from "@/app/[locale]/(public)/quote/[token]/quotes-data";

// Signed URLs expire, so always render fresh.
export const dynamic = "force-dynamic";

const BUCKET = "client-documents";
const URL_TTL = 60 * 60; // 1h

type Doc = { name: string; createdAt: string; url: string | null; isPdf: boolean; traveler: string | null };

export default async function AdminDocuments() {
  const supabase = createAdminClient();
  const { data: folders } = await supabase.storage.from(BUCKET).list("", { limit: 200 });

  const groups = await Promise.all(
    (folders ?? []).map(async (folder) => {
      const { data: files } = await supabase.storage
        .from(BUCKET)
        .list(folder.name, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      const real = (files ?? []).filter((f) => f.id); // skip placeholders
      const paths = real.map((f) => `${folder.name}/${f.name}`);
      const { data: signed } = paths.length
        ? await supabase.storage.from(BUCKET).createSignedUrls(paths, URL_TTL)
        : { data: [] };

      const docs: Doc[] = real.map((f, i) => ({
        name: f.name,
        createdAt: f.created_at ?? "",
        url: signed?.[i]?.signedUrl ?? null,
        isPdf: f.name.toLowerCase().endsWith(".pdf"),
        traveler: f.name.match(/^traveler-(\d+)-/)?.[1] ?? null,
      }));
      const latest = docs[0]?.createdAt ?? "";
      return { token: folder.name, quote: QUOTES[folder.name], docs, latest };
    }),
  );

  const visible = groups
    .filter((g) => g.docs.length > 0)
    .sort((a, b) => b.latest.localeCompare(a.latest));

  return (
    <div>
      <h1 className="font-display text-4xl text-night mb-2">Pasaportes</h1>
      <p className="text-night/60 mb-8">
        Fotos que los clientes subieron desde su página de cotización. Los enlaces duran 1 hora.
      </p>

      {visible.length === 0 ? (
        <div className="bg-white border border-night/8 rounded-2xl py-16 text-center text-night/40">
          Ningún cliente ha subido fotos todavía.
        </div>
      ) : (
        <div className="space-y-6">
          {visible.map((g) => (
            <section key={g.token} id={g.token} className="bg-white border border-night/8 rounded-2xl p-6 scroll-mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-night">
                    {g.quote
                      ? `${g.quote.clientName} · ${g.quote.destination}`
                      : g.token.startsWith("mp2027-")
                        ? `Machu Picchu 2027 · ${g.token.slice(7)}`
                        : g.token}
                  </h2>
                  <p className="text-sm text-night/50">
                    {g.quote ? `${g.quote.dates} · ${g.quote.travelers} pasajeros · ` : ""}
                    {g.token.startsWith("mp2027-") ? (
                      <a href="/admin/bookings" className="underline">
                        Ver en Reservas
                      </a>
                    ) : (
                      <a href={`/en/quote/${g.token}`} target="_blank" className="underline">
                        /quote/{g.token}
                      </a>
                    )}
                  </p>
                </div>
                <span className="text-sm text-night/60">
                  {g.docs.length} {g.docs.length === 1 ? "archivo" : "archivos"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {g.docs.map((d) => (
                  <a
                    key={d.name}
                    href={d.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="group block rounded-xl border border-night/10 overflow-hidden hover:border-night/30"
                  >
                    <div className="aspect-[4/3] bg-stone flex items-center justify-center">
                      {d.url && !d.isPdf ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.url} alt={d.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-night/50">PDF</span>
                      )}
                    </div>
                    <div className="px-3 py-2 text-xs text-night/60">
                      <span className="font-medium text-night">
                        {d.traveler ? `Pasajero ${d.traveler}` : "Archivo"}
                      </span>
                      {" · "}
                      {new Date(d.createdAt).toLocaleString("es-PE", { timeZone: "America/Lima" })}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
