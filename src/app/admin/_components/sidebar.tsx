"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Download,
  Newspaper,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/import", label: "Importar", icon: Download },
  { href: "/admin/bookings", label: "Reservas", icon: Calendar },
  { href: "/admin/inquiries", label: "Consultas", icon: MessageSquare },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

export function AdminSidebar({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-night/8 flex flex-col">
      <Link href="/admin" className="block px-6 py-7 border-b border-night/8">
        <div className="font-display text-xl font-bold">
          <span className="text-gradient-gold">DANFER</span>
          <span className="text-night">TOURS</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-night/50 mt-0.5">
          Admin
        </div>
      </Link>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? "bg-gold text-white font-medium shadow-soft"
                  : "text-night/70 hover:bg-stone hover:text-night"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-night/70 hover:bg-stone transition"
        >
          <ExternalLink className="w-4 h-4" />
          Ver sitio
        </Link>
      </nav>

      <div className="border-t border-night/8 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-terracotta grid place-items-center font-display text-white font-bold">
            {(userName || userEmail).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-night truncate">
              {userName || "Admin"}
            </div>
            <div className="text-xs text-night/50 truncate">{userEmail}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-night/60 hover:bg-rose-50 hover:text-rose-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
