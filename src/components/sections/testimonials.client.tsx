"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { GlobalReview } from "@/lib/queries/reviews";
import { t, type Locale } from "@/types/database";

export function TestimonialsCarousel({
  reviews,
  locale,
}: {
  reviews: GlobalReview[];
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
      {/* Image */}
      <div className="relative h-[420px] lg:h-[560px] rounded-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={review.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {review.tour && (
              <Image
                src={review.tour.cover_image}
                alt={t(review.tour.title, locale)}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
            {review.tour && (
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-hand text-gold-bright text-xl">
                  {locale === "en" ? "Review of" : "Reseña sobre"}
                </span>
                <h4 className="font-display text-2xl mt-1">
                  {t(review.tour.title, locale)}
                </h4>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quote */}
      <div className="relative bg-white rounded-3xl shadow-card border border-night/5 p-8 lg:p-12 flex flex-col justify-center">
        <Quote className="w-14 h-14 text-gold/40" />

        <AnimatePresence mode="wait">
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex gap-1 mt-6 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-5 h-5 ${
                    j < review.rating ? "fill-gold text-gold" : "text-night/15"
                  }`}
                />
              ))}
            </div>

            {review.title && (
              <h3 className="font-display text-3xl text-night">{review.title}</h3>
            )}
            {review.body && (
              <p className="mt-4 text-night/70 text-lg leading-relaxed">
                {review.body}
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-terracotta grid place-items-center font-display text-2xl font-bold text-white">
                {review.author_name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-night text-lg">
                  {review.author_name}
                </div>
                {review.author_country && (
                  <div className="text-night/50 text-sm">
                    {review.author_country}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-night/15 hover:border-gold hover:text-gold text-night/70 grid place-items-center transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-night/15 hover:border-gold hover:text-gold text-night/70 grid place-items-center transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-night/40 text-sm font-mono">
            {String(index + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
