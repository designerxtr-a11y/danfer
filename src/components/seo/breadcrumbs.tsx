import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Visible breadcrumbs. Mantén el orden y los nombres iguales a los del
 * `breadcrumbSchema()` JSON-LD para que coincidan (Google revisa
 * consistencia entre el schema y el HTML visible).
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-night/55 ${className}`}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-night font-medium truncate max-w-[260px]"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-gold transition truncate max-w-[180px]"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="w-3 h-3 text-night/35 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
