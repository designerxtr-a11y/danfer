"use client";

import { useTransition } from "react";
import { togglePublished, toggleFeatured, deleteTour } from "./actions";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";

interface Props {
  id: string;
  isPublished: boolean;
  isFeatured: boolean;
  title: string;
}

export function ToursTableActions({ id, isPublished, isFeatured, title }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => startTransition(() => togglePublished(id, isPublished))}
        disabled={pending}
        title={isPublished ? "Despublicar" : "Publicar"}
        className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
          isPublished
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-night/5 text-night/40 hover:bg-night/10"
        }`}
      >
        {isPublished ? (
          <Eye className="w-3.5 h-3.5" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
      </button>
      <button
        onClick={() => startTransition(() => toggleFeatured(id, isFeatured))}
        disabled={pending}
        title={isFeatured ? "Quitar destacado" : "Destacar"}
        className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
          isFeatured
            ? "bg-gold/15 text-gold hover:bg-gold/25"
            : "bg-night/5 text-night/40 hover:bg-night/10"
        }`}
      >
        <Star
          className={`w-3.5 h-3.5 ${isFeatured ? "fill-gold" : ""}`}
        />
      </button>
      <button
        onClick={() => {
          if (confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) {
            startTransition(() => deleteTour(id));
          }
        }}
        disabled={pending}
        title="Eliminar"
        className="p-1.5 rounded-lg bg-night/5 text-night/40 hover:bg-rose-100 hover:text-rose-700 transition disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
