import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-night/60 hover:text-gold text-sm mb-4 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al blog
      </Link>
      <h1 className="font-display text-4xl text-night mb-2">Nuevo post</h1>
      <p className="text-night/60 mb-8">
        Crea un nuevo artículo. Marca &quot;Publicado&quot; cuando esté listo —
        si no, queda como borrador.
      </p>
      <PostForm mode="create" />
    </div>
  );
}
