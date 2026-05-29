"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, Smile, Globe2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const stats = [
  { icon: Calendar, value: 12, labelKey: "years" as const, suffix: "+" },
  { icon: Smile, value: 8500, labelKey: "travelers" as const, suffix: "+" },
  { icon: Globe2, value: 35, labelKey: "routes" as const, suffix: "" },
];

export function Stats() {
  const { m, locale } = useI18n();
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 bg-stone">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <div className="grid grid-cols-3 gap-6 mb-12">
            {stats.map((s, i) => (
              <Stat
                key={s.labelKey}
                {...s}
                label={m.sections.stats[s.labelKey]}
                delay={i * 0.15}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-night/70 leading-relaxed max-w-md"
          >
            {locale === "en" ? (
              <>
                We design itineraries for curious travelers: from the citadel of
                Machu Picchu at dawn to shamanic hikes through sacred valleys.
                The first 50 bookings of the month get{" "}
                <span className="text-gold font-semibold">15% off</span>.
              </>
            ) : (
              <>
                Diseñamos itinerarios para viajeros curiosos: desde la ciudadela
                de Machu Picchu al amanecer, hasta caminatas chamánicas por
                valles sagrados. Los primeros 50 reservantes del mes obtienen{" "}
                <span className="text-gold font-semibold">15% de descuento</span>.
              </>
            )}
          </motion.p>

          <div className="mt-8">
            <button className="text-gold hover:text-gold-bright text-sm font-medium underline-offset-4 hover:underline transition">
              {m.common.learnMore} →
            </button>
          </div>
        </div>

        <div className="relative h-[500px] hidden lg:block">
          <PolaroidGallery />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  suffix,
  delay,
}: {
  icon: typeof Calendar;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    }
  }, [inView, value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <Icon className="w-6 h-6 text-gold mx-auto mb-3" />
      <div className="flex items-baseline justify-center gap-0.5">
        <motion.span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-night">
          {rounded}
        </motion.span>
        <span className="font-display text-2xl sm:text-3xl text-gold">{suffix}</span>
      </div>
      <div className="mt-2 text-xs text-night/60 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

const polaroids = [
  {
    src: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=600&auto=format&fit=crop",
    rotate: -8,
    top: "5%",
    left: "0%",
  },
  {
    src: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&auto=format&fit=crop",
    rotate: 5,
    top: "10%",
    left: "30%",
  },
  {
    src: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600&auto=format&fit=crop",
    rotate: -3,
    top: "25%",
    left: "55%",
  },
];

function PolaroidGallery() {
  return (
    <>
      {polaroids.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: i * 0.18, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotate: 0, scale: 1.05, zIndex: 50 }}
          style={{ top: p.top, left: p.left }}
          className="absolute w-56 polaroid rounded-sm cursor-pointer"
        >
          <Image
            src={p.src}
            alt=""
            width={224}
            height={224}
            sizes="224px"
            loading="lazy"
            className="w-full h-56 object-cover rounded-sm"
          />
        </motion.div>
      ))}
    </>
  );
}
