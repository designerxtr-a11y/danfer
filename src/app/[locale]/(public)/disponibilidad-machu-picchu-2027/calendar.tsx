"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { isHighSeason } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";

const WEEKDAYS: Record<Locale, string[]> = {
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  ja: ["月", "火", "水", "木", "金", "土", "日"],
};
const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };

const pad = (n: number) => String(n).padStart(2, "0");

export function Mp2027Calendar({
  locale,
  value,
  onChange,
}: {
  locale: Locale;
  value: string | null;
  onChange: (iso: string) => void;
}) {
  const [month, setMonth] = useState(value ? Number(value.slice(5, 7)) - 1 : 0); // 0..11 de 2027
  const first = new Date(Date.UTC(2027, month, 1));
  const daysInMonth = new Date(Date.UTC(2027, month + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // lunes primero
  const rawLabel = first.toLocaleDateString(DATE_LOCALE[locale], { month: "long", year: "numeric", timeZone: "UTC" });
  const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
  const high = isHighSeason(`2027-${pad(month + 1)}-01`);

  return (
    <div className="max-w-xl mx-auto rounded-3xl border border-night/8 bg-white p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setMonth((m) => Math.max(0, m - 1))}
          disabled={month === 0}
          aria-label={L(locale, { es: "Mes anterior", en: "Previous month", ja: "前の月" })}
          className="w-9 h-9 grid place-items-center rounded-full hover:bg-stone disabled:opacity-25 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="font-display text-xl sm:text-2xl text-night">{label}</div>
          <div className={`text-xs font-semibold mt-0.5 ${high ? "text-terracotta" : "text-emerald-700"}`}>
            {high
              ? L(locale, { es: "Temporada alta · reserva cuanto antes", en: "High season · book early", ja: "ハイシーズン・お早めに" })
              : L(locale, { es: "Temporada regular", en: "Regular season", ja: "通常シーズン" })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMonth((m) => Math.min(11, m + 1))}
          disabled={month === 11}
          aria-label={L(locale, { es: "Mes siguiente", en: "Next month", ja: "次の月" })}
          className="w-9 h-9 grid place-items-center rounded-full hover:bg-stone disabled:opacity-25 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS[locale].map((d) => (
          <span key={d} className="text-[11px] uppercase tracking-wider text-night/40 pb-1">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const iso = `2027-${pad(month + 1)}-${pad(i + 1)}`;
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              className={`h-10 sm:h-11 rounded-xl text-sm font-medium transition ${
                selected
                  ? "bg-gold text-night shadow-glow"
                  : high
                    ? "bg-terracotta/8 text-night hover:bg-gold/30"
                    : "bg-stone text-night hover:bg-gold/30"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-night/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-stone" />
          {L(locale, { es: "Pre-reserva abierta", en: "Pre-booking open", ja: "事前予約受付中" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-terracotta/20" />
          {L(locale, { es: "Alta demanda", en: "High demand", ja: "混雑期" })}
        </span>
      </div>
    </div>
  );
}
