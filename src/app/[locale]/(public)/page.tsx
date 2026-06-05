import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { Destinations } from "@/components/sections/destinations";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { getSettings, publicPhone } from "@/lib/queries/settings";
import {
  organizationSchema,
  websiteSchema,
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
  const settings = await getSettings();
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(publicPhone(settings)),
          websiteSchema(),
          speakableSchema(),
          heroVideoSchema(),
          homepageFaqSchema(),
          ...topDestinationsSchemas(),
        ]}
      />
      <Hero />
      <Stats />
      <FeaturedTours />
      <Destinations />
      <Testimonials />
    </>
  );
}
