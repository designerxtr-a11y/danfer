"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useLocale } from "next-intl";
import { TourCard } from "@/components/sections/featured-tours.client";
import { tr } from "@/lib/i18n/messages";
import type {
  TourWithCategory,
  Category,
  Difficulty,
  Locale,
} from "@/types/database";
import { t } from "@/types/database";
import { L } from "@/lib/i18n/pick";

interface Props {
  tours: TourWithCategory[];
  categories: Category[];
}

export function ToursPageClient({ tours, categories }: Props) {
  const locale = useLocale() as Locale;
  const m = tr(locale);

  const difficulties: { value: Difficulty; label: string }[] = [
    { value: "easy", label: L(locale, { es: "Fácil", en: "Easy", ja: "やさしい" }) },
    { value: "moderate", label: L(locale, { es: "Moderado", en: "Moderate", ja: "普通" }) },
    {
      value: "challenging",
      label: L(locale, { es: "Exigente", en: "Challenging", ja: "きつい" }),
    },
    { value: "expert", label: L(locale, { es: "Experto", en: "Expert", ja: "上級者向け" }) },
  ];

  const sortOptions = [
    { value: "popular", label: L(locale, { es: "Más populares", en: "Most popular", ja: "人気順" }) },
    { value: "price-asc", label: L(locale, { es: "Precio ↑", en: "Price ↑", ja: "料金が安い順" }) },
    { value: "price-desc", label: L(locale, { es: "Precio ↓", en: "Price ↓", ja: "料金が高い順" }) },
    { value: "rating", label: L(locale, { es: "Mejor calificados", en: "Top rated", ja: "評価が高い順" }) },
    { value: "duration", label: L(locale, { es: "Duración", en: "Duration", ja: "所要時間" }) },
  ];

  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [priceMax, setPriceMax] = useState(1000);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r = [...tours];
    if (category) r = r.filter((tour) => tour.category?.slug === category);
    if (difficulty) r = r.filter((tour) => tour.difficulty === difficulty);
    r = r.filter((tour) => tour.price_usd <= priceMax);

    switch (sort) {
      case "price-asc":
        r.sort((a, b) => a.price_usd - b.price_usd);
        break;
      case "price-desc":
        r.sort((a, b) => b.price_usd - a.price_usd);
        break;
      case "rating":
        r.sort((a, b) => b.rating - a.rating);
        break;
      case "duration":
        r.sort((a, b) => a.duration_days - b.duration_days);
        break;
      default:
        r.sort((a, b) => b.bookings_count - a.bookings_count);
    }
    return r;
  }, [tours, category, difficulty, priceMax, sort]);

  const maxPriceInData = Math.max(...tours.map((tour) => tour.price_usd));
  const activeCount =
    (category ? 1 : 0) + (difficulty ? 1 : 0) + (priceMax < maxPriceInData ? 1 : 0);

  const reset = () => {
    setCategory(null);
    setDifficulty(null);
    setPriceMax(maxPriceInData);
    setSort("popular");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-32">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sticky top-20 z-30 bg-background/85 backdrop-blur-md py-3 sm:py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-y border-night/8">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-stone hover:bg-cream border border-night/8 text-night text-sm transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {L(locale, { es: "Filtros", en: "Filters", ja: "絞り込み" })}
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gold text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-night/60 text-xs sm:text-sm hidden xs:inline">
            {filtered.length} {filtered.length === 1 ? "tour" : "tours"}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-stone border border-night/8 text-night text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none focus:border-gold max-w-[140px] sm:max-w-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-white">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-stone border border-night/8 rounded-2xl p-4 sm:p-6 grid md:grid-cols-3 gap-6 md:gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-night/50 mb-3">
                  {L(locale, { es: "Categoría", en: "Category", ja: "カテゴリー" })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill active={!category} onClick={() => setCategory(null)}>
                    {L(locale, { es: "Todas", en: "All", ja: "すべて" })}
                  </Pill>
                  {categories.map((c) => (
                    <Pill
                      key={c.id}
                      active={category === c.slug}
                      onClick={() => setCategory(c.slug)}
                    >
                      {t(c.name, locale)}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-night/50 mb-3">
                  {L(locale, { es: "Dificultad", en: "Difficulty", ja: "難易度" })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    active={!difficulty}
                    onClick={() => setDifficulty(null)}
                  >
                    {L(locale, { es: "Todas", en: "All", ja: "すべて" })}
                  </Pill>
                  {difficulties.map((d) => (
                    <Pill
                      key={d.value}
                      active={difficulty === d.value}
                      onClick={() => setDifficulty(d.value)}
                    >
                      {d.label}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-night/50">
                    {L(locale, { es: "Precio máximo", en: "Max price", ja: "上限料金" })}
                  </span>
                  <span className="text-gold font-semibold">US${priceMax}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={maxPriceInData}
                  step={25}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-night/60 hover:text-gold text-sm transition"
                >
                  <X className="w-4 h-4" />
                  {L(locale, { es: "Limpiar filtros", en: "Clear filters", ja: "条件をクリア" })}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-32 text-night/40">
          <p>
            {L(locale, { es: "No hay tours con esos filtros.", en: "No tours match those filters.", ja: "条件に合うツアーがありません。" })}
          </p>
          <button onClick={reset} className="mt-4 text-gold hover:underline">
            {L(locale, { es: "Limpiar filtros", en: "Clear filters", ja: "条件をクリア" })}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((tour, i) => (
            <TourCard
              key={tour.id}
              tour={tour}
              index={i}
              isBestseller={false}
              locale={locale}
              m={m}
              wrapperClassName="w-full group"
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        active
          ? "bg-gold text-white border-gold font-semibold"
          : "bg-white border-night/10 text-night/80 hover:border-night/30"
      }`}
    >
      {children}
    </button>
  );
}
