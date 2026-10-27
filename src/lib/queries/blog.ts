import { createClient } from "@/lib/supabase/public";
import type { Localized } from "@/types/database";

export interface BlogPost {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized | null;
  body_md: Localized | null;
  cover_image: string | null;
  author_name: string | null;
  author_avatar: string | null;
  read_minutes: number;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  meta_title: Localized | null;
  meta_description: Localized | null;
  created_at: string;
  updated_at?: string | null;
}

// Posts programados: con published_at futuro no se muestran hasta esa fecha.
// Las páginas son ISR de 1h, así que aparecen como mucho una hora después.
export function publishedNow(): string {
  return `published_at.is.null,published_at.lte.${new Date().toISOString()}`;
}

export async function getPublishedPosts(limit = 24): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .or(publishedNow())
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getPublishedPosts]", error);
    return [];
  }
  return (data ?? []) as unknown as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .or(publishedNow())
    .maybeSingle();
  if (error) {
    console.error("[getPostBySlug]", error);
    return null;
  }
  return data as unknown as BlogPost | null;
}

export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .or(publishedNow())
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []) as unknown as BlogPost[];
}
