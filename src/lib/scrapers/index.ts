import type { ScraperAdapter } from "./types";
import { condeAdapter } from "./adapters/conde";
import { peruToursAdapter } from "./adapters/peru-tour-sites";
import { tripadvisorAdapter } from "./adapters/tripadvisor";
import { genericAdapter } from "./adapters/generic";

const adapters: ScraperAdapter[] = [
  condeAdapter,
  peruToursAdapter,
  tripadvisorAdapter,
  // genericAdapter is fallback; matches everything → last
  genericAdapter,
];

export function pickAdapter(url: string): ScraperAdapter {
  return adapters.find((a) => a.matches(url)) ?? genericAdapter;
}

export async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "es-PE,es;q=0.9,en;q=0.8",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }

  return await res.text();
}

export type { ScrapedTour, ScrapedReview, ScrapedItineraryDay } from "./types";
