"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types/database";
import { t } from "@/types/database";

export function TourFaqs({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-night mb-6">Preguntas frecuentes</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="bg-white border border-night/8 rounded-2xl overflow-hidden shadow-soft hover:border-gold/40 transition"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left"
              >
                <span className="font-display text-base sm:text-lg text-night">
                  {t(faq.q)}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-5 text-night/75 leading-relaxed text-sm sm:text-base">
                      {t(faq.a)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
