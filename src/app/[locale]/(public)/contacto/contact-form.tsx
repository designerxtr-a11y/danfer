"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { submitInquiry } from "./actions";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await submitInquiry(form);
      if (r.ok) {
        setSent(true);
      } else {
        setError(r.error ?? "Algo falló. Intenta de nuevo o escríbenos a hola@danfertourscusco.com");
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
        <h2 className="font-display text-3xl text-night">¡Mensaje recibido!</h2>
        <p className="mt-3 text-night/65">
          Te respondemos en menos de 24 horas a{" "}
          <span className="text-night font-medium">{form.email}</span>.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-night/8 rounded-3xl p-6 md:p-8 shadow-soft space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Nombre" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          />
        </Field>
      </div>

      <Field label="Teléfono / WhatsApp">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+51 999 999 999"
          className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
        />
      </Field>

      <Field label="¿Qué tour te interesa? ¿Cuándo viajas?" required>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Soy de... me gustaría viajar a... mi presupuesto es..."
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
        Enviar mensaje
      </button>

      <p className="text-xs text-night/40">
        Al enviar aceptas nuestra{" "}
        <a href="/privacidad" className="underline hover:text-gold">
          política de privacidad
        </a>
        . No compartimos tu información.
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
