import Image from "next/image";
import { CERTIFICATIONS } from "@/lib/certifications";
import type { Locale } from "@/types/database";

export function CertificationsStrip({ locale = "es" }: { locale?: Locale }) {
  if (CERTIFICATIONS.length === 0) return null;
  const en = locale === "en";
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-night/8">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-6">
        {en ? "Licenses and associations" : "Licencias y asociaciones"}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {CERTIFICATIONS.map((c) => (
          <div key={c.name} className="relative h-16 bg-white rounded-xl border border-night/8">
            <Image src={c.logo} alt={c.name} fill sizes="120px" className="object-contain p-3" />
          </div>
        ))}
      </div>
    </section>
  );
}
