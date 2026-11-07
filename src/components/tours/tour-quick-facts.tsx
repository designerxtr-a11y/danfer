import { Clock, Compass, Mountain, Users } from "lucide-react";
import type { Locale } from "@/types/database";
import { L } from "@/lib/i18n/pick";

/** Tarjeta de datos rápidos: duración, tipo de tour, dificultad y grupo. */
export function TourQuickFacts({
  duration,
  type,
  difficulty,
  groupSize,
  locale = "es",
}: {
  duration: string;
  type: string | null;
  difficulty: string;
  groupSize: number;
  locale?: Locale;
}) {
  const facts = [
    { icon: Clock, label: L(locale, { es: "Duración", en: "Duration", ja: "所要時間" }), value: duration },
    ...(type ? [{ icon: Compass, label: L(locale, { es: "Tipo de tour", en: "Tour type", ja: "ツアータイプ" }), value: type }] : []),
    { icon: Mountain, label: L(locale, { es: "Dificultad", en: "Difficulty", ja: "難易度" }), value: difficulty },
    {
      icon: Users,
      label: L(locale, { es: "Tamaño del grupo", en: "Group size", ja: "グループ人数" }),
      value: L(locale, { es: `Hasta ${groupSize} personas`, en: `Up to ${groupSize} people`, ja: `最大${groupSize}名` }),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 bg-white border border-night/8 rounded-3xl p-5 md:p-6 shadow-soft">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-11 h-11 shrink-0 rounded-full bg-gold/10 grid place-items-center">
            <Icon className="w-5 h-5 text-gold" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gold">{label}</p>
            <p className="text-sm font-medium text-night leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
