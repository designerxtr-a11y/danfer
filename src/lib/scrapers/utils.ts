import { load, type CheerioAPI } from "cheerio";

export function $$(html: string): CheerioAPI {
  return load(html);
}

export function abs(url: string | undefined, base: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, base).toString();
  } catch {
    return undefined;
  }
}

export function clean(s: string | undefined | null): string {
  return (s ?? "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function parsePrice(s: string | undefined): number | undefined {
  if (!s) return undefined;
  const m = s.replace(/[,.](?=\d{3}\b)/g, "").match(/(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(",", ".")) : undefined;
}

export function parseDuration(s: string | undefined): {
  days?: number;
  label?: string;
} {
  if (!s) return {};
  const label = clean(s);
  const dMatch = label.match(/(\d+)\s*(d[ií]a|day)/i);
  if (dMatch) return { days: parseInt(dMatch[1]), label };
  if (/medio\s*d[ií]a|half\s*day/i.test(label)) return { days: 1, label };
  if (/full\s*day|d[ií]a\s*completo/i.test(label)) return { days: 1, label };
  return { label };
}

export function detectMeals(text: string): string[] {
  const out: string[] = [];
  const t = text.toLowerCase();
  if (/desayuno|breakfast/.test(t)) out.push("breakfast");
  if (/almuerzo|lunch/.test(t)) out.push("lunch");
  if (/cena|dinner/.test(t)) out.push("dinner");
  return out;
}

export function detectDifficulty(
  text: string
): "easy" | "moderate" | "challenging" | "expert" | undefined {
  const t = text.toLowerCase();
  if (/(\bexperto|expert\b|extreme)/.test(t)) return "expert";
  if (/(exigente|difícil|dificil|challenging|hard)/.test(t)) return "challenging";
  if (/(moderado|moderate|medio)/.test(t)) return "moderate";
  if (/(fácil|facil|easy)/.test(t)) return "easy";
  return undefined;
}

export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const $ = $$(html);
  $('script[type="application/ld+json"]').each((_, el) => {
    const txt = $(el).contents().text();
    try {
      const data = JSON.parse(txt);
      out.push(data);
    } catch {
      // ignore
    }
  });
  return out;
}
