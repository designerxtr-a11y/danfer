import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Public client — anon key, sin cookies. Para lecturas públicas desde Server
// Components: no lee cookies(), así las páginas pueden ser estáticas/ISR en
// vez de renderizarse en cada request (eso consumía la CPU de Vercel).
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
