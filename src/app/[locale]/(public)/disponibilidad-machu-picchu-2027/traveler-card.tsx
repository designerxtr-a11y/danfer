"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { L } from "@/lib/i18n/pick";
import { shrinkImage, MAX_UPLOAD } from "@/lib/shrink-image";
import type { Locale } from "@/types/database";
import { uploadMp2027Doc } from "./actions";

export interface TravelerDraft {
  fullName: string;
  docType: "passport" | "dni";
  docNumber: string;
  nationality: string;
  birthDate: string;
  docUploaded: boolean;
}

export const emptyTraveler = (): TravelerDraft => ({
  fullName: "",
  docType: "passport",
  docNumber: "",
  nationality: "",
  birthDate: "",
  docUploaded: false,
});

const input =
  "w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition";

export function TravelerCard({
  locale,
  index,
  draftId,
  value,
  onChange,
  onRemove,
}: {
  locale: Locale;
  index: number; // 1-based
  draftId: string;
  value: TravelerDraft;
  onChange: (v: TravelerDraft) => void;
  onRemove?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const set = <K extends keyof TravelerDraft>(k: K, v: TravelerDraft[K]) => onChange({ ...value, [k]: v });

  async function upload(file: File) {
    setFileName(file.name);
    setStatus("uploading");
    setError(null);
    try {
      const f = await shrinkImage(file);
      if (f.size > MAX_UPLOAD) throw new Error("too_big");
      const fd = new FormData();
      fd.set("file", f);
      const res = await uploadMp2027Doc(draftId, index, fd);
      if (!res.ok) throw new Error(res.error);
      setStatus("idle");
      onChange({ ...value, docUploaded: true });
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error && e.message === "too_big"
          ? L(locale, {
              es: "El archivo es muy pesado. Envía una foto más liviana.",
              en: "This file is too large. Please send a smaller photo.",
              ja: "ファイルが大きすぎます。小さい写真をお送りください。",
            })
          : L(locale, {
              es: "No se pudo subir. Inténtalo de nuevo.",
              en: "Upload failed. Please try again.",
              ja: "アップロードできませんでした。もう一度お試しください。",
            })
      );
    }
  }

  return (
    <div className="rounded-2xl border border-night/10 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-night">
          {L(locale, { es: `Pasajero ${index}`, en: `Traveler ${index}`, ja: `旅行者 ${index}` })}
        </h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-sm text-night/50 hover:text-rose-600 transition"
          >
            <Trash2 className="w-4 h-4" />
            {L(locale, { es: "Quitar", en: "Remove", ja: "削除" })}
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-wider text-night/50">
            {L(locale, {
              es: "Nombre y apellidos (como en el documento)",
              en: "Full name (as on the document)",
              ja: "氏名（書類と同じ表記）",
            })}
          </span>
          <input className={`${input} mt-1.5`} value={value.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            {L(locale, { es: "Documento", en: "Document", ja: "書類" })}
          </span>
          <div className="mt-1.5 flex gap-2">
            <select
              className={`${input} w-32 shrink-0`}
              value={value.docType}
              onChange={(e) => set("docType", e.target.value as TravelerDraft["docType"])}
            >
              <option value="passport">{L(locale, { es: "Pasaporte", en: "Passport", ja: "パスポート" })}</option>
              <option value="dni">DNI</option>
            </select>
            <input
              className={input}
              value={value.docNumber}
              onChange={(e) => set("docNumber", e.target.value.toUpperCase())}
              placeholder={L(locale, { es: "Número", en: "Number", ja: "番号" })}
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            {L(locale, { es: "Nacionalidad", en: "Nationality", ja: "国籍" })}
          </span>
          <input className={`${input} mt-1.5`} value={value.nationality} onChange={(e) => set("nationality", e.target.value)} />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            {L(locale, { es: "Fecha de nacimiento", en: "Date of birth", ja: "生年月日" })}
          </span>
          <input
            type="date"
            className={`${input} mt-1.5`}
            value={value.birthDate}
            max="2027-12-31"
            onChange={(e) => set("birthDate", e.target.value)}
          />
        </label>

        <div className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            {L(locale, { es: "Foto del pasaporte o DNI", en: "Passport or ID photo", ja: "パスポート・身分証の写真" })}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            {value.docUploaded && status !== "uploading" ? (
              <span className="inline-flex items-center gap-2 text-emerald-700 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {L(locale, { es: "Recibido", en: "Received", ja: "受け付けました" })}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={status === "uploading"}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-night font-semibold text-sm hover:bg-gold-bright disabled:opacity-60 transition"
            >
              {status === "uploading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {status === "uploading"
                ? L(locale, { es: "Subiendo…", en: "Uploading…", ja: "アップロード中…" })
                : value.docUploaded
                  ? L(locale, { es: "Cambiar foto", en: "Replace photo", ja: "写真を変更" })
                  : L(locale, { es: "Subir foto", en: "Upload photo", ja: "写真をアップロード" })}
            </button>
            {fileName && <span className="text-xs text-night/45 truncate max-w-[160px]">{fileName}</span>}
          </div>
          {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
