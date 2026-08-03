# boletomachupicchutours.com — Fase 4b-1: Hero + Stats (rediseño visual)

## Contexto

Primera sub-fase de "Fase 4b: Home", dentro del rediseño visual mayor (ver spec padre `2026-08-02-boletomachupicchutours-fase4-rediseno-visual-design.md`). Fase 4a (navbar + footer) ya está en producción y estableció el patrón base: turquesa como color primario, `--color-gold` reducido a una única excepción (el wordmark del logo), sin `font-display`/`font-hand`.

Home completo (9 archivos, ~123 usos de color/tipografía) es demasiado grande para un solo plan — se parte en 3 sub-fases: **4b-1 Hero + Stats** (esta), 4b-2 Tours destacados + Destinos, 4b-3 Testimonios + FAQ.

Hero es el primer archivo del rediseño con fondo tipo foto/video (no un panel de color plano como navbar/footer), lo que obliga a decisiones nuevas que no estaban cubiertas por el spec padre.

## Alcance

- `src/components/sections/hero.tsx` (incluye el sub-componente `FloatingCard` y `BottomStat`, en el mismo archivo)
- `src/components/sections/stats.tsx` (incluye `Stat` y `PolaroidGallery`, en el mismo archivo)

**Fuera de alcance:** el resto de Home (tours destacados, destinos, testimonios, FAQ — sub-fases 4b-2/4b-3), `/admin`, contenido/copy (esto es reskin visual, no reescritura de textos).

## Reglas nuevas (además de las del spec padre)

Estas reglas nacen de que el hero es la primera sección con fondo de foto, y se reutilizarán en las sub-fases siguientes cuando aplique:

**1. Fondo/overlay del hero — `night` → `turquoise-deep`, con opacidad más alta.** `--color-turquoise-deep` (#023E8A) es ~10× más claro que `--color-night` (#0B1929) en luminancia relativa — el mismo problema que causó la regresión de contraste en el footer de Fase 4a. Para mantener la misma legibilidad del texto blanco sobre la foto, cada capa de overlay sube ~10 puntos de opacidad al migrar de `night` a `turquoise-deep`:

| Elemento | Antes | Después |
|---|---|---|
| Overlay principal (vertical) | `from-night/55 via-night/15 to-night/80` | `from-turquoise-deep/65 via-turquoise-deep/25 to-turquoise-deep/90` |
| Overlay lateral | `from-night/60 via-transparent` | `from-turquoise-deep/70 via-transparent` |
| Barra de stats inferior | `bg-night/85` | `bg-turquoise-deep/90` |
| Overlay interno de cada `FloatingCard` | `from-night/40 via-transparent to-night/95` | `from-turquoise-deep/50 via-transparent to-turquoise-deep/95` |

**2. Botones con fondo propio → blanco sólido + texto `turquoise-deep`, no turquesa-sobre-turquesa.** El CTA principal, las flechas del carrusel y el mini-botón que aparece al hover en cada tarjeta tienen su propio fondo (no dependen de lo que hay detrás). Fase 4a ya encontró el bug de que un botón turquesa con hover turquesa-deep se "funde" con un fondo turquesa-deep (el CTA del menú móvil). Para evitar repetir ese bug aquí — donde el fondo detrás de estos botones SÍ va a ser turquesa-deep —, estos botones usan `bg-white text-turquoise-deep hover:bg-white/90` (mismo patrón ya usado para arreglar el formulario de newsletter en el review final de 4a), no `bg-turquoise`.

**3. Texto/íconos sueltos directamente sobre la foto/overlay → blanco, no turquesa.** Todo lo que hoy es `text-gold` o `text-gold` en íconos y que se renderiza directamente sobre el overlay turquesa (la línea eyebrow, los chips de destinos, el contador de tarjetas, el precio "Desde US$X", los separadores) pasa a variantes de blanco (`text-white`, `text-white/70`, etc.), no a turquesa — turquesa sobre un fondo turquesa-tintado no se distingue.

**4. Detalles decorativos sobre las FOTOS de las tarjetas (no sobre el overlay) → turquesa sí funciona.** El anillo que aparece al hover alrededor de cada `FloatingCard` está sobre una foto variada (Machu Picchu, Valle Sagrado, etc.), no sobre el overlay turquesa uniforme — ahí `ring-turquoise/60` sí contrasta bien y se mantiene como accent color.

**5. Badge de rating (estrella) → blanco/turquesa, sin excepción.** El degradado dorado (`from-gold to-gold-bright`) del badge de rating en cada `FloatingCard` pasa también a `bg-white text-turquoise-deep` (mismo patrón de botón) — se mantiene la regla estricta de Fase 4a de que `--color-gold` solo existe en el wordmark del logo, sin una segunda excepción para "estrella = dorado" (decisión explícita del usuario).

**6. Confirmación (no nueva regla, cierre de un pendiente de 4a):** el hover dorado del navbar en su estado transparente (`!solid`, sobre el hero) que quedó deliberadamente sin tocar en Fase 4a **se confirma permanente**, no era una decisión pendiente. Como el fondo del hero pasa a ser turquesa-tintado, un hover turquesa ahí tampoco contrastaría — dorado sigue siendo la elección correcta en ese único punto del sitio.

**7. Tipografía — sin excepciones nuevas.** `font-display` y `font-hand` se eliminan de ambos archivos, igual que en Fase 4a (títulos → `--font-body` con `font-bold`/`font-semibold` según el elemento). La firma manuscrita "Cusco, Perú" sobre las polaroids en `stats.tsx` (hoy `font-hand text-gold text-3xl`) pierde el script y se convierte en un label uppercase con letter-spacing, mismo patrón que los demás eyebrows del sitio (ya no hay equivalente sin fuente script, así que cambia de forma, no solo de color).

## `stats.tsx` — mucho más simple

Fondo claro (`bg-stone`), sin foto — no aplican las reglas 1-4. Todo lo que es `text-gold`/`hover:text-gold` (íconos Compass/Globe2/ShieldCheck, el sufijo "%", el texto destacado "15% descuento", el botón "Saber más →") pasa directo a `text-turquoise`/`hover:text-turquoise-deep` sin problema de contraste, igual que en footer/navbar sobre fondo claro.

## Testing / verificación de esta sub-fase

- `npm run build` pasa sin errores nuevos.
- Revisión visual en `npm run dev` de `/es` (home): hero con overlay turquesa (no negro/navy), CTA y flechas en blanco sólido con texto turquoise-deep, badge de rating blanco, ring de hover turquesa sobre las fotos de las tarjetas; sección de stats con íconos/números en turquesa sobre fondo claro.
- `grep -n "bg-gold\|text-gold\|ring-gold\|font-display\|font-hand\|shadow-glow" src/components/sections/hero.tsx src/components/sections/stats.tsx` — sin resultados (no hay excepción de "logo" en ninguno de los dos archivos, a diferencia de navbar/footer).
- Confirmar que el hover dorado del navbar en `!solid` (sin tocar desde 4a) sigue funcionando visualmente bien contra el nuevo overlay turquesa del hero — verificación visual, no un grep.
