import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const batchPath = process.argv[2];
if (!batchPath) {
  console.error("Uso: node scripts/insert-blog-batch.mjs <ruta-absoluta-batch.mjs>");
  process.exit(1);
}

const { default: posts } = await import(batchPath.startsWith("file:") ? batchPath : `file:///${batchPath.replace(/\\/g, "/")}`);

let now = new Date();
let ok = 0;
let fail = 0;

for (const p of posts) {
  const row = {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body_md: p.body_md,
    cover_image: p.cover_image,
    author_name: "Danfer Tours Cusco",
    author_avatar: null,
    read_minutes: p.read_minutes,
    tags: p.tags,
    is_published: true,
    published_at: now.toISOString(),
    meta_title: p.meta_title,
    meta_description: p.meta_description,
  };
  now = new Date(now.getTime() - 3600 * 1000);
  const { error } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("FAIL", p.slug, error.message);
    fail++;
  } else {
    console.log("OK", p.slug);
    ok++;
  }
}
console.log(`\n${ok} insertados, ${fail} fallidos.`);
