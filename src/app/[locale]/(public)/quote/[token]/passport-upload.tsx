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
  },
  es: {
    uploadLabel: "Subir foto",
    uploading: "Subiendo…",
    done: "¡Recibido, gracias!",
    hint: "Una foto o escaneo claro de tu pasaporte o DNI (nombre, foto, número de documento).",
    traveler: (n: number) => `Pasajero ${n}`,
  },
};

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

    const formData = new FormData();
    formData.set("file", file);
    const res = await uploadPassportPhoto(token, formData, index);

    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(res.error);
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
