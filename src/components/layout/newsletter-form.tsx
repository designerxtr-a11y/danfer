"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export function NewsletterForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const r = await subscribeNewsletter(fd);
      if (r.ok) setDone(true);
      else setError(r.error ?? "Error");
    });
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-emerald-300 text-sm">
        <Check className="w-4 h-4" />
        ¡Gracias! Te llegarán nuestras mejores ofertas.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="tu@email.com"
        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-gold hover:bg-gold-bright text-white font-medium text-sm px-5 rounded-full transition disabled:opacity-50 flex items-center gap-1.5"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "OK"}
      </button>
      {error && (
        <div className="absolute mt-12 text-rose-300 text-xs">{error}</div>
      )}
    </form>
  );
}
