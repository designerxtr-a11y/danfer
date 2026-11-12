"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, Check, CheckCircle2, Clock, Loader2, Minus, Plus, Mountain, Star, MessageCircle } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { ROUTES, PACKAGES, MAX_TRAVELERS, mp2027Total, routeById, packageById, hoursFor, slotsLeft, type RouteId, type PackageId } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";
import { Mp2027Calendar } from "./calendar";
import { RoutesCarousel } from "./routes-carousel";
import { TravelerCard, emptyTraveler, type TravelerDraft } from "./traveler-card";
import { createMp2027Order, captureMp2027Order, createMp2027Hold } from "./actions";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };

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
const input =
  "w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition";
const usd = (n: number) => `US$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Step({ n, title, id, children }: { n: number; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-full bg-night text-white grid place-items-center font-display font-bold">{n}</span>
        <h2 className="font-display text-2xl sm:text-3xl text-night">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Mp2027Booking({
  locale,
  paypalClientId,
  whatsapp,
  booked = {},
  updatedLabel,
  title,
  subtitle,
  intro,
}: {
  locale: Locale;
  paypalClientId?: string;
  whatsapp: string;
  booked?: Record<string, number>;
  updatedLabel?: string;
  /** H1 sobre la foto. */
  title: string;
  subtitle?: string;
  /** Bloque bajo la portada (migas, texto, prueba social), renderizado en el servidor. */
  intro?: React.ReactNode;
}) {
  const [draftId] = useState(() =>
    Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("")
  );
  const [date, setDate] = useState<string | null>(null);
  const [pkgId, setPkgId] = useState<PackageId>("2d1n");
  const [route, setRoute] = useState<RouteId | null>(null);
  const [hour, setHour] = useState<string | null>(null);
  const [travelers, setTravelers] = useState<TravelerDraft[]>([emptyTraveler()]);
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [hotel, setHotel] = useState("");
  const [accept, setAccept] = useState(false);
  const [paid, setPaid] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  // Pre-reserva sin pago (nombre + WhatsApp): baja la barrera para quien recién mira.
  const [holdOpen, setHoldOpen] = useState(false);
  const [holdName, setHoldName] = useState("");
  const [holdWa, setHoldWa] = useState("");
  const [holdEmail, setHoldEmail] = useState("");
  const [holdTrap, setHoldTrap] = useState("");
  const [holdBusy, setHoldBusy] = useState(false);
  const [holdSent, setHoldSent] = useState(false);
  const [holdError, setHoldError] = useState<string | null>(null);

  const r = route ? routeById(route) : undefined;

  // Los pasos 2-6 aparecen al elegir fecha. No bajamos solos: el calendario
  // muestra los cupos del día y dos salidas (reservar o consultar por WhatsApp).
  function pickDate(d: string | null) {
    setDate(d);
  }
  function goToPackages() {
    setTimeout(() => document.getElementById("mp-paso-2")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }
  const left = date ? slotsLeft(date, booked) : MAX_TRAVELERS;
  const pkg = packageById(pkgId)!;
  const hours = r ? hoursFor(r, pkg) : [];
  const totals = mp2027Total(travelers.length, pkgId);

  function chooseRoute(id: RouteId) {
    const x = routeById(id);
    if (!x) return;
    setRoute(id);
    if (hour && !hoursFor(x, pkg).includes(hour)) setHour(null);
  }

  function choosePackage(id: PackageId) {
    setPkgId(id);
    const p = packageById(id);
    if (r && hour && !hoursFor(r, p).includes(hour)) setHour(null);
  }

  const missing = useMemo(() => {
    const m: string[] = [];
    if (!date) m.push(L(locale, { es: "Elige una fecha", en: "Pick a date", ja: "日付を選択" }));
    if (!route) m.push(L(locale, { es: "Elige una ruta", en: "Pick a route", ja: "ルートを選択" }));
    if (route && !hour) m.push(L(locale, { es: "Elige la hora de ingreso", en: "Pick an entry time", ja: "入場時間を選択" }));
    if (date && travelers.length > left) {
      m.push(
        L(locale, {
          es: `Para esa fecha solo quedan ${left} cupos de reserva: quita pasajeros o elige otro día`,
          en: `Only ${left} booking spots are left for that date: remove travelers or pick another day`,
          ja: `その日の予約枠は残り${left}名分です。人数を減らすか別の日を選んでください`,
        })
      );
    }
    travelers.forEach((t, i) => {
      const n = i + 1;
      if (t.fullName.trim().length < 3 || t.docNumber.trim().length < 4 || t.nationality.trim().length < 2 || !t.birthDate) {
        m.push(L(locale, { es: `Completa los datos del pasajero ${n}`, en: `Complete traveler ${n}'s details`, ja: `旅行者${n}の情報を入力` }));
      }
      if (!t.docUploaded) {
        m.push(L(locale, { es: `Sube la foto del documento del pasajero ${n}`, en: `Upload traveler ${n}'s ID photo`, ja: `旅行者${n}の書類写真をアップロード` }));
      }
    });
    if (!/^\S+@\S+\.\S+$/.test(email)) m.push(L(locale, { es: "Escribe tu email", en: "Enter your email", ja: "メールアドレスを入力" }));
    if (wa.replace(/\D/g, "").length < 6) m.push(L(locale, { es: "Escribe tu WhatsApp", en: "Enter your WhatsApp", ja: "WhatsApp番号を入力" }));
    if (!accept) m.push(L(locale, { es: "Acepta la política de reserva", en: "Accept the booking policy", ja: "予約ポリシーに同意" }));
    return m;
  }, [date, route, hour, travelers, email, wa, accept, locale, left]);

  const ready = missing.length === 0;
  const readyRef = useRef(ready);
  readyRef.current = ready;

  // Datos que viajan al servidor (el monto lo calcula el servidor).
  const payloadRef = useRef<() => Parameters<typeof createMp2027Order>[0]>(null as never);
  payloadRef.current = () => ({
    draftId,
    pkg: pkgId,
    date: date!,
    route: route!,
    hour: hour!,
    travelers: travelers.map(({ docUploaded: _d, ...t }) => t),
    email,
    whatsapp: wa,
    hotel,
    acceptPolicy: true,
    lang: locale,
  });

  const rawDate = date
    ? new Date(date + "T00:00:00Z").toLocaleDateString(DATE_LOCALE[locale], {
        weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      })
    : "—";
  const dateLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const waSummary = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hi Danfer Tours! I'd like to pre-book Machu Picchu ${pkg.name.en} 2027: ${date ?? "-"}, Route ${route ?? "-"} at ${hour ?? "-"}, ${travelers.length} traveler(s).`
  )}`;

  if (paid) {
    return (
      <div className="max-w-2xl mx-4 sm:mx-auto mt-28 md:mt-36 rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 text-center shadow-soft">
        <div className="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-night">
          {L(locale, { es: "¡Pre-reserva confirmada!", en: "Pre-booking confirmed!", ja: "事前予約が完了しました！" })}
        </h2>
        <p className="mt-3 text-night/65">
          {L(locale, {
            es: "Recibimos tu pago. Compraremos tu entrada apenas abra la venta oficial 2027 y te enviaremos todo por WhatsApp y email.",
            en: "We received your payment. We'll buy your ticket as soon as official 2027 sales open and send everything by WhatsApp and email.",
            ja: "お支払いを確認しました。2027年の公式販売が始まり次第チケットを購入し、WhatsAppとメールでお知らせします。",
          })}
        </p>
        <div className="mt-6 inline-block rounded-2xl bg-stone px-6 py-4 text-left text-sm">
          <div><span className="text-night/50">{L(locale, { es: "Código", en: "Code", ja: "予約コード" })}:</span> <b className="font-mono">{paid}</b></div>
          <div><span className="text-night/50">{L(locale, { es: "Paquete", en: "Package", ja: "プラン" })}:</span> {L(locale, pkg.name)}</div>
          <div><span className="text-night/50">{L(locale, { es: "Fecha", en: "Date", ja: "日付" })}:</span> {dateLabel}</div>
          <div><span className="text-night/50">{L(locale, { es: "Ruta", en: "Route", ja: "ルート" })}:</span> {route} · {r && L(locale, r.name)} · {hour}</div>
        </div>
      </div>
    );
  }

  const waDate = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    L(locale, {
      es: `Hola Danfer Tours, quiero reservar Machu Picchu ${date ? `para el ${dateLabel}` : "en 2027"}, ${travelers.length} pasajero(s), ${pkg.name.es}. ¿Me confirman precio y qué incluye?`,
      en: `Hi Danfer Tours, I'd like to book Machu Picchu ${date ? `for ${dateLabel}` : "in 2027"}, ${travelers.length} traveler(s), ${pkg.name.en}. Could you confirm the price and what's included?`,
      ja: `Danfer Toursさん、マチュピチュを予約したいです（${date ? dateLabel : "2027年"}、${travelers.length}名、${pkg.name.ja}）。料金と内容を教えてください。`,
    })
  )}`;
  const maxGuests = Math.min(MAX_TRAVELERS, left);
  function setGuests(n: number) {
    const k = Math.max(1, Math.min(maxGuests, n));
    setTravelers((arr) => (k > arr.length ? [...arr, ...Array.from({ length: k - arr.length }, emptyTraveler)] : arr.slice(0, k)));
  }
  const label = "block text-[15px] font-semibold text-night mb-1.5";

  return (
    <>
      {/* ───── Portada: foto + calendario + reserva ───── */}
      <section className="relative isolate">
        <Image
          src="/images/rutas-mp/1b.jpg"
          alt={L(locale, { es: "Machu Picchu visto desde la terraza superior", en: "Machu Picchu seen from the upper terrace", ja: "上部テラスから見たマチュピチュ" })}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/55 via-night/15 to-night/35" aria-hidden />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-36 pb-10 md:pb-14">
          <h1 className="max-w-3xl font-display text-3xl sm:text-5xl text-white leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-white text-base sm:text-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">{subtitle}</p>
          )}

          <div className="mt-6 md:mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)] items-start">
            <div className="min-w-0">
              <Mp2027Calendar locale={locale} value={date} onChange={pickDate} booked={booked} />
              <RoutesCarousel locale={locale} />
            </div>

            <div className="rounded-xl bg-white p-5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)]">
              <h2 className="text-2xl font-semibold text-night">
                {L(locale, { es: "Tu reserva", en: "Booking", ja: "ご予約" })}
              </h2>

              <div className="mt-4">
                <span className={label}>{L(locale, { es: "Fecha de ingreso", en: "Entry date", ja: "入場日" })}</span>
                <div className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2.5 ${date ? "border-night/30 text-night" : "border-night/20 text-night/50"}`}>
                  <span>{date ? dateLabel : L(locale, { es: "Elige un día en el calendario", en: "Pick a day on the calendar", ja: "カレンダーで日付を選択" })}</span>
                  <CalendarDays className="w-5 h-5 shrink-0 text-night/50" />
                </div>
                {date && (
                  <p className="mt-1.5 text-sm font-medium text-green-700">
                    {booked[date]
                      ? L(locale, {
                          es: `Quedan ${left} cupos de reserva ese día`,
                          en: `${left} booking spots left that day`,
                          ja: `この日の予約枠：残り${left}名`,
                        })
                      : L(locale, {
                          es: `${left} cupos de reserva para ese día`,
                          en: `${left} booking spots for that day`,
                          ja: `この日の予約枠：${left}名`,
                        })}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <span className={label}>{L(locale, { es: "Pasajeros", en: "Number of guests", ja: "人数" })}</span>
                <div className="flex items-stretch rounded-md border border-night/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setGuests(travelers.length - 1)}
                    disabled={travelers.length <= 1}
                    aria-label={L(locale, { es: "Quitar pasajero", en: "Remove guest", ja: "人数を減らす" })}
                    className="w-11 grid place-items-center bg-night/5 text-night disabled:text-night/25 hover:bg-night/10 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 py-2.5 text-center text-night tabular-nums">{travelers.length}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(travelers.length + 1)}
                    disabled={travelers.length >= maxGuests}
                    aria-label={L(locale, { es: "Agregar pasajero", en: "Add guest", ja: "人数を増やす" })}
                    className="w-11 grid place-items-center bg-night/5 text-night disabled:text-night/25 hover:bg-night/10 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <fieldset className="mt-4">
                <legend className={label}>{L(locale, { es: "Paquete", en: "Package", ja: "プラン" })}</legend>
                <div className="space-y-2">
                  {PACKAGES.map((p) => (
                    <label key={p.id} className="flex items-center gap-2.5 cursor-pointer text-night">
                      <input
                        type="radio"
                        name="mp-pkg"
                        checked={p.id === pkgId}
                        onChange={() => choosePackage(p.id)}
                        className="w-[18px] h-[18px] accent-green-600"
                      />
                      <span className="flex-1">{L(locale, p.name)}</span>
                      <span className="text-night/70 tabular-nums">US${p.price}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div key={pkg.id} className="mt-3 rounded-md bg-green-50 px-3 py-2.5">
                <div className="text-xs font-semibold text-night">
                  {L(locale, { es: "Incluye", en: "Includes", ja: "含まれるもの" })}
                </div>
                <ul className="mt-1.5 space-y-1">
                  {pkg.includes.map((inc) => (
                    <li key={inc.es} className="flex gap-1.5 text-[13px] text-night/80 leading-snug">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-600" />
                      {L(locale, inc)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-night/55">
                  <span className="font-semibold">{L(locale, { es: "No incluye:", en: "Not included:", ja: "含まれないもの：" })}</span>{" "}
                  {L(locale, pkg.excludes)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-[1.6fr_1fr] gap-2">
                <label className="block">
                  <span className={label}>{L(locale, { es: "Ruta", en: "Route", ja: "ルート" })}</span>
                  <select
                    value={route ?? ""}
                    onChange={(e) => chooseRoute(e.target.value as RouteId)}
                    className="w-full rounded-md border border-night/20 bg-white px-2.5 py-2.5 text-night"
                  >
                    <option value="" disabled>
                      {L(locale, { es: "Elige tu ruta", en: "Choose a route", ja: "ルートを選択" })}
                    </option>
                    {([1, 2, 3] as const).map((c) => (
                      <optgroup key={c} label={L(locale, { es: `Circuito ${c}`, en: `Circuit ${c}`, ja: `サーキット${c}` })}>
                        {ROUTES.filter((x) => x.circuit === c).map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.id} · {L(locale, x.name)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={label}>{L(locale, { es: "Hora", en: "Time", ja: "時間" })}</span>
                  <select
                    value={hour ?? ""}
                    onChange={(e) => setHour(e.target.value)}
                    disabled={!r}
                    className="w-full rounded-md border border-night/20 bg-white px-2.5 py-2.5 text-night disabled:bg-night/5 disabled:text-night/40"
                  >
                    <option value="" disabled>
                      --:--
                    </option>
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-1.5 text-xs text-night/55">
                {L(locale, {
                  es: "La hora exacta se confirma al comprar tu boleto.",
                  en: "The exact time is confirmed when we buy your ticket.",
                  ja: "正確な時間はチケット購入時に確定します。",
                })}
              </p>

              <div className="mt-4 flex items-baseline justify-between border-t border-night/10 pt-3">
                <span className="text-sm text-night/60">
                  US${pkg.price} × {travelers.length}
                </span>
                <span className="text-2xl font-semibold text-night tabular-nums">US${totals.subtotal.toLocaleString("en-US")}</span>
              </div>

              <button
                type="button"
                onClick={date ? goToPackages : undefined}
                disabled={!date}
                className="mt-4 w-full rounded-md bg-green-600 py-3 text-lg font-medium text-white hover:bg-green-700 disabled:bg-green-600/45 disabled:cursor-not-allowed transition"
              >
                {L(locale, { es: "Reservar", en: "Book now", ja: "予約する" })}
              </button>
              <a
                href={waDate}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 text-base font-semibold text-white hover:bg-[#1fb857] transition"
              >
                <MessageCircle className="w-5 h-5" />
                {date
                  ? L(locale, { es: "Consultar disponibilidad por WhatsApp", en: "Check availability on WhatsApp", ja: "WhatsAppで空き状況を確認" })
                  : L(locale, { es: "Consultar por WhatsApp", en: "Ask on WhatsApp", ja: "WhatsAppで問い合わせ" })}
              </a>

              {/* Separar la fecha sin pagar: solo nombre y WhatsApp. */}
              {holdSent ? (
                <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-night">
                  <p className="font-semibold text-emerald-800">
                    {L(locale, { es: "¡Fecha separada!", en: "Date on hold!", ja: "日付を仮押さえしました！" })}
                  </p>
                  <p className="mt-1 text-night/70">
                    {L(locale, {
                      es: "Te escribimos por WhatsApp para confirmar tu reserva. No pagas nada hasta que todo esté confirmado.",
                      en: "We'll message you on WhatsApp to confirm your booking. You pay nothing until everything is confirmed.",
                      ja: "WhatsAppでご予約の確認をご連絡します。すべて確定するまでお支払いは不要です。",
                    })}
                  </p>
                  <a
                    href={waDate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-semibold text-[#128C4B] hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {L(locale, { es: "Escribirnos ahora", en: "Message us now", ja: "今すぐメッセージ" })}
                  </a>
                </div>
              ) : !holdOpen ? (
                <button
                  type="button"
                  onClick={() => setHoldOpen(true)}
                  disabled={!date}
                  className="mt-3 w-full text-sm font-semibold text-night/70 underline underline-offset-4 hover:text-night disabled:no-underline disabled:text-night/35 disabled:cursor-not-allowed"
                >
                  {L(locale, { es: "Separar mi fecha sin pagar", en: "Hold my date without paying", ja: "支払いなしで日付を仮押さえ" })}
                </button>
              ) : (
                <form
                  className="mt-4 space-y-2.5 rounded-lg border border-night/10 bg-stone/60 p-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!date || holdBusy) return;
                    setHoldBusy(true);
                    setHoldError(null);
                    const res = await createMp2027Hold({
                      name: holdName,
                      whatsapp: holdWa,
                      email: holdEmail,
                      date,
                      pkg: pkgId,
                      travelers: travelers.length,
                      route: route ?? "",
                      hour: hour ?? "",
                      lang: locale,
                      website: holdTrap,
                    });
                    setHoldBusy(false);
                    if (res.ok) setHoldSent(true);
                    else
                      setHoldError(
                        L(locale, {
                          es: "Revisa tu nombre y tu WhatsApp e intenta de nuevo.",
                          en: "Please check your name and WhatsApp and try again.",
                          ja: "お名前とWhatsApp番号をご確認のうえ、もう一度お試しください。",
                        })
                      );
                  }}
                >
                  <p className="text-xs text-night/60">
                    {L(locale, {
                      es: "Separamos tu fecha y te escribimos por WhatsApp. Sin pago y sin datos de pasaporte por ahora.",
                      en: "We hold your date and message you on WhatsApp. No payment and no passport details for now.",
                      ja: "日付を仮押さえし、WhatsAppでご連絡します。今はお支払いもパスポート情報も不要です。",
                    })}
                  </p>
                  <input
                    className={input}
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder={L(locale, { es: "Tu nombre", en: "Your name", ja: "お名前" })}
                    value={holdName}
                    onChange={(e) => setHoldName(e.target.value)}
                  />
                  <input
                    className={input}
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder={L(locale, { es: "WhatsApp con código de país", en: "WhatsApp with country code", ja: "WhatsApp（国番号から）" })}
                    value={holdWa}
                    onChange={(e) => setHoldWa(e.target.value)}
                  />
                  <input
                    className={input}
                    type="email"
                    autoComplete="email"
                    placeholder={L(locale, { es: "Email (opcional)", en: "Email (optional)", ja: "メール（任意）" })}
                    value={holdEmail}
                    onChange={(e) => setHoldEmail(e.target.value)}
                  />
                  {/* trampa para bots: invisible para personas */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                    value={holdTrap}
                    onChange={(e) => setHoldTrap(e.target.value)}
                  />
                  {holdError && <p className="text-xs text-rose-700">{holdError}</p>}
                  <button
                    type="submit"
                    disabled={holdBusy}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-night py-2.5 text-sm font-semibold text-white hover:bg-night/90 disabled:opacity-60 transition"
                  >
                    {holdBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                    {L(locale, { es: "Separar mi fecha", en: "Hold my date", ja: "日付を仮押さえ" })}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {intro}

      {date && (
      <div className="mt-12 space-y-12 animate-[mpReveal_.4s_ease-out]">
      <style>{`@keyframes mpReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      <Step n={2} id="mp-paso-2" title={L(locale, { es: "Pasajeros", en: "Travelers", ja: "旅行者" })}>
        <div className="space-y-4">
          {travelers.map((t, i) => (
            <TravelerCard
              key={i}
              locale={locale}
              index={i + 1}
              draftId={draftId}
              value={t}
              onChange={(v) => setTravelers((arr) => arr.map((x, j) => (j === i ? v : x)))}
              onRemove={i > 0 && i === travelers.length - 1 ? () => setTravelers((arr) => arr.slice(0, -1)) : undefined}
            />
          ))}
          {travelers.length < Math.min(MAX_TRAVELERS, left) && (
            <button
              type="button"
              onClick={() => setTravelers((arr) => [...arr, emptyTraveler()])}
              className="w-full rounded-2xl border-2 border-dashed border-night/15 py-4 text-night font-semibold hover:border-gold hover:text-gold transition inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {L(locale, { es: "Agregar pasajero", en: "Add traveler", ja: "旅行者を追加" })}
            </button>
          )}
        </div>
      </Step>

      <Step n={3} title={L(locale, { es: "Datos de contacto", en: "Contact details", ja: "連絡先" })}>
        <div className="grid sm:grid-cols-2 gap-4 rounded-2xl border border-night/10 bg-white p-5 sm:p-6">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">Email</span>
            <input type="email" className={`${input} mt-1.5`} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">WhatsApp</span>
            <input type="tel" className={`${input} mt-1.5`} value={wa} onChange={(e) => setWa(e.target.value)} placeholder="+1 555 123 4567" autoComplete="tel" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-night/50">
              {L(locale, {
                es: "Hotel en Cusco para el recojo (opcional)",
                en: "Hotel in Cusco for pickup (optional)",
                ja: "送迎用のクスコのホテル（任意）",
              })}
            </span>
            <input className={`${input} mt-1.5`} value={hotel} onChange={(e) => setHotel(e.target.value)} />
          </label>
        </div>
      </Step>

      <Step n={4} title={L(locale, { es: "Resumen y pago", en: "Summary and payment", ja: "確認とお支払い" })}>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-night/10 bg-white p-5 sm:p-6 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between gap-4"><dt className="text-night/55">{L(locale, { es: "Tour", en: "Tour", ja: "ツアー" })}</dt><dd className="font-semibold text-right">Machu Picchu · {L(locale, pkg.name)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-night/55">{L(locale, { es: "Fecha", en: "Date", ja: "日付" })}</dt><dd className="text-right">{dateLabel}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-night/55">{L(locale, { es: "Ruta", en: "Route", ja: "ルート" })}</dt><dd className="text-right">{r ? `${r.id} · ${L(locale, r.name)}` : "—"}{hour ? ` · ${hour}` : ""}</dd></div>
              <div className="flex justify-between gap-4 border-t border-night/8 pt-2"><dt className="text-night/55">US$ {pkg.price} × {travelers.length}</dt><dd>{usd(totals.subtotal)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-night/55">{L(locale, { es: "Pago con tarjeta (+5%)", en: "Card payment (+5%)", ja: "カード手数料（5%）" })}</dt><dd>{usd(totals.fee)}</dd></div>
              <div className="flex justify-between gap-4 border-t-2 border-night pt-2 text-base"><dt className="font-semibold">{L(locale, { es: "Total", en: "Total", ja: "合計" })}</dt><dd className="font-display text-2xl text-gold">{usd(totals.total)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-night/55">
              {pkg.includes.map((inc) => L(locale, inc)).join(" · ")}
            </p>
          </div>

          <div className="rounded-2xl border border-night/10 bg-white p-5 sm:p-6">
            <label className="flex items-start gap-3 text-sm text-night/75 cursor-pointer">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1 accent-[#C8901E] w-4 h-4" />
              <span>
                {L(locale, {
                  es: "Entiendo que la venta oficial 2027 aún no abre. Si al abrir no hay cupo en mi fecha, ruta u hora, me ofrecerán otra opción o me devolverán el 100% del pago.",
                  en: "I understand official 2027 sales haven't opened yet. If there's no availability for my date, route or time when they open, I'll be offered another option or a 100% refund.",
                  ja: "2027年の公式販売はまだ始まっていないことを理解しています。販売開始時にご希望の日付・ルート・時間に空きがない場合は、別の候補のご提案か全額返金となります。",
                })}
              </span>
            </label>

            <div className="mt-5">
              {!ready && (
                <div className="rounded-xl bg-stone p-4 mb-4">
                  <div className="text-sm font-semibold text-night mb-2">
                    {L(locale, { es: "Para pagar falta:", en: "Before paying:", ja: "お支払い前に必要な項目：" })}
                  </div>
                  <ul className="text-sm text-night/65 list-disc pl-5 space-y-0.5">
                    {missing.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              {paypalClientId && (
                <PaypalButtons
                  clientId={paypalClientId}
                  locale={locale}
                  canPay={() => readyRef.current}
                  getPayload={() => payloadRef.current()}
                  onPaid={setPaid}
                  onError={setPayError}
                />
              )}
              {payError && <p className="text-sm text-rose-600 mt-3">{payError}</p>}
              <a
                href={waSummary}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#128C4B] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                {L(locale, { es: "¿Dudas? Escríbenos por WhatsApp", en: "Questions? Message us on WhatsApp", ja: "ご質問はWhatsAppで" })}
              </a>
            </div>
          </div>
        </div>
      </Step>
      </div>
      )}
      </div>
    </>
  );
}

function PaypalButtons({
  clientId,
  locale,
  canPay,
  getPayload,
  onPaid,
  onError,
}: {
  clientId: string;
  locale: Locale;
  canPay: () => boolean;
  getPayload: () => Parameters<typeof createMp2027Order>[0];
  onPaid: (code: string) => void;
  onError: (msg: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const cb = useRef({ canPay, getPayload, onPaid, onError });
  cb.current = { canPay, getPayload, onPaid, onError };

  useEffect(() => {
    const id = "paypal-sdk";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    const incomplete = L(locale, {
      es: "Completa los datos que faltan (lista de arriba) antes de pagar.",
      en: "Please complete the missing details (list above) before paying.",
      ja: "お支払いの前に、上の不足項目を入力してください。",
    });
    const fail = L(locale, {
      es: "No se pudo completar el pago. Inténtalo de nuevo o escríbenos por WhatsApp.",
      en: "Payment could not be completed. Please try again or message us on WhatsApp.",
      ja: "お支払いを完了できませんでした。もう一度お試しいただくか、WhatsAppでご連絡ください。",
    });

    // En desarrollo React monta el efecto dos veces: sin este control el SDK
    // dibuja dos veces y lanza "container element removed from DOM".
    let cancelled = false;
    let buttons: { render: (el: HTMLElement) => unknown; close?: () => unknown } | null = null;

    function render() {
      if (cancelled || buttons || !window.paypal || !ref.current) return;
      ref.current.innerHTML = "";
      buttons = window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },
          createOrder: async () => {
            cb.current.onError(null);
            if (!cb.current.canPay()) {
              cb.current.onError(incomplete);
              throw new Error("incomplete");
            }
            const res = await createMp2027Order(cb.current.getPayload());
            if (!res.ok) {
              cb.current.onError(res.error.startsWith("missing_doc") ? fail : fail);
              throw new Error(res.error);
            }
            return res.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await captureMp2027Order(data.orderID);
            if (!res.ok) {
              cb.current.onError(fail);
              return;
            }
            cb.current.onPaid(res.code);
          },
          onError: () => {
            if (!cb.current.canPay()) return; // ya se mostró el aviso de datos faltantes
            cb.current.onError(fail);
          },
        });
      Promise.resolve(buttons.render(ref.current)).catch(() => {});
      setLoading(false);
    }

    const cleanup = () => {
      cancelled = true;
      script?.removeEventListener("load", render);
      try {
        Promise.resolve(buttons?.close?.()).catch(() => {});
      } catch {}
    };

    if (script) {
      if (window.paypal) render();
      else script.addEventListener("load", render);
      return cleanup;
    }
    script = document.createElement("script");
    script.id = id;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.addEventListener("load", render);
    script.addEventListener("error", () => cb.current.onError(fail));
    document.body.appendChild(script);
    return cleanup;
  }, [clientId, locale]);

  return (
    <div>
      <div ref={ref} />
      {loading && (
        <div className="flex items-center gap-2 text-night/50 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {L(locale, { es: "Cargando opciones de pago…", en: "Loading payment options…", ja: "お支払い方法を読み込み中…" })}
        </div>
      )}
    </div>
  );
}
