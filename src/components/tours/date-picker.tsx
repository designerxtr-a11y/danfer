"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/types/database";

interface Props {
  value: string | null;
  onChange: (iso: string) => void;
  /** Earliest selectable day, YYYY-MM-DD. */
  min: string;
  locale: Locale;
}

const WEEKDAYS = {
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
};

export function DatePicker({ value, onChange, min, locale }: Props) {
  const en = locale === "en";
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => monthStart(value ?? min));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const year = view.getUTCFullYear();
  const month = view.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  // Monday-first offset of the 1st of the month.
  const offset = (view.getUTCDay() + 6) % 7;
  const canGoBack = toIso(view) > min.slice(0, 7) + "-01";

  const rawMonthLabel = view.toLocaleDateString(en ? "en-US" : "es-PE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1);

  const shiftMonth = (delta: number) =>
    setView(new Date(Date.UTC(year, month + delta, 1)));

  return (
    <div ref={ref} className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between bg-stone hover:bg-cream rounded-xl px-4 py-3 transition"
      >
        <span className={`flex items-center gap-2 ${value ? "text-night" : "text-night/50"}`}>
          <Calendar className="w-4 h-4 text-gold" />
          {value ? formatLong(value, locale) : en ? "Pick a date" : "Elige tu fecha"}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-night/40 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-night/8 bg-white p-4 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canGoBack}
                aria-label={en ? "Previous month" : "Mes anterior"}
                className="w-8 h-8 grid place-items-center rounded-full text-night hover:bg-stone transition disabled:opacity-25 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-display text-lg text-night">{monthLabel}</span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label={en ? "Next month" : "Mes siguiente"}
                className="w-8 h-8 grid place-items-center rounded-full text-night hover:bg-stone transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS[locale].map((d) => (
                <span key={d} className="text-[10px] uppercase tracking-wider text-night/40 pb-1">
                  {d}
                </span>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <span key={`pad-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const iso = toIso(new Date(Date.UTC(year, month, i + 1)));
                const disabled = iso < min;
                const selected = iso === value;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                    className={`mx-auto w-9 h-9 rounded-full text-sm transition ${
                      selected
                        ? "bg-gold text-white font-semibold"
                        : disabled
                        ? "text-night/20 cursor-not-allowed"
                        : "text-night hover:bg-gold/15"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function monthStart(iso: string) {
  return new Date(iso.slice(0, 7) + "-01T00:00:00Z");
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatLong(iso: string, locale: Locale) {
  const label = new Date(iso + "T00:00:00Z").toLocaleDateString(locale === "en" ? "en-US" : "es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
