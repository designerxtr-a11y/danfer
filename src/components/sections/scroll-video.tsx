"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const overlayMessages = [
  { at: 0.05, text: "Despega", sub: "Sobrevuela los Andes peruanos" },
  { at: 0.35, text: "Desciende", sub: "Hacia el corazón del imperio" },
  { at: 0.65, text: "Camina", sub: "Por senderos milenarios" },
  { at: 0.9, text: "Vive", sub: "Una experiencia que cambia vidas" },
];

export function ScrollVideoSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (!videoRef.current || !wrapperRef.current || !loaded) return;
      const video = videoRef.current;
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;

      const tween = gsap.to(video, {
        currentTime: duration - 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            // Update active message based on progress
            const idx = overlayMessages.findIndex((m, i) => {
              const next = overlayMessages[i + 1]?.at ?? 1;
              return self.progress >= m.at && self.progress < next;
            });
            if (idx !== -1) setActiveIndex(idx);
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: wrapperRef, dependencies: [loaded] }
  );

  return (
    <section
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: "350vh" }}
    >
      {/* Sticky video container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-night">
        <video
          ref={videoRef}
          src="https://videos.pexels.com/video-files/2228489/2228489-hd_1920_1080_24fps.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night/70 pointer-events-none" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            {overlayMessages.map((m, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i === activeIndex ? 1 : 0,
                  y: i === activeIndex ? 0 : 20,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center px-6"
              >
                <div>
                  <motion.div
                    className="font-hand text-gold text-3xl mb-3"
                  >
                    {m.sub}
                  </motion.div>
                  <h2 className="font-display text-7xl md:text-9xl text-white font-bold leading-none">
                    {m.text}
                  </h2>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {overlayMessages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === activeIndex ? "w-8 bg-gold" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-white/40 text-xs uppercase tracking-widest rotate-90 origin-center">
          Scroll para viajar →
        </div>
      </div>
    </section>
  );
}
