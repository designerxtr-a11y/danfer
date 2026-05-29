import { LoginForm } from "./login-form";

interface PageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next = "/admin", error } = await searchParams;

  return (
    <div className="min-h-screen grid place-items-center bg-stone px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-3xl font-bold">
            <span className="text-gradient-gold">DANFER</span>
            <span className="text-night">TOURS</span>
          </div>
          <p className="mt-2 text-night/50 text-sm uppercase tracking-widest">
            Panel administrativo
          </p>
        </div>

        <div className="bg-white border border-night/8 shadow-card rounded-3xl p-8">
          <h1 className="font-display text-3xl text-night">Acceso al panel</h1>
          <p className="mt-2 text-night/60 text-sm">
            Inicia sesión o crea tu cuenta para gestionar el sitio.
          </p>

          {error === "not_admin" && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              Tu cuenta no tiene permisos de administrador todavía. Pide al super
              admin que te active desde Usuarios.
            </div>
          )}

          <LoginForm nextUrl={next} />
        </div>

        <p className="mt-6 text-center text-night/40 text-xs">
          ¿Olvidaste tu contraseña? Contacta al super admin.
        </p>
      </div>
    </div>
  );
}
