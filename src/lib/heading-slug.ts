/**
 * Slug estable para anclas de headings (índice de contenidos del blog).
 * Debe producir el MISMO id en el TOC y en el renderer de h2 del MDX.
 */
export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tildes fuera
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/** Extrae los títulos de nivel 2 (## ...) del markdown del post. */
export function extractH2s(markdown: string): { text: string; id: string }[] {
  const matches = markdown.match(/^## +(.+)$/gm) ?? [];
  return matches.map((line) => {
    // Limpia el "## " y formato inline básico (negritas, enlaces)
    const text = line
      .replace(/^## +/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();
    return { text, id: headingSlug(text) };
  });
}
