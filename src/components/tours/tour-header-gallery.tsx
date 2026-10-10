"use client";

import { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import type { GalleryImage, Locale } from "@/types/database";
import { TourLightbox } from "./tour-lightbox";

/**
 * Cabecera en mosaico para tours con 3+ fotos, sin huecos:
 * 5+ → 1 grande + 4 chicas · 4 → 1 grande + 1 ancha + 2 chicas ·
 * 3 → 1 grande + 2 apiladas. En móvil, carrusel deslizable con contador.
 */
export function TourHeaderGallery({
  images,
  locale = "es",
}: {
  images: GalleryImage[];
  locale?: Locale;
}) {
  const en = locale === "en";
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);
  const cols = thumbs.length === 2 ? "grid-cols-3" : "grid-cols-4";
  const thumbSpan = (i: number) => (thumbs.length === 3 && i === 0 ? "col-span-2" : "");

  return (
    <>
      {/* Desktop / tablet: mosaico */}
      <div className={`hidden md:grid ${cols} grid-rows-2 gap-3 h-[440px] lg:h-[520px]`}>
        <button
          onClick={() => setLightbox(0)}
          className="relative col-span-2 row-span-2 rounded-3xl overflow-hidden group"
        >
          <Image
            src={main.url}
            alt={main.alt}
            fill
            priority
            sizes="(min-width:1280px) 640px, 50vw"
            className="object-cover group-hover:scale-105 transition duration-700"
          />
        </button>
        {thumbs.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setLightbox(i + 1)}
            className={`relative rounded-3xl overflow-hidden group ${thumbSpan(i)}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes={
                thumbSpan(i)
                  ? "(min-width:1280px) 640px, 50vw"
                  : thumbs.length === 2
                    ? "(min-width:1280px) 430px, 34vw"
                    : "(min-width:1280px) 320px, 25vw"
              }
              className="object-cover group-hover:scale-105 transition duration-700"
            />
            {i === thumbs.length - 1 && images.length > thumbs.length + 1 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-night">
                <Images className="w-3.5 h-3.5" />
                {en ? `See all ${images.length}` : `Ver las ${images.length}`}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Móvil: carrusel */}
      <div className="md:hidden relative -mx-4 sm:-mx-6">
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            setCurrent(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setLightbox(i)}
              className="relative shrink-0 w-full aspect-[4/3] snap-center"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <span className="absolute bottom-3 right-4 rounded-full bg-night/70 px-3 py-1 text-xs font-medium text-white">
          {current + 1}/{images.length}
        </span>
      </div>

      <TourLightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </>
  );
}
