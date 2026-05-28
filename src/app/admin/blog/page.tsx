import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Calendar, Clock, Eye, EyeOff } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { t } from "@/types/database";
import type { BlogPost } from "@/lib/queries/blog";

export const dynamic = "force-dynamic";

async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as BlogPost[];
}

export default async function AdminBlogList() {
  const posts = await getAllPosts();
  const published = posts.filter((p) => p.is_published).length;
  const drafts = posts.length - published;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-night">Blog</h1>
          <p className="text-night/60 mt-1">
            {posts.length} posts · {published} publicados · {drafts} borradores
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-night hover:bg-gold text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-dashed border-night/15 rounded-2xl p-16 text-center">
          <h2 className="font-display text-2xl text-night">
            No hay posts todavía
          </h2>
          <p className="mt-2 text-night/60">
            Crea tu primer post y aparecerá en /blog automáticamente.
          </p>
          <Link
            href="/admin/blog/new"
            className="mt-6 inline-flex items-center gap-2 bg-night text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gold transition"
          >
            <Plus className="w-4 h-4" />
            Crear primer post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone">
              <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Post</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Tiempo lectura</th>
                <th className="px-6 py-3 font-medium">Publicado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-night/5 hover:bg-stone/40 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.cover_image && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone">
                          <Image
                            src={p.cover_image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-night truncate max-w-md">
                          {t(p.title)}
                        </div>
                        <div className="text-xs text-night/50 truncate font-mono">
                          /blog/{p.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.is_published ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        <Eye className="w-3 h-3" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-stone text-night/60 text-xs font-medium px-2.5 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-night/60">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {p.read_minutes} min
                    </span>
                  </td>
                  <td className="px-6 py-4 text-night/60">
                    {p.published_at ? (
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(p.published_at).toLocaleDateString("es-PE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-night/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-night/70 hover:text-gold text-sm transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
