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

export const tripadvisorAdapter: ScraperAdapter = {
  name: "tripadvisor",
  matches: (url) => /tripadvisor\.[a-z.]+/i.test(url),

  parseTour(html, url) {
    const tour = genericAdapter.parseTour(html, url);
    if (tour) tour.source_domain = "tripadvisor";
    return tour;
  },

  parseReviews(html) {
    const reviews: ScrapedReview[] = [];

    // 1) Try JSON-LD reviews (most reliable)
    const lds = extractJsonLd(html);
    const found: TAReviewLd[] = [];
    lds.forEach((ld) => findReviewsInLd(ld, found));

    for (const r of found) {
      const rating = Number(r.reviewRating?.ratingValue);
      reviews.push({
        author_name: clean(r.author?.name) || "Anónimo",
        rating: isFinite(rating) ? rating : 5,
        title: clean(r.name),
        body: clean(r.reviewBody),
        published_at: r.datePublished,
      });
    }

    // 2) HTML fallback
    if (reviews.length === 0) {
      const $ = $$(html);
      $('[data-test-target="review-card"], .review-container, [data-automation="reviewCard"]').each(
        (_, el) => {
          const card = $(el);
          const author = clean(card.find('[class*="memberOverlayLink"], [class*="username"]').first().text());
          const body = clean(card.find('.partial_entry, [data-test-target="review-text"], q').first().text());
          const title = clean(card.find('[data-test-target="review-title"], .noQuotes, h4').first().text());
          // Rating: look for "bubble_XX" classes
          const bubble = card.find('[class*="bubble_"]').first().attr("class") || "";
          const m = bubble.match(/bubble_(\d{2})/);
          const rating = m ? parseInt(m[1]) / 10 : 5;

          if (author && body) {
            reviews.push({
              author_name: author,
              rating,
              title: title || undefined,
              body,
            });
          }
        }
      );
    }

    return reviews.slice(0, 30);
  },
};
