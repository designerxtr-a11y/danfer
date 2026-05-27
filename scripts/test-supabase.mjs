// Verifica conexión a Supabase
// Uso: node scripts/test-supabase.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const url = get("NEXT_PUBLIC_SUPABASE_URL");
const anon = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// Probar contra una tabla que aún no existe; un 404 con código PGRST205
// confirma que la API y las credenciales funcionan.
const res = await fetch(`${url}/rest/v1/tours?select=id&limit=1`, {
  headers: { apikey: anon, Authorization: `Bearer ${anon}` },
});

console.log("URL:    ", url);
console.log("Status: ", res.status, res.statusText);
const body = await res.text();
console.log("Body:   ", body);

if (res.ok) {
  console.log("\n[OK] Conexión exitosa — tabla 'tours' existe.");
} else if (body.includes("PGRST205") || body.includes("Could not find the table")) {
  console.log("\n[OK] Credenciales válidas. Tablas no creadas aún — pega las migraciones.");
} else {
  console.log("\n[FAIL] Revisa las credenciales en .env.local");
}
