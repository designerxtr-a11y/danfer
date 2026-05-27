import type { ScraperAdapter } from "../types";
import { genericAdapter } from "./generic";
import { $$, clean } from "../utils";

const peruDomains = [
  "machupicchubuspackers.com",
  "boletomachupicchu.com",
  "supervallesagrado.com",
  "intupacusco.com",
];

export const peruToursAdapter: ScraperAdapter = {
  name: "peru-tour-sites",
  matches: (url) => peruDomains.some((d) => url.includes(d)),
  parseTour(html, url) {
    const tour = genericAdapter.parseTour(html, url);
    if (!tour) return null;

    // Many of these sites have an "Itinerario" tab in WordPress / plain HTML.
    // Try to refine the itinerary by looking for explicit "Día X" sections in body.
    const $ = $$(html);
    if (tour.itinerary.length === 0) {
      const bodyText = $("body").text();
      const dayRegex = /D[ií]a\s+(\d+)[:\s\-—]+([^\n]{5,120})/gi;
      let m: RegExpExecArray | null;
      while ((m = dayRegex.exec(bodyText)) !== null && tour.itinerary.length < 10) {
        tour.itinerary.push({
          day_number: parseInt(m[1]),
          title: clean(m[2]),
          meals: [],
        });
      }
    }
    return tour;
  },
};
