import { cookies } from "next/headers";
import type { Locale } from "./messages";

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const c = store.get("locale")?.value;
  return c === "en" ? "en" : "es";
}
