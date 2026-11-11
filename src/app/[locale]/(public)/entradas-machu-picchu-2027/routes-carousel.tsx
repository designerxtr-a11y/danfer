"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { ROUTES } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";

const LEVEL_LABEL = {
  easy: { es: "Fácil", en: "Easy", ja: "やさしい" },
  moderate: { es: "Moderada", en: "Moderate", ja: "普通" },
  hard: { es: "Exigente", en: "Challenging", ja: "きつい" },
} as const;
const LEVEL_STYLE = {
  easy: "bg-emerald-50 text-emerald-700",
  moderate: "bg-amber-50 text-amber-700",
  hard: "bg-rose-50 text-rose-700",
} as const;

/** Carrusel informativo de rutas: avanza solo y se pausa al pasar el cursor o tocar. */
export function RoutesCarousel({
  locale,
}: {
  locale: Locale;
}) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  /** Ancho de una vuelta completa (la lista está duplicada para girar sin corte). */
  const period = (el: HTMLDivElement) => (el.scrollWidth + 16) / 2;

  function move(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 300) + 16;
    paused.current = true;
    if (dir === -1 && el.scrollLeft < step) el.scrollLeft += period(el);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    window.setTimeout(() => (paused.current = false), 900);
  }

  // Desplazamiento continuo: avanza solo y se detiene al pasar el cursor o tocar.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let pos = -1;
    const tick = (now: number) => {
      const el = track.current;
      const dt = Math.min(64, now - last);
      last = now;
      if (el && !paused.current && !document.hidden) {
        if (pos < 0 || Math.abs(pos - el.scrollLeft) > 2) pos = el.scrollLeft;
        pos += dt * 0.045; // ~45 px por segundo
        const p = period(el);
        if (pos >= p) pos -= p;
        el.scrollLeft = pos;
      } else {
        pos = -1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const arrow =
    "w-10 h-10 grid place-items-center rounded-full bg-white text-night shadow hover:bg-night hover:text-white transition";

  return (
    <section className="mt-6">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
            {L(locale, { es: "Conoce las rutas de Machu Picchu", en: "Get to know the Machu Picchu routes", ja: "マチュピチュのルート紹介" })}
          </h2>
          <p className="mt-1 text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
            {L(locale, {
              es: "Diez rutas en tres circuitos. Elige la tuya en \"Tu reserva\".",
              en: "Ten routes across three circuits. Choose yours under \"Booking\".",
              ja: "3つのサーキットに10のルート。「ご予約」でお選びください。",
            })}
          </p>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button type="button" onClick={() => move(-1)} aria-label={L(locale, { es: "Anterior", en: "Previous", ja: "前へ" })} className={arrow}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label={L(locale, { es: "Siguiente", en: "Next", ja: "次へ" })} className={arrow}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => window.setTimeout(() => (paused.current = false), 2500)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[...ROUTES, ...ROUTES].map((x, idx) => {
          return (
            <article
              key={idx}
              aria-hidden={idx >= ROUTES.length}
              className="shrink-0 w-[82%] sm:w-[300px] rounded-xl overflow-hidden bg-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-[16/10] bg-night">
                {x.photo ? (
                  <Image src={x.photo} alt={L(locale, x.name)} fill sizes="340px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-display text-6xl text-white/25">{x.id}</span>
                )}
                <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-night">
                  {L(locale, { es: `Circuito ${x.circuit}`, en: `Circuit ${x.circuit}`, ja: `サーキット${x.circuit}` })} · {x.id}
                </span>
                {x.photoCredit && (
                  <span className="absolute bottom-0 inset-x-0 bg-night/60 text-white text-[10px] px-3 py-1 truncate">
                    {L(locale, { es: "Foto", en: "Photo", ja: "写真" })}: {x.photoCredit}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-night leading-snug">{L(locale, x.name)}</h3>
                <p className="mt-1 text-sm text-night/65">{L(locale, x.desc)}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded bg-night/5 text-night/70 px-2 py-0.5">
                    <Clock className="w-3 h-3" />
                    {L(locale, { es: "aprox.", en: "approx.", ja: "約" })} {x.time}
                  </span>
                  <span className={`rounded px-2 py-0.5 ${LEVEL_STYLE[x.level]}`}>{L(locale, LEVEL_LABEL[x.level])}</span>
                  {x.recommended && (
                    <span className="rounded bg-green-600 text-white px-2 py-0.5">
                      {L(locale, { es: "Recomendada", en: "Recommended", ja: "おすすめ" })}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-[13px] text-night/70 leading-snug">{L(locale, x.tip)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
