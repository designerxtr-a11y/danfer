import type { ScraperAdapter, ScrapedTour, ScrapedItineraryDay } from "../types";
import { $$, abs, clean, slugify, parsePrice, parseDuration, detectMeals, extractJsonLd } from "../utils";

interface JsonLdNode {
  "@type"?: string | string[];
  name?: string;
  description?: string;
  image?: string | string[] | { url?: string }[];
  offers?: { price?: string | number; priceCurrency?: string };
  duration?: string;
  itinerary?: { itemListElement?: { name?: string; description?: string }[] };
}

function findTypeIn(data: unknown, typeName: string): JsonLdNode | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const r = findTypeIn(item, typeName);
      if (r) return r;
    }
    return null;
  }
  if (typeof data === "object") {
    const obj = data as JsonLdNode & { "@graph"?: unknown };
    const type = obj["@type"];
    const typeArr = Array.isArray(type) ? type : type ? [type] : [];
    if (typeArr.includes(typeName)) return obj;
    if (obj["@graph"]) return findTypeIn(obj["@graph"], typeName);
  }
  return null;
}

export const genericAdapter: ScraperAdapter = {
  name: "generic",
  matches: () => true, // fallback
  parseTour(html, url) {
    const $ = $$(html);
    const u = new URL(url);

    // 1) Try JSON-LD first (best signal)
    const lds = extractJsonLd(html);
    let lt: JsonLdNode | null = null;
    for (const t of ["Product", "TouristTrip", "TouristAttraction", "Event"]) {
      for (const ld of lds) {
        lt = findTypeIn(ld, t);
        if (lt) break;
      }
      if (lt) break;
    }

    const title =
      clean(lt?.name) ||
      clean($('meta[property="og:title"]').attr("content")) ||
      clean($("h1").first().text()) ||
      clean($("title").text());

    const description =
      clean(lt?.description) ||
      clean($('meta[name="description"]').attr("content")) ||
      clean($('meta[property="og:description"]').attr("content"));

    // Cover image
    const cover =
      abs(
        (() => {
          const img = lt?.image;
          if (typeof img === "string") return img;
          if (Array.isArray(img)) {
            const first = img[0];
            return typeof first === "string" ? first : first?.url;
          }
          return undefined;
        })(),
        url
      ) ||
      abs($('meta[property="og:image"]').attr("content"), url) ||
      abs($('img[src*="hero"], img[src*="banner"], .hero img, header img').first().attr("src"), url);

    // Gallery — collect images from main content
    const gallery: string[] = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      const absUrl = abs(src, url);
      if (absUrl && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(absUrl) && !gallery.includes(absUrl)) {
        // skip tiny icons
        const w = parseInt($(el).attr("width") || "0");
        if (w > 0 && w < 200) return;
        gallery.push(absUrl);
      }
    });

    // Price
    const priceText =
      String(lt?.offers?.price ?? "") ||
      clean($('[itemprop="price"], .price, [class*="price"]').first().text());
    const price = parsePrice(priceText);

    // Duration
    const { days, label } = parseDuration(
      lt?.duration ?? clean($('[class*="duration"]').first().text())
    );

    // Highlights / Includes / Excludes — heuristic by headings
    const highlights = extractListAfterHeading($, /destacad|highlight|incluye especialmente/i);
    const includes = extractListAfterHeading($, /incluy(e|es)|include[ds]?/i);
    const excludes = extractListAfterHeading($, /no incluy|excluye|excludes|not included/i);
    const whatToBring = extractListAfterHeading($, /qu[ée] llevar|what to bring|recomendaciones de equipo/i);

    // Itinerary
    const itinerary: ScrapedItineraryDay[] = [];
    if (lt?.itinerary?.itemListElement) {
      lt.itinerary.itemListElement.forEach((d, i) => {
        itinerary.push({
          day_number: i + 1,
          title: clean(d.name),
          description: clean(d.description),
          meals: detectMeals(d.description ?? ""),
        });
      });
    } else {
      // Try to find <h2|h3> followed by description (e.g. "Día 1:")
      $("h2, h3, h4").each((_, el) => {
        const head = clean($(el).text());
        const m = head.match(/d[ií]a\s*(\d+)\s*[:\-—]?\s*(.*)/i);
        if (m) {
          const desc = clean($(el).nextUntil("h2, h3, h4").text()).slice(0, 800);
          itinerary.push({
            day_number: parseInt(m[1]),
            title: m[2] || `Día ${m[1]}`,
            description: desc,
            meals: detectMeals(desc),
          });
        }
      });
    }

    if (!title) return null;

    const tour: ScrapedTour = {
      source_url: url,
      source_domain: u.hostname,
      slug: slugify(title),
      title,
      short_desc: description?.slice(0, 200),
      description,
      cover_image: cover,
      gallery: gallery.slice(0, 12),
      duration_days: days,
      duration_label: label,
      price_usd: price,
      highlights,
      includes,
      excludes,
      what_to_bring: whatToBring,
      itinerary,
    };

    return tour;
  },
};

function extractListAfterHeading(
  $: ReturnType<typeof $$>,
  regex: RegExp
): string[] {
  const out: string[] = [];
  $("h1, h2, h3, h4, h5, strong, b").each((_, el) => {
    const head = clean($(el).text());
    if (regex.test(head)) {
      const parent = $(el).parent();
      const list = $(el).nextAll("ul, ol").first();
      if (list.length) {
        list.find("li").each((_, li) => {
          const t = clean($(li).text());
          if (t && t.length < 200) out.push(t);
        });
      } else {
        // try siblings <p> with bullet text
        parent
          .find("li")
          .each((_, li) => {
            const t = clean($(li).text());
            if (t && t.length < 200 && !out.includes(t)) out.push(t);
          });
      }
    }
  });
  return out.slice(0, 15);
}
