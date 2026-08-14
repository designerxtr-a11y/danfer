# Paleta de boletomachupicchutours.com alineada al logo — Spec

**Fecha:** 2026-08-14
**Repo del código:** `C:\xampp\htdocs\boletomachupicchutours` (repo separado; este spec vive en cuscotours-v2 siguiendo el patrón ya usado para Fases 1/3/4 de este sitio hermano — ver memoria `boletomachupicchutours-rediseno-visual`).

## Contexto

El sitio terminó Fase 4 (rediseño visual dorado/night → turquesa/blanco tipo agencia). Desde entonces se subió el logo definitivo de la marca (`branding/logo-boletomachupicchutours.png` en Supabase Storage), y no coincide con la paleta actual del sitio: el logo usa **azul marino muy oscuro** (`#01173E`) y **naranja/rojo** (`#FD4707`), mientras el sitio usa un azul medio (`#0077B6`/`#023E8A`, nombrados "turquoise") y dorado (`#C8901E`, ya reducido a un solo uso: el wordmark de respaldo).

El usuario pidió que la web use los colores del logo. Se verificó el PNG real descargándolo y muestreando píxeles: fondo transparente (82.6% alpha=0, confirmado — no hay problema de "rectángulo blanco" al invertir el logo sobre el hero), navy dominante `#00163F` y naranja `#FF440B` en el arte, muy cercanos a los hex que dio el usuario. Se usan los hex dados por el usuario como fuente de verdad.

## Alcance

Recolor completo del sitio cambiando **valores de tokens** en `src/app/globals.css`, sin renombrar los tokens existentes (`night`, `turquoise`, `turquoise-deep` se quedan con esos nombres pero valores nuevos) y sin tocar estructura, copy, ni componentes — mismo patrón que Fase 4 (reskin, no rediseño). Fuera de alcance: cambiar la disposición de secciones, rehacer el logo, mover el sitio a fondo oscuro dominante.

Se descartaron dos alternativas:
- **Renombrar tokens** (`turquoise`→`brand`, etc.): mismo resultado visual, ~490 líneas tocadas en ~50 archivos solo por nombre. Se deja como limpieza opcional futura, no parte de este spec.
- **Rediseño oscuro** (fondos navy dominantes en todo el sitio): revierte el trabajo de Fase 4 y exige rehacer contraste en tarjetas/formularios/admin. El usuario confirmó que la base sigue blanca.

## Paleta nueva

Verificado con cálculo de contraste WCAG (luminancia relativa real, no estimación):

| Token | Valor actual | Valor nuevo | Rol | Contraste verificado |
|---|---|---|---|---|
| `--color-night` | `#0B1929` | `#01173E` | texto oscuro, secciones/fondos oscuros | 17.60:1 sobre blanco |
| `--color-night-deep` | `#060F1C` | `#000C24` | capa más honda (footer inferior, overlays) | proporcional, más oscuro que `night` |
| `--color-turquoise` | `#0077B6` | `#123E8C` | azul interactivo: links, iconos, precios, rellenos | 10.03:1 sobre blanco |
| `--color-turquoise-deep` | `#023E8A` | `#071F52` | hover de `turquoise`, texto sobre tintes claros | 15.83:1 sobre blanco |
| `--color-flame` *(nuevo)* | — | `#FD4707` | acento exacto del logo: iconos, badges, detalles, subrayados | 3.45:1 sobre blanco (no válido para texto normal — ver reglas abajo) |
| `--color-flame-deep` *(nuevo)* | — | `#D93A05` | relleno de botón de conversión con texto blanco | 4.61:1 con blanco (pasa AA texto normal) |
| `--color-gold`, `--color-gold-bright` | `#C8901E`, `#E8B043` | **eliminados** | ya no se necesitan tras rehacer el wordmark de respaldo (ver abajo) | — |
| `--color-foreground` | `#0B1929` | `#01173E` | derivado de `night` | — |
| `--color-border` | `rgba(11,25,41,0.1)` | `rgba(1,23,62,0.1)` | derivado de `night`, mismo alpha | — |

La luminancia de `night` nuevo (0.0097) es casi idéntica a la de `night` actual (0.0093) — **ninguna superficie oscura pierde contraste** al migrar; no se repite la regresión de contraste que ya se dio dos veces en Fase 4a/4b-1 (texto blanco sobre superficie aclarada). `turquoise-deep` nuevo queda además ~3× más oscuro que el actual, mejorando su contraste.

## Reglas de uso del naranja (`flame`)

