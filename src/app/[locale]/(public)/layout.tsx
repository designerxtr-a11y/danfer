import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";
import { getSettings, normalizeWhatsApp, publicPhone } from "@/lib/queries/settings";
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
  return (
    <I18nProvider initialLocale={typedLocale}>
      {/* Organization + WebSite en TODAS las páginas públicas: los schemas de
          tours/blog/destinos referencian #organization por @id y Google no
          resuelve referencias entre páginas — el nodo debe ir inline. */}
      <JsonLd
        data={[organizationSchema(publicPhone(settings)), websiteSchema()]}
      />
      <SmoothScroll>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <WhatsAppButton phone={normalizeWhatsApp(settings.whatsapp)} />
    </I18nProvider>
  );
}
