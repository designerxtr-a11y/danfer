"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  ExternalLink,
  Shuffle,
  Undo2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createPost, updatePost, deletePost } from "./actions";
import { paraphraseWithStats } from "@/lib/scrapers/paraphrase";
import type { BlogPost } from "@/lib/queries/blog";
import { t } from "@/types/database";

interface Props {
  post?: BlogPost;
  mode: "create" | "edit";
}

export function PostForm({ post, mode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletePending, startDelete] = useTransition();
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "ok" } | { type: "error"; msg: string }
  >({ type: "idle" });

  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [paraInfo, setParaInfo] = useState<
    | { type: "idle" }
    | { type: "ok"; original: string; pct: number; changed: number; total: number }
    | { type: "error"; msg: string }
  >({ type: "idle" });

  function paraphrase() {
    const textarea = bodyRef.current;
    if (!textarea) return;
    const current = textarea.value;
    if (current.length < 100) {
      setParaInfo({
        type: "error",
        msg: "Escribe al menos 100 caracteres antes de parafrasear.",
      });
      return;
    }
    const { content, stats } = paraphraseWithStats(current, { intensity: 0.35 });
    textarea.value = content;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    setParaInfo({
      type: "ok",
      original: current,
      pct: stats.changePct,
      changed: stats.wordsChanged,
      total: stats.wordsTotal,
    });
  }

  function undoParaphrase() {
    if (paraInfo.type !== "ok") return;
    const textarea = bodyRef.current;
    if (!textarea) return;
    textarea.value = paraInfo.original;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    setParaInfo({ type: "idle" });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus({ type: "idle" });
    startTransition(async () => {
      const action = mode === "create" ? createPost : updatePost;
      const result = await action(formData);
      if (result && "error" in result) {
        setStatus({ type: "error", msg: result.error });
      } else {
        setStatus({ type: "ok" });
        setTimeout(() => setStatus({ type: "idle" }), 3500);
      }
    });
  }

  function onDelete() {
    if (!post?.id) return;
    if (
      !confirm(
        `¿Eliminar "${t(post.title)}"? Esta acción es irreversible y borrará el post de la web.`
      )
    )
      return;
    startDelete(async () => {
      const result = await deletePost(post.id);
      if ("error" in result) {
        setStatus({ type: "error", msg: result.error });
      } else {
        router.push("/admin/blog");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_320px] gap-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      {/* Main column */}
      <div className="space-y-6 min-w-0">
        <Section>
          <Field
            label="Slug (URL)"
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="ejemplo-titulo-del-post"
            hint="Aparece en /blog/{slug}. Solo minúsculas, números y guiones."
            required
          />
          <Field
            label="Título (Español)"
            name="title_es"
            defaultValue={post ? t(post.title) : ""}
            placeholder="Mi increíble post sobre Cusco"
            required
          />
          <Field
            label="Título (English) — opcional"
            name="title_en"
            defaultValue={post?.title.en ?? ""}
          />
          <Field
            label="Extracto / resumen (ES)"
            name="excerpt_es"
            defaultValue={post && post.excerpt ? t(post.excerpt) : ""}
            placeholder="Aparece en el listing y en el meta description."
            multiline={2}
          />
          <Field
            label="Extracto (EN) — opcional"
            name="excerpt_en"
            defaultValue={post?.excerpt?.en ?? ""}
            multiline={2}
          />
        </Section>

        <Section title="Contenido (Markdown)">
          <Field
            label="Body en Español"
            name="body_md_es"
            defaultValue={post && post.body_md ? t(post.body_md) : ""}
            placeholder={"# Título del post\n\nIntroducción...\n\n## Sección\n\nContenido con **negrita**, [links](/destinos/machu-picchu), listas, etc."}
            multiline={20}
            mono
            required
            textareaRef={bodyRef}
            actionSlot={
              <div className="flex items-center gap-2">
                {paraInfo.type === "ok" && (
                  <button
                    type="button"
                    onClick={undoParaphrase}
                    className="inline-flex items-center gap-1 text-[11px] text-night/55 hover:text-night underline transition"
                  >
                    <Undo2 className="w-3 h-3" />
                    Deshacer
                  </button>
                )}
                <button
                  type="button"
                  onClick={paraphrase}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-turquoise to-turquoise-deep text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:shadow-md transition"
                  title="Reemplaza palabras por sinónimos para evitar contenido duplicado"
                >
                  <Shuffle className="w-3 h-3" />
                  Parafrasear
                </button>
              </div>
            }
          />
          {paraInfo.type === "error" && (
            <div className="flex items-start gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{paraInfo.msg}</span>
            </div>
          )}
          {paraInfo.type === "ok" && (
            <div className="flex items-start gap-2 text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Parafraseado.</span>{" "}
                {paraInfo.changed} de {paraInfo.total} palabras cambiadas (
                {(paraInfo.pct * 100).toFixed(0)}%). Puedes volver a clic en
                Parafrasear para variar más, o Deshacer.
              </div>
            </div>
          )}
          <Field
            label="Body en English — opcional"
            name="body_md_en"
            defaultValue={post?.body_md?.en ?? ""}
            multiline={10}
            mono
          />
        </Section>

        <Section title="SEO">
          <Field
            label="Meta title (ES) — máx 60 chars"
            name="meta_title_es"
            defaultValue={post?.meta_title?.es ?? ""}
            hint="Si lo dejas vacío, usa el título normal."
            maxLength={60}
          />
          <Field
            label="Meta description (ES) — máx 160 chars"
            name="meta_description_es"
            defaultValue={post?.meta_description?.es ?? ""}
            multiline={2}
            maxLength={160}
          />
        </Section>
      </div>

      {/* Sidebar column */}
      <aside className="space-y-6">
        <Section>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={post?.is_published ?? false}
              className="w-5 h-5 rounded accent-gold"
            />
            <div>
              <div className="font-medium text-night text-sm">Publicado</div>
              <div className="text-xs text-night/55">
                Si está apagado, el post no aparece en /blog (solo borrador).
              </div>
            </div>
          </label>
        </Section>

        <Section title="Imagen de portada">
          {coverImage && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone">
              <Image
                src={coverImage}
                alt="cover preview"
                fill
                sizes="320px"
                className="object-cover"
                unoptimized={!coverImage.startsWith("/")}
              />
            </div>
          )}
          <Field
            label="URL de la imagen"
            name="cover_image"
            defaultValue={post?.cover_image ?? ""}
            placeholder="https://images.unsplash.com/photo-... ó /uploads/..."
            onChange={(v) => setCoverImage(v)}
            hint="Pega la URL completa. Recomendado 1600x900 px."
          />
        </Section>

        <Section title="Meta">
          <Field
            label="Autor"
            name="author_name"
            defaultValue={post?.author_name ?? "Danfer Tours Cusco"}
          />
          <Field
            label="Avatar autor (URL)"
            name="author_avatar"
            defaultValue={post?.author_avatar ?? ""}
          />
          <Field
            label="Tiempo de lectura (minutos)"
            name="read_minutes"
            type="number"
            defaultValue={String(post?.read_minutes ?? 5)}
          />
          <Field
            label="Tags (separados por coma)"
            name="tags"
            defaultValue={(post?.tags ?? []).join(", ")}
            placeholder="machu-picchu, guia, soroche"
            hint="Sin la #. Solo minúsculas y guiones."
          />
        </Section>

        {post?.is_published && post?.slug && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full bg-white border border-night/10 hover:border-gold text-night text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            <Eye className="w-4 h-4" />
            Ver en el sitio
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </aside>

      {/* Sticky action bar */}
      <div className="lg:col-span-2 sticky bottom-4 z-10">
        <div className="bg-white/90 backdrop-blur border border-night/8 rounded-2xl shadow-card p-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 bg-night text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando…
                </>
              ) : mode === "create" ? (
                "Crear post"
              ) : (
                "Guardar cambios"
              )}
            </button>

            {status.type === "ok" && (
              <span className="inline-flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Guardado
              </span>
            )}
            {status.type === "error" && (
              <span className="inline-flex items-center gap-2 text-rose-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {status.msg}
              </span>
            )}
          </div>

          {mode === "edit" && post?.id && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deletePending}
              className="inline-flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl text-sm transition disabled:opacity-50"
            >
              {deletePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Eliminar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-night/8 rounded-2xl p-5 space-y-4">
      {title && (
        <h3 className="font-display text-base text-night">{title}</h3>
      )}
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  hint,
  placeholder,
  multiline,
  mono,
  required,
  maxLength,
  onChange,
  textareaRef,
  actionSlot,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  hint?: string;
  placeholder?: string;
  multiline?: number;
  mono?: boolean;
  required?: boolean;
  maxLength?: number;
  onChange?: (v: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  actionSlot?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-night/70 uppercase tracking-wider">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </span>
        {actionSlot}
      </span>
      {multiline ? (
        <textarea
          ref={textareaRef}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={multiline}
          required={required}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.target.value)}
          className={`mt-1.5 block w-full bg-stone border border-night/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:bg-white transition resize-y ${
            mono ? "font-mono leading-relaxed" : ""
          }`}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1.5 block w-full bg-stone border border-night/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:bg-white transition"
        />
      )}
      {hint && (
        <span className="mt-1 block text-[11px] text-night/45">{hint}</span>
      )}
    </label>
  );
}
