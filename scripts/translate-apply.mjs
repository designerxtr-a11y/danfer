// Aplica las traducciones EN de scripts/en/*.mjs a blog_posts en Supabase.
// Solo hace merge de la clave "en" en cada campo jsonb — el "es" no se toca.
// Idempotente: re-ejecutarlo deja el mismo resultado.
//   node scripts/translate-apply.mjs            -> aplica todo
//   node scripts/translate-apply.mjs <slug>     -> aplica solo ese slug
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const dir = path.join(import.meta.dirname, "en");
const only = process.argv[2];
const files = readdirSync(dir).filter((f) => f.endsWith(".mjs"));

for (const file of files) {
  const { default: tr } = await import(pathToFileURL(path.join(dir, file)).href);
  if (only && tr.slug !== only) continue;

  const { data: post, error: readErr } = await sb
    .from("blog_posts")
    .select("slug, title, excerpt, body_md, meta_title, meta_description")
    .eq("slug", tr.slug)
    .single();
  if (readErr || !post) {
    console.error(`✗ ${tr.slug}: no encontrado (${readErr?.message})`);
    continue;
  }

  const merged = {
    title: { ...post.title, en: tr.title },
    excerpt: { ...post.excerpt, en: tr.excerpt },
    body_md: { ...post.body_md, en: tr.body_md },
    meta_title: { ...(post.meta_title ?? { es: tr.title }), en: tr.meta_title },
    meta_description: {
      ...(post.meta_description ?? { es: tr.excerpt }),
      en: tr.meta_description,
    },
  };

  const { error: updErr } = await sb
    .from("blog_posts")
    .update(merged)
    .eq("slug", tr.slug);
  if (updErr) {
    console.error(`✗ ${tr.slug}: ${updErr.message}`);
  } else {
    console.log(`✓ ${tr.slug}: EN aplicado (${tr.body_md.length} chars)`);
  }
}
