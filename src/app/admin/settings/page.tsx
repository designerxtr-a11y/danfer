import { getSettings } from "@/lib/queries/settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl text-night mb-2">Ajustes</h1>
      <p className="text-night/60 mb-8">
        Configura los datos públicos del sitio. Los cambios se reflejan en el
        footer, página de contacto y botón flotante de WhatsApp en pocos
        segundos.
      </p>

      <SettingsForm initial={settings} />
    </div>
  );
}
