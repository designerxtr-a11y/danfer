import { Clock, Compass, Mountain, Users } from "lucide-react";
import type { Locale } from "@/types/database";

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
  const en = locale === "en";
  const facts = [
    { icon: Clock, label: en ? "Duration" : "Duración", value: duration },
    ...(type ? [{ icon: Compass, label: en ? "Tour type" : "Tipo de tour", value: type }] : []),
    { icon: Mountain, label: en ? "Difficulty" : "Dificultad", value: difficulty },
    {
      icon: Users,
      label: en ? "Group size" : "Tamaño del grupo",
      value: en ? `Up to ${groupSize} people` : `Hasta ${groupSize} personas`,
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
