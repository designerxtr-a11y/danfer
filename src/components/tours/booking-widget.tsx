"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Minus, Plus, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AvailableDate } from "@/lib/queries/tours";

interface Props {
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  priceUsd: number;
  originalPrice: number | null;
  maxGroupSize: number;
  availability: AvailableDate[];
}

export function BookingWidget({
  tourSlug,
  priceUsd,
  originalPrice,
  maxGroupSize,
  availability,
}: Props) {
  const router = useRouter();
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

  const total = priceUsd * travelers;

  const handleBook = () => {
    if (!selectedDate) return;
    router.push(`/reservar/${tourSlug}?date=${selectedDate}&travelers=${travelers}`);
  };

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
        <span className="text-night/60 text-sm">/ persona</span>
      </div>

      <div className="mt-5">
        <label className="text-xs uppercase tracking-wider text-night/50">
          Fecha de salida
        </label>
        <button
          onClick={() => setShowCalendar((v) => !v)}
          className="mt-2 w-full flex items-center justify-between bg-stone hover:bg-cream rounded-xl px-4 py-3 transition"
        >
          <span className="flex items-center gap-2 text-night">
            <Calendar className="w-4 h-4 text-gold" />
            {selectedDate ? formatDate(selectedDate) : "Selecciona una fecha"}
          </span>
          <span className="text-night/40 text-xs">{availability.length} fechas</span>
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
                  <span>{formatDate(a.date)}</span>
                  <span className="text-xs">
                    {spots > 0 ? `${spots} cupos` : "Lleno"}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      <div className="mt-5">
        <label className="text-xs uppercase tracking-wider text-night/50">
          Viajeros
        </label>
        <div className="mt-2 flex items-center justify-between bg-stone rounded-xl px-4 py-3">
          <button
            onClick={() => setTravelers((t) => Math.max(1, t - 1))}
            className="w-8 h-8 rounded-full bg-white hover:bg-gold hover:text-white text-night grid place-items-center transition shadow-soft"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-display text-xl text-night">
            {travelers}{" "}
            <span className="text-sm text-night/50">
              {travelers === 1 ? "persona" : "personas"}
            </span>
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

      <div className="mt-6 pt-5 border-t border-night/8 flex items-baseline justify-between">
        <span className="text-night/70 text-sm">Total</span>
        <span className="font-display text-3xl text-night font-bold">
          US${total.toLocaleString()}
        </span>
      </div>

      <button
        onClick={handleBook}
        disabled={!selectedDate || availableSpots === 0}
        className="mt-5 w-full rounded-full bg-gold hover:bg-gold-bright text-white font-semibold py-4 transition hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reservar ahora
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-night/60">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span>Pago seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-gold" />
          <span>Confirmación instantánea</span>
        </div>
      </div>
    </motion.div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
