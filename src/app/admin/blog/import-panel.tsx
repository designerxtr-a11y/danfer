"use client";

import { useState, useTransition } from "react";
import { Link2, Loader2, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { scrapeUrl } from "./actions";
import type { ScrapedBlogPost } from "@/lib/scrapers/blog-scraper";

export function ImportPanel({
  onImport,
}: {
  onImport: (data: ScrapedBlogPost) => void;
}) {
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "ok"; preview: ScrapedBlogPost } | { type: "error"; msg: string }
  >({ type: "idle" });

  function onScrape(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });
    startTransition(async () => {
      const result = await scrapeUrl(url);
      if ("error" in result) {
        setStatus({ type: "error", msg: result.error });
      } else {
        setStatus({ type: "ok", preview: result.data });
      }
    });
  }

  function onUse() {
    if (status.type === "ok") {
      onImport(status.preview);
      setStatus({ type: "idle" });
      setUrl("");
    }
  }

  return (
    <div className="bg-gradient-to-br from-night to-night-deep text-white rounded-2xl p-6 mb-6 shadow-card">
      <div className="flex items-start gap-3 mb-4">
        <div className="grid place-items-center w-10 h-10 rounded-xl bg-gold/20 shrink-0">
          <Globe className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-lg text-white">
            Importar desde URL
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            Pega la URL de cualquier blog post y extraemos título, imagen,
            cuerpo y tags. Después editas todo antes de publicar.
          </p>
        </div>
      </div>

      <form onSubmit={onScrape} className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://blog.ejemplo.com/post-machu-picchu"
            required
            disabled={pending}
            className="w-full bg-white/10 border border-white/20 focus:border-gold focus:bg-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !url}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-night px-5 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 text-sm shrink-0"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extrayendo…
            </>
          ) : (
            "Extraer"
          )}
        </button>
      </form>

      {status.type === "error" && (
        <div className="mt-4 flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2.5 text-rose-200 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{status.msg}</span>
        </div>
      )}

      {status.type === "ok" && (
        <div className="mt-4 bg-white/5 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-start gap-2 text-emerald-300 text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">
              Extraído de {status.preview.source_domain}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-white/50 text-xs uppercase tracking-wider">
                Título
              </span>
              <div className="text-white mt-0.5">{status.preview.title}</div>
            </div>
            {status.preview.excerpt && (
              <div>
                <span className="text-white/50 text-xs uppercase tracking-wider">
                  Resumen
                </span>
                <div className="text-white/80 mt-0.5 line-clamp-2">
                  {status.preview.excerpt}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-white/60 pt-2 border-t border-white/10">
              <span>📝 ~{status.preview.read_minutes} min lectura</span>
              <span>📊 {status.preview.body_md.length.toLocaleString()} chars</span>
              {status.preview.author_name && (
                <span>✍ {status.preview.author_name}</span>
              )}
              {status.preview.tags.length > 0 && (
                <span>🏷 {status.preview.tags.length} tags</span>
              )}
              {status.preview.cover_image && <span>🖼 cover OK</span>}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onUse}
              className="flex-1 bg-gold hover:bg-gold-bright text-night px-4 py-2.5 rounded-xl font-semibold transition text-sm"
            >
              Usar este contenido →
            </button>
            <button
              type="button"
              onClick={() => setStatus({ type: "idle" })}
              className="bg-white/10 hover:bg-white/15 text-white/80 px-4 py-2.5 rounded-xl transition text-sm"
            >
              Cancelar
            </button>
          </div>
          <div className="mt-3 text-[11px] text-white/40 leading-relaxed">
            ⚠ <strong>Importante</strong>: el contenido scrapeado tiene
            copyright del autor original. Úsalo solo como base para tu propia
            reescritura/inspiración, no lo publiques tal cual.
          </div>
        </div>
      )}
    </div>
  );
}
