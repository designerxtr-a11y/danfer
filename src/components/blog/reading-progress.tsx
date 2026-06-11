"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Barra dorada de progreso de lectura, fija arriba del viewport.
 * Señal visual "pro" estándar en blogs editoriales largos.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-gold to-gold-bright z-[70] pointer-events-none"
    />
  );
}
