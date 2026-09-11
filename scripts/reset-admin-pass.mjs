// Resetea la contraseña de un admin de Supabase Auth.
// Uso: node scripts/reset-admin-pass.mjs <email> <nueva-pass>

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const [, , email, newPass] = process.argv;
if (!email || !newPass) {
  console.error("Uso: node scripts/reset-admin-pass.mjs <email> <nueva-pass>");
  process.exit(1);
}

const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error: listErr } = await supabase.auth.admin.listUsers();
if (listErr) {
  console.error("[FAIL]", listErr.message);
  process.exit(1);
}
const user = data.users.find((u) => u.email === email);
if (!user) {
  console.error(`[FAIL] No existe el usuario ${email}`);
  process.exit(1);
}

const { error } = await supabase.auth.admin.updateUserById(user.id, {
  password: newPass,
  email_confirm: true,
});
if (error) {
  console.error("[FAIL]", error.message);
  process.exit(1);
}

console.log(`[OK] Contraseña actualizada para ${email}`);
