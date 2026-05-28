"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PHONE = "51984123456"; // sin el +, formato WhatsApp wa.me
const DEFAULT_MESSAGE =
  "Hola Danfer Tours! 👋 Quiero información sobre un tour en Cusco.";

const WhatsAppIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
  </svg>
);

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Mostrar el tooltip "Pregúntanos por WhatsApp" después de 3 segundos
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setShowTooltip(true), 3000);
    const t2 = setTimeout(() => setShowTooltip(false), 9000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [dismissed]);

  const openChat = (message: string) => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      {/* Tooltip card que aparece automáticamente */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-40 max-w-[260px] bg-white rounded-2xl shadow-card border border-night/8 p-4 pr-9"
          >
            <button
              onClick={() => {
                setShowTooltip(false);
                setDismissed(true);
              }}
              className="absolute top-2 right-2 grid place-items-center w-6 h-6 rounded-full hover:bg-night/5 text-night/40 transition"
              aria-label="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="grid place-items-center w-9 h-9 rounded-full bg-[#25D366]/15 shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <div className="font-display text-night text-sm font-semibold leading-tight">
                  ¿Necesitas ayuda?
                </div>
                <div className="mt-1 text-xs text-night/60 leading-relaxed">
                  Escríbenos por WhatsApp y un asesor te responde en minutos.
                </div>
              </div>
            </div>
            {/* Pointer hacia el botón */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-r border-b border-night/8 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel expandido con opciones rápidas */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-40 w-[300px] bg-white rounded-3xl shadow-card border border-night/8 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#075E54] text-white px-5 py-4 flex items-start gap-3">
              <div className="grid place-items-center w-11 h-11 rounded-full bg-white/15 shrink-0 relative">
                <WhatsAppIcon className="w-6 h-6 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-semibold leading-tight">
                  Danfer Tours Cusco
                </div>
                <div className="text-[11px] text-white/80 mt-0.5">
                  En línea · responde en minutos
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid place-items-center w-7 h-7 rounded-full hover:bg-white/10 transition"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-night leading-snug">
                  ¡Hola! 👋 Soy parte del equipo de{" "}
                  <strong>Danfer Tours Cusco</strong>. ¿En qué te ayudo? Elige
                  una opción rápida:
                </p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="p-4 pt-0 bg-[#ECE5DD] space-y-2">
              {[
                {
                  label: "Quiero info de Machu Picchu",
                  message:
                    "Hola Danfer Tours! 👋 Me interesa el tour a Machu Picchu, ¿pueden contarme más sobre fechas y precios?",
                },
                {
                  label: "Camino Inca 4 días",
                  message:
                    "Hola Danfer Tours! 👋 Quiero información sobre el Camino Inca de 4 días — disponibilidad, precio y qué incluye.",
                },
                {
                  label: "Armar paquete completo",
                  message:
                    "Hola Danfer Tours! 👋 Voy a Cusco por varios días y quiero armar un paquete (Machu Picchu + Valle Sagrado + más). ¿Me pueden ayudar?",
                },
                {
                  label: "Otra consulta",
                  message: DEFAULT_MESSAGE,
                },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => openChat(q.message)}
                  className="w-full text-left bg-white hover:bg-gold/10 border border-night/8 hover:border-gold/40 rounded-xl px-4 py-2.5 text-sm text-night transition"
                >
                  {q.label} →
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-night/8 text-center">
              <div className="text-[10px] uppercase tracking-widest text-night/40">
                Horario hoy
              </div>
              <div className="text-xs text-night/70 mt-0.5">
                Lun-Vie 8am - 8pm · Sáb 9am - 6pm
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante principal */}
      <motion.button
        onClick={() => {
          setOpen((o) => !o);
          setShowTooltip(false);
          setDismissed(true);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.7)] transition-shadow"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center"
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="wa"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center relative"
            >
              <WhatsAppIcon className="w-7 h-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
