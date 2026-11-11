"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { eventOn, slotsLeft } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";

const WEEKDAYS: Record<Locale, string[]> = {
  es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ja: ["月", "火", "水", "木", "金", "土", "日"],
};
const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (m: number, d: number) => `2027-${pad(m + 1)}-${pad(d)}`;
const daysIn = (m: number) => new Date(Date.UTC(2027, m + 1, 0)).getUTCDate();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Calendario 2027 en tarjeta: verde = con cupos, ámbar = pocos, gris = completo. */
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
  const fmt = (m: number, opts: Intl.DateTimeFormatOptions) =>
    new Date(Date.UTC(2027, m, 1)).toLocaleDateString(DATE_LOCALE[locale], { ...opts, timeZone: "UTC" });
  const offset = (new Date(Date.UTC(2027, month, 1)).getUTCDay() + 6) % 7; // lunes primero
  const monthName = cap(fmt(month, { month: "long" }));

  const arrow =
    "w-9 h-9 grid place-items-center rounded-md text-night/70 hover:bg-night/5 disabled:opacity-25 disabled:hover:bg-transparent transition";

  return (
    <div className="rounded-xl bg-white p-4 sm:p-5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => Math.max(0, m - 1))}
          disabled={month === 0}
          aria-label={L(locale, { es: "Mes anterior", en: "Previous month", ja: "前の月" })}
          className={arrow}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg sm:text-xl font-semibold text-night">{monthName} 2027</div>
        <button
          type="button"
          onClick={() => setMonth((m) => Math.min(11, m + 1))}
          disabled={month === 11}
          aria-label={L(locale, { es: "Mes siguiente", en: "Next month", ja: "次の月" })}
          className={arrow}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Salto rápido de mes */}
      <div className="mt-2 grid grid-cols-12 gap-0.5">
        {Array.from({ length: 12 }, (_, m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMonth(m)}
            aria-label={cap(fmt(m, { month: "long" }))}
            aria-pressed={m === month}
            className={`rounded py-1 text-[11px] font-medium transition ${
              m === month ? "bg-night text-white" : "text-night/50 hover:bg-night/5"
            }`}
          >
            {cap(fmt(m, { month: "short" })).slice(0, locale === "ja" ? 3 : 1)}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
        {WEEKDAYS[locale].map((d) => (
          <span key={d} className="py-1 text-sm text-night/70">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysIn(month) }, (_, i) => {
          const iso = isoOf(month, i + 1);
          const selected = iso === value;
          const left = slotsLeft(iso, booked);
          const full = left === 0;
          const few = !full && left <= 5;
          const ev = eventOn(iso);
          const state = full
            ? L(locale, { es: "completo", en: "full", ja: "満席" })
            : L(locale, { es: `${left} cupos`, en: `${left} spots`, ja: `残り${left}枠` });
          return (
            <button
              key={iso}
              type="button"
              disabled={full}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={`${i + 1} ${monthName}: ${state}${ev ? `, ${L(locale, ev)}` : ""}`}
              title={ev ? `${L(locale, ev)} · ${state}` : state}
              className={`relative overflow-hidden min-h-[58px] sm:min-h-[84px] rounded-md px-0.5 flex flex-col items-center justify-center text-center text-white transition ${
                full
                  ? "bg-red-500 cursor-not-allowed"
                  : selected
                    ? "bg-night ring-2 ring-night ring-offset-2"
                    : few
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {full && (
                <svg className="absolute inset-0 w-full h-full text-red-800/45" preserveAspectRatio="none" viewBox="0 0 10 10" aria-hidden>
                  <path d="M0 0L10 10M10 0L0 10" stroke="currentColor" strokeWidth="0.35" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
              {/* Día grande, como en un calendario; los cupos van en palabras debajo */}
              <span className="relative grid place-items-center w-7 h-7 sm:w-11 sm:h-11 rounded-full border-2 border-white text-white text-sm sm:text-xl font-semibold leading-none tabular-nums">
                {i + 1}
              </span>
              <span className="relative mt-1 sm:mt-1.5 block text-[9px] sm:text-xs font-medium leading-tight">
                {full
                  ? L(locale, { es: "Agotado", en: "Sold out", ja: "満席" })
                  : L(locale, { es: `Quedan ${left}`, en: `${left} left`, ja: `残り${left}` })}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-night/65">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-600" />
          {L(locale, { es: "Disponible", en: "Available", ja: "空きあり" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500" />
          {L(locale, { es: "Pocos cupos", en: "Few spots", ja: "残りわずか" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500" />
          {L(locale, { es: "Agotado", en: "Sold out", ja: "満席" })}
        </span>
        <span className="sm:ml-auto text-night/50">
          {L(locale, {
            es: "Cupos de pre-reserva con Danfer Tours",
            en: "Pre-booking spots with Danfer Tours",
            ja: "Danfer Toursの事前予約枠",
          })}
        </span>
      </div>
    </div>
  );
}
