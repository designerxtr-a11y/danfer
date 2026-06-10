"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.72 3.72 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.88 5.88 0 0 0 1.38 2.13 5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
);

const TikTokIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.74a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1.84-.12Z" />
  </svg>
);

const PeruFlag = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 6 4" {...p}>
    <rect width="2" height="4" fill="#D91023" />
    <rect x="2" width="2" height="4" fill="#fff" />
    <rect x="4" width="2" height="4" fill="#D91023" />
  </svg>
);

const USFlag = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 7 5" {...p}>
    {Array.from({ length: 13 }).map((_, i) => (
      <rect
        key={i}
        y={(i * 5) / 13}
        width="7"
        height={5 / 13}
        fill={i % 2 ? "#fff" : "#B22234"}
      />
    ))}
    <rect width="3" height={(5 * 7) / 13} fill="#3C3B6E" />
  </svg>
);

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));
  const { m, locale, setLocale } = useI18n();

  // El navbar es transparente con texto blanco SOLO en el home (que tiene el
  // hero oscuro detrás). En el resto de páginas el fondo es claro, así que el
  // texto blanco quedaría invisible → forzamos el estilo sólido (texto oscuro).
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  // Bloquea scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { label: m.nav.tours, href: "/tours" },
    { label: m.nav.destinations, href: "/destinos" },
    { label: m.nav.blog, href: "/blog" },
    { label: m.nav.reviews, href: "/#reviews" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-background/85 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-wider">
          <span className="text-gradient-gold">DANFER</span>
          <span className={solid ? "text-night" : "text-white"}>TOURS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-gold ${
                solid ? "text-night/70" : "text-white/85"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div
          className={`flex items-center gap-4 ${
            solid ? "text-night/70" : "text-white/85"
          }`}
        >
          <div
            className={`hidden md:flex items-center gap-0.5 rounded-full p-0.5 border transition ${
              solid ? "border-night/15" : "border-white/30"
            }`}
          >
            <button
              onClick={() => locale !== "es" && setLocale("es")}
              aria-label="Español"
              className={`grid place-items-center w-7 h-7 rounded-full transition ${
                locale === "es"
                  ? "ring-2 ring-gold"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <PeruFlag className="w-4 h-3 rounded-sm" />
            </button>
            <button
              onClick={() => locale !== "en" && setLocale("en")}
              aria-label="English"
              className={`grid place-items-center w-7 h-7 rounded-full transition ${
                locale === "en"
                  ? "ring-2 ring-gold"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <USFlag className="w-4 h-3 rounded-sm" />
            </button>
          </div>
          <a
            href="https://www.tiktok.com/@danfertourscusco"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de Danfer Tours"
            className="hidden md:block hover:text-gold transition"
          >
            <TikTokIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.facebook.com/danfertourscusco"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Danfer Tours"
            className="hidden md:block hover:text-gold transition"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/danfertourscusco"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Danfer Tours"
            className="hidden md:block hover:text-gold transition"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* CTA de reserva — el navbar no tenía acción primaria visible */}
          <Link
            href="/tours"
            className="hidden md:inline-flex items-center rounded-full bg-gold px-5 py-2 text-night text-sm font-semibold hover:bg-gold-bright hover:shadow-glow transition"
          >
            {locale === "en" ? "Book now" : "Reservar"}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className={`md:hidden grid place-items-center w-10 h-10 rounded-full border transition ${
              solid
                ? "border-night/15 text-night"
                : "border-white/30 text-white"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-night/95 backdrop-blur-md md:hidden flex flex-col"
          >
            {/* Top bar inside menu */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl font-bold tracking-wider"
              >
                <span className="text-gradient-gold">DANFER</span>
                <span className="text-white">TOURS</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="grid place-items-center w-10 h-10 rounded-full border border-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex-1 flex flex-col justify-center px-8 gap-2"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-display text-4xl text-white hover:text-gold transition py-3 border-b border-white/10"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + links.length * 0.06 }}
              >
                <Link
                  href="/tours"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-night font-semibold hover:bg-gold-bright transition"
                >
                  {locale === "en" ? "Book your tour" : "Reservar tu tour"}
                </Link>
              </motion.div>
            </motion.nav>

            {/* Footer of mobile menu: lang + social */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="px-8 py-6 border-t border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 rounded-full p-0.5 border border-white/20">
                <button
                  onClick={() => locale !== "es" && setLocale("es")}
                  aria-label="Español"
                  className={`grid place-items-center w-8 h-8 rounded-full transition ${
                    locale === "es"
                      ? "ring-2 ring-gold"
                      : "opacity-50"
                  }`}
                >
                  <PeruFlag className="w-5 h-3.5 rounded-sm" />
                </button>
                <button
                  onClick={() => locale !== "en" && setLocale("en")}
                  aria-label="English"
                  className={`grid place-items-center w-8 h-8 rounded-full transition ${
                    locale === "en"
                      ? "ring-2 ring-gold"
                      : "opacity-50"
                  }`}
                >
                  <USFlag className="w-5 h-3.5 rounded-sm" />
                </button>
              </div>
              <div className="flex items-center gap-5 text-white/80">
                <a
                  href="https://www.tiktok.com/@danfertourscusco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok de Danfer Tours"
                  className="hover:text-gold transition"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/danfertourscusco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de Danfer Tours"
                  className="hover:text-gold transition"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/danfertourscusco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Danfer Tours"
                  className="hover:text-gold transition"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
