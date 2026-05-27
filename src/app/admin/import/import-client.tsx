"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link2, FileCode, Star, CheckCircle2, Image as ImageIcon, Plus, X } from "lucide-react";
import { scrape, saveScrapedTour, saveScrapedReviews } from "./actions";
import type { ScrapedTour, ScrapedReview } from "@/lib/scrapers";

interface Props {
  categories: { id: string; slug: string; name: { es: string; en?: string } }[];
  tours: { id: string; slug: string; title: string }[];
}

export function ImportClient({ categories, tours }: Props) {
  const [tab, setTab] = useState<"tour" | "reviews">("tour");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <TabBtn active={tab === "tour"} onClick={() => setTab("tour")}>
          <Link2 className="w-4 h-4" />
          Importar tour
        </TabBtn>
        <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")}>
          <Star className="w-4 h-4" />
          Importar reseñas (TripAdvisor)
        </TabBtn>
      </div>

      {tab === "tour" ? <TourImporter categories={categories} /> : <ReviewsImporter tours={tours} />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition ${
        active
          ? "bg-night text-white"
          : "bg-white border border-night/10 text-night/70 hover:border-night/30"
      }`}
    >
      {children}
    </button>
  );
}

// =====================================================
// TOUR IMPORTER
// =====================================================
function TourImporter({
  categories,
}: {
  categories: Props["categories"];
}) {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [adapter, setAdapter] = useState<string | null>(null);
  const [tour, setTour] = useState<ScrapedTour | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [downloadImgs, setDownloadImgs] = useState(true);
  const [saved, setSaved] = useState<{ id?: string } | null>(null);

  function onScrape() {
    setError(null);
    setSaved(null);
    startTransition(async () => {
      const r = await scrape({ url, html: showHtml ? html : undefined, mode: "tour" });
      if (!r.ok) {
        setError(r.error ?? "Error desconocido");
        return;
      }
      setAdapter(r.adapter ?? null);
      setTour(r.tour ?? null);
    });
  }

  function onSave() {
    if (!tour) return;
    startTransition(async () => {
      const r = await saveScrapedTour({
        ...tour,
        category_id: categoryId || null,
        downloadImages: downloadImgs,
      });
      if (!r.ok) {
        setError(r.error ?? "Error guardando");
        return;
      }
      setSaved({ id: r.id });
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <FieldRow label="URL del tour">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.conde.travel/tour/..."
            className="flex-1 bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
          />
          <button
            onClick={onScrape}
            disabled={pending || !url}
            className="flex items-center gap-2 bg-night hover:bg-gold text-white px-5 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Extraer
          </button>
        </FieldRow>

        <button
          onClick={() => setShowHtml((v) => !v)}
          className="text-sm text-gold hover:underline mt-2 flex items-center gap-1.5"
        >
          <FileCode className="w-3.5 h-3.5" />
          {showHtml ? "Ocultar pegar HTML" : "¿Bloqueado? Pega HTML manual"}
        </button>

        {showHtml && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={6}
            placeholder="En la página del tour: Ctrl+U → Ctrl+A → Ctrl+C → pega aquí."
            className="mt-3 w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-gold"
          />
        )}

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}
      </Card>

      <AnimatePresence>
        {tour && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-night">Vista previa</h2>
                <span className="text-xs uppercase tracking-widest text-gold">
                  Parser: {adapter}
                </span>
              </div>

              <Grid>
                <Field label="Slug">
                  <Input
                    value={tour.slug}
                    onChange={(v) => setTour({ ...tour, slug: v })}
                  />
                </Field>
                <Field label="Categoría">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
                  >
                    <option value="">— Sin categoría —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.es}
                      </option>
                    ))}
                  </select>
                </Field>
              </Grid>

              <Field label="Título">
                <Input
                  value={tour.title}
                  onChange={(v) => setTour({ ...tour, title: v })}
                />
              </Field>

              <Field label="Descripción corta">
                <Input
                  value={tour.short_desc ?? ""}
                  onChange={(v) => setTour({ ...tour, short_desc: v })}
                />
              </Field>

              <Field label="Descripción completa">
                <textarea
                  value={tour.description ?? ""}
                  onChange={(e) => setTour({ ...tour, description: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
                />
              </Field>

              <Grid cols={4}>
                <Field label="Días">
                  <Input
                    type="number"
                    value={String(tour.duration_days ?? "")}
                    onChange={(v) => setTour({ ...tour, duration_days: v ? Number(v) : undefined })}
                  />
                </Field>
                <Field label="Duración">
                  <Input
                    value={tour.duration_label ?? ""}
                    onChange={(v) => setTour({ ...tour, duration_label: v })}
                  />
                </Field>
                <Field label="Precio USD">
                  <Input
                    type="number"
                    value={String(tour.price_usd ?? "")}
                    onChange={(v) => setTour({ ...tour, price_usd: v ? Number(v) : undefined })}
                  />
                </Field>
                <Field label="Grupo máx">
                  <Input
                    type="number"
                    value={String(tour.max_group_size ?? "")}
                    onChange={(v) => setTour({ ...tour, max_group_size: v ? Number(v) : undefined })}
                  />
                </Field>
              </Grid>

              <ListEditor
                label={`Highlights (${tour.highlights.length})`}
                items={tour.highlights}
                onChange={(items) => setTour({ ...tour, highlights: items })}
              />
              <ListEditor
                label={`Incluye (${tour.includes.length})`}
                items={tour.includes}
                onChange={(items) => setTour({ ...tour, includes: items })}
              />
              <ListEditor
                label={`No incluye (${tour.excludes.length})`}
                items={tour.excludes}
                onChange={(items) => setTour({ ...tour, excludes: items })}
              />

              {/* Itinerary preview */}
              {tour.itinerary.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-night/50 mb-2">
                    Itinerario ({tour.itinerary.length} días)
                  </div>
                  <div className="space-y-2">
                    {tour.itinerary.map((d, i) => (
                      <div key={i} className="bg-stone rounded-xl p-3 text-sm">
                        <strong className="text-night">Día {d.day_number}:</strong>{" "}
                        <span className="text-night/80">{d.title}</span>
                        {d.description && (
                          <p className="text-xs text-night/60 mt-1 line-clamp-2">
                            {d.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images preview */}
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wider text-night/50 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Imágenes ({1 + tour.gallery.length})
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {tour.cover_image && (
                    <img
                      src={tour.cover_image}
                      alt=""
                      className="w-32 h-24 object-cover rounded-lg border-2 border-gold shrink-0"
                    />
                  )}
                  {tour.gallery.slice(0, 8).map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="w-32 h-24 object-cover rounded-lg shrink-0"
                    />
                  ))}
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={downloadImgs}
                  onChange={(e) => setDownloadImgs(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-night/80">
                  Descargar imágenes a Supabase Storage (recomendado — sino los
                  links externos pueden romperse)
                </span>
              </label>
            </Card>

            {saved ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                Tour guardado como <strong>borrador</strong>. Edítalo y publícalo en{" "}
                <a href="/admin/tours" className="underline">/admin/tours</a>.
              </div>
            ) : (
              <button
                onClick={onSave}
                disabled={pending}
                className="flex items-center gap-2 bg-gold hover:bg-gold-bright text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
              >
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar tour
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =====================================================
// REVIEWS IMPORTER (TripAdvisor)
// =====================================================
function ReviewsImporter({ tours }: { tours: Props["tours"] }) {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [tourId, setTourId] = useState("");
  const [reviews, setReviews] = useState<ScrapedReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  function onScrape() {
    setError(null);
    setSaved(null);
    startTransition(async () => {
      const r = await scrape({ url, html: showHtml ? html : undefined, mode: "reviews" });
      if (!r.ok) {
        setError(r.error ?? "Error");
        return;
      }
      setReviews(r.reviews ?? []);
    });
  }

  function onSave() {
    if (!reviews || !tourId) return;
    startTransition(async () => {
      const r = await saveScrapedReviews(tourId, reviews);
      if (r.ok) setSaved(r.count ?? 0);
      else setError(r.error ?? "Error guardando");
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <FieldRow label="URL de TripAdvisor">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tripadvisor.com/Attraction_Review-..."
            className="flex-1 bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
          />
          <button
            onClick={onScrape}
            disabled={pending || !url}
            className="flex items-center gap-2 bg-night hover:bg-gold text-white px-5 py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Extraer
          </button>
        </FieldRow>

        <button
          onClick={() => setShowHtml((v) => !v)}
          className="text-sm text-gold hover:underline mt-2 flex items-center gap-1.5"
        >
          <FileCode className="w-3.5 h-3.5" />
          {showHtml ? "Ocultar HTML manual" : "TripAdvisor bloquea bots — pega HTML"}
        </button>

        {showHtml && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={6}
            placeholder="En la página de TripAdvisor: scroll para cargar reseñas → Ctrl+U → Ctrl+A → Ctrl+C → pega aquí."
            className="mt-3 w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-gold"
          />
        )}

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}
      </Card>

      {reviews && reviews.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-night">
              {reviews.length} reseñas encontradas
            </h2>
          </div>

          <Field label="Asociar a tour">
            <select
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
            >
              <option value="">— Elige un tour —</option>
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 max-h-96 overflow-y-auto">
            {reviews.slice(0, 10).map((r, i) => (
              <div key={i} className="bg-stone rounded-xl p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-night text-xs">{r.author_name}</strong>
                  <span className="text-gold text-xs">★ {r.rating}</span>
                </div>
                {r.title && <div className="font-medium text-night/90">{r.title}</div>}
                <p className="text-xs text-night/70 mt-1 line-clamp-3">{r.body}</p>
              </div>
            ))}
          </div>

          {saved !== null ? (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {saved} reseñas guardadas y verificadas.
            </div>
          ) : (
            <button
              onClick={onSave}
              disabled={pending || !tourId}
              className="mt-4 flex items-center gap-2 bg-gold hover:bg-gold-bright text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar reseñas
            </button>
          )}
        </Card>
      )}

      {reviews && reviews.length === 0 && (
        <Card>
          <p className="text-night/60 text-sm">
            No se encontraron reseñas en esa URL. Prueba pegando el HTML manualmente.
          </p>
        </Card>
      )}
    </div>
  );
}

// =====================================================
// UI primitives (local)
// =====================================================

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-night/8 rounded-2xl p-6 space-y-4">
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-night/50 mb-2">
        {label}
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-night/50">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
      {...props}
    />
  );
}

function Grid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const gridCls = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }[cols];
  return <div className={`grid ${gridCls} gap-4`}>{children}</div>;
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="mt-2">
      <div className="text-xs uppercase tracking-wider text-night/50 mb-2">{label}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 bg-white border border-night/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="px-3 text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 text-sm text-gold hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir
        </button>
      </div>
    </div>
  );
}
