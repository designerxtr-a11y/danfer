"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Minus, Plus, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import type { AvailableDate } from "@/lib/queries/tours";
import type { Locale } from "@/types/database";

interface Props {
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  priceUsd: number;
  originalPrice: number | null;
  maxGroupSize: number;
  availability: AvailableDate[];
  whatsapp: string;
  locale?: Locale;
}

export function BookingWidget({
  tourTitle,
  priceUsd,
  originalPrice,
  maxGroupSize,
  availability,
  whatsapp,
  locale = "es",
}: Props) {
  const en = locale === "en";
  const [selectedDate, setSelectedDate] = useState<string | null>(
    availability[0]?.date ?? null
  );
  const [travelers, setTravelers] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedAvailability = useMemo(
    () => availability.find((a) => a.date === selectedDate),
    [availability, selectedDate]
  );

  const availableSpots = selectedAvailability
    ? selectedAvailability.total_spots - selectedAvailability.booked_spots
    : maxGroupSize;

  const personWord = en
    ? travelers === 1
      ? "person"
      : "people"
    : travelers === 1
    ? "persona"
    : "personas";

  const waMessage = en
    ? `Hi Danfer Tours! 👋 I'd like to ask about the price and availability for the "${tourTitle}" tour${
        selectedDate ? ` on ${formatDate(selectedDate, locale)}` : ""
      } for ${travelers} ${personWord}. Can you help me?`
    : `¡Hola Danfer Tours! 👋 Quiero consultar el precio y la disponibilidad del tour "${tourTitle}"${
        selectedDate ? ` para el ${formatDate(selectedDate, locale)}` : ""
      } para ${travelers} ${personWord}. ¿Me ayudan?`;

  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-night/8 rounded-3xl p-4 sm:p-6 shadow-card"
    >
      <div className="flex items-baseline gap-3 pb-5 border-b border-night/8">
        {originalPrice && (
          <span className="text-night/40 line-through text-lg">
            US${originalPrice.toFixed(0)}
          </span>
        )}
        <span className="font-display text-3xl sm:text-4xl text-gold font-bold">
          US${priceUsd.toFixed(0)}
        </span>
        <span className="text-night/60 text-sm">{en ? "/ person" : "/ persona"}</span>
      </div>

      <div className="mt-5">
        <label className="text-xs uppercase tracking-wider text-night/50">
          {en ? "Departure date" : "Fecha de salida"}
        </label>
        <button
          onClick={() => setShowCalendar((v) => !v)}
          className="mt-2 w-full flex items-center justify-between bg-stone hover:bg-cream rounded-xl px-4 py-3 transition"
        >
          <span className="flex items-center gap-2 text-night">
            <Calendar className="w-4 h-4 text-gold" />
            {selectedDate
              ? formatDate(selectedDate, locale)
              : en
              ? "Pick a date"
              : "Selecciona una fecha"}
          </span>
          <span className="text-night/40 text-xs">
            {availability.length} {en ? "dates" : "fechas"}
          </span>
        </button>

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 max-h-56 overflow-y-auto bg-stone rounded-xl p-2 space-y-1"
          >
            {availability.slice(0, 30).map((a) => {
              const spots = a.total_spots - a.booked_spots;
              const isSelected = a.date === selectedDate;
              return (
                <button
                  key={a.date}
                  onClick={() => {
                    setSelectedDate(a.date);
                    setShowCalendar(false);
                  }}
                  disabled={spots === 0}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-gold text-white font-semibold"
                      : spots === 0
                      ? "text-night/30 cursor-not-allowed"
                      : "text-night/80 hover:bg-white"
                  }`}
                >
                  <span>{formatDate(a.date, locale)}</span>
                  <span className="text-xs">
                    {spots > 0
                      ? `${spots} ${en ? "spots" : "cupos"}`
                      : en
                      ? "Full"
                      : "Lleno"}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      <div className="mt-5">
        <label className="text-xs uppercase tracking-wider text-night/50">
          {en ? "Travelers" : "Viajeros"}
        </label>
        <div className="mt-2 flex items-center justify-between bg-stone rounded-xl px-4 py-3">
          <button
            onClick={() => setTravelers((t) => Math.max(1, t - 1))}
            className="w-8 h-8 rounded-full bg-white hover:bg-gold hover:text-white text-night grid place-items-center transition shadow-soft"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-display text-xl text-night">
            {travelers} <span className="text-sm text-night/50">{personWord}</span>
          </span>
          <button
            onClick={() => setTravelers((t) => Math.min(availableSpots, t + 1))}
            disabled={travelers >= availableSpots}
            className="w-8 h-8 rounded-full bg-white hover:bg-gold hover:text-white text-night grid place-items-center transition disabled:opacity-40 shadow-soft"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold py-4 transition hover:shadow-glow"
      >
        <MessageCircle className="w-5 h-5" />
        {en ? "Ask price on WhatsApp" : "Consultar precio por WhatsApp"}
      </a>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-night/60">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span>{en ? "Fast reply" : "Respuesta rápida"}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>{en ? "No commitment" : "Sin compromiso"}</span>
        </div>
      </div>
    </motion.div>
  );
}

function formatDate(iso: string, locale: Locale) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "en" ? "en-US" : "es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
