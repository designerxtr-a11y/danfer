interface Props {
  data: (object | null | undefined) | (object | null | undefined)[];
}

export function JsonLd({ data }: Props) {
  // Filtra entradas null/undefined (p.ej. heroVideoSchema() sin video real)
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(items),
      }}
    />
  );
}
