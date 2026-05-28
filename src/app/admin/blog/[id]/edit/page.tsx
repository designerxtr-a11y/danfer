import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost } from "@/lib/queries/blog";
import { PostForm } from "../../post-form";
import { t } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const post = data as unknown as BlogPost;

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-4 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al blog
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-night truncate max-w-3xl">
            {t(post.title)}
          </h1>
          <p className="text-night/60 mt-1 font-mono text-sm">/blog/{post.slug}</p>
        </div>
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
