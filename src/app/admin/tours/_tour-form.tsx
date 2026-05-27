"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, MapPin } from "lucide-react";
import { saveTour } from "./actions";
import { RichText } from "@/app/admin/_components/rich-text";
import { ImageUploader, GalleryUploader } from "@/app/admin/_components/image-uploader";

interface FAQItem { q_es: string; q_en: string; a_es: string; a_en: string; }
interface Coords { lat: number | null; lng: number | null; zoom: number; }

interface Category {
  id: string;
  name: { es: string; en?: string };
}

export interface TourFormInitial {
  id?: string;
  slug?: string;
  category_id?: string | null;
  title?: { es: string; en?: string };
  short_desc?: { es: string; en?: string } | null;
  description?: { es: string; en?: string } | null;
  cover_image?: string;
  gallery?: { url: string; alt?: string }[];
  duration_days?: number;
  duration_label?: { es: string; en?: string };
  difficulty?: string;
  max_group_size?: number;
  altitude_max?: number | null;
  price_usd?: number;
  price_pen?: number | null;
  discount_pct?: number;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  what_to_bring?: string[];
  faqs?: { q: { es: string; en?: string }; a: { es: string; en?: string } }[];
  coordinates?: { lat: number; lng: number; zoom?: number } | null;
  is_published?: boolean;
  is_featured?: boolean;
}

interface Props {
  initial?: TourFormInitial;
  categories: Category[];
}

