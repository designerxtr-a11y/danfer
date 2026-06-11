import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { Destinations } from "@/components/sections/destinations";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { getSettings } from "@/lib/queries/settings";
import {
  heroVideoSchema,
  homepageFaqSchema,
  speakableSchema,
  topDestinationsSchemas,
} from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates("/", locale),
    openGraph: { locale: ogLocale(locale) },
  };
}

export default async function Home() {
  // Organization + WebSite los emite el layout público (todas las páginas).
  const settings = await getSettings();
  return (
    <>
      <JsonLd
        data={[
          speakableSchema(),
          heroVideoSchema(),
          homepageFaqSchema(),
          ...topDestinationsSchemas(),
        ]}
      />
      <Hero cardImages={settings.hero_images} />
      <Stats polaroidImages={settings.stats_images} />
      <FeaturedTours />
      <Destinations />
      <Testimonials />
    </>
  );
}
