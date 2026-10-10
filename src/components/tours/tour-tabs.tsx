"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface TourTab {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

/**
 * Barra de pestañas estilo "panel": oscura, sticky, ícono arriba y texto
 * abajo. Todos los paneles se renderizan en el HTML (Google indexa todo);
 * los inactivos solo se ocultan con `hidden`. `#<id>` en la URL abre esa
 * pestaña.
 */
export function TourTabs({ tabs }: { tabs: TourTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!tabs.some((t) => t.id === id)) return;
    const timer = setTimeout(() => {
      setActive(id);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [tabs]);

  function select(id: string) {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (tabs.length === 0) return null;

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <div className="sticky top-20 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-background/0">
        <div
          role="tablist"
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-1 bg-night rounded-2xl p-2 shadow-card"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => select(tab.id)}
                className={`flex-1 min-w-[96px] flex flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap transition ${
                  isActive ? "bg-gold text-white shadow-glow" : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="[&>svg]:w-5 [&>svg]:h-5">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className="mt-4 bg-white border border-night/8 rounded-3xl p-5 sm:p-8 md:p-10 shadow-soft"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
