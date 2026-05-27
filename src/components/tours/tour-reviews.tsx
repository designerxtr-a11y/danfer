"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/types/database";

interface Props {
  reviews: Review[];
  avgRating: number;
  total: number;
}

export function TourReviews({ reviews, avgRating, total }: Props) {
  if (reviews.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-4xl text-night">Reseñas</h2>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-gold text-gold" />
          <span className="font-display text-2xl text-night">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-night/50 text-sm">({total} reseñas)</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="bg-white border border-night/8 shadow-soft rounded-2xl p-6 relative"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/30" />

            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${
                    j < r.rating ? "fill-gold text-gold" : "text-night/15"
                  }`}
                />
              ))}
            </div>

            {r.title && (
              <h4 className="font-display text-lg text-night mb-2">{r.title}</h4>
            )}
            {r.body && (
              <p className="text-night/70 text-sm leading-relaxed line-clamp-4">
                {r.body}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-night/8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-terracotta grid place-items-center font-display font-bold text-white">
                {r.author_name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-night">
                  {r.author_name}
                </div>
                {r.author_country && (
                  <div className="text-xs text-night/50">{r.author_country}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
