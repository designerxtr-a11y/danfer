import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const hasEn = (f) => f && typeof f === "object" && typeof f.en === "string" && f.en.trim().length > 0;

const { data: tours, error } = await sb.from("tours")
  .select("slug,title,subtitle,short_desc,description,duration_label,faqs,is_published")
  .eq("is_published", true);
if (error) throw error;
console.log("TOURS publicados:", tours.length);
for (const t of tours) {
  const missing = ["title","subtitle","short_desc","description","duration_label"]
    .filter(k => t[k] && !hasEn(t[k]));
  const faqsNoEn = (t.faqs ?? []).filter(f => !hasEn(f.q) || !hasEn(f.a)).length;
  console.log(`- ${t.slug}: faltan EN [${missing.join(",")}] faqs sin EN: ${faqsNoEn}/${(t.faqs??[]).length}`);
}

const { data: cats } = await sb.from("categories").select("slug,name,description").eq("is_published", true);
console.log("\nCATEGORIES:", cats.length);
for (const c of cats) console.log(`- ${c.slug}: name EN ${hasEn(c.name)?"OK":"FALTA"}, desc EN ${c.description ? (hasEn(c.description)?"OK":"FALTA") : "-"}`);

const { data: posts } = await sb.from("blog_posts").select("slug,title,excerpt,body_md,meta_title,meta_description").eq("is_published", true);
console.log("\nBLOG posts publicados:", posts.length);
let conEn = 0;
for (const p of posts) { if (hasEn(p.title) && hasEn(p.body_md)) conEn++; }
console.log("Posts con EN completo:", conEn, "| solo ES:", posts.length - conEn);

// itinerary table?
const { data: itin, error: e2 } = await sb.from("tour_itinerary").select("id,title,description").limit(3);
if (!e2 && itin) {
  console.log("\nITINERARY muestra:", itin.length, itin.length ? Object.keys(itin[0]).join(",") : "");
  for (const d of itin) console.log(`- title EN: ${hasEn(d.title)?"OK":"FALTA"}`);
}
