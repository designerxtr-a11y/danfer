import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { Destinations } from "@/components/sections/destinations";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/seo/json-ld";
import {
  organizationSchema,
  websiteSchema,
  heroVideoSchema,
  homepageFaqSchema,
  speakableSchema,
  topDestinationsSchemas,
} from "@/lib/seo/schema";

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
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
