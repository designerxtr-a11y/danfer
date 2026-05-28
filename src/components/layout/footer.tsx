import Link from "next/link";
import { Mail, Phone, MapPin, Award, Shield, Clock } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { t } from "@/types/database";

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
  { label: "Machu Picchu", href: "/tours?destino=machu-picchu" },
  { label: "Valle Sagrado", href: "/tours?destino=valle-sagrado" },
  { label: "Camino Inca", href: "/tours?destino=camino-inca" },
  { label: "Rainbow Mountain", href: "/tours?destino=rainbow-mountain" },
  { label: "Laguna Humantay", href: "/tours?destino=laguna-humantay" },
  { label: "Choquequirao", href: "/tours?destino=choquequirao" },
  { label: "Salkantay", href: "/tours?destino=salkantay" },
];

const company = [
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Blog de viajes", href: "/blog" },
  { label: "Reseñas verificadas", href: "/#reviews" },
  { label: "Contacto", href: "/contacto" },
];

const legal = [
  { label: "Términos", href: "/terminos" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Cancelación", href: "/cancelacion" },
];

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

export async function Footer() {
  const { tours, categories } = await getFooterData();

  return (
    <footer
      className="bg-night-deep border-t border-white/5 mt-32"
      itemScope
      itemType="https://schema.org/TravelAgency"
    >
      {/* Trust strip */}
      <div className="border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/55 text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" />
            Operador autorizado MINCETUR
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            Reservas con confianza
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            12+ años en Cusco
          </span>
          <span className="hidden md:flex items-center gap-2">
            <span className="text-gold">★</span>
            4.9/5 · 2,300+ reseñas TripAdvisor
          </span>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-4">
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
              Operador turístico oficial en Cusco, Perú. Tours premium a Machu
              Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna
              Humantay. Guías locales certificados, grupos pequeños, reservas
              con confianza.
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-white/70">
              <a
                href="mailto:hola@danfertourscusco.com"
                className="flex items-center gap-2 hover:text-gold transition"
                itemProp="email"
              >
                <Mail className="w-4 h-4" />
                hola@danfertourscusco.com
              </a>
              <a
                href="tel:+51984123456"
                className="flex items-center gap-2 hover:text-gold transition"
                itemProp="telephone"
              >
                <Phone className="w-4 h-4" />
                +51 984 123 456
              </a>
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
                  <span itemProp="addressCountry">Perú</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-display text-sm text-white mb-2">
                Horario de atención
              </h4>
              <div className="text-xs text-white/55 space-y-0.5">
                <div>Lun-Vie · 8:00 - 20:00</div>
                <div>Sábado · 9:00 - 18:00</div>
                <div>Domingo · 9:00 - 14:00</div>
              </div>
            </div>
          </div>

          {/* Tours top vendidos */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-white mb-4">
              Tours más vendidos
            </h4>
            <ul className="space-y-2.5">
              {tours.slice(0, 6).map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="group flex items-center justify-between gap-3 text-white/60 text-sm hover:text-gold transition"
                  >
                    <span className="truncate">{t(tour.title)}</span>
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
                      {d.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/tours"
                  className="text-gold text-xs uppercase tracking-widest font-semibold mt-2 inline-block hover:underline"
                >
                  Ver todos los tours →
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías + Destinos */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white mb-4">
              Por categoría
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tours?category=${cat.slug}`}
                    className="text-white/60 text-sm hover:text-gold transition"
                  >
                    {t(cat.name)}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-sm text-white mt-8 mb-3 uppercase tracking-widest">
              Destinos
            </h4>
            <ul className="space-y-2">
              {destinations.slice(0, 5).map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="text-white/50 text-xs hover:text-gold transition"
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa + newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-white mb-4">Empresa</h4>
            <ul className="space-y-2.5 mb-8">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-white/60 text-sm hover:text-gold transition"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-lg text-white mb-3">
              Newsletter
            </h4>
            <p className="text-white/55 text-xs mb-4">
              Ofertas exclusivas y nuevas rutas en tu email.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <div>
            © {new Date().getFullYear()}{" "}
            <span itemProp="name">Danfer Tours Cusco</span> · Made with{" "}
            <span className="text-gold">♥</span> in Cusco, Perú
          </div>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-gold transition"
              >
                {l.label}
              </Link>
            ))}
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
