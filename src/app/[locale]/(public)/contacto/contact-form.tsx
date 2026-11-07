"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { submitInquiry } from "./actions";
import { useI18n } from "@/lib/i18n/provider";
import { L } from "@/lib/i18n/pick";

export function ContactForm() {
  const { locale } = useI18n();
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await submitInquiry(form);
      if (r.ok) {
        setSent(true);
      } else {
        setError(
          r.error ??
            L(locale, {
              es: "Algo falló. Intenta de nuevo o escríbenos a hola@danfertourscusco.com",
              en: "Something went wrong. Please try again or email us at hola@danfertourscusco.com",
              ja: "送信できませんでした。もう一度お試しいただくか、hola@danfertourscusco.com までメールでご連絡ください。",
            })
        );
      }
    });
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-night/8 rounded-3xl p-12 text-center shadow-soft"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl text-night">
          {L(locale, { es: "¡Mensaje recibido!", en: "Message received!", ja: "メッセージを受け付けました！" })}
        </h2>
        <p className="mt-3 text-night/65">
          {L(locale, {
            es: "Te respondemos en menos de 24 horas a ",
            en: "We'll reply within 24 hours to ",
            ja: "24時間以内に次のアドレスへお返事します：",
          })}
          <span className="text-night font-medium">{form.email}</span>
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative bg-white border border-night/8 rounded-3xl p-6 md:p-8 shadow-soft space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label={L(locale, { es: "Nombre", en: "Name", ja: "お名前" })} required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          />
        </Field>
        <Field label={L(locale, { es: "Email", en: "Email", ja: "メールアドレス" })} required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          />
        </Field>
      </div>

      {/* Campo trampa anti-bots: oculto para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </label>
      </div>

      <Field label={L(locale, { es: "Teléfono / WhatsApp", en: "Phone / WhatsApp", ja: "電話 / WhatsApp" })}>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+51 999 999 999"
          className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
        />
      </Field>

      <Field
        label={L(locale, {
          es: "¿Qué tour te interesa? ¿Cuándo viajas?",
          en: "Which tour are you interested in? When are you traveling?",
          ja: "ご希望のツアーと旅行時期を教えてください",
        })}
        required
      >
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={L(locale, {
            es: "Soy de... me gustaría viajar a... mi presupuesto es...",
            en: "I'm from... I'd like to travel to... my budget is...",
            ja: "出身国、行きたい場所、ご予算などをご記入ください",
          })}
          className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition resize-y"
        />
      </Field>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-night hover:bg-gold text-white font-semibold px-8 py-3.5 rounded-full transition disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {L(locale, { es: "Enviar mensaje", en: "Send message", ja: "送信する" })}
      </button>

      <p className="text-xs text-night/40">
        {L(locale, { es: "Al enviar aceptas nuestra ", en: "By sending, you accept our ", ja: "送信すると、" })}
        <a href={L(locale, { es: "/privacidad", en: "/en/privacidad", ja: "/ja/privacidad" })} className="underline hover:text-gold">
          {L(locale, { es: "política de privacidad", en: "privacy policy", ja: "プライバシーポリシー" })}
        </a>
        {L(locale, {
          es: ". No compartimos tu información.",
          en: ". We don't share your information.",
          ja: "に同意したものとみなされます。お客様の情報を第三者と共有することはありません。",
        })}
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-night/50">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
