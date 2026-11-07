import { Link } from "@/i18n/navigation";
import { L, toLocale } from "@/lib/i18n/pick";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries/blog";
import { t, type Locale } from "@/types/database";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { setRequestLocale } from "next-intl/server";

// Red de seguridad: refresca cada hora aunque el dato se edite directo en
// Supabase (fuera del admin, que ya revalida al guardar).
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<import("next").Metadata> {
  const { locale } = await params;
  const lc: Locale = toLocale(locale);
  const title =
    L(lc, { es: "Blog de viajes a Cusco y Machu Picchu", en: "Cusco & Machu Picchu Travel Blog", ja: "クスコ＆マチュピチュ旅行ブログ" });
  const description =
    L(lc, { es: "Guías, consejos y experiencias para tu próximo viaje a Cusco, Machu Picchu y el Valle Sagrado. Escrito por nuestros guías locales.", en: "Guides, tips and experiences for your next trip to Cusco, Machu Picchu and the Sacred Valley. Written by our local guides.", ja: "クスコ、マチュピチュ、聖なる谷への旅に役立つガイドとヒント。地元ガイドが書いています。" });
  return {
    title,
    description,
    alternates: buildAlternates("/blog", lc, { jaAvailable: true }),
    openGraph: {
      title,
      description,
      locale: ogLocale(lc),
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lc: Locale = toLocale(locale);
  const posts = await getPublishedPosts(60);

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="font-hand text-gold text-2xl">
            {L(lc, { es: "Diario de viaje", en: "Travel journal", ja: "旅行ガイド" })}
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl md:text-7xl text-night">
            {lc === "ja" ? (
              <>
                <span className="text-gradient-gold">ペルー</span>からの物語
              </>
            ) : lc === "en" ? (
              <>
                Stories from{" "}
                <span className="text-gradient-gold italic">Peru</span>
              </>
            ) : (
              <>
                Historias del{" "}
                <span className="text-gradient-gold italic">Perú</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-night/60 max-w-xl mx-auto">
            {L(lc, { es: "Guías, tips y experiencias contadas por nuestros guías locales.", en: "Guides, tips and experiences told by our local guides.", ja: "地元ガイドによる旅のヒントと体験談。" })}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-night/40">
            {L(lc, { es: "Estamos preparando los primeros artículos. Vuelve pronto.", en: "We're preparing our first articles. Check back soon.", ja: "記事を準備中です。もうしばらくお待ちください。" })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group block"
              >
                <article className="bg-white border border-night/8 rounded-3xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition duration-500">
                  {p.cover_image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.cover_image}
                        alt={t(p.title, lc)}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition duration-1000"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {p.tags.length > 0 && (
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-widest text-gold bg-gold/10 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-display text-2xl text-night leading-tight group-hover:text-gold transition">
                      {t(p.title, lc)}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 text-night/65 text-sm leading-relaxed line-clamp-3">
                        {t(p.excerpt, lc)}
                      </p>
                    )}
                    <div className="mt-5 flex items-center gap-4 text-xs text-night/50">
                      {p.published_at && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(p.published_at).toLocaleDateString(
                            L(lc, { es: "es-PE", en: "en-US", ja: "ja-JP" }),
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {p.read_minutes} {L(lc, { es: "min", en: "min", ja: "分" })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
