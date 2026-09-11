// Convierte una foto local a WebP (sharp) y la sube a Supabase Storage
// (bucket tour-images/hero), luego actualiza settings.hero_images[slug] con
// la nueva URL (merge, no pisa las demás). Uso:
//   node scripts/upload-hero-photo.mjs <slug> <ruta-local-de-la-foto>
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import sharp from "sharp";

const [, , slug, filePath] = process.argv;
if (!slug || !filePath) {
  console.error("Uso: node scripts/upload-hero-photo.mjs <slug> <ruta-foto>");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const original = readFileSync(filePath);
const webp = await sharp(original)
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toBuffer();

console.log(
  `Convertido: ${(original.length / 1024 / 1024).toFixed(1)}MB -> ${(webp.length / 1024).toFixed(0)}KB`
);

const path = `hero/${slug}-${Date.now()}.webp`;
const { error: uploadErr } = await sb.storage.from("tour-images").upload(path, webp, {
  contentType: "image/webp",
  upsert: false,
  cacheControl: "31536000",
});
if (uploadErr) {
  console.error("Error subiendo:", uploadErr.message);
  process.exit(1);
}

const { data: pub } = sb.storage.from("tour-images").getPublicUrl(path);
console.log("URL pública:", pub.publicUrl);

const { data: row } = await sb.from("settings").select("value").eq("key", "hero_images").maybeSingle();
const merged = { ...(row?.value ?? {}), [slug]: pub.publicUrl };
const { error: upsertErr } = await sb
  .from("settings")
  .upsert({ key: "hero_images", value: merged }, { onConflict: "key" });
if (upsertErr) {
  console.error("Error guardando en settings:", upsertErr.message);
  process.exit(1);
}
console.log(`settings.hero_images["${slug}"] actualizado.`);
