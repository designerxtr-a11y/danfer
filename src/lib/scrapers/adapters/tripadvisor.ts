import type { ScraperAdapter, ScrapedReview } from "../types";
import { genericAdapter } from "./generic";
import { $$, clean, extractJsonLd } from "../utils";

interface TAReviewLd {
  "@type"?: string | string[];
  reviewBody?: string;
  name?: string;
  author?: { name?: string };
  reviewRating?: { ratingValue?: string | number };
  datePublished?: string;
  itemReviewed?: { name?: string };
}

function findReviewsInLd(ld: unknown, acc: TAReviewLd[]): TAReviewLd[] {
  if (!ld) return acc;
  if (Array.isArray(ld)) {
    ld.forEach((x) => findReviewsInLd(x, acc));
    return acc;
  }
  if (typeof ld === "object") {
    const obj = ld as TAReviewLd & { review?: TAReviewLd[]; "@graph"?: unknown };
    const types = Array.isArray(obj["@type"]) ? obj["@type"] : obj["@type"] ? [obj["@type"]] : [];
    if (types.includes("Review")) acc.push(obj);
    if (obj.review) findReviewsInLd(obj.review, acc);
    if (obj["@graph"]) findReviewsInLd(obj["@graph"], acc);
  }
  return acc;
}

// --- helpers ---------------------------------------------------------------

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function pickStr(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

function pickNum(o: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = o[k];
    const n = typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;
    if (isFinite(n)) return n;
  }
  return null;
}

// TA usa varias escalas: JSON-LD y GraphQL nuevo = 1–5, "bubbles" viejos = 10–50.
function normRating(n: number): number {
  if (!isFinite(n) || n <= 0) return 5;
  let r = n > 5 ? n / 10 : n; // 50 -> 5.0
  if (r > 5) r = 5;
  return r;
}

// Recolecta TODOS los <script> cuyo contenido parezca JSON y mencione "review"
// (incluye el estado de hidratación de TA, no solo ld+json).
function extractEmbeddedJson(html: string): unknown[] {
  const out: unknown[] = [];
  const $ = $$(html);
  const tryParse = (s: string) => {
    try {
      out.push(JSON.parse(s));
      return true;
    } catch {
      return false;
    }
  };
  $("script").each((_, el) => {
    const txt = $(el).contents().text();
    if (!txt || txt.length < 50 || txt.length > 8_000_000) return;
    if (!/review/i.test(txt)) return;
    if (tryParse(txt)) return;
    // p.ej. window.__X__ = {...}; → recorta del primer { al último }
    const first = txt.indexOf("{");
    const last = txt.lastIndexOf("}");
    if (first >= 0 && last > first) tryParse(txt.slice(first, last + 1));
  });
  return out;
}

// Camina un JSON arbitrario buscando objetos con forma de reseña.
function collectReviewLike(root: unknown): ScrapedReview[] {
  const found: ScrapedReview[] = [];
  const seen = new Set<unknown>();
  let budget = 300_000; // tope de nodos para no colgarse en blobs enormes

  const walk = (node: unknown) => {
    if (budget-- <= 0 || node === null || typeof node !== "object") return;
    if (seen.has(node)) return;
    seen.add(node);

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    const o = node as Record<string, unknown>;
    const body = pickStr(o, ["text", "reviewBody", "body"]);
    const rating =
      pickNum(o, ["rating", "bubbleRating", "ratingValue"]) ??
      pickNum(asObj(o.reviewRating), ["ratingValue", "rating"]);
    const hasMeta = [
      "title",
      "reviewTitle",
      "publishedDate",
      "createdDate",
      "datePublished",
      "username",
      "userProfile",
    ].some((k) => k in o);

    if (body && body.length >= 15 && rating !== null && hasMeta) {
      found.push({
        author_name:
          pickStr(o, ["username", "displayName"]) ||
          pickStr(asObj(o.userProfile), ["displayName", "username"]) ||
          pickStr(asObj(o.author), ["name"]) ||
          "Anónimo",
        rating: normRating(rating),
        title: pickStr(o, ["title", "reviewTitle"]) || undefined,
        body,
        published_at:
          pickStr(o, ["publishedDate", "createdDate", "datePublished"]) || undefined,
      });
    }

    for (const v of Object.values(o)) walk(v);
  };

  walk(root);
  return found;
}

export const tripadvisorAdapter: ScraperAdapter = {
  name: "tripadvisor",
  matches: (url) => /tripadvisor\.[a-z.]+/i.test(url),

  parseTour(html, url) {
    const tour = genericAdapter.parseTour(html, url);
    if (tour) tour.source_domain = "tripadvisor";
    return tour;
  },

  parseReviews(html) {
    const out: ScrapedReview[] = [];
    const seen = new Set<string>();

    const push = (r: ScrapedReview) => {
      const key = clean(r.body || r.title || "").slice(0, 80).toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({
        ...r,
        author_name: clean(r.author_name) || "Anónimo",
        title: r.title ? clean(r.title) : undefined,
        body: r.body ? clean(r.body) : undefined,
        rating: normRating(r.rating),
      });
    };

    // 1) JSON-LD (lo más fiable cuando está presente)
    const lds = extractJsonLd(html);
    const ldReviews: TAReviewLd[] = [];
    lds.forEach((ld) => findReviewsInLd(ld, ldReviews));
    for (const r of ldReviews) {
      push({
        author_name: r.author?.name || "Anónimo",
        rating: Number(r.reviewRating?.ratingValue) || 5,
        title: r.name,
        body: r.reviewBody,
        published_at: r.datePublished,
      });
    }

    // 2) JSON embebido (estado de hidratación de TA). Enriquecemos hasta tener
    //    un buen lote; el dedup por cuerpo evita duplicar lo del JSON-LD.
    if (out.length < 20) {
      for (const blob of extractEmbeddedJson(html)) {
        collectReviewLike(blob).forEach(push);
        if (out.length >= 50) break;
      }
    }

    // 3) Fallback DOM (clases de TA cambian/ofuscan, esto es best-effort)
    if (out.length === 0) {
      const $ = $$(html);
      $(
        '[data-automation="reviewCard"], [data-test-target="review-card"], .review-container'
      ).each((_, el) => {
        const card = $(el);
        const cardHtml = $.html(card);

        // rating: "5.0 of 5 bubbles" (aria-label/title) o bubble_XX viejo
        let rating = 5;
        const bub = cardHtml.match(/([0-5](?:\.\d)?)\s*of\s*5\s*bubbles?/i);
        if (bub) {
          rating = parseFloat(bub[1]);
        } else {
          const cls = card.find('[class*="bubble_"]').first().attr("class") || "";
          const m = cls.match(/bubble_(\d{2})/);
          if (m) rating = parseInt(m[1]) / 10;
        }

        const author =
          card.find('a[href*="/Profile/"]').first().text() ||
          card.find('[class*="memberOverlayLink"], [class*="username"]').first().text();

        const title =
          card.find('[data-test-target="review-title"]').first().text() ||
          card.find(".noQuotes, h4").first().text();

        let body = card
          .find('[data-test-target="review-text"], .partial_entry, q')
          .first()
          .text();

        // si no hay selector conocido, toma el bloque de texto más largo del card
        if (!clean(body)) {
          let best = "";
          card.find("span, div, p").each((_, e) => {
            const t = clean($(e).text());
            if (t.length > best.length) best = t;
          });
          body = best;
        }

        if (clean(body).length >= 15) {
          push({ author_name: author, rating, title, body });
        }
      });
    }

    return out.slice(0, 50);
  },
};
