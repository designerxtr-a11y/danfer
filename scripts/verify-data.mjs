import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const url = get("NEXT_PUBLIC_SUPABASE_URL");
const anon = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const headers = { apikey: anon, Authorization: `Bearer ${anon}` };

async function count(table) {
  const r = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { ...headers, Prefer: "count=exact", Range: "0-0" },
  });
  return r.headers.get("content-range")?.split("/")[1] ?? "?";
}

console.log("== Tabla counts ==");
for (const t of ["categories", "tours", "tour_itinerary", "tour_availability", "reviews", "settings"]) {
  console.log(`${t.padEnd(20)} ${await count(t)}`);
}

console.log("\n== Tours featured ==");
const featured = await fetch(
  `${url}/rest/v1/tours?is_featured=eq.true&select=slug,title,price_usd,rating,reviews_count&order=bookings_count.desc`,
  { headers }
).then((r) => r.json());

for (const t of featured) {
  console.log(`- ${t.slug.padEnd(25)} US$${t.price_usd}  ★${t.rating} (${t.reviews_count})  "${t.title.es}"`);
}