export function TourForm({ initial = {}, categories }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: initial.slug ?? "",
    category_id: initial.category_id ?? "",
    title_es: initial.title?.es ?? "",
    title_en: initial.title?.en ?? "",
    short_desc_es: initial.short_desc?.es ?? "",
    short_desc_en: initial.short_desc?.en ?? "",
    description_es: initial.description?.es ?? "",
    description_en: initial.description?.en ?? "",
    cover_image: initial.cover_image ?? "",
    duration_days: initial.duration_days ?? 1,
    duration_label_es: initial.duration_label?.es ?? "1 día",
    duration_label_en: initial.duration_label?.en ?? "1 day",
    difficulty: initial.difficulty ?? "easy",
    max_group_size: initial.max_group_size ?? 12,
    altitude_max: initial.altitude_max ?? null,
    price_usd: initial.price_usd ?? 0,
    price_pen: initial.price_pen ?? null,
    discount_pct: initial.discount_pct ?? 0,
    is_published: initial.is_published ?? false,
    is_featured: initial.is_featured ?? false,
  });

  const [highlights, setHighlights] = useState<string[]>(initial.highlights ?? []);
  const [includes, setIncludes] = useState<string[]>(initial.includes ?? []);
  const [excludes, setExcludes] = useState<string[]>(initial.excludes ?? []);
  const [whatToBring, setWhatToBring] = useState<string[]>(
    initial.what_to_bring ?? []
  );
  const [gallery, setGallery] = useState<string[]>(
    (initial.gallery ?? []).map((g) => g.url)
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(
    (initial.faqs ?? []).map((f) => ({
      q_es: f.q?.es ?? "",
      q_en: f.q?.en ?? "",
      a_es: f.a?.es ?? "",
      a_en: f.a?.en ?? "",
    }))
  );
  const [coords, setCoords] = useState<Coords>({
    lat: initial.coordinates?.lat ?? null,
    lng: initial.coordinates?.lng ?? null,
    zoom: initial.coordinates?.zoom ?? 13,
  });

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveTour({
        id: initial.id,
        ...form,
        category_id: form.category_id || null,
        highlights,
        includes,
        excludes,
        what_to_bring: whatToBring,
        gallery,
        faqs: faqs
          .filter((f) => f.q_es && f.a_es)
          .map((f) => ({
            q: { es: f.q_es, en: f.q_en || undefined },
            a: { es: f.a_es, en: f.a_en || undefined },
          })),
        coordinates:
          coords.lat !== null && coords.lng !== null
            ? { lat: coords.lat, lng: coords.lng, zoom: coords.zoom }
            : null,
      });
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <Card title="Información básica">
        <Grid>
          <Field label="Slug (URL)" hint="ej: machu-picchu-full-day">
            <Input
              value={form.slug}
              onChange={(v) => update("slug", v)}
              required
            />
          </Field>
          <Field label="Categoría">
            <select
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
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

        <Grid>
          <Field label="Título (Español)" required>
            <Input
              value={form.title_es}
              onChange={(v) => update("title_es", v)}
              required
            />
          </Field>
          <Field label="Title (English)">
            <Input
              value={form.title_en}
              onChange={(v) => update("title_en", v)}
            />
          </Field>
        </Grid>

        <Grid>
          <Field label="Subtítulo / corta descripción (ES)">
            <Input
              value={form.short_desc_es}
              onChange={(v) => update("short_desc_es", v)}
            />
          </Field>
          <Field label="Short description (EN)">
            <Input
              value={form.short_desc_en}
              onChange={(v) => update("short_desc_en", v)}
            />
          </Field>
        </Grid>

        <Grid>
          <Field label="Descripción completa (ES)">
            <RichText
              value={form.description_es}
              onChange={(v) => update("description_es", v)}
              placeholder="Escribe la descripción del tour..."
            />
          </Field>
          <Field label="Full description (EN)">
            <RichText
              value={form.description_en}
              onChange={(v) => update("description_en", v)}
              placeholder="Tour description..."
            />
          </Field>
        </Grid>

        <Field label="Imagen de portada">
          <ImageUploader
            bucket="tour-images"
            folder={form.slug || "new-tour"}
            value={form.cover_image || undefined}
            onChange={(url) => update("cover_image", url ?? "")}
          />
        </Field>

        <Field label="Galería de fotos">
          <GalleryUploader
            value={gallery}
            onChange={setGallery}
            bucket="tour-images"
            folder={form.slug || "new-tour"}
          />
        </Field>
      </Card>

      <Card title="Logística">
        <Grid cols={4}>
          <Field label="Días">
            <Input
              type="number"
              value={form.duration_days}
              onChange={(v) => update("duration_days", Number(v))}
            />
          </Field>
          <Field label="Etiqueta duración (ES)">
            <Input
              value={form.duration_label_es}
              onChange={(v) => update("duration_label_es", v)}
            />
          </Field>
          <Field label="Duration label (EN)">
            <Input
              value={form.duration_label_en}
              onChange={(v) => update("duration_label_en", v)}
            />
          </Field>
          <Field label="Dificultad">
            <select
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value)}
              className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold"
            >
              <option value="easy">Fácil</option>
              <option value="moderate">Moderado</option>
              <option value="challenging">Exigente</option>
              <option value="expert">Experto</option>
            </select>
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label="Grupo máximo">
            <Input
              type="number"
              value={form.max_group_size}
              onChange={(v) => update("max_group_size", Number(v))}
            />
          </Field>
          <Field label="Altitud máx (msnm)">
            <Input
              type="number"
              value={form.altitude_max ?? ""}
              onChange={(v) =>
                update("altitude_max", v === "" ? null : Number(v))
              }
            />
          </Field>
        </Grid>
      </Card>

      <Card title="Precios">
        <Grid cols={3}>
          <Field label="Precio USD" required>
            <Input
              type="number"
              step="0.01"
              value={form.price_usd}
              onChange={(v) => update("price_usd", Number(v))}
              required
            />
          </Field>
          <Field label="Precio PEN (opcional)">
            <Input
              type="number"
              step="0.01"
              value={form.price_pen ?? ""}
              onChange={(v) =>
                update("price_pen", v === "" ? null : Number(v))
              }
            />
          </Field>
          <Field label="Descuento %">
            <Input
              type="number"
              value={form.discount_pct}
              onChange={(v) => update("discount_pct", Number(v))}
            />
          </Field>
        </Grid>
      </Card>

      <Card title="Listas de contenido">
        <ListEditor label="Highlights / lo más destacado" items={highlights} setItems={setHighlights} />
        <ListEditor label="Incluye" items={includes} setItems={setIncludes} />
        <ListEditor label="No incluye" items={excludes} setItems={setExcludes} />
        <ListEditor label="Qué llevar" items={whatToBring} setItems={setWhatToBring} />
      </Card>

      <Card title="Preguntas frecuentes (FAQ)">
        <p className="text-sm text-night/60 -mt-3 mb-2">
          Estas preguntas aparecen en la página del tour Y se inyectan como
          structured data para snippets en Google.
        </p>
        {faqs.map((f, i) => (
          <div
            key={i}
            className="border border-night/10 rounded-xl p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
              className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
            <Grid>
              <Field label={`Pregunta ${i + 1} (ES)`}>
                <Input
                  value={f.q_es}
                  onChange={(v) => {
                    const next = [...faqs];
                    next[i] = { ...next[i], q_es: v };
                    setFaqs(next);
                  }}
                />
              </Field>
              <Field label={`Question ${i + 1} (EN)`}>
                <Input
                  value={f.q_en}
                  onChange={(v) => {
                    const next = [...faqs];
                    next[i] = { ...next[i], q_en: v };
                    setFaqs(next);
                  }}
                />
              </Field>
            </Grid>
            <Grid>
              <Field label="Respuesta (ES)">
                <Textarea
                  rows={3}
                  value={f.a_es}
                  onChange={(v) => {
                    const next = [...faqs];
                    next[i] = { ...next[i], a_es: v };
                    setFaqs(next);
                  }}
                />
              </Field>
              <Field label="Answer (EN)">
                <Textarea
                  rows={3}
                  value={f.a_en}
                  onChange={(v) => {
                    const next = [...faqs];
                    next[i] = { ...next[i], a_en: v };
                    setFaqs(next);
                  }}
                />
              </Field>
            </Grid>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFaqs([...faqs, { q_es: "", q_en: "", a_es: "", a_en: "" }])
          }
          className="flex items-center gap-1.5 text-sm text-gold hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir pregunta
        </button>
      </Card>

      <Card title="Punto de inicio (mapa)">
        <p className="text-sm text-night/60 -mt-3 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          Copia coords desde Google Maps (click derecho → "¿Qué hay aquí?")
        </p>
        <Grid cols={3}>
          <Field label="Latitud">
            <Input
              type="number"
              step="0.000001"
              value={coords.lat?.toString() ?? ""}
              onChange={(v) =>
                setCoords({ ...coords, lat: v ? Number(v) : null })
              }
              placeholder="-13.1631"
            />
          </Field>
          <Field label="Longitud">
            <Input
              type="number"
              step="0.000001"
              value={coords.lng?.toString() ?? ""}
              onChange={(v) =>
                setCoords({ ...coords, lng: v ? Number(v) : null })
              }
              placeholder="-72.5450"
            />
          </Field>
          <Field label="Zoom (1-18)">
            <Input
              type="number"
              min="1"
              max="18"
              value={coords.zoom.toString()}
              onChange={(v) => setCoords({ ...coords, zoom: Number(v) || 13 })}
            />
          </Field>
        </Grid>
      </Card>

      <Card title="Visibilidad">
        <div className="flex flex-wrap gap-4">
          <Checkbox
            checked={form.is_published}
            onChange={(v) => update("is_published", v)}
            label="Publicado (visible en el sitio)"
          />
          <Checkbox
            checked={form.is_featured}
            onChange={(v) => update("is_featured", v)}
            label="Destacado (aparece en home)"
          />
        </div>
      </Card>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 bg-gold hover:bg-gold-bright text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar tour
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/tours")}
          className="text-night/60 hover:text-night text-sm transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-night/8 rounded-2xl p-6 space-y-5">
      <h2 className="font-display text-xl text-night">{title}</h2>
      {children}
    </div>
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

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-night/50">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="text-xs text-night/40 mt-1 block">{hint}</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  ...props
}: {
  value: string | number;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 text-night focus:outline-none focus:border-gold"
      {...props}
    />
  );
}

function Textarea({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-night/10 rounded-xl px-4 py-2.5 text-night focus:outline-none focus:border-gold resize-y"
      {...props}
    />
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-gold"
      />
      <span className="text-sm text-night">{label}</span>
    </label>
  );
}

function ListEditor({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-night/50 mb-2">
        {label}
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                setItems(next);
              }}
              className="flex-1 bg-white border border-night/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="px-3 text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems([...items, ""])}
          className="flex items-center gap-1.5 text-sm text-gold hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir
        </button>
      </div>
    </div>
  );
}
