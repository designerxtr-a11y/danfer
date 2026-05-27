import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { I18nProvider } from "@/lib/i18n/provider";
import { getServerLocale } from "@/lib/i18n/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();
  return (
    <I18nProvider initialLocale={locale}>
      <SmoothScroll>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
    </I18nProvider>
  );
}
