"use client";

import { useState } from "react";
import Image from "next/image";
import { TourLightbox } from "./tour-lightbox";
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

      <TourLightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </>
  );
}
