"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type Mode = "signin" | "signup";

export function LoginForm({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || null } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Si Supabase devuelve sesión (confirmación de email desactivada) ya entra;
      // si no, hay que confirmar el correo antes de iniciar sesión.
      if (data.session) {
        router.push(nextUrl);
        router.refresh();
        return;
      }
      setNotice(
        "Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión."
      );
      setMode("signin");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push(nextUrl);
    router.refresh();
  }

  const isSignup = mode === "signup";

  return (
    <div className="mt-6">
      {/* Tabs login / registro */}
      <div className="flex gap-1 p-1 bg-stone rounded-full">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
          }}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
            !isSignup ? "bg-white text-night shadow-soft" : "text-night/50"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
            isSignup ? "bg-white text-night shadow-soft" : "text-night/50"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isSignup && (
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-night/50">
              Nombre
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
              placeholder="Tu nombre"
            />
          </label>
        )}

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
            placeholder="tu@email.com"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-night/50">
            Contraseña
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full bg-stone border border-night/8 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold focus:bg-white transition"
            placeholder="••••••••"
          />
          {isSignup && (
            <span className="mt-1 block text-[11px] text-night/40">
              Mínimo 6 caracteres.
            </span>
          )}
        </label>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}
        {notice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-night hover:bg-gold text-white font-semibold py-3.5 rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignup ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
