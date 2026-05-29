import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/messages";
import { getSettings, normalizeWhatsApp } from "@/lib/queries/settings";

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
      <SmoothScroll>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
      <WhatsAppButton phone={normalizeWhatsApp(settings.whatsapp)} />
    </I18nProvider>
  );
}
