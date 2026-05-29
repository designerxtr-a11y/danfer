"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/types/database";

export function TourGallery({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) return null;

  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 sm:gap-3 h-[280px] sm:h-[360px] md:h-[420px]">
        <button
          onClick={() => setLightbox(0)}
          className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden group"
        >
          <Image
            src={main.url}
            alt={main.alt}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition duration-700"
          />
        </button>
        {rest.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i + 1)}
            className="relative rounded-2xl overflow-hidden group"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="25vw"
              className="object-cover group-hover:scale-105 transition duration-700"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-night/70 grid place-items-center text-white font-display text-2xl">
                +{images.length - 5}
              </div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-night-deep/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-gold"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-6 text-white/80 hover:text-gold"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p! - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              className="absolute right-6 text-white/80 hover:text-gold"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((p) => (p! + 1) % images.length);
              }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-5xl aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].url}
                alt={images[lightbox].alt}
                fill
                sizes="80vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
