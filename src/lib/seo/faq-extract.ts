/**
 * Extrae la sección de preguntas frecuentes del markdown de un post
 * para emitir schema FAQPage. Data-driven: el post solo emite el
 * schema si tiene una sección "## Preguntas frecuentes" (o "FAQ" /
 * "Frequently asked questions") con preguntas en headings ###.
 * Google exige que el contenido del FAQPage sea visible en la página,
 * por eso se deriva del propio cuerpo y no de un campo aparte.
 */

export interface FaqItem {
  q: string;
  a: string;
}

const FAQ_HEADING =
  /^##\s+.*(preguntas frecuentes|frequently asked|faq)\b.*$/im;

/** Texto plano: quita negritas, enlaces y colapsa saltos de línea. */
function stripInline(md: string): string {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

export function extractFaqSection(markdown: string): FaqItem[] {
  const m = markdown.match(FAQ_HEADING);
  if (!m || m.index === undefined) return [];

  // Sección = desde el heading FAQ hasta el siguiente ## (o el final)
  const rest = markdown.slice(m.index + m[0].length);
  const nextH2 = rest.search(/^##\s/m);
  const section = nextH2 === -1 ? rest : rest.slice(0, nextH2);

  return section
    .split(/^###\s+/m)
    .slice(1) // lo anterior al primer ### no es una pregunta
    .map((block) => {
      const newline = block.indexOf("\n");
      const q = stripInline(newline === -1 ? block : block.slice(0, newline));
      const a = stripInline(newline === -1 ? "" : block.slice(newline + 1));
      return { q, a };
    })
    .filter((f) => f.q && f.a);
}
