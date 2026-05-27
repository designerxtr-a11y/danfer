import { Check, X, Backpack } from "lucide-react";

interface Props {
  includes: string[];
  excludes: string[];
  whatToBring: string[];
}

export function TourIncludes({ includes, excludes, whatToBring }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {includes.length > 0 && (
        <div>
          <h3 className="font-display text-2xl text-night mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            Incluye
          </h3>
          <ul className="space-y-2.5">
            {includes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-night/75">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {excludes.length > 0 && (
        <div>
          <h3 className="font-display text-2xl text-night mb-4 flex items-center gap-2">
            <X className="w-5 h-5 text-rose-600" />
            No incluye
          </h3>
          <ul className="space-y-2.5">
            {excludes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-night/75">
                <X className="w-4 h-4 text-rose-600 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {whatToBring.length > 0 && (
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl text-night mb-4 flex items-center gap-2">
            <Backpack className="w-5 h-5 text-gold" />
            Qué llevar
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {whatToBring.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-night/75">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
