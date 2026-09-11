import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar, type NavItem } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { I18nProvider } from "@/lib/i18n/provider";
import { tr, type Locale } from "@/lib/i18n/messages";
import { getSettings, normalizeWhatsApp, publicPhone } from "@/lib/queries/settings";
import { getCategoriesWithTours } from "@/lib/queries/categories";
import { listDestinations } from "@/lib/destinations-content";
import { t } from "@/types/database";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, settings] = await Promise.all([params, getSettings()]);
  const typedLocale: Locale = locale === "en" ? "en" : "es";
  const mx = tr(typedLocale);

  const [categories, destinations] = await Promise.all([
    getCategoriesWithTours(),
    Promise.resolve(listDestinations(typedLocale)),
  ]);

  const catBySlug = (slug: string) => categories.find((c) => c.slug === slug);
  const toTourLinks = (slugs: string[]) =>
    slugs
      .flatMap((slug) => catBySlug(slug)?.tours ?? [])
      .map((tour) => ({
        label: t(tour.title, typedLocale),
        href: `/tours/${tour.slug}`,
      }));

  const allNavItems: NavItem[] = [
    {
      type: "mega",
      label: mx.nav.machuPicchuTours,
      items: toTourLinks(["machu-picchu"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    {
      type: "mega",
      label: mx.nav.cuscoTours,
      items: toTourLinks(["valle-sagrado"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    {
      type: "mega",
      label: mx.nav.caminoIncaTrekking,
      items: toTourLinks(["camino-inca", "aventura"]),
      viewAllHref: "/tours",
      viewAllLabel: mx.nav.viewAll,
    },
    { type: "link", label: mx.nav.blog, href: "/blog" },
    {
      type: "mega",
      label: mx.nav.conocePeru,
      items: destinations.map((d) => ({
        label: d.name,
        href: `/destinos/${d.slug}`,
      })),
      viewAllHref: "/destinos",
      viewAllLabel: mx.nav.viewAll,
    },
    {
      type: "mega",
      label: mx.nav.infoUtil,
      items: [
        { label: mx.nav.aboutUs, href: "/sobre-nosotros" },
        { label: mx.nav.contact, href: "/contacto" },
        { label: mx.nav.reviews, href: "/#reviews" },
        { label: mx.nav.terms, href: "/terminos" },
        { label: mx.nav.cancellation, href: "/cancelacion" },
        { label: mx.nav.privacy, href: "/privacidad" },
      ],
    },
  ];

  const navItems = allNavItems.filter(
    (item) => item.type === "link" || item.items.length > 0
  );

  return (
    <I18nProvider initialLocale={typedLocale}>
      {/* Organization + WebSite en TODAS las páginas públicas: los schemas de
          tours/blog/destinos referencian #organization por @id y Google no
          resuelve referencias entre páginas — el nodo debe ir inline. */}
      <JsonLd
        data={[
          organizationSchema(publicPhone(settings), settings.branding?.logo_url),
          websiteSchema(),
        ]}
      />
      <SmoothScroll>
        <Navbar logoUrl={settings.branding?.logo_url || undefined} navItems={navItems} />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <WhatsAppButton phone={normalizeWhatsApp(settings.whatsapp)} />
    </I18nProvider>
  );
}
