# Rediseño "Bold Adventure" — hero, tarjetas de tour y widget de reserva

**Repo de trabajo:** `C:\xampp\htdocs\boletomachupicchutours` (todas las rutas de este spec son relativas a ese repo, no a `cuscotours-v2` donde vive este documento).

## Contexto

La paleta navy/naranja del logo ([[2026-08-14-boletomachupicchutours-paleta-logo-design]]) ya está en producción, pero el usuario la describe como "genérica" — el problema no es el color en sí, sino que la composición visual (tipografía, jerarquía, tratamiento de badges/CTAs) no transmite la sensación "premium" que el producto (tours a Machu Picchu) debería proyectar.

Se evaluaron 3 direcciones de estilo con mockups reales (copy y fotos reales, sin placeholders) en el compañero visual de brainstorming:

- **A — Editorial Minimal:** tipografía serif, mucho espacio, CTA como link de texto (estilo revista de lujo).
- **B — Bold Adventure:** tipografía sans pesada (800-900), badges de prueba social, CTAs sólidos en `flame` con sombra pronunciada (estilo aventura/expedición).
- **C — Boutique Warm:** layout partido foto/texto sobre fondo crema, más cálido.

**Dirección elegida: B — Bold Adventure.** El usuario la seleccionó directamente sobre el mockup comparativo.

## Lenguaje visual "Bold Adventure"

Reglas transversales a las 3 secciones de este spec (no se re-explican en cada sección):

- **CTAs primarios de reserva → `bg-flame-deep` sólido, texto blanco, `font-bold`/`font-extrabold`, `hover:brightness-90`** (mismo patrón ya usado en los 5 botones "Reservar" existentes tras el fix de contraste de la paleta — no se reinventa un hover nuevo).
- **Badges/pills de estado (bestseller, descuento, "más vendido") → fondo `flame` sólido con texto blanco**, en vez del blanco-con-texto-navy o turquesa-claro actual. Sombra sutil en tono flame (`shadow-[...rgba(253,71,7,...)]`) para dar profundidad, consistente con el patrón que ya usan los botones de reserva.
- **Números clave (precios, ratings) → peso tipográfico más pesado** (`font-extrabold`/`font-black` en vez de `font-bold`) y tamaño ligeramente mayor donde el layout lo permita — es el detalle que más contribuye a la sensación "premium" en los mockups aprobados.
- **Paneles de profundidad (headers de widgets, fondos oscuros nuevos) → gradiente `from-night to-night-deep`** con un glow radial sutil en `flame` al 30-35% de opacidad como acento decorativo (visto en el header del widget de reserva) — no se usa en superficies donde ya existe suficiente contraste sin él.
- **No se toca ningún uso de `turquoise`/`turquoise-deep` que no esté explícitamente listado abajo.** El objetivo es un lenguaje más audaz en puntos de conversión específicos (CTAs, badges, precios), no un repintado general — a diferencia del cambio de paleta anterior, este es un cambio de composición/jerarquía, no de valores de color base.

## Sección 1: Hero (`src/components/sections/hero.tsx`)

**Cambio confirmado:** el CTA principal ("Reservar tour", línea ~145-151) pasa de `bg-white` + `text-turquoise-deep` a `bg-flame-deep` + `text-white` + `hover:brightness-90`, siguiendo el mismo patrón que los 5 botones de reserva ya existentes en el sitio.

**Razón:** el botón dice literalmente "Reservar tour" — es la acción más importante del hero, y hoy es visualmente más discreto (blanco) que botones secundarios. En Bold Adventure el CTA de mayor intención debe ser el elemento más audaz de toda la sección.

**Restricción a preservar:** el bloque del "eyebrow" con la keyword visible (línea ~94-105, comentado en el código como crítico para LCP — sin `opacity:0` ni delay de animación) no debe alterar su timing de renderizado. Cualquier ajuste visual a esa línea debe mantener la misma estrategia de pintado inmediato.

**Fuera de alcance de este spec** (no se decidió en el brainstorming, queda a criterio de la fase de implementación si se retoma después): agregar badges de prueba social (rating, "guías locales") al hero. Apareció en un mockup de exploración de dirección de estilo pero no se validó como cambio a implementar — no incluir a menos que se confirme explícitamente antes de escribir el plan.

## Sección 2: Tarjetas de tour (`src/components/sections/featured-tours.client.tsx`, componente `TourCard`)

Este componente es compartido — se usa en el home (`FeaturedToursGrid`), en el listado `/tours` (`page.client.tsx`) y en tours relacionados. Un solo cambio se propaga a las 3 ubicaciones.

**Cambios confirmados** (validados sobre mockup con contenido real: Machu Picchu Full Day, Valle Sagrado, Rainbow Mountain):

