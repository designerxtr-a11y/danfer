import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

const footerLinks = {
  tours: [
    { label: "Machu Picchu", href: "/tours?category=machu-picchu" },
    { label: "Valle Sagrado", href: "/tours?category=valle-sagrado" },
    { label: "Camino Inca", href: "/tours?category=camino-inca" },
    { label: "Aventura", href: "/tours?category=aventura" },
  ],
  company: [
    { label: "Sobre nosotros", href: "/sobre-nosotros" },
    { label: "Contacto", href: "/contacto" },
    { label: "Reseñas", href: "/#reviews" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Términos", href: "/terminos" },
    { label: "Privacidad", href: "/privacidad" },
    { label: "Política de cancelación", href: "/cancelacion" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-night-deep border-t border-white/5 py-20 px-6 mt-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        <div>
          <Link href="/" className="font-display text-3xl font-bold tracking-wider block">
            <span className="text-gradient-gold">DANFER</span>
            <span className="text-white">TOURS</span>
          </Link>
          <p className="mt-4 text-white/60 text-sm leading-relaxed">
            Tours premium en Cusco, Machu Picchu y el Valle Sagrado. Operador
            turístico oficial autorizado por MINCETUR.
          </p>

          <div className="mt-6 space-y-2.5 text-sm text-white/70">
            <a
              href="mailto:hola@danfertourscusco.com"
              className="flex items-center gap-2 hover:text-gold transition"
            >
              <Mail className="w-4 h-4" />
              hola@danfertourscusco.com
            </a>
            <a
              href="tel:+51984123456"
              className="flex items-center gap-2 hover:text-gold transition"
            >
              <Phone className="w-4 h-4" />
              +51 984 123 456
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Av. El Sol 314, Cusco
            </div>
          </div>
        </div>

        <FooterColumn title="Tours" links={footerLinks.tours} />
        <FooterColumn title="Empresa" links={footerLinks.company} />

        <div>
          <h4 className="font-display text-lg text-white mb-4">
            Suscríbete
          </h4>
          <p className="text-white/60 text-sm mb-4">
            Ofertas exclusivas y nuevas rutas en tu email.
          </p>
          <NewsletterForm />

          <div className="mt-6 flex items-center gap-3 text-xs text-white/40">
            {footerLinks.legal.map((l, i) => (
              <Link key={l.href} href={l.href} className="hover:text-gold transition">
                {l.label}
                {i < footerLinks.legal.length - 1 && <span className="ml-3">·</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} Danfer Tours Cusco · Made with{" "}
        <span className="text-gold">♥</span> in Cusco, Perú
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-lg text-white mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-white/60 text-sm hover:text-gold transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
