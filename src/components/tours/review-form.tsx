"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2, Send, CheckCircle2, PenLine } from "lucide-react";
import { submitTourReview } from "@/lib/actions/submit-review";
import type { Locale } from "@/types/database";

interface Props {
  tourId: string;
  lc: Locale;
}

const COPY = {
  es: {
    kicker: "Tu opinión",
    heading: "¿Hiciste este tour? Déjanos tu reseña",
    sub: "Las reseñas reales de viajeros guían a otros y nos ayudan a mejorar. Se publican tras una breve revisión.",
    open: "Escribir una reseña",
    rating: "Tu calificación",
    name: "Nombre",
    country: "País",
    optional: "opcional",
    title: "Título",
    body: "Tu experiencia",
    bodyPh: "Cuéntanos cómo fue tu tour: el guía, los paisajes, la organización…",
    submit: "Enviar reseña",
    cancel: "Cancelar",
    successTitle: "¡Gracias por tu reseña!",
    successSub: "La revisaremos y la publicaremos pronto. Tu opinión ayuda muchísimo a otros viajeros.",
    ratingError: "Elige cuántas estrellas le das.",
    starWord: "estrellas",
  },
  en: {
    kicker: "Your opinion",
    heading: "Took this tour? Leave us a review",
    sub: "Real traveler reviews guide others and help us improve. They're published after a quick review.",
    open: "Write a review",
    rating: "Your rating",
    name: "Name",
    country: "Country",
    optional: "optional",
    title: "Title",
    body: "Your experience",
    bodyPh: "Tell us how your tour went: the guide, the scenery, the organization…",
    submit: "Submit review",
    cancel: "Cancel",
    successTitle: "Thanks for your review!",
    successSub: "We'll review it and publish it soon. Your feedback helps other travelers a lot.",
    ratingError: "Pick how many stars you give it.",
    starWord: "stars",
  },
} as const;

export function ReviewForm({ tourId, lc }: Props) {
  const c = COPY[lc] ?? COPY.es;
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({
    author_name: "",
    author_country: "",
    title: "",
    body: "",
    website: "", // honeypot
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError(c.ratingError);
      return;
    }
    startTransition(async () => {
      const r = await submitTourReview({ tour_id: tourId, rating, ...form });
      if (r.ok) setSent(true);
      else setError(r.error ?? "Error");
    });
  }

  if (sent) {
    return (
      <div className="mt-12 pt-10 border-t border-night/8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center shadow-soft"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="font-display text-2xl text-night">{c.successTitle}</h3>
          <p className="mt-2 text-night/65 max-w-md mx-auto">{c.successSub}</p>
        </motion.div>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <div className="mt-12 pt-10 border-t border-night/8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-hand text-gold text-xl">{c.kicker}</span>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl text-night">
            {c.heading}
          </h3>
          <p className="mt-2 text-night/60 max-w-lg text-sm">{c.sub}</p>
        </div>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-night hover:bg-gold text-white font-semibold px-6 py-3 rounded-full transition shrink-0"
          >
            <PenLine className="w-4 h-4" />
            {c.open}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={onSubmit}
            className="mt-6 bg-white border border-night/8 rounded-3xl p-6 md:p-8 shadow-soft space-y-5 overflow-hidden"
          >
            {/* Honeypot — oculto para humanos, los bots lo rellenan */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
            </div>

            {/* Star picker */}
            <div>
              <span className="text-xs uppercase tracking-wider text-night/50">
                {c.rating} <span className="text-rose-500">*</span>
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const v = i + 1;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRating(v)}
                      onMouseEnter={() => setHover(v)}
                      onMouseLeave={() => setHover(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                      aria-label={`${v} ${c.starWord}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          v <= shown ? "fill-gold text-gold" : "text-night/20"
                        }`}
                      />
                    </button>
                  );
                })}
                {shown > 0 && (
                  <span className="ml-2 text-sm text-night/60">
                    {shown}/5
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label={c.name} required>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label={`${c.country} (${c.optional})`}>
                <input
                  type="text"
                  maxLength={60}
                  value={form.author_country}
                  onChange={(e) => setForm({ ...form, author_country: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label={`${c.title} (${c.optional})`}>
              <input
                type="text"
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </Field>

            <Field label={c.body} required>
              <textarea
                required
                rows={5}
                maxLength={1500}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder={c.bodyPh}
                className={`${inputCls} resize-y`}
              />
            </Field>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-bright text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {c.submit}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-night/50 hover:text-night text-sm transition"
              >
                {c.cancel}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-night/50">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
