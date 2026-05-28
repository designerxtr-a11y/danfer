"use client";

import { useState } from "react";
import { PostForm } from "../post-form";
import { ImportPanel } from "../import-panel";
import type { ScrapedBlogPost } from "@/lib/scrapers/blog-scraper";
import type { BlogPost } from "@/lib/queries/blog";

function scrapedToBlogPost(s: ScrapedBlogPost): BlogPost {
  return {
    id: "",
    slug: s.slug,
    title: { es: s.title },
    excerpt: s.excerpt ? { es: s.excerpt } : null,
    body_md: { es: s.body_md },
    cover_image: s.cover_image ?? null,
    author_name: s.author_name ?? "Danfer Tours Cusco",
    author_avatar: null,
    read_minutes: s.read_minutes,
    tags: s.tags,
    is_published: false,
    published_at: s.published_at ?? null,
    meta_title: { es: s.title },
    meta_description: s.excerpt ? { es: s.excerpt } : null,
    created_at: new Date().toISOString(),
  };
}

export function NewPostClient() {
  const [imported, setImported] = useState<BlogPost | null>(null);

  return (
    <>
      <ImportPanel
        onImport={(data) => setImported(scrapedToBlogPost(data))}
      />
      <PostForm
        key={imported?.slug || "blank"}
        mode="create"
        post={imported ?? undefined}
      />
    </>
  );
}
