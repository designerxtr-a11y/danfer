import { MessageCircle } from "lucide-react";

/** Mensaje prellenado: el asesor ve de qué artículo viene cada chat. */
export function postWhatsAppHref(
  whatsapp: string,
  postTitle: string,
  locale: "es" | "en"
) {
  const msg =
    locale === "en"
      ? `Hi Danfer Tours, I read your article "${postTitle}" and I'd like information for my trip to Cusco.`
      : `Hola Danfer Tours, leí su artículo "${postTitle}" y quiero información para mi viaje a Cusco.`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}

/**
 * Recuadro de WhatsApp para insertar a mitad de un post desde el markdown:
 *
 *   <WhatsAppCta title="¿Viajas a Cusco en los próximos meses?">
 *   Texto en markdown...
 *   </WhatsAppCta>
 *
 * El número, el título del post y el idioma los inyecta la página.
 */
export function WhatsAppCta({
  title,
  children,
  href,
  locale,
}: {
  title?: string;
  children?: React.ReactNode;
  href: string;
  locale: "es" | "en";
}) {
  const en = locale === "en";
  return (
    <aside className="not-prose my-10 rounded-2xl border border-gold/30 bg-gold/5 p-6 sm:p-7">
      {title && (
        <p className="font-display text-xl sm:text-2xl text-night leading-snug">
          {title}
        </p>
      )}
      {children && (
        <div className="mt-2 text-night/75 text-base leading-relaxed [&_p]:my-2 [&_strong]:text-night">
          {children}
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold text-sm sm:text-base hover:brightness-95 transition"
      >
        <MessageCircle className="w-4 h-4" />
        {en ? "Ask us on WhatsApp" : "Consúltanos por WhatsApp"}
      </a>
    </aside>
  );
}
