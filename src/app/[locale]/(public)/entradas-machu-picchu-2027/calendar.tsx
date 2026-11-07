"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { isHighSeason, demandOf, eventOn, type Demand } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";

const WEEKDAYS: Record<Locale, string[]> = {
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  ja: ["月", "火", "水", "木", "金", "土", "日"],
};
const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };

const pad = (n: number) => String(n).padStart(2, "0");

// Colores por demanda real (ver demandOf). "booked" = pre-reservas pagadas.
const CELL: Record<Demand | "booked", string> = {
  booked: "bg-terracotta text-white hover:bg-terracotta/85",
  event: "bg-fuchsia-600 text-white hover:bg-fuchsia-700",
  highWeekend: "bg-amber-400 text-night hover:bg-amber-500",
  high: "bg-amber-100 text-night hover:bg-amber-200",
  rainy: "bg-sky-100 text-night hover:bg-sky-200",
  regular: "bg-emerald-50 text-night hover:bg-emerald-100",
};

const LEGEND: { key: Demand | "booked"; label: { es: string; en: string; ja: string } }[] = [
  { key: "booked", label: { es: "Ya hay viajeros", en: "Travelers booked", ja: "予約あり" } },
  { key: "event", label: { es: "Festividad: se agota primero", en: "Festival: sells out first", ja: "祭り・連休（早く売り切れ）" } },
  { key: "highWeekend", label: { es: "Fin de semana temporada alta", en: "High-season weekend", ja: "ハイシーズンの週末" } },
  { key: "high", label: { es: "Temporada alta", en: "High season", ja: "ハイシーズン" } },
  { key: "regular", label: { es: "Temporada regular", en: "Regular season", ja: "通常シーズン" } },
  { key: "rainy", label: { es: "Lluvias: más tranquilo", en: "Rainy: quieter", ja: "雨季（比較的すいている）" } },
];

export function Mp2027Calendar({
  locale,
  value,
  onChange,
  booked = {},
}: {
  locale: Locale;
  value: string | null;
  onChange: (iso: string) => void;
  booked?: Record<string, number>;
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
          const taken = booked[iso] ?? 0;
          const kind: Demand | "booked" = taken ? "booked" : demandOf(iso);
          const ev = eventOn(iso);
          const tip = taken
            ? L(locale, {
                es: "Ya hay viajeros para esta fecha",
                en: "Travelers already booked for this date",
                ja: "この日はすでに予約があります",
              })
            : ev
              ? L(locale, ev)
              : undefined;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              title={tip}
              aria-label={tip ? `${i + 1} · ${tip}` : String(i + 1)}
              className={`relative h-10 sm:h-11 rounded-xl text-sm font-medium transition ${
                selected ? "bg-night text-white ring-2 ring-gold shadow-glow" : CELL[kind]
              }`}
            >
              {i + 1}
              {taken > 0 && !selected && (
                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-white" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-night/60">
        {LEGEND.map((l) => (
          <span key={l.key} className="inline-flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded shrink-0 ${CELL[l.key].split(" ")[0]}`} />
            {L(locale, l.label)}
          </span>
        ))}
      </div>
      {(() => {
        const ev = Array.from({ length: daysInMonth }, (_, i) => eventOn(`2027-${pad(month + 1)}-${pad(i + 1)}`)).find(Boolean);
        return ev ? (
          <p className="mt-3 text-xs font-semibold text-fuchsia-700">
            {L(locale, { es: "Este mes: ", en: "This month: ", ja: "今月：" })}
            {L(locale, ev)}
          </p>
        ) : null;
      })()}
    </div>
  );
}
