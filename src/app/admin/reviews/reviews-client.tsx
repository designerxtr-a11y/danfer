"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, Eye, EyeOff, Loader2, Upload } from "lucide-react";
import {
  bulkImportReviews,
  addReview,
  setReviewPublished,
  deleteReview,
} from "./actions";

type Tour = { id: string; slug: string; title: string };
type Review = {
  id: string;
  author_name: string;
  author_country: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_published: boolean;
  created_at: string;
  tourSlug: string;
  tourTitle: string;
};

const PLACEHOLDER = `# Una reseña por línea:  tour_slug | rating(1-5) | nombre | país | YYYY-MM-DD | texto
machu-picchu-full-day | 5 | María González | España | 2026-03-12 | Tour increíble, el guía sabía muchísimo y el tren panorámico fue espectacular.
camino-inca-clasico-4d-3n | 5 | John Smith | USA | 2026-02-28 | Best trek of my life. Porters and food were amazing.`;

export function ReviewsClient({
  tours,
  reviews,
}: {
  tours: Tour[];
  reviews: Review[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Bulk import
  const [bulkText, setBulkText] = useState("");
  const [bulkResult, setBulkResult] = useState<{
    ok: boolean;
    inserted?: number;
    errors?: string[];
    error?: string;
  } | null>(null);

  // Single add
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  function runBulk() {
    setBulkResult(null);
    startTransition(async () => {
      const res = await bulkImportReviews(bulkText);
      setBulkResult(res);
      if (res.ok) {
        setBulkText("");
        router.refresh();
      }
    });
  }

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFormMsg(null);
    startTransition(async () => {
      const res = await addReview(fd);
      if (res.ok) {
        setFormMsg({ ok: true, text: "Reseña agregada." });
        form.reset();
        router.refresh();
      } else {
        setFormMsg({ ok: false, text: res.error ?? "Error" });
      }
    });
  }

  function togglePublish(r: Review) {
    startTransition(async () => {
      await setReviewPublished(r.id, !r.is_published);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    startTransition(async () => {
      await deleteReview(id);
      router.refresh();
    });
  }

  const slugList = tours.map((t) => t.slug).join(" · ");

  return (
    <div className="space-y-10">
      {/* ---- Importación en lote ---- */}
      <section className="bg-white border border-night/8 rounded-3xl p-6 shadow-soft">
        <h2 className="font-display text-2xl text-night flex items-center gap-2">
          <Upload className="w-5 h-5 text-gold" /> Importar en lote
        </h2>
        <p className="mt-1 text-sm text-night/60">
          Pega tus reseñas (una por línea). Formato:{" "}
          <code className="bg-stone px-1.5 py-0.5 rounded text-xs">
            tour_slug | rating | nombre | país | YYYY-MM-DD | texto
          </code>
        </p>
        <p className="mt-2 text-xs text-night/50">
          <strong>Slugs disponibles:</strong> {slugList || "(no hay tours)"}
        </p>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={8}
          placeholder={PLACEHOLDER}
          className="mt-3 w-full font-mono text-xs bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={runBulk}
            disabled={pending || !bulkText.trim()}
            className="bg-night hover:bg-gold text-white font-semibold px-5 py-2.5 rounded-full transition flex items-center gap-2 disabled:opacity-50"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Importar reseñas
          </button>
        </div>
        {bulkResult && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              bulkResult.ok
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {bulkResult.ok
              ? `✓ ${bulkResult.inserted} reseña(s) importada(s).`
              : `Error: ${bulkResult.error}`}
            {bulkResult.errors && bulkResult.errors.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-xs text-rose-600">
                {bulkResult.errors.map((er, i) => (
                  <li key={i}>{er}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* ---- Alta individual ---- */}
      <section className="bg-white border border-night/8 rounded-3xl p-6 shadow-soft">
        <h2 className="font-display text-2xl text-night flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" /> Agregar una reseña
        </h2>
        <form onSubmit={onAdd} className="mt-4 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Tour
            </span>
            <select
              name="tour_id"
              required
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            >
              <option value="">Selecciona…</option>
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Rating
            </span>
            <select
              name="rating"
              defaultValue="5"
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Nombre
            </span>
            <input
              name="author_name"
              required
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              País
            </span>
            <input
              name="author_country"
              placeholder="Opcional"
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Reseña
            </span>
            <textarea
              name="body"
              rows={3}
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Fecha
            </span>
            <input
              type="date"
              name="date"
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={pending}
              className="bg-night hover:bg-gold text-white font-semibold px-5 py-2.5 rounded-full transition flex items-center gap-2 disabled:opacity-50"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              Agregar
            </button>
          </div>
        </form>
        {formMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${
              formMsg.ok
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {formMsg.text}
          </div>
        )}
      </section>

      {/* ---- Listado ---- */}
      <section>
        <h2 className="font-display text-2xl text-night mb-4">
          Reseñas cargadas ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-night/50 text-sm">
            Aún no hay reseñas. Importa o agrega las primeras arriba.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`bg-white border rounded-2xl p-4 flex items-start gap-4 ${
                  r.is_published ? "border-night/8" : "border-dashed border-night/20 opacity-60"
                }`}
              >
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? "fill-gold text-gold" : "text-night/15"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-night">
                    {r.author_name}
                    {r.author_country && (
                      <span className="text-night/40 font-normal">
                        {" "}
                        · {r.author_country}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gold/80 uppercase tracking-wider">
                    {r.tourTitle} · {new Date(r.created_at).toLocaleDateString("es-PE")}
                  </div>
                  {r.body && (
                    <p className="mt-1 text-sm text-night/70 line-clamp-2">
                      {r.body}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublish(r)}
                    disabled={pending}
                    title={r.is_published ? "Ocultar" : "Publicar"}
                    className="p-2 rounded-lg hover:bg-stone text-night/50 hover:text-night transition"
                  >
                    {r.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    disabled={pending}
                    title="Eliminar"
                    className="p-2 rounded-lg hover:bg-rose-50 text-night/50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
