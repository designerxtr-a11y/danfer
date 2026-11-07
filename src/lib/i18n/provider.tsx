"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { messages, type Locale, type Messages } from "./messages";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = "es",
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
    // El middleware de next-intl redirige según NEXT_LOCALE: si sigue en "en",
    // ir a /tours devuelve a /en/tours y el cambio a español no funciona.
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
    // ES va sin prefijo; EN y JA con /en y /ja
    const path = window.location.pathname.replace(/^\/(en|ja)(?=\/|$)/, "");
    window.location.href = l === "es" ? path || "/" : `/${l}${path || "/"}`;
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, m: messages[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
