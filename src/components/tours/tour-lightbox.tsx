"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/types/database";

/** Visor de fotos a pantalla completa. `index === null` lo mantiene cerrado. */
export function TourLightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-night-deep/95 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={onClose}
        >
          <button className="absolute top-6 right-6 text-white/80 hover:text-gold" onClick={onClose}>
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-6 text-white/80 hover:text-gold"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + images.length) % images.length);
            }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            className="absolute right-6 text-white/80 hover:text-gold"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % images.length);
            }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl aspect-[3/2]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={images[index].url} alt={images[index].alt} fill sizes="80vw" className="object-contain" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
