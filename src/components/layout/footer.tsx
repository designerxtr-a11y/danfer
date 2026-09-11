import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Award, Shield, Clock, Send } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "./navbar";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSettings, publicPhone, normalizeWhatsApp } from "@/lib/queries/settings";
import { t, type Locale } from "@/types/database";
import { siteUrl } from "@/lib/seo/site-url";

interface TourLite {
  slug: string;
  title: { es: string; en?: string };
  price_usd: number;
  bookings_count: number;
}
interface CategoryLite {
  slug: string;
  name: { es: string; en?: string };
  sort_order: number;
}

async function getFooterData() {
  try {
    const supabase = createAdminClient();
    const [{ data: tours }, { data: categories }] = await Promise.all([
      supabase
        .from("tours")
        .select("slug,title,price_usd,bookings_count")
        .eq("is_published", true)
        .order("bookings_count", { ascending: false })
        .limit(8),
      supabase
        .from("categories")
        .select("slug,name,sort_order")
        .eq("is_published", true)
        .order("sort_order"),
    ]);
    return {
      tours: (tours ?? []) as TourLite[],
      categories: (categories ?? []) as CategoryLite[],
    };
  } catch {
    return { tours: [], categories: [] };
  }
}

const destinations = [
  { es: "Machu Picchu", en: "Machu Picchu", href: "/destinos/machu-picchu" },
  { es: "Camino Inca", en: "Inca Trail", href: "/destinos/camino-inca" },
  { es: "Valle Sagrado", en: "Sacred Valley", href: "/destinos/valle-sagrado" },
  {
    es: "Rainbow Mountain",
    en: "Rainbow Mountain",
    href: "/destinos/rainbow-mountain",
  },
  { es: "Laguna Humantay", en: "Humantay Lake", href: "/destinos/laguna-humantay" },
  { es: "Todos los destinos", en: "All destinations", href: "/destinos" },
];

const company = [
  { es: "Sobre nosotros", en: "About us", href: "/sobre-nosotros" },
  { es: "Blog de viajes", en: "Travel blog", href: "/blog" },
  { es: "Reseñas verificadas", en: "Verified reviews", href: "/#reviews" },
  { es: "Contacto", en: "Contact", href: "/contacto" },
];

const legal = [
  { es: "Términos", en: "Terms", href: "/terminos" },
  { es: "Privacidad", en: "Privacy", href: "/privacidad" },
  { es: "Cancelación", en: "Cancellation", href: "/cancelacion" },
];

const SITE = siteUrl();

