"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function LoginForm({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-night/50">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          placeholder="admin@danfertourscusco.com"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-night/50">
          Contraseña
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-night hover:bg-gold text-white font-semibold py-3.5 rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Entrar
      </button>
    </form>
  );
}
