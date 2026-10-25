import { revalidatePath } from "next/cache";

// Las páginas públicas son estáticas/ISR y viven bajo /[locale]/... (la URL
// /tours se reescribe a /es/tours), así que revalidatePath("/tours") no las
// toca. Esto invalida todo el sitio público; se regenera en la próxima visita.
export function revalidatePublicSite() {
  revalidatePath("/[locale]", "layout");
}
