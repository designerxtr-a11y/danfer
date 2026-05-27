import Link from "next/link";

interface Props {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalShell({ title, updatedAt, children }: Props) {
  return (
    <div className="pt-32 pb-24 bg-stone min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-xs text-night/40 mb-2 uppercase tracking-widest">
          <Link href="/" className="hover:text-gold">
            Inicio
          </Link>{" "}
          / Legal
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-night">{title}</h1>
        <p className="mt-2 text-sm text-night/50">
          Última actualización: {updatedAt}
        </p>

        <article className="mt-10 prose prose-neutral max-w-none bg-white rounded-3xl shadow-soft border border-night/8 p-8 md:p-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-night [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-night [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-night/75 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-night/75 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:list-disc [&_li]:mb-1 [&_a]:text-gold [&_a]:underline [&_strong]:text-night">
          {children}
        </article>
      </div>
    </div>
  );
}