`#FD4707` sobre blanco da 3.45:1, insuficiente para texto normal en AA (mínimo 4.5:1). Reglas:

1. **Botón de conversión "reservar"**: todo botón/link cuya acción es iniciar o confirmar una reserva pasa de `bg-turquoise`/`bg-turquoise-deep` a `bg-flame-deep` con hover `bg-flame`, texto blanco. Cubre exactamente estos 4 usos (verificados por archivo/línea):
   - `booking-widget.tsx` — botón "Reservar ahora" (abre el formulario, step `idle`).
   - `booking-widget.tsx` — botón "Confirmar · US$X" (envía el formulario de reserva).
   - `checkout-form.tsx` — botón "Enviar solicitud" (paso final `confirm` del checkout).
   - `navbar.tsx` — los dos links "Reservar"/"Book now" que apuntan a `/tours` (versión desktop `hidden lg:inline-flex` y versión del menú mobile), presentes en todas las páginas.
   - **No** incluye: el botón "Continuar" del checkout (pasos intermedios, ya es `bg-night` con hover `turquoise` — se repinta solo vía token, sin tocar), el link "Volver al sitio" de la página de confirmación (navegación post-compra, no dispara una reserva), ni el CTA "Ver los tours" del blog (`post-cta.tsx`, navegación al catálogo) — estos tres siguen navy vía repintado automático de tokens, no se editan a mano.
   - El botón del hero (`hero.tsx`, fondo blanco + `text-turquoise-deep`) tampoco cambia a naranja: sigue el patrón ya fijado en Fase 4 (botón con fondo propio → `bg-white text-turquoise-deep`), se repinta solo por el cambio de token de `turquoise-deep`.
2. **Iconos, badges pequeños, subrayados, bordes decorativos**: `flame` libre (no es texto corrido, el umbral de contraste no aplica igual — objetos gráficos piden 3:1, que sí cumple).
3. **Texto en naranja**: solo permitido (a) sobre fondo `night`/`night-deep` (5.10:1, pasa AA), o (b) en texto grande ≥24px y bold sobre blanco (umbral AA large text es 3:1, que sí cumple). Precios chicos de tarjeta y texto de párrafo **no** van en naranja — siguen `turquoise`/`night`.
4. **Links y hovers de navegación**: siguen navy (`turquoise`/`turquoise-deep`), nunca naranja — mantiene el naranja como acento aislado en vez de saturar toda interacción.
5. `::selection` y hover del scrollbar (que hoy usan `--color-gold`) pasan a `--color-flame`.

## Limpieza del dorado

El dorado no tiene ya ningún rol — se elimina de los tokens. Usos actuales a migrar:

- **Wordmark de respaldo** `.text-gradient-gold` (5 usos: `navbar.tsx` ×2, `footer.tsx`, `admin/login/page.tsx`, `admin/_components/sidebar.tsx`) — se muestra solo cuando no hay `logoUrl` cargado. Estructura actual: dos `<span>`, `"BOLETO MP"` con el acento (`text-gradient-gold`) y `"TOURS"` en color de estado (`text-night`/`text-white` según si el navbar está sólido o flotando sobre el hero). Se conserva esa misma estructura de dos spans — solo cambia el acento de degradado dorado a **naranja sólido** (`text-flame`, sin gradiente: el logo real usa color sólido, no degradado).
  - Nota de contraste: en estado "solid" (navbar blanco), `"BOLETO MP"` queda en `flame` sobre blanco — igual que hoy ese mismo span queda en dorado sobre blanco (~2.8:1, ya bajo AA). Es una excepción de logotipo ya aceptada y documentada (memoria `boletomachupicchutours-rediseno-visual`: *"gold queda como excepción única y aislada: el wordmark del logo"*) — se hereda la misma excepción para `flame` en este único uso, no se generaliza al resto del sitio (regla 3 de "Reglas de uso del naranja" sigue aplicando a todo lo demás).
- **`accent-gold`** en 4 checkboxes/radios de admin (`post-form.tsx`, `import-client.tsx`, `_tour-form.tsx`, `tours/page.client.tsx`) → `accent-flame`.

## Superficies con hex hardcodeado (fuera de Tailwind)

Estas no se repintan con el cambio de tokens CSS porque no usan clases Tailwind — hay que editarlas a mano con los valores nuevos. Se buscó tanto en formato hex (`#RRGGBB`) como en `rgba(r,g,b,a)` decimal (mismo color, otra notación — un componente puede usar `rgba(11,25,41,0.4)` para lo mismo que en otro lado es `#0B1929`), porque un grep solo de hex no las encuentra:

