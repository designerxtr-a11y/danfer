import type { ScraperAdapter } from "../types";
import { genericAdapter } from "./generic";

export const condeAdapter: ScraperAdapter = {
  name: "conde.travel",
  matches: (url) => /conde\.travel/i.test(url),
  parseTour(html, url) {
    // Conde.travel uses standard markup; generic adapter handles it well.
    const tour = genericAdapter.parseTour(html, url);
    if (tour) {
      tour.source_domain = "conde.travel";
    }
    return tour;
  },
};
