import { List } from "lucide-react";

interface Props {
  items: { text: string; id: string }[];
  locale: "es" | "en";
}

/**
 * Índice de contenidos del post — mejora la navegación en guías largas
 * y habilita sitelinks de fragmento en Google.
 */
export function PostToc({ items, locale }: Props) {
  if (items.length < 3) return null; // en posts cortos solo estorba
  return (
    <nav
      aria-label={locale === "en" ? "Table of contents" : "Índice del artículo"}
      className="mt-10 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/8 to-transparent p-6 sm:p-7"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="grid place-items-center w-7 h-7 rounded-full bg-gold/15">
          <List className="w-3.5 h-3.5 text-gold" />
        </span>
        <span className="text-[11px] uppercase tracking-[0.25em] text-night/50 font-medium">
          {locale === "en" ? "In this article" : "En este artículo"}
        </span>
      </div>
      <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group flex items-baseline gap-2.5 text-sm text-night/75 hover:text-gold transition leading-snug"
            >
              <span className="font-display text-gold/60 text-xs tabular-nums group-hover:text-gold transition">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
