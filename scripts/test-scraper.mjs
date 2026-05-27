// Prueba el scraper contra una URL
// Uso: node scripts/test-scraper.mjs https://danfertourscusco.com

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/test-scraper.mjs <URL>");
  process.exit(1);
}

const res = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
  },
});

console.log("Status:", res.status, res.statusText);
console.log("Content-Type:", res.headers.get("content-type"));

const html = await res.text();
console.log("Length:", html.length, "chars");

// Extract title and links
const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
console.log("Title:", titleMatch?.[1]?.trim());

const description =
  html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)/i)?.[1];
console.log("Description:", description);

// Find tour links
const links = new Set();
const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
let m;
while ((m = linkRegex.exec(html)) !== null) {
  let href = m[1];
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
  if (!href.startsWith("http")) {
    try {
      href = new URL(href, url).toString();
    } catch {
      continue;
    }
  }
  if (/tour|paquete|excursion/i.test(href) && href.includes(new URL(url).hostname)) {
    links.add(href);
  }
}

console.log(`\nFound ${links.size} candidate tour URLs:`);
[...links].slice(0, 20).forEach((l) => console.log(" -", l));