1. **Badge "Más vendido"** (línea ~112-117): de `bg-white text-turquoise-deep` a `bg-flame text-white`, con el ícono `Flame` ya existente.
2. **Ribbon de descuento** (línea ~104-109): mantiene la forma diagonal actual; cambia de `bg-turquoise-deep` a `bg-flame` sólido.
3. **Flecha de hover** (línea ~134-139): de `bg-white` + ícono `text-turquoise-deep` a `bg-flame` + ícono blanco.
4. **Precio** (línea ~184-186): de `text-3xl font-bold` a `text-3xl font-extrabold` (o `text-4xl` si el layout de la card lo permite sin romper el `line-clamp` del título) — mismo dato, mayor peso visual.

**Sin cambios:** rating badge (`bg-night/60`, se mantiene neutro para no competir con los acentos flame), meta row (duración/dificultad/grupo), estructura general de la card (`aspect-[5/8]`, overlay, imagen).

**Nota de consistencia a decidir en el plan:** el anillo de hover de la card (línea ~196, `ring-turquoise/0 → ring-turquoise/60`) hoy usa turquoise. No se mostró explícitamente en el mockup aprobado; dado que el resto de los acentos interactivos de la card pasan a flame, cambiarlo a `ring-flame/0 → ring-flame/60` sería la lectura más consistente del lenguaje aprobado — confirmar en la fase de plan si esto se incluye o se deja como está.

## Sección 3: Widget de reserva (`src/components/tours/booking-widget.tsx`)

Dos cambios distintos: uno visual (tratamiento) y uno de comportamiento (flujo del formulario). Ambos confirmados sobre mockup.

### 3a. Tratamiento visual

- **Header nuevo:** el bloque de precio (líneas ~132-159 actuales) pasa de texto plano sobre fondo blanco a un panel con `bg-gradient-to-br from-night to-night-deep`, texto blanco, con el badge de descuento como pill `bg-flame` (en vez de `bg-turquoise/10 text-turquoise-deep`) y un glow radial `flame` sutil como acento decorativo (ver lenguaje visual arriba).
- **Precio:** aumenta de peso (`font-extrabold`/`font-black`) y tamaño dentro del nuevo header oscuro.
- **Total** (líneas ~211-223 actuales): mantiene su función (precio × viajeros) pero pasa de fondo `turquoise/5` a fondo `flame/5` con borde `flame/15`, para quedar visualmente asociado al CTA de flame que sigue debajo.
- El resto del cuerpo (selector de fecha, stepper de viajeros, WhatsApp secundario, trust badges) mantiene su estructura actual — no se rediseñan, solo heredan cualquier ajuste de color que ya defina el lenguaje visual de arriba donde corresponda.

### 3b. Cambio de flujo (comportamiento, no solo visual)

**Estado actual:** el widget tiene 3 pasos controlados por `step` (`"idle" | "form" | "done"`). En `"idle"` solo se ve precio/fecha/viajeros/total y un botón "Reservar ahora"; recién al hacer click aparecen los campos del viajero (nombre, email, teléfono, notas) en el paso `"form"`.

**Cambio pedido:** eliminar el paso `"idle"` como pantalla separada. Los campos del viajero (nombre, email, teléfono, notas) se muestran **siempre visibles** junto con fecha/viajeros/total, desde el primer render. Un único botón "Reservar ahora" al final del formulario dispara `enviarReserva` directamente — no hay un click intermedio que solo revela campos.

**Se mantiene sin cambios:**
- El paso `"done"` (confirmación con código de reserva) — mismo contenido, mismo trigger (respuesta exitosa de `createBooking`).
- Toda la lógica de validación, estado y el server action `createBooking` — este es un cambio de qué se renderiza y cuándo, no de cómo se procesa la reserva.
- El bloque condicional de `DatePicker` para fecha libre cuando `availability.length === 0` (línea ~241-248) — sigue apareciendo bajo la misma condición, ahora simplemente ya no está detrás de un paso oculto.

**Implicación técnica para la fase de plan:** el estado `step` pasa a tener solo dos valores relevantes para el render (`"form"` mostrado por defecto, `"done"` tras éxito) — evaluar si conviene mantener el nombre `"idle"` como valor inicial equivalente a `"form"` o simplificar el tipo directamente a `"form" | "done"`.

## Fuera de alcance

- Cualquier otra sección del sitio (footer, navbar, destinos, blog, checkout standalone en `/reservar/[slug]`) — no se tocan en este spec.
- El formulario de checkout standalone (`checkout-form.tsx`) usa un flujo distinto (página completa, no widget embebido) y no se modifica aquí.
- Paleta de colores base (tokens `night`/`turquoise`/`flame`) — ya está fijada por el spec de paleta anterior; este spec solo cambia *dónde y con qué peso* se usan esos tokens en las 3 secciones listadas.
