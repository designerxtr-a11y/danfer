import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { I18nProvider } from "@/lib/i18n/provider";
import { getServerLocale } from "@/lib/i18n/server";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, settings] = await Promise.all([
    getServerLocale(),
    getSettings(),
  ]);
  return (
    <I18nProvider initialLocale={locale}>
      <SmoothScroll>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <WhatsAppButton phone={normalizeWhatsApp(settings.whatsapp)} />
    </I18nProvider>
  );
}
