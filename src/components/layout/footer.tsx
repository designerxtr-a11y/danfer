import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Award, Shield, Clock, Send } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "./navbar";
import { getSettings, publicPhone, normalizeWhatsApp } from "@/lib/queries/settings";
import { siteUrl } from "@/lib/seo/site-url";
import { L, toLocale } from "@/lib/i18n/pick";

const destinations = [
  { es: "Machu Picchu", en: "Machu Picchu", ja: "マチュピチュ", href: "/destinos/machu-picchu" },
  { es: "Camino Inca", en: "Inca Trail", ja: "インカ道", href: "/destinos/camino-inca" },
  { es: "Valle Sagrado", en: "Sacred Valley", ja: "聖なる谷", href: "/destinos/valle-sagrado" },
  {
    es: "Rainbow Mountain",
    en: "Rainbow Mountain",
    ja: "レインボーマウンテン",
    href: "/destinos/rainbow-mountain",
  },
  { es: "Laguna Humantay", en: "Humantay Lake", ja: "フマンタイ湖", href: "/destinos/laguna-humantay" },
  { es: "Todos los destinos", en: "All destinations", ja: "すべての目的地", href: "/destinos" },
];

const quickLinks = [
  { es: "Inicio", en: "Home", ja: "ホーム", href: "/" },
  { es: "Tours", en: "Tours", ja: "ツアー", href: "/tours" },
  { es: "Destinos", en: "Destinations", ja: "目的地", href: "/destinos" },
  { es: "Sobre nosotros", en: "About us", ja: "会社概要", href: "/sobre-nosotros" },
  { es: "Blog de viajes", en: "Travel blog", ja: "旅行ブログ", href: "/blog" },
  { es: "Contacto", en: "Contact", ja: "お問い合わせ", href: "/contacto" },
];

const legal = [
  { es: "Términos", en: "Terms", ja: "利用規約", href: "/terminos" },
  { es: "Privacidad", en: "Privacy", ja: "プライバシー", href: "/privacidad" },
  { es: "Cancelación", en: "Cancellation", ja: "キャンセル", href: "/cancelacion" },
];

const SITE = siteUrl();

export async function Footer() {
  const [locale, settings] = await Promise.all([getLocale(), getSettings()]);
  const lc = toLocale(locale);
  const phone = publicPhone(settings);

  return (
    <footer
      className="bg-neutral-950 mt-32"
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
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-neutral-400 text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" />
            {L(lc, { es: "Operador autorizado MINCETUR", en: "MINCETUR-licensed operator", ja: "MINCETUR認可の旅行会社" })}
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            {L(lc, { es: "Reservas con confianza", en: "Book with confidence", ja: "安心して予約" })}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            {L(lc, { es: "12+ años en Cusco", en: "12+ years in Cusco", ja: "クスコで12年以上" })}
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
                {L(lc, { es: "Inspírate y viaja con nosotros", en: "Get inspired, travel with us", ja: "旅のヒントを見つけて、私たちと旅しよう" })}
              </h4>
              <p className="text-neutral-400 text-xs">
                {L(lc, {
                  es: "Ofertas exclusivas y nuevas rutas en tu email.",
                  en: "Exclusive deals and new routes straight to your inbox.",
                  ja: "限定オファーや新しいルートをメールでお届けします。",
                })}
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
            <Link href="/" className="flex items-center gap-2.5 flex-wrap">
              {settings.branding?.logo_url && (
                <Image
                  src={settings.branding.logo_url}
                  alt=""
                  aria-hidden
                  width={840}
                  height={397}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              )}
              <span className="font-display text-3xl font-bold tracking-wider">
                <span className="text-gradient-gold">DANFER</span>
                <span className="text-white">TOURS</span>
              </span>
            </Link>
            <p
              className="mt-4 text-neutral-400 text-sm leading-relaxed max-w-sm"
              itemProp="description"
            >
              {L(lc, {
                es: "Operador turístico oficial en Cusco, Perú. Tours premium a Machu Picchu, Valle Sagrado, Camino Inca, Rainbow Mountain y Laguna Humantay. Guías locales certificados, grupos pequeños, reservas con confianza.",
                en: "Official tour operator in Cusco, Peru. Premium tours to Machu Picchu, the Sacred Valley, the Inca Trail, Rainbow Mountain and Humantay Lake. Certified local guides, small groups, book with confidence.",
                ja: "ペルー・クスコの公認旅行会社です。マチュピチュ、聖なる谷、インカ道、レインボーマウンテン、フマンタイ湖へのプレミアムツアーをご用意しています。認定の地元ガイド、少人数制で安心してご予約いただけます。",
              })}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-neutral-300 hover:text-gold hover:border-gold/40 transition"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-neutral-300 hover:text-gold hover:border-gold/40 transition"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/danfertourscusco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Danfer Tours Cusco"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-neutral-300 hover:text-gold hover:border-gold/40 transition"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {L(lc, { es: "Enlaces rápidos", en: "Quick links", ja: "クイックリンク" })}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-neutral-400 text-sm hover:text-gold transition"
                  >
                    {L(lc, l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinos populares */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {L(lc, { es: "Destinos populares", en: "Popular destinations", ja: "人気の目的地" })}
            </h4>
            <ul className="space-y-2.5">
              {destinations.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="text-neutral-400 text-sm hover:text-gold transition"
                  >
                    {L(lc, d)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-3 lg:px-8">
            <h4 className="font-display text-lg text-white mb-4">
              {L(lc, { es: "Contacto", en: "Contact", ja: "お問い合わせ" })}
            </h4>
            <div className="space-y-2.5 text-sm text-neutral-300">
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
                  <span itemProp="addressCountry">{L(lc, { es: "Perú", en: "Peru", ja: "ペルー" })}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <div>{L(lc, { es: "Lun-Vie", en: "Mon-Fri", ja: "月〜金" })} · 8:00 - 20:00</div>
                  <div>{L(lc, { es: "Sábado", en: "Saturday", ja: "土曜日" })} · 9:00 - 18:00</div>
                  <div>{L(lc, { es: "Domingo", en: "Sunday", ja: "日曜日" })} · 9:00 - 14:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()}{" "}
            <span itemProp="name">Danfer Tours Cusco</span>
          </div>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-gold transition"
              >
                {L(lc, l)}
              </Link>
            ))}
            {/* Acceso al panel. next/link plano y no el Link de next-intl a
                propósito: /admin queda fuera del enrutado por idioma (lo
                excluye el middleware), así que el Link con prefijo de
                locale lo rompería agregando /en. */}
            <NextLink
              href="/admin/login"
              rel="nofollow"
              className="text-neutral-600 hover:text-gold transition"
            >
              {L(lc, { es: "Administrar", en: "Staff", ja: "スタッフ" })}
            </NextLink>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600">
            Visa · MC · Amex · PayPal
          </div>
        </div>
      </div>

      {/* Hidden semantic links for crawlers */}
      <link itemProp="url" href={SITE} />
    </footer>
  );
}
