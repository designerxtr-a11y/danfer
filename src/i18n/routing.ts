import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // El locale por defecto NO lleva prefijo. EN sí: /en/tours
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
