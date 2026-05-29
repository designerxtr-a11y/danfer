"use client";

import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Moon, Tent } from "lucide-react";
import type { ItineraryDay } from "@/lib/queries/tours";
import { t } from "@/types/database";

const mealIcon: Record<string, typeof Coffee> = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Moon,
};

const mealLabel: Record<string, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

export function TourItinerary({ days }: { days: ItineraryDay[] }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night mb-8">Itinerario día a día</h2>
      <div className="relative">
        <div className="absolute left-5 sm:left-6 top-3 bottom-3 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />

        <div className="space-y-8">
          {days.map((day, i) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative pl-14 sm:pl-20"
            >
              <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold text-white font-display font-bold text-lg sm:text-xl grid place-items-center shadow-glow">
                {day.day_number}
              </div>

              <div className="bg-white border border-night/8 shadow-soft rounded-2xl p-4 sm:p-6 hover:border-gold/40 hover:shadow-card transition">
                <h3 className="font-display text-xl sm:text-2xl text-night">
                  {t(day.title)}
                </h3>
                {day.description && (
                  <p className="mt-3 text-night/70 leading-relaxed">
                    {t(day.description)}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                  {day.meals.map((m) => {
                    const Icon = mealIcon[m] ?? UtensilsCrossed;
                    return (
                      <span
                        key={m}
                        className="flex items-center gap-1.5 text-night/70 bg-stone rounded-full px-3 py-1.5"
                      >
                        <Icon className="w-3.5 h-3.5 text-gold" />
                        {mealLabel[m]}
                      </span>
                    );
                  })}
                  {day.accommodation && (
                    <span className="flex items-center gap-1.5 text-night/70 bg-stone rounded-full px-3 py-1.5">
                      <Tent className="w-3.5 h-3.5 text-gold" />
                      {t(day.accommodation)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
