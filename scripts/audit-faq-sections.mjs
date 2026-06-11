// Audita qué posts del blog tienen sección "Preguntas frecuentes" / "FAQ"
// y cuántos pares pregunta(###)/respuesta contiene cada una. Solo lectura.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const FAQ_HEADING = /^##\s+.*(preguntas frecuentes|faq|frequently asked)/im;

const { data: posts, error } = await supabase
  .from("blog_posts")
  .select("slug, body_md")
  .eq("is_published", true);
if (error) throw error;

let withFaq = 0;
for (const p of posts) {
  for (const lc of ["es", "en"]) {
    const body = p.body_md?.[lc];
    if (!body) continue;
    const m = body.match(FAQ_HEADING);
    if (!m) continue;
    // sección = desde el heading FAQ hasta el siguiente ## o fin
    const start = body.indexOf(m[0]);
    const rest = body.slice(start + m[0].length);
    const nextH2 = rest.search(/^## /m);
    const section = nextH2 === -1 ? rest : rest.slice(0, nextH2);
    const questions = section.match(/^###\s+(.+)$/gm) ?? [];
    console.log(`${p.slug} [${lc}]: "${m[0].trim()}" — ${questions.length} preguntas`);
    if (lc === "es") withFaq++;
  }
}
console.log(`\nTotal posts publicados: ${posts.length} | con sección FAQ (es): ${withFaq}`);
