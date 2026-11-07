"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { demandOf, eventOn, type Demand } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";

const WEEKDAYS: Record<Locale, string[]> = {
  es: ["L", "M", "M", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
  ja: ["月", "火", "水", "木", "金", "土", "日"],
};
const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };

const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (m: number, d: number) => `2027-${pad(m + 1)}-${pad(d)}`;
const daysIn = (m: number) => new Date(Date.UTC(2027, m + 1, 0)).getUTCDate();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const isHigh = (d: Demand) => d === "high" || d === "highWeekend";

const MONTH_NOTE = {
  rainy: { es: "Temporada de lluvias, menos gente", en: "Rainy season, fewer crowds", ja: "雨季・比較的すいています" },
  regular: { es: "Temporada regular", en: "Regular season", ja: "通常シーズン" },
  high: { es: "Temporada alta, reserva con tiempo", en: "High season, book early", ja: "ハイシーズン・お早めに" },
};
function monthNote(m: number) {
  const d = demandOf(isoOf(m, 15));
  return d === "rainy" ? MONTH_NOTE.rainy : isHigh(d) ? MONTH_NOTE.high : MONTH_NOTE.regular;
}

/** Festividades del mes con su rango de días. */
function monthEvents(m: number) {
  const out: { name: { es: string; en: string; ja: string }; from: number; to: number }[] = [];
  for (let d = 1; d <= daysIn(m); d++) {
    const ev = eventOn(isoOf(m, d));
    if (!ev) continue;
    const last = out[out.length - 1];
    if (last && last.name.es === ev.es && last.to === d - 1) last.to = d;
    else out.push({ name: ev, from: d, to: d });
  }
  return out;
}

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
  const events = monthEvents(month);

  const selectedLabel = value
    ? new Date(value + "T00:00:00Z").toLocaleDateString(DATE_LOCALE[locale], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  const arrow =
    "w-9 h-9 grid place-items-center rounded-full text-night/60 hover:text-night hover:bg-stone disabled:opacity-20 disabled:hover:bg-transparent transition";

  return (
    <div className="max-w-xl mx-auto rounded-[28px] border border-night/10 bg-white px-5 py-7 sm:px-10 sm:py-9">
      {/* Meses */}
      <nav className="flex sm:grid sm:grid-cols-12 gap-1 overflow-x-auto [scrollbar-width:none] pb-5 mb-6 border-b border-night/8">
        {Array.from({ length: 12 }, (_, m) => {
          const active = m === month;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(m)}
              aria-pressed={active}
              className={`relative shrink-0 px-1.5 sm:px-0 pb-1.5 text-[11px] uppercase tracking-[0.08em] transition ${
                active ? "text-night font-semibold" : "text-night/40 hover:text-night/80"
              }`}
            >
              {fmt(m, { month: "short" }).replace(".", "")}
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-px bg-gold transition-all ${active ? "w-full" : "w-0"}`}
              />
            </button>
          );
        })}
      </nav>

      {/* Cabecera */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="font-display text-4xl sm:text-5xl text-night leading-none lining-nums">
            {monthName} <span className="text-night/25">2027</span>
          </div>
          <div className="mt-2 text-[13px] italic text-night/55">{L(locale, monthNote(month))}</div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonth((m) => Math.max(0, m - 1))}
            disabled={month === 0}
            aria-label={L(locale, { es: "Mes anterior", en: "Previous month", ja: "前の月" })}
            className={arrow}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => Math.min(11, m + 1))}
            disabled={month === 11}
            aria-label={L(locale, { es: "Mes siguiente", en: "Next month", ja: "次の月" })}
            className={arrow}
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS[locale].map((d, i) => (
          <span key={i} className="pb-3 text-[11px] uppercase tracking-[0.18em] text-night/35">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysIn(month) }, (_, i) => {
          const iso = isoOf(month, i + 1);
          const selected = iso === value;
          const taken = booked[iso] ?? 0;
          const demand = demandOf(iso);
          const ev = eventOn(iso);
          const tip =
            [ev ? L(locale, ev) : null, taken ? L(locale, { es: "Ya hay viajeros", en: "Travelers booked", ja: "予約あり" }) : null]
              .filter(Boolean)
              .join(" · ") || undefined;
          const dot = ev ? "bg-terracotta" : isHigh(demand) ? "bg-gold" : null;
          return (
            <div key={iso} className="grid place-items-center">
              <button
                type="button"
                onClick={() => onChange(iso)}
                aria-pressed={selected}
                title={tip}
                aria-label={tip ? `${i + 1} · ${tip}` : String(i + 1)}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full font-display text-lg sm:text-xl lining-nums tabular-nums transition ${
                  selected
                    ? "bg-night text-white ring-1 ring-gold ring-offset-2"
                    : `${ev ? "text-terracotta" : "text-night"} hover:ring-1 hover:ring-night/25`
                }`}
              >
                <span className="relative -top-px">{i + 1}</span>
                {dot && (
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 bottom-1.5 w-1 h-1 rounded-full ${selected ? "bg-gold" : dot}`}
                    aria-hidden
                  />
                )}
                {taken > 0 && (
                  <span
                    className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border ${
                      selected ? "border-gold" : "border-night/50"
                    }`}
                    aria-hidden
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pie */}
      <div className="mt-7 pt-5 border-t border-night/8 space-y-3">
        {events.map((e) => (
          <p key={e.name.es + e.from} className="text-sm text-night/70">
            <span className="font-display text-terracotta">{L(locale, e.name)}</span>
            <span className="text-night/40">
              {" · "}
              {e.from === e.to ? e.from : `${e.from}–${e.to}`} {fmt(month, { month: "long" })}
              {" · "}
              {L(locale, { es: "se agota primero", en: "sells out first", ja: "早く売り切れ" })}
            </span>
          </p>
        ))}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] uppercase tracking-[0.12em] text-night/45">
          <span className="inline-flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold" />
            {L(locale, { es: "Temporada alta", en: "High season", ja: "ハイシーズン" })}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-terracotta" />
            {L(locale, { es: "Festividad", en: "Festival", ja: "祭り" })}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full border border-night/50" />
            {L(locale, { es: "Ya hay viajeros", en: "Travelers booked", ja: "予約あり" })}
          </span>
        </div>
        {selectedLabel && (
          <p className="pt-1 text-sm text-night/55">
            {L(locale, { es: "Tu ingreso a Machu Picchu:", en: "Your Machu Picchu entry:", ja: "マチュピチュ入場日：" })}{" "}
            <span className="font-display text-base text-night lining-nums">{selectedLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
