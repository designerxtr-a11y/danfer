"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { uploadPassportPhoto } from "./actions";

export function PassportUpload({ token }: { token: string }) {
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
    const res = await uploadPassportPhoto(token, formData);

    if (res.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">
          Received — thanks! We&rsquo;ll use it to book your train ticket and hotel reservation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-night/20 bg-white px-5 py-6">
      <input
        ref={inputRef}
        type="file"
        id="passport-file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-night font-semibold text-sm transition hover:bg-gold-bright disabled:opacity-60"
        >
          {status === "uploading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {status === "uploading" ? "Uploading…" : "Upload passport photo"}
        </button>
        {fileName && status !== "idle" && (
          <span className="text-sm text-night/60 truncate max-w-[220px]">{fileName}</span>
        )}
      </div>
      {status === "error" && (
        <p className="text-sm text-rose-600 mt-3">{error}</p>
      )}
      <p className="text-xs text-night/50 mt-3">
        A clear photo or scan of your passport&rsquo;s main page (name, photo, passport number).
        Needed to purchase your tourist train ticket and hotel reservation.
      </p>
    </div>
  );
}
