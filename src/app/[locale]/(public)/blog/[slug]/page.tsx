import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, ChevronLeft } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries/blog";
import { t, type Locale } from "@/types/database";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, blogPostingSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://danfertourscusco.com";

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = t(post.meta_title, lc) || t(post.title, lc);
  const description = t(post.meta_description, lc) || t(post.excerpt, lc);

  return {
    title,
    description,
    alternates: buildAlternates(`/blog/${post.slug}`, lc),
    openGraph: {
      title,
      description,
      type: "article",
      url: lc === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`,
      locale: ogLocale(lc),
      images: post.cover_image ? [{ url: post.cover_image, width: 1600, height: 900 }] : undefined,
      publishedTime: post.published_at ?? post.created_at,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const body = t(post.body_md, lc);

  const articleSchema = blogPostingSchema({
    slug: post.slug,
    title: t(post.title, lc),
    excerpt: t(post.excerpt, lc) || "",
    bodyText: body,
    coverImage: post.cover_image,
    publishedAt: post.published_at ?? post.created_at,
    updatedAt: post.published_at ?? post.created_at,
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    readMinutes: post.read_minutes,
    tags: post.tags,
  });

  const crumbs = [
    { name: lc === "en" ? "Home" : "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: t(post.title, lc), url: `/blog/${post.slug}` },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24">
      <JsonLd data={[articleSchema, breadcrumbSchema(crumbs)]} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={crumbs} className="mb-6" />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Blog
        </Link>

        {post.tags.length > 0 && (
          <div className="flex gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-night leading-[1.05]">
          {t(post.title, lc)}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-5 text-sm text-night/60">
          {post.author_name && (
            <div className="flex items-center gap-2">
              {post.author_avatar && (
                <Image
                  src={post.author_avatar}
                  alt={post.author_name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <span className="text-night font-medium">{post.author_name}</span>
            </div>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString(
                lc === "en" ? "en-US" : "es-PE",
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
            {post.read_minutes} {lc === "en" ? "min read" : "min de lectura"}
          </span>
        </div>

        {post.cover_image && (
          <div className="relative aspect-[16/9] mt-10 rounded-3xl overflow-hidden">
            <Image
              src={post.cover_image}
              alt={t(post.title, lc)}
              fill
              priority
              sizes="(min-width:768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-10 prose prose-neutral max-w-none prose-lg [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-night [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-night [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-night/80 [&_p]:leading-relaxed [&_p]:my-4 [&_ul]:my-4 [&_ul]:pl-5 [&_li]:list-disc [&_li]:my-1 [&_li]:text-night/80 [&_a]:text-gold [&_a]:underline [&_strong]:text-night [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-night/70">
          {body && (
            <MDXRemote
              source={body}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 md:mt-24 pt-12 md:pt-16 border-t border-night/8">
          <h2 className="font-display text-2xl sm:text-3xl text-night mb-8">
            {lc === "en" ? "Keep reading" : "Sigue leyendo"}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group block bg-white border border-night/8 rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition"
              >
                {p.cover_image && (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={p.cover_image}
                      alt={t(p.title, lc)}
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg text-night group-hover:text-gold transition">
                    {t(p.title, lc)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