- `src/app/apple-icon.tsx`, `src/app/icon.tsx`: fallback que solo se renderiza si no hay favicon subido en `/admin/settings` (hoy sí hay logo subido, así que este fallback probablemente no se sirve en producción — se actualiza igual por consistencia). Gradiente de fondo `#0B1929→#060F1C` → `#01173E→#000C24`. La letra `"D"` (nota: es un resto de la marca hermana Danfer, no de Boleto Machupicchu Tours — fuera de alcance de este spec, no se toca el contenido) cambia de color `#E8B043` a **blanco** — a 96px/180px con recorte adicional a 16-32px en la pestaña del navegador, blanco sobre navy da más legibilidad que naranja (17.6:1 vs 5.1:1) y evita el problema de contraste de texto pequeño que si tiene el naranja.
- `src/app/manifest.ts`: `theme_color: "#0B1929"` → `"#01173E"`.
- `src/app/opengraph-image.tsx`, `src/app/[locale]/(public)/blog/[slug]/opengraph-image.tsx`, `src/app/[locale]/(public)/tours/[slug]/opengraph-image.tsx`: fondo/gradiente `#0B1929`/`#060F1C` → `#01173E`/`#000C24` (incluye las variantes `rgba(11,25,41, alpha)` usadas como overlay sobre la foto de portada en los dos últimos archivos → `rgba(1,23,62, mismo alpha)`). Todo el texto que hoy está en `#E8B043`/`#C8901E` (el span `"BOLETO MP"` del wordmark, el precio grande, el rating con estrella, la fecha del post) pasa a `#FD4707` — en los tres archivos ese texto siempre se renderiza sobre el fondo navy de la propia imagen OG, nunca sobre blanco, así que cumple la regla 3 (5.10:1, pasa AA) sin necesitar la excepción de logotipo.
- `src/app/opengraph-image.tsx` tiene además un glow decorativo de fondo con dos `radial-gradient`: `rgba(200,144,30,0.25)` (dorado) → `rgba(253,71,7,0.25)` (`flame`), y `rgba(0,119,182,0.2)` (turquoise viejo) → `rgba(18,62,140,0.2)` (`turquoise` nuevo).
- `src/components/sections/destinations.client.tsx` y `src/components/sections/featured-tours.client.tsx`: ambos tienen una sombra Tailwind con valor arbitrario `shadow-[0_30px_60px_-25px_rgba(11,25,41,alpha)]` (night viejo) `hover:shadow-[0_40px_80px_-25px_rgba(2,62,138,0.45)]` (turquoise-deep viejo) — mismo criterio, `rgba(11,25,41,·)` → `rgba(1,23,62,·)` y `rgba(2,62,138,0.45)` → `rgba(7,31,82,0.45)`.

## Verificación

- Grep de `-gold\b` (clases Tailwind: `text-gradient-gold`, `accent-gold`, `--color-gold`) en `src/` tras el cambio debe dar 0 resultados. No aplica a apariciones de "gold" como palabra de contenido/copy (ej. `lib/destinations-en/rainbow-mountain.ts`, que describe los colores minerales reales del Vinicunca en inglés — texto legítimo, no token de diseño).
- Grep de los hex viejos (`#0B1929`, `#060F1C`, `#0077B6`, `#023E8A`, `#C8901E`, `#E8B043`) y de sus equivalentes decimales en `rgba()` (`11,25,41`, `6,15,28`, `0,119,182`, `2,62,138`, `200,144,30`, `232,176,67`) en `src/` debe dar 0 resultados — salvo `globals.css`, donde esos mismos decimales se reemplazan por los nuevos como parte del cambio de tokens (no se buscan ahí, se editan directamente).
- Revisión visual de: navbar (transparente sobre hero + sólido al hacer scroll), footer, booking widget (CTA naranja), tarjetas de tours, admin (sidebar + login), favicon/OG (comparar imagen renderizada).
- `npm run build` sin errores (mismo gate que Fases previas).

## Siguiente paso

Este spec pasa a `writing-plans` para el plan de implementación. Dado el volumen (~1,100 clases entre `night`/`turquoise`/`turquoise-deep`, pero **todas resueltas por el cambio de tokens**, no edición archivo por archivo), el plan real de edición manual es acotado: tokens CSS, wordmark de respaldo (5 archivos), `accent-gold` (4 archivos), y las 6 superficies con hex hardcodeado. No hace falta partir en sub-fases — es un solo plan.
