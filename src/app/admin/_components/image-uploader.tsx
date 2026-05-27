"use client";

import { useState, useTransition } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/app/admin/_actions/upload";

interface Props {
  bucket: "tour-images" | "blog-images" | "review-photos";
  folder?: string;
  value?: string;
  onChange: (url: string | null) => void;
  label?: string;
}

export function ImageUploader({
  bucket,
  folder = "general",
  value,
  onChange,
  label,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    if (file.size > 8 * 1024 * 1024) {
      setError("Imagen muy grande (máx 8MB)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);

    startTransition(async () => {
      const r = await uploadImage(formData);
      if (r.ok && r.url) onChange(r.url);
      else setError(r.error ?? "Error subiendo");
    });
  }

  return (
    <div>
      {label && (
        <div className="text-xs uppercase tracking-wider text-night/50 mb-2">
          {label}
        </div>
      )}

      {value ? (
        <div className="relative inline-block group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="w-full max-w-sm h-48 object-cover rounded-xl border border-night/8"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-night/80 text-white grid place-items-center hover:bg-rose-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 w-full max-w-sm h-48 border-2 border-dashed border-night/15 hover:border-gold hover:bg-stone rounded-xl cursor-pointer transition group">
          {pending ? (
            <>
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
              <span className="text-sm text-night/60">Subiendo...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-night/40 group-hover:text-gold transition" />
              <span className="text-sm text-night/60">
                Click o arrastra una imagen
              </span>
              <span className="text-xs text-night/40">JPG, PNG, WebP — máx 8MB</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
            disabled={pending}
          />
        </label>
      )}

      {error && (
        <div className="mt-2 text-sm text-rose-600">{error}</div>
      )}
    </div>
  );
}

// Gallery uploader — multiple images
export function GalleryUploader({
  value,
  onChange,
  bucket = "tour-images",
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: "tour-images" | "blog-images";
  folder?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);

    startTransition(async () => {
      const uploaded: string[] = [];
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) continue;
        const fd = new FormData();
        fd.append("file", file);
        fd.append("bucket", bucket);
        fd.append("folder", folder ?? "general");
        const r = await uploadImage(fd);
        if (r.ok && r.url) uploaded.push(r.url);
      }
      onChange([...value, ...uploaded]);
    });
  }

  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-night/50 mb-2">
        Galería ({value.length})
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="w-full h-28 object-cover rounded-lg border border-night/8"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-7 h-7 rounded-full bg-night/80 text-white grid place-items-center hover:bg-rose-600 transition opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center gap-1 h-28 border-2 border-dashed border-night/15 hover:border-gold hover:bg-stone rounded-lg cursor-pointer transition">
          {pending ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-5 h-5 text-night/40" />
              <span className="text-xs text-night/60">+ Añadir</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFiles}
            disabled={pending}
          />
        </label>
      </div>
      {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
    </div>
  );
}
