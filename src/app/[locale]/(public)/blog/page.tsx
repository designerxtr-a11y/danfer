import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries/blog";
import { t } from "@/types/database";

export const metadata = {
  title: "Blog",
  description:
    "Guías, consejos y experiencias para tu próximo viaje a Cusco, Machu Picchu y el Valle Sagrado. Escrito por nuestros guías locales.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts(24);

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="font-hand text-gold text-2xl">Diario de viaje</span>
          <h1 className="mt-2 font-display text-5xl md:text-7xl text-night">
            Historias del{" "}
            <span className="text-gradient-gold italic">Perú</span>
          </h1>
          <p className="mt-4 text-night/60 max-w-xl mx-auto">
            Guías, tips y experiencias contadas por nuestros guías locales.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-night/40">
            Estamos preparando los primeros artículos. Vuelve pronto.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        alt={t(p.title)}
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
                      {t(p.title)}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 text-night/65 text-sm leading-relaxed line-clamp-3">
                        {t(p.excerpt)}
                      </p>
                    )}
                    <div className="mt-5 flex items-center gap-4 text-xs text-night/50">
                      {p.published_at && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(p.published_at).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {p.read_minutes} min
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
