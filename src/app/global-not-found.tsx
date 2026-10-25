import { RootHtml, rootMetadata } from "@/components/layout/root-html";
import {
  NotFoundContent,
  notFoundMetadata,
} from "@/components/layout/not-found-content";

// 404 para URLs que no matchean ninguna ruta. Hace falta porque ya no hay un
// app/layout.tsx único: [locale] y admin son layouts raíz separados.
export const metadata = { ...rootMetadata, ...notFoundMetadata };

export default function GlobalNotFound() {
  return (
    <RootHtml lang="es">
      <NotFoundContent />
    </RootHtml>
  );
}
