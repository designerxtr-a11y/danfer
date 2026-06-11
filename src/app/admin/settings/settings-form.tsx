"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateSettingsForm } from "./actions";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import type { SiteSettings } from "@/lib/queries/settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [logoUrl, setLogoUrl] = useState(initial.branding?.logo_url ?? "");
  const [faviconUrl, setFaviconUrl] = useState(
    initial.branding?.favicon_url ?? ""
  );
  const [heroImgs, setHeroImgs] = useState({
    "machu-picchu": initial.hero_images?.["machu-picchu"] ?? "",
    "valle-sagrado": initial.hero_images?.["valle-sagrado"] ?? "",
    "rainbow-mountain": initial.hero_images?.["rainbow-mountain"] ?? "",
  });
  const [statsImgs, setStatsImgs] = useState({
    polaroid_1: initial.stats_images?.polaroid_1 ?? "",
    polaroid_2: initial.stats_images?.polaroid_2 ?? "",
    polaroid_3: initial.stats_images?.polaroid_3 ?? "",
  });
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "ok" }
    | { type: "error"; message: string }
  >({ type: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus({ type: "idle" });
    startTransition(async () => {
      const result = await updateSettingsForm(formData);
      if ("error" in result) {
        setStatus({ type: "error", message: result.error });
      } else {
        setStatus({ type: "ok" });
        setTimeout(() => setStatus({ type: "idle" }), 3500);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Section title="Identidad visual (logo y favicon)">
        <div>
          <ImageUploader
            bucket="tour-images"
            folder="branding"
            value={logoUrl || undefined}
            onChange={(url) => setLogoUrl(url ?? "")}
            label="Logo del sitio"
          />
          <p className="mt-2 text-[11px] text-night/45 leading-relaxed">
            Se muestra en la barra de navegación y se declara a Google como
            logo de la empresa. Ideal: PNG o SVG con <strong>fondo
            transparente</strong>, que se lea bien sobre fondo oscuro.
          </p>
          <input type="hidden" name="logo_url" value={logoUrl} />
        </div>
        <div>
          <ImageUploader
            bucket="tour-images"
            folder="branding"
            value={faviconUrl || undefined}
            onChange={(url) => setFaviconUrl(url ?? "")}
            label="Favicon (icono de pestaña)"
          />
          <p className="mt-2 text-[11px] text-night/45 leading-relaxed">
            El icono que aparece en la pestaña del navegador y junto al sitio
            en Google. Ideal: PNG <strong>cuadrado de 512×512</strong>. Si lo
            dejas vacío se usa la &quot;D&quot; dorada generada.
          </p>
          <input type="hidden" name="favicon_url" value={faviconUrl} />
        </div>
      </Section>

      <Section title="Fotos del hero (tarjetas flotantes de la portada)">
        {(
          [
            { key: "machu-picchu", label: "Tarjeta Machu Picchu", field: "hero_img_machu_picchu" },
            { key: "valle-sagrado", label: "Tarjeta Pisac & Ollanta (Valle Sagrado)", field: "hero_img_valle_sagrado" },
            { key: "rainbow-mountain", label: "Tarjeta Rainbow Mountain", field: "hero_img_rainbow_mountain" },
          ] as const
        ).map((card) => (
          <div key={card.key}>
            <ImageUploader
              bucket="tour-images"
              folder="hero"
              value={heroImgs[card.key] || undefined}
              onChange={(url) =>
                setHeroImgs((prev) => ({ ...prev, [card.key]: url ?? "" }))
              }
              label={card.label}
            />
            <p className="mt-2 text-[11px] text-night/45 leading-relaxed">
              Foto vertical (ideal ~800×1100). Si la dejas vacía se usa la
              foto de stock actual.
            </p>
            <input type="hidden" name={card.field} value={heroImgs[card.key]} />
          </div>
        ))}
      </Section>

      <Section title="Fotos polaroid (sección de estadísticas de la portada)">
        {(
          [
            { key: "polaroid_1", label: "Polaroid 1 (arriba-izquierda)", field: "stats_img_polaroid_1" },
            { key: "polaroid_2", label: "Polaroid 2 (centro-derecha)", field: "stats_img_polaroid_2" },
            { key: "polaroid_3", label: "Polaroid 3 (abajo-izquierda)", field: "stats_img_polaroid_3" },
          ] as const
        ).map((p) => (
          <div key={p.key}>
            <ImageUploader
              bucket="tour-images"
              folder="stats"
              value={statsImgs[p.key] || undefined}
              onChange={(url) =>
                setStatsImgs((prev) => ({ ...prev, [p.key]: url ?? "" }))
              }
              label={p.label}
            />
            <p className="mt-2 text-[11px] text-night/45 leading-relaxed">
              Foto cuadrada (ideal ~600×600). Si la dejas vacía se usa la foto
              de stock actual.
            </p>
            <input type="hidden" name={p.field} value={statsImgs[p.key]} />
          </div>
        ))}
      </Section>

      <Section title="Marca y contacto">
        <Field label="Nombre del sitio" name="site_name" defaultValue={initial.site_name} />
        <Field
          label="Tagline (español)"
          name="tagline_es"
          defaultValue={initial.site_tagline?.es ?? ""}
        />
        <Field
          label="Tagline (inglés)"
          name="tagline_en"
          defaultValue={initial.site_tagline?.en ?? ""}
        />
        <Field
          label="Email de contacto"
          name="contact_email"
          type="email"
          defaultValue={initial.contact_email}
        />
        <Field
          label="Teléfono (visible al público)"
          name="contact_phone"
          defaultValue={initial.contact_phone}
          hint="Formato libre, ej: +51 984 123 456"
        />
        <Field
          label="WhatsApp (botón flotante)"
          name="whatsapp"
          defaultValue={initial.whatsapp}
          hint="Con código de país. Ej: +51 984 123 456 — solo números se usan para el link wa.me"
        />
      </Section>

      <Section title="Dirección">
        <Field
          label="Dirección (español)"
          name="address_es"
          defaultValue={initial.address?.es ?? ""}
        />
        <Field
          label="Dirección (inglés)"
          name="address_en"
          defaultValue={initial.address?.en ?? ""}
        />
      </Section>

      <Section title="Redes sociales">
        <Field
          label="Instagram (usuario)"
          name="social_instagram"
          defaultValue={initial.social?.instagram ?? ""}
          hint="Sin la @, ej: danfertourscusco"
        />
        <Field
          label="Facebook (usuario o slug)"
          name="social_facebook"
          defaultValue={initial.social?.facebook ?? ""}
        />
        <Field
          label="TikTok (usuario)"
          name="social_tiktok"
          defaultValue={initial.social?.tiktok ?? ""}
        />
      </Section>

      <div className="flex items-center gap-4 sticky bottom-4 bg-white/80 backdrop-blur p-3 rounded-2xl border border-night/8 shadow-card">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-night text-white px-6 py-3 rounded-full font-semibold hover:bg-gold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando…
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>

        {status.type === "ok" && (
          <span className="inline-flex items-center gap-2 text-emerald-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Guardado · el sitio se actualizará en segundos
          </span>
        )}
        {status.type === "error" && (
          <span className="inline-flex items-center gap-2 text-rose-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {status.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="bg-white border border-night/8 rounded-2xl p-6 space-y-4">
      <legend className="font-display text-lg text-night px-2 -ml-2">
        {title}
      </legend>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-night/70 uppercase tracking-wider">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 block w-full bg-stone border border-night/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:bg-white transition"
      />
      {hint && <span className="mt-1 block text-[11px] text-night/45">{hint}</span>}
    </label>
  );
}
