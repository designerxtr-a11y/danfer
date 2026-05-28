"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Localized = { es: string; en?: string };

interface BlogInput {
  id?: string;
  slug: string;
  title_es: string;
  title_en?: string;
  excerpt_es?: string;
  excerpt_en?: string;
  body_md_es: string;
  body_md_en?: string;
  cover_image?: string;
  author_name?: string;
  author_avatar?: string;
  read_minutes: number;
  tags: string[];
  is_published: boolean;
  meta_title_es?: string;
  meta_title_en?: string;
  meta_description_es?: string;
  meta_description_en?: string;
}

function parseFormData(formData: FormData): BlogInput {
  const tagsRaw = String(formData.get("tags") || "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return {
    id: (formData.get("id") as string) || undefined,
    slug: String(formData.get("slug") || "").trim(),
    title_es: String(formData.get("title_es") || ""),
    title_en: String(formData.get("title_en") || "") || undefined,
    excerpt_es: String(formData.get("excerpt_es") || "") || undefined,
    excerpt_en: String(formData.get("excerpt_en") || "") || undefined,
    body_md_es: String(formData.get("body_md_es") || ""),
    body_md_en: String(formData.get("body_md_en") || "") || undefined,
    cover_image: String(formData.get("cover_image") || "") || undefined,
    author_name: String(formData.get("author_name") || "") || undefined,
    author_avatar: String(formData.get("author_avatar") || "") || undefined,
    read_minutes: Number(formData.get("read_minutes") || 5),
    tags,
    is_published: formData.get("is_published") === "on",
    meta_title_es: String(formData.get("meta_title_es") || "") || undefined,
    meta_title_en: String(formData.get("meta_title_en") || "") || undefined,
    meta_description_es:
      String(formData.get("meta_description_es") || "") || undefined,
    meta_description_en:
      String(formData.get("meta_description_en") || "") || undefined,
  };
}

function toRow(input: BlogInput) {
  const titleLoc: Localized = { es: input.title_es };
  if (input.title_en) titleLoc.en = input.title_en;
  const excerptLoc: Localized | null =
    input.excerpt_es || input.excerpt_en
      ? { es: input.excerpt_es ?? "", ...(input.excerpt_en ? { en: input.excerpt_en } : {}) }
      : null;
  const bodyLoc: Localized = { es: input.body_md_es };
  if (input.body_md_en) bodyLoc.en = input.body_md_en;
  const metaTitleLoc: Localized | null =
    input.meta_title_es || input.meta_title_en
      ? {
          es: input.meta_title_es ?? input.title_es,
          ...(input.meta_title_en ? { en: input.meta_title_en } : {}),
        }
      : null;
  const metaDescLoc: Localized | null =
    input.meta_description_es || input.meta_description_en
      ? {
          es: input.meta_description_es ?? "",
          ...(input.meta_description_en
            ? { en: input.meta_description_en }
            : {}),
        }
      : null;

  return {
    slug: input.slug,
    title: titleLoc,
    excerpt: excerptLoc,
    body_md: bodyLoc,
    cover_image: input.cover_image ?? null,
    author_name: input.author_name ?? null,
    author_avatar: input.author_avatar ?? null,
    read_minutes: input.read_minutes,
    tags: input.tags,
    is_published: input.is_published,
    published_at: input.is_published ? new Date().toISOString() : null,
    meta_title: metaTitleLoc,
    meta_description: metaDescLoc,
  };
}

export async function createPost(
  formData: FormData
): Promise<{ ok: true; id: string } | { error: string }> {
  const input = parseFormData(formData);
  if (!input.slug || !input.title_es || !input.body_md_es) {
    return { error: "Slug, título y body son obligatorios" };
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(toRow(input))
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${data.id}/edit?ok=created`);
}

export async function updatePost(
  formData: FormData
): Promise<{ ok: true } | { error: string }> {
  const input = parseFormData(formData);
  if (!input.id) return { error: "Falta id" };
  if (!input.slug || !input.title_es || !input.body_md_es) {
    return { error: "Slug, título y body son obligatorios" };
  }
  const supabase = createAdminClient();
  // Para update no sobrescribimos published_at si ya estaba publicado
  const row = toRow(input);
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at, is_published")
    .eq("id", input.id)
    .single();
  if (existing?.is_published && existing.published_at && input.is_published) {
    // Mantén la fecha original de publicación
    row.published_at = existing.published_at;
  }
  const { error } = await supabase
    .from("blog_posts")
    .update(row)
    .eq("id", input.id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  revalidatePath("/admin/blog");
  return { ok: true };
}

export async function deletePost(
  id: string
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { ok: true };
}

export async function togglePublished(
  id: string,
  next: boolean
): Promise<{ ok: true } | { error: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_published: next,
      published_at: next ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { ok: true };
}
