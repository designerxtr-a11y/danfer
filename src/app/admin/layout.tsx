import { AdminSidebar } from "./_components/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Login page renders without sidebar
  if (!user) return <>{children}</>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-stone flex">
      <AdminSidebar
        userEmail={user.email ?? ""}
        userName={profile?.full_name ?? ""}
      />
      <div className="flex-1 ml-64">
        <div className="px-8 py-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