export async function Footer() {
  const [{ tours, categories }, locale, settings] = await Promise.all([
    getFooterData(),
    getLocale(),
    getSettings(),
  ]);
  const lc = (locale === "en" ? "en" : "es") as Locale;
  const en = lc === "en";
  const phone = publicPhone(settings);

  return (
    <footer
      className="bg-night-deep mt-32"
      itemScope
      itemType="https://schema.org/TravelAgency"
    >
      {/* Franja decorativa: skyline de Machu Picchu (siluetas) sobre fondo
          claro — transición visual entre el contenido de la página y el
          footer oscuro. */}
      <div className="bg-background">
        <Image
          src="/images/machupicchu-footer-v3-negro.png"
          alt=""
          aria-hidden
          width={1920}
          height={268}
          className="w-full h-auto"
        />
      </div>

      {/* Trust strip */}
      <div className="border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/55 text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" />
            {en ? "MINCETUR-licensed operator" : "Operador autorizado MINCETUR"}
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            {en ? "Book with confidence" : "Reservas con confianza"}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            {en ? "12+ years in Cusco" : "12+ años en Cusco"}
          </span>
        </div>
      </div>

      {/* Newsletter — barra destacada, ancho completo */}
      <div className="border-b border-white/5 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-5 md:gap-8">
          <div className="flex items-center gap-3 md:shrink-0">
            <Send className="w-5 h-5 text-gold shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm">
                {en ? "Get inspired, travel with us" : "Inspírate y viaja con nosotros"}
              </h4>
              <p className="text-white/60 text-xs">
                {en
                  ? "Exclusive deals and new routes straight to your inbox."
                  : "Ofertas exclusivas y nuevas rutas en tu email."}
              </p>
            </div>
          </div>
          <div className="w-full md:max-w-sm md:ml-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="relative py-20 px-6 overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:divide-x lg:divide-white/5">
          {/* Brand col */}
          <div className="lg:col-span-3 lg:pr-8">
            <Link
              href="/"
              className="font-display text-3xl font-bold tracking-wider block"
            >
              <span className="text-gradient-gold">DANFER</span>
              <span className="text-white">TOURS</span>
            </Link>
            <p
              className="mt-4 text-white/60 text-sm leading-relaxed max-w-sm"
              itemProp="description"
            >
              {en
                ? "Official tour operator in Cusco, Peru. Premium tours to Machu Picchu, the Sacred Valley, the Inca Trail, Rainbow Mountain and Humantay Lake. Certified local guides, small groups, book with confidence."
                : "Operador turístico oficial en Cusco, Perú. Tours premium a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay. Guías locales certificados, grupos pequeños, reservas con confianza."}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-gold hover:border-gold/40 transition"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-gold hover:border-gold/40 transition"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-gold hover:border-gold/40 transition"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tours top vendidos */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {en ? "Best-selling tours" : "Tours más vendidos"}
            </h4>
            <ul className="space-y-2.5">
              {tours.slice(0, 6).map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="group flex items-center justify-between gap-3 text-white/60 text-sm hover:text-gold transition"
                  >
                    <span className="truncate">{t(tour.title, lc)}</span>
                    <span className="text-[10px] text-gold/60 shrink-0">
                      US${tour.price_usd.toFixed(0)}
                    </span>
                  </Link>
                </li>
              ))}
              {tours.length === 0 &&
                destinations.slice(0, 6).map((d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      className="text-white/60 text-sm hover:text-gold transition"
                    >
                      {en ? d.en : d.es}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/tours"
                  className="text-gold text-xs uppercase tracking-widest font-semibold mt-2 inline-block hover:underline"
                >
                  {en ? "View all tours →" : "Ver todos los tours →"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías + Destinos */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {en ? "By category" : "Por categoría"}
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tours?category=${cat.slug}`}
                    className="text-white/60 text-sm hover:text-gold transition"
                  >
                    {t(cat.name, lc)}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-sm text-white mt-8 mb-3 uppercase tracking-widest">
              {en ? "Destinations" : "Destinos"}
            </h4>
            <ul className="space-y-2">
              {destinations.slice(0, 5).map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="text-white/50 text-xs hover:text-gold transition"
                  >
                    {en ? d.en : d.es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa + Contacto */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {en ? "Company" : "Empresa"}
            </h4>
            <ul className="space-y-2.5 mb-8">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-white/60 text-sm hover:text-gold transition"
                  >
                    {en ? c.en : c.es}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-sm text-white mb-3 uppercase tracking-widest">
              {en ? "Contact" : "Contacto"}
            </h4>
            <div className="space-y-2.5 text-sm text-white/70">
              <a
                href="mailto:hola@danfertourscusco.com"
                className="flex items-center gap-2 hover:text-gold transition"
                itemProp="email"
              >
                <Mail className="w-4 h-4 shrink-0" />
                hola@danfertourscusco.com
              </a>
              {phone && (
                <a
                  href={`tel:${normalizeWhatsApp(phone)}`}
                  className="flex items-center gap-2 hover:text-gold transition"
                  itemProp="telephone"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {phone}
                </a>
              )}
              <div
                className="flex items-start gap-2"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <span itemProp="streetAddress">Av. El Sol 314</span> ·{" "}
                  <span itemProp="addressLocality">Cusco</span>,{" "}
                  <span itemProp="addressCountry">{en ? "Peru" : "Perú"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <div>{en ? "Mon-Fri" : "Lun-Vie"} · 8:00 - 20:00</div>
                  <div>{en ? "Saturday" : "Sábado"} · 9:00 - 18:00</div>
                  <div>{en ? "Sunday" : "Domingo"} · 9:00 - 14:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <div>
            © {new Date().getFullYear()}{" "}
            <span itemProp="name">Danfer Tours Cusco</span> ·{" "}
            {en ? "Made with" : "Hecho con"}{" "}
            <span className="text-gold">♥</span>{" "}
            {en ? "in Cusco, Peru" : "en Cusco, Perú"}
          </div>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-gold transition"
              >
                {en ? l.en : l.es}
              </Link>
            ))}
            {/* Acceso al panel. next/link plano y no el Link de next-intl a
                propósito: /admin queda fuera del enrutado por idioma (lo
                excluye el middleware), así que el Link con prefijo de
                locale lo rompería agregando /en. */}
            <NextLink
              href="/admin/login"
              rel="nofollow"
              className="text-white/35 hover:text-gold transition"
            >
              {en ? "Staff" : "Administrar"}
            </NextLink>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/35">
            Visa · MC · Amex · PayPal
          </div>
        </div>
      </div>

      {/* Hidden semantic links for crawlers */}
      <link itemProp="url" href={SITE} />
    </footer>
  );
}
