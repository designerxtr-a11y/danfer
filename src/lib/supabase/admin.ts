import { createClient } from "@supabase/supabase-js";

// Admin client — bypasses RLS using service role key.
// Only use in server actions / route handlers protected by middleware.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
