"use client";

import { Quote, Star } from "lucide-react";
import type { GlobalReview } from "@/lib/queries/reviews";
import { t, type Locale } from "@/types/database";

export function TestimonialsMarquee({
  reviews,
  locale,
}: {
  reviews: GlobalReview[];
  locale: Locale;
}) {
  return (
    <div className="group relative flex">
      {[0, 1].map((track) => (
        <div
          key={track}
          aria-hidden={track === 1}
          className="flex min-w-full shrink-0 items-stretch gap-6 px-4 sm:px-6 animate-marquee-slow group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {reviews.map((review) => (
            <ReviewCard
              key={`${track}-${review.id}`}
              review={review}
              locale={locale}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  locale,
}: {
  review: GlobalReview;
  locale: Locale;
}) {
  return (
    <div className="w-[340px] sm:w-[400px] shrink-0 rounded-3xl bg-white shadow-card border border-night/5 p-6 sm:p-7 flex flex-col">
      <Quote className="w-8 h-8 text-gold/40" />

      <div className="flex gap-1 mt-4 mb-3">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            className={`w-4 h-4 ${
              j < review.rating ? "fill-gold text-gold" : "text-night/15"
            }`}
          />
        ))}
      </div>

      {review.title && (
        <h3 className="font-display text-xl text-night">{review.title}</h3>
      )}
      {review.body && (
        <p className="mt-2 text-night/70 text-sm leading-relaxed line-clamp-4">
          {review.body}
        </p>
      )}

      <div className="mt-5 pt-5 border-t border-night/5 flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-terracotta grid place-items-center font-display text-lg font-bold text-white">
          {review.author_name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-night text-sm truncate">
            {review.author_name}
          </div>
          <div className="text-night/50 text-xs truncate">
            {review.author_country ||
              (review.tour && t(review.tour.title, locale))}
          </div>
        </div>
      </div>
    </div>
  );
}
