"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { uploadPassportPhoto } from "./actions";

const COPY = {
  en: {
    uploadLabel: "Upload photo",
    uploading: "Uploading…",
    done: "Received — thanks!",
    hint: "A clear photo or scan of your passport or ID (name, photo, document number).",
    traveler: (n: number) => `Traveler ${n}`,
    tooBig: "This file is too large. Please send a smaller photo, or send it to us on WhatsApp.",
    failed: "Upload failed. Please try again, or send the photo to us on WhatsApp.",
  },
  es: {
    uploadLabel: "Subir foto",
    uploading: "Subiendo…",
    done: "¡Recibido, gracias!",
    hint: "Una foto o escaneo claro de tu pasaporte o DNI (nombre, foto, número de documento).",
    traveler: (n: number) => `Pasajero ${n}`,
    tooBig: "El archivo es muy pesado. Envía una foto más liviana o mándanosla por WhatsApp.",
    failed: "No se pudo subir. Inténtalo de nuevo o mándanos la foto por WhatsApp.",
  },
};

// Server actions arrive at Vercel with a ~4MB cap; phone photos are often bigger.
const MAX_UPLOAD = 3.8 * 1024 * 1024;
const MAX_SIDE = 2000;

// Re-encode photos as JPEG (max 2000px) so they fit the upload limit while
// keeping the passport legible. PDFs and images the browser can't decode
// (e.g. HEIC outside Safari) are sent as-is.
async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 900 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function UploadSlot({
  token,
  index,
  lang,
}: {
  token: string;
  index: number;
  lang: "en" | "es";
}) {
  const t = COPY[lang];
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setStatus("uploading");
    setError(null);

    try {
      const upload = await shrinkImage(file);
      if (upload.size > MAX_UPLOAD) {
        setStatus("error");
        setError(t.tooBig);
        return;
      }
      const formData = new FormData();
      formData.set("file", upload);
      const res = await uploadPassportPhoto(token, formData, index);

      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(res.error);
      }
    } catch {
      setStatus("error");
      setError(t.failed);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-night/20 bg-white px-5 py-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-night min-w-[92px]">{t.traveler(index)}</span>

        {status === "done" ? (
          <span className="inline-flex items-center gap-2 text-emerald-700 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {t.done}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-night font-semibold text-sm transition hover:bg-gold-bright disabled:opacity-60"
          >
            {status === "uploading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            {status === "uploading" ? t.uploading : t.uploadLabel}
          </button>
        )}

        {fileName && status !== "idle" && (
          <span className="text-sm text-night/50 truncate max-w-[180px]">{fileName}</span>
        )}
      </div>
      {status === "error" && <p className="text-sm text-rose-600 mt-2">{error}</p>}
    </div>
  );
}

export function PassportUpload({
  token,
  travelers,
  lang = "en",
}: {
  token: string;
  travelers: number;
  lang?: "en" | "es";
}) {
  const t = COPY[lang];
  return (
    <div>
      <div className="space-y-3">
        {Array.from({ length: travelers }, (_, i) => (
          <UploadSlot key={i} token={token} index={i + 1} lang={lang} />
        ))}
      </div>
      <p className="text-xs text-night/50 mt-3">{t.hint}</p>
    </div>
  );
}
