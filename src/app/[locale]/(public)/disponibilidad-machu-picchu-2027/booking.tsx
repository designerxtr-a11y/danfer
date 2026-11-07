"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, CheckCircle2, Loader2, Plus, Mountain, Star, MessageCircle } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { ROUTES, PACKAGES, MAX_TRAVELERS, mp2027Total, routeById, packageById, hoursFor, type RouteId, type PackageId } from "@/lib/mp2027/data";
import type { Locale } from "@/types/database";
import { Mp2027Calendar } from "./calendar";
import { TravelerCard, emptyTraveler, type TravelerDraft } from "./traveler-card";
import { createMp2027Order, captureMp2027Order } from "./actions";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

const DATE_LOCALE: Record<Locale, string> = { es: "es-PE", en: "en-US", ja: "ja-JP" };
const input =
  "w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition";
const usd = (n: number) => `US$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-28">
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
}: {
  locale: Locale;
  paypalClientId?: string;
  whatsapp: string;
  booked?: Record<string, number>;
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

  const r = route ? routeById(route) : undefined;
  const pkg = packageById(pkgId)!;
  const hours = r ? hoursFor(r, pkg) : [];
  const totals = mp2027Total(travelers.length, pkgId);

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
  }, [date, route, hour, travelers, email, wa, accept, locale]);

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
      <div className="max-w-2xl mx-auto rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 text-center shadow-soft">
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

  return (
    <div className="space-y-12">
      <Step n={1} title={L(locale, { es: "Elige tu fecha en 2027", en: "Pick your 2027 date", ja: "2027年の日付を選ぶ" })}>
        <Mp2027Calendar locale={locale} value={date} onChange={setDate} booked={booked} />
      </Step>

      <Step n={2} title={L(locale, { es: "Elige tu paquete", en: "Choose your package", ja: "プランを選ぶ" })}>
        <div className="grid md:grid-cols-3 gap-3 items-start">
          {PACKAGES.map((p) => {
            const sel = p.id === pkgId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => choosePackage(p.id)}
                aria-pressed={sel}
                className={`text-left rounded-2xl border p-4 transition ${
                  sel ? "border-gold bg-gold/10 ring-2 ring-gold" : "border-night/10 bg-white hover:border-gold/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-night">{L(locale, p.name)}</span>
                  {L(locale, p.duration) !== L(locale, p.name) && (
                    <span className="text-[11px] font-semibold rounded-full bg-night/5 text-night/70 px-2 py-0.5 shrink-0">
                      {L(locale, p.duration)}
                    </span>
                  )}
                </div>
                <div className="mt-1 font-display text-2xl text-gold">
                  US$ {p.price}
                  <span className="text-xs text-night/50 font-sans"> / {L(locale, { es: "persona", en: "person", ja: "1名" })}</span>
                </div>
                <p className="mt-2 text-sm text-night/70">{L(locale, p.desc)}</p>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-night/45 font-semibold">
                  {L(locale, { es: "Incluye", en: "Includes", ja: "含まれるもの" })}
                </div>
                <ul className="mt-1.5 space-y-1">
                  {p.includes.map((inc) => (
                    <li key={inc.es} className="flex gap-2 text-[13px] text-night/75 leading-snug">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
                      {L(locale, inc)}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-night/50">
                  <span className="font-semibold">{L(locale, { es: "No incluye:", en: "Not included:", ja: "含まれないもの：" })}</span>{" "}
                  {L(locale, p.excludes)}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-night/55">
          {L(locale, {
            es: "La fecha del calendario es el día que entras a Machu Picchu.",
            en: "The calendar date is the day you enter Machu Picchu.",
            ja: "カレンダーの日付はマチュピチュに入場する日です。",
          })}
        </p>
      </Step>

      <Step n={3} title={L(locale, { es: "Ruta y hora de ingreso", en: "Route and entry time", ja: "ルートと入場時間" })}>
        <div className="space-y-6">
          {([1, 2, 3] as const).map((c) => (
            <div key={c}>
              <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">
                {L(locale, { es: `Circuito ${c}`, en: `Circuit ${c}`, ja: `サーキット${c}` })}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 items-start">
                {ROUTES.filter((x) => x.circuit === c).map((x) => {
                  const sel = x.id === route;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => {
                        setRoute(x.id);
                        if (hour && !hoursFor(x, pkg).includes(hour)) setHour(null);
                      }}
                      aria-pressed={sel}
                      className={`text-left rounded-2xl border p-4 transition ${
                        sel ? "border-gold bg-gold/10 ring-2 ring-gold" : "border-night/10 bg-white hover:border-gold/60"
                      }`}
                    >
                      {x.photo && (
                        <div className="relative -mx-4 -mt-4 mb-3 aspect-[16/9] overflow-hidden rounded-t-2xl">
                          <Image src={x.photo} alt={L(locale, x.name)} fill sizes="(min-width:640px) 400px, 100vw" className="object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-night/60 text-white text-[11px] px-3 py-1.5">
                            {x.photoCredit
                              ? `${L(locale, { es: "Vista de referencia", en: "Reference view", ja: "参考写真" })} · ${L(locale, { es: "Foto", en: "Photo", ja: "写真" })}: ${x.photoCredit}`
                              : L(locale, {
                                  es: `Foto tomada con el boleto Ruta ${x.id}`,
                                  en: `Photo taken with the Route ${x.id} ticket`,
                                  ja: `ルート${x.id}のチケットで撮影`,
                                })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold rounded-md bg-night text-white px-1.5 py-0.5">{x.id}</span>
                        <span className="font-semibold text-night">{L(locale, x.name)}</span>
                        {x.recommended && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                            <Star className="w-3 h-3" />
                            {L(locale, { es: "Recomendada", en: "Recommended", ja: "おすすめ" })}
                          </span>
                        )}
                        {x.mountain && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta bg-terracotta/10 rounded-full px-2 py-0.5">
                            <Mountain className="w-3 h-3" />
                            {L(locale, { es: "Cupos muy limitados", en: "Very limited spots", ja: "枠わずか" })}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-night/60">{L(locale, x.desc)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {r && (
            <div className="rounded-2xl bg-stone p-4 sm:p-5">
              <div className="text-sm font-semibold text-night mb-3">
                {L(locale, { es: "Hora de ingreso preferida", en: "Preferred entry time", ja: "希望入場時間" })}
              </div>
              <div className="flex flex-wrap gap-2">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHour(h)}
                    aria-pressed={h === hour}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      h === hour ? "bg-gold text-night" : "bg-white text-night hover:bg-gold/30"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-night/55">
                {L(locale, {
                  es: "La hora exacta se confirma al comprar tu boleto. Si tu hora no está disponible, te ofrecemos la más cercana.",
                  en: "The exact time is confirmed when we buy your ticket. If your time isn't available, we'll offer the closest one.",
                  ja: "正確な時間はチケット購入時に確定します。ご希望の時間が取れない場合は、一番近い時間をご提案します。",
                })}
              </p>
            </div>
          )}
        </div>
      </Step>

      <Step n={4} title={L(locale, { es: "Pasajeros", en: "Travelers", ja: "旅行者" })}>
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
          {travelers.length < MAX_TRAVELERS && (
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

      <Step n={5} title={L(locale, { es: "Datos de contacto", en: "Contact details", ja: "連絡先" })}>
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

      <Step n={6} title={L(locale, { es: "Resumen y pago", en: "Summary and payment", ja: "確認とお支払い" })}>
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

    function render() {
      if (!window.paypal || !ref.current) return;
      ref.current.innerHTML = "";
      window.paypal
        .Buttons({
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
        })
        .render(ref.current);
      setLoading(false);
    }

    if (script) {
      if (window.paypal) render();
      else script.addEventListener("load", render);
      return;
    }
    script = document.createElement("script");
    script.id = id;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.addEventListener("load", render);
    script.addEventListener("error", () => cb.current.onError(fail));
    document.body.appendChild(script);
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
