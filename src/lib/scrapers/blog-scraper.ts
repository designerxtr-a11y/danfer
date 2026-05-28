import TurndownService from "turndown";
import { $$, clean, slugify } from "./utils";

export interface ScrapedBlogPost {
  source_url: string;
  source_domain: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  cover_image?: string;
  author_name?: string;
  read_minutes: number;
  tags: string[];
  published_at?: string;
}

const turndown = new TurndownService({
  headingStyle: "atx", // # H1, ## H2 (more standard)
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  hr: "---",
  emDelimiter: "_",
  strongDelimiter: "**",
});

// Reglas custom para limpiar markdown
turndown.addRule("removeScripts", {
  filter: ["script", "style", "noscript"],
  replacement: () => "",
});
turndown.addRule("removeIframes", {
  filter: ["iframe", "embed", "object", "form", "input", "button"],
  replacement: () => "",
});
turndown.addRule("removeEmptyParas", {
  filter: (node) =>
    node.nodeName === "P" && (node.textContent?.trim() ?? "") === "",
  replacement: () => "",
});

function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 220));
}

type JsonLdNode = {
  "@type"?: string | string[];
  "@graph"?: JsonLdNode[];
  headline?: string;
  name?: string;
  description?: string;
  image?: string | { url?: string } | (string | { url?: string })[];
  author?: { name?: string } | { name?: string }[] | string;
  datePublished?: string;
  keywords?: string | string[];
  articleBody?: string;
};

function pickArticleJsonLd(ldData: unknown[]): JsonLdNode | null {
  for (const item of ldData) {
    if (!item || typeof item !== "object") continue;
    const node = item as JsonLdNode;
    const graph = node["@graph"];
    if (Array.isArray(graph)) {
      const fromGraph = pickArticleJsonLd(graph);
      if (fromGraph) return fromGraph;
    }
    const type = node["@type"];
    const types = Array.isArray(type) ? type : type ? [type] : [];
    if (
      types.some((t) =>
        ["Article", "BlogPosting", "NewsArticle", "TechArticle"].includes(t)
      )
    ) {
      return node;
    }
  }
  return null;
}

function imageFromJsonLd(img: JsonLdNode["image"]): string | undefined {
  if (!img) return undefined;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) {
    for (const i of img) {
      if (typeof i === "string") return i;
      if (i && typeof i === "object" && "url" in i && i.url) return i.url;
    }
    return undefined;
  }
  if (typeof img === "object" && "url" in img) return img.url;
  return undefined;
}

function authorFromJsonLd(
  author: JsonLdNode["author"]
): string | undefined {
  if (!author) return undefined;
  if (typeof author === "string") return author;
  if (Array.isArray(author)) {
    return author.map((a) => (typeof a === "string" ? a : a.name)).filter(Boolean).join(", ");
  }
  return author.name;
}

export async function scrapeBlogUrl(
  url: string
): Promise<{ ok: true; data: ScrapedBlogPost } | { error: string }> {
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DanferToursBot/1.0; +https://danfertourscusco.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      // Server-side fetch — sin caché para que la última versión cuente
      cache: "no-store",
    });
    if (!res.ok) return { error: `HTTP ${res.status} al cargar la URL` };
    html = await res.text();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al fetchear" };
  }

  const $ = $$(html);
  const sourceUrl = url;
  const sourceDomain = new URL(url).hostname.replace(/^www\./, "");

  // 1. Intenta JSON-LD (Article/BlogPosting)
  const ldData: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      if (Array.isArray(data)) ldData.push(...data);
      else ldData.push(data);
    } catch {
      // ignore
    }
  });
  const article = pickArticleJsonLd(ldData);

  // 2. Title
  const title =
    article?.headline ||
    article?.name ||
    clean($("h1").first().text()) ||
    clean($('meta[property="og:title"]').attr("content")) ||
    clean($("title").text());

  if (!title) return { error: "No se pudo extraer el título" };

  // 3. Excerpt / description
  const excerpt =
    article?.description ||
    clean($('meta[name="description"]').attr("content")) ||
    clean($('meta[property="og:description"]').attr("content")) ||
    clean($("article p").first().text()).slice(0, 280);

  // 4. Cover image
  const coverImage =
    imageFromJsonLd(article?.image) ||
    clean($('meta[property="og:image"]').attr("content")) ||
    clean($('meta[name="twitter:image"]').attr("content")) ||
    clean($("article img").first().attr("src"));

  // 5. Author
  const authorName =
    authorFromJsonLd(article?.author) ||
    clean($('meta[name="author"]').attr("content")) ||
    clean($('[rel="author"]').first().text()) ||
    clean($(".author, .byline").first().text()) ||
    undefined;

  // 6. Date
  const published =
    article?.datePublished ||
    clean($('meta[property="article:published_time"]').attr("content")) ||
    clean($("time[datetime]").first().attr("datetime")) ||
    undefined;

  // 7. Tags
  let tags: string[] = [];
  if (article?.keywords) {
    tags = Array.isArray(article.keywords)
      ? article.keywords
      : article.keywords.split(",");
  } else {
    const kw = clean($('meta[name="keywords"]').attr("content"));
    if (kw) tags = kw.split(",");
  }
  // También extrae tags visibles (.tag, .post-tag)
  $(".tag, .post-tag, [rel=tag]").each((_, el) => {
    const t = clean($(el).text());
    if (t && !tags.includes(t)) tags.push(t);
  });
  tags = tags
    .map((t) => slugify(t.trim()))
    .filter(Boolean)
    .slice(0, 8);

  // 8. Body — intenta los selectores típicos
  const candidates = [
    "article .entry-content",
    "article .post-content",
    "article .article-content",
    "article .content",
    "article",
    ".entry-content",
    ".post-content",
    ".article-content",
    "main article",
    "main",
    "[role=main]",
  ];
  let bodyHtml = "";
  for (const sel of candidates) {
    const node = $(sel).first();
    if (node.length && (node.text().trim().length ?? 0) > 200) {
      // Limpia elementos no deseados antes de convertir
      node.find("script, style, noscript, iframe, .share, .related, .comments, .ad, .advertisement, nav, header, footer, aside").remove();
      bodyHtml = node.html() ?? "";
      break;
    }
  }
  if (!bodyHtml && article?.articleBody) {
    bodyHtml = `<p>${article.articleBody.replace(/\n\n/g, "</p><p>")}</p>`;
  }
  if (!bodyHtml) return { error: "No se pudo extraer el cuerpo del artículo" };

  const bodyMd = turndown
    .turndown(bodyHtml)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (bodyMd.length < 200) {
    return { error: "El cuerpo extraído es muy corto (<200 chars)" };
  }

  const slug = slugify(title);
  const readMinutes = estimateReadMinutes(bodyMd);

  return {
    ok: true,
    data: {
      source_url: sourceUrl,
      source_domain: sourceDomain,
      slug,
      title,
      excerpt,
      body_md: bodyMd,
      cover_image: coverImage,
      author_name: authorName,
      read_minutes: readMinutes,
      tags,
      published_at: published,
    },
  };
}
