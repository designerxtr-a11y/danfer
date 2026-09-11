// Lista usuarios de Supabase Auth y su estado admin.
// Uso: node scripts/list-admins.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error } = await supabase.auth.admin.listUsers();
if (error) {
  console.error("[FAIL]", error.message);
  process.exit(1);
}

const { data: profiles } = await supabase.from("profiles").select("id, is_admin, full_name");
const adminMap = new Map((profiles ?? []).map((p) => [p.id, p]));

console.log(`Total usuarios: ${data.users.length}\n`);
for (const u of data.users) {
  const p = adminMap.get(u.id);
  console.log(
    `${p?.is_admin ? "[ADMIN]" : "[ user]"} ${u.email}` +
      `  confirmado=${u.email_confirmed_at ? "sí" : "NO"}` +
      `  nombre=${p?.full_name ?? "-"}`
  );
}
