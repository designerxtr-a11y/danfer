"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { FeaturedToursCarousel } from "@/components/sections/featured-tours.client";
import type { TourWithCategory, Category, Difficulty } from "@/types/database";
import { t } from "@/types/database";

interface Props {
  tours: TourWithCategory[];
  categories: Category[];
}

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Fácil" },
  { value: "moderate", label: "Moderado" },
  { value: "challenging", label: "Exigente" },
  { value: "expert", label: "Experto" },
];

const sortOptions = [
  { value: "popular", label: "Más populares" },
  { value: "price-asc", label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
  { value: "rating", label: "Mejor calificados" },
  { value: "duration", label: "Duración" },
];

export function ToursPageClient({ tours, categories }: Props) {
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
    <section className="max-w-7xl mx-auto px-6 pb-32">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 sticky top-20 z-30 bg-background/85 backdrop-blur-md py-4 -mx-6 px-6 border-y border-night/8">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone hover:bg-cream border border-night/8 text-night text-sm transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gold text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-4">
          <span className="text-night/60 text-sm">
            {filtered.length} {filtered.length === 1 ? "tour" : "tours"}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-stone border border-night/8 text-night text-sm rounded-full px-4 py-2 focus:outline-none focus:border-gold"
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
            <div className="bg-stone border border-night/8 rounded-2xl p-6 grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-night/50 mb-3">
                  Categoría
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill active={!category} onClick={() => setCategory(null)}>
                    Todas
                  </Pill>
                  {categories.map((c) => (
                    <Pill
                      key={c.id}
                      active={category === c.slug}
                      onClick={() => setCategory(c.slug)}
                    >
                      {t(c.name)}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-night/50 mb-3">
                  Dificultad
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    active={!difficulty}
                    onClick={() => setDifficulty(null)}
                  >
                    Todas
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
                    Precio máximo
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
                  Limpiar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-32 text-night/40">
          <p>No hay tours con esos filtros.</p>
          <button onClick={reset} className="mt-4 text-gold hover:underline">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <FeaturedToursCarousel tours={filtered} />
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
