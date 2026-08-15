# Rediseño "Bold Adventure" (hero, cards, widget de reserva) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el lenguaje visual "Bold Adventure" (elegido sobre 3 mockups) al CTA del hero, a las tarjetas de tour (`TourCard`, compartida entre home/listado/relacionados) y al widget de reserva — incluyendo un cambio de flujo del widget: todos los campos de reserva visibles desde el inicio, sin paso intermedio oculto.

**Architecture:** Son 3 componentes independientes, cada uno editado en su propio archivo. Task 1 y 2 son cambios puramente de clases Tailwind (mecánicos). Task 3 restructura el JSX del widget de reserva para eliminar un estado (`"idle"`) y mover el header de precio a un panel con fondo oscuro — mismo comportamiento de negocio (mismo `enviarReserva`, mismo server action, misma validación), solo cambia qué se renderiza y cuándo.

**Tech Stack:** Next.js 16.2.6 (App Router), Tailwind CSS v4 (`@theme` en CSS, sin `tailwind.config`), React 19, TypeScript, Framer Motion.

**Repo de trabajo:** `C:\xampp\htdocs\boletomachupicchutours` (todas las rutas de este plan son relativas a ese repo, no a `cuscotours-v2` donde vive este documento).

## Global Constraints

- CTAs primarios de reserva → `bg-flame-deep` sólido + texto blanco + `font-bold`/`font-extrabold` + `hover:brightness-90` (mismo patrón que los 5 botones "Reservar" ya existentes tras el fix de contraste de la paleta — no inventar un hover nuevo).
- Badges/pills de estado (bestseller, descuento) → fondo `flame` sólido, texto blanco.
- Números clave (precios) → peso tipográfico más pesado (`font-extrabold` en vez de `font-bold`).
- Paneles de profundidad nuevos → `bg-gradient-to-br from-night to-night-deep` con un glow radial `bg-flame/30` decorativo.
- No tocar ningún uso de `turquoise`/`turquoise-deep` que no esté explícitamente listado en una tarea de este plan (ej. el hover de los botones +/- del stepper de viajeros y el `focus:border-turquoise` de los inputs se mantienen sin cambios — no son CTAs primarios ni badges).
- El widget de reserva pierde el estado `"idle"`: los campos de datos del viajero pasan a estar siempre visibles junto con fecha/viajeros/total, con un solo botón de submit. El estado `"done"` (confirmación con código) no cambia. Ninguna lógica de validación, estado de negocio, ni el server action `createBooking` se modifican — solo el JSX y el tipo del estado `step`.
- Spec completo: `docs/superpowers/specs/2026-08-14-boletomachupicchutours-bold-redesign-design.md` (en el repo `cuscotours-v2`).
- Este repo no tiene script `npm test` en `master` — la verificación de cada tarea es `npm run build` (incluye chequeo de TypeScript) + revisión visual manual con `npm run dev`, siguiendo el mismo método ya usado en el plan de paleta anterior.

---

### Task 1: CTA del hero a flame sólido

**Files:**
- Modify: `src/components/sections/hero.tsx:145-151`

**Interfaces:**
- Consumes: tokens `--color-flame-deep` (ya existe desde el plan de paleta).
- Produces: ninguno consumido por tareas posteriores.

- [ ] **Step 1: Confirmar el código actual**

Run: `grep -n "text-turquoise-deep" src/components/sections/hero.tsx`

Expected:
```
147:              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-white px-5 sm:px-7 py-3 sm:py-3.5 text-turquoise-deep font-semibold text-sm sm:text-base transition hover:bg-white/90"
```

- [ ] **Step 2: Editar el CTA**

En `src/components/sections/hero.tsx`, reemplazar (línea 145-151):

```tsx
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-white px-5 sm:px-7 py-3 sm:py-3.5 text-turquoise-deep font-semibold text-sm sm:text-base transition hover:bg-white/90"
            >
              {m.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
```

por:

```tsx
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-flame-deep px-5 sm:px-7 py-3 sm:py-3.5 text-white font-semibold text-sm sm:text-base transition hover:brightness-90"
            >
              {m.hero.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
```

No se toca el bloque del "eyebrow"/keyword (líneas 94-105) ni su timing de animación — sigue pintando en el primer frame para no afectar LCP.

- [ ] **Step 3: Verificar**

Run: `grep -n "bg-flame-deep\|text-turquoise-deep" src/components/sections/hero.tsx`
Expected: una sola coincidencia, `bg-flame-deep` en la línea del CTA. Sin coincidencias de `text-turquoise-deep`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build termina sin errores.

- [ ] **Step 5: Ver el resultado**

Run: `npm run dev`, abrir `http://localhost:3000/es`.
Expected: el botón "Reservar tour" del hero se ve naranja sólido (antes blanco), con el mismo texto y flecha. El resto del hero (video, eyebrow, título, chips de destinos) no cambia. Cerrar el dev server al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat(hero): CTA principal a flame solido (lenguaje Bold Adventure)"
```

---

### Task 2: Tarjetas de tour (`TourCard`) — badges, ribbon, flecha y precio

**Files:**
- Modify: `src/components/sections/featured-tours.client.tsx:106-196`

**Interfaces:**
- Consumes: tokens `--color-flame` (ya existe).
- Produces: ninguno consumido por tareas posteriores. Este componente se usa en 3 lugares (`FeaturedToursGrid` en el home, el listado `/tours` vía `page.client.tsx`, y donde se reutilice `TourCard` directamente) — un solo cambio se propaga a los 3.

Incluye la resolución de la nota de consistencia dejada abierta en el spec (anillo de hover): se cambia a `flame` porque es la lectura más consistente con el resto de los acentos interactivos de la card, que en esta misma tarea pasan de turquoise a flame.

- [ ] **Step 1: Confirmar las 5 líneas actuales**

Run: `grep -n "turquoise-deep\|ring-turquoise" src/components/sections/featured-tours.client.tsx`

Expected:
```
106:          <div className="absolute top-5 -left-9 rotate-[-35deg] bg-turquoise-deep text-white text-[10px] uppercase tracking-widest font-bold px-10 py-1 shadow-lg">
113:          <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white text-turquoise-deep text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
137:            <ArrowUpRight className="w-5 h-5 text-turquoise-deep" />
196:        <div className="absolute inset-0 rounded-3xl ring-2 ring-turquoise/0 group-hover:ring-turquoise/60 transition-all duration-300 pointer-events-none" />
```

- [ ] **Step 2: Ribbon de descuento (línea 106)**

```tsx
          <div className="absolute top-5 -left-9 rotate-[-35deg] bg-turquoise-deep text-white text-[10px] uppercase tracking-widest font-bold px-10 py-1 shadow-lg">
            -{tour.discount_pct}%
          </div>
```
→
```tsx
          <div className="absolute top-5 -left-9 rotate-[-35deg] bg-flame text-white text-[10px] uppercase tracking-widest font-bold px-10 py-1 shadow-lg">
            -{tour.discount_pct}%
          </div>
```

- [ ] **Step 3: Badge "Más vendido" (línea 112-117)**

```tsx
          <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white text-turquoise-deep text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Flame className="w-3 h-3" />
            {locale === "en" ? "Best seller" : "Más vendido"}
          </div>
```
→
```tsx
          <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-flame text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
            <Flame className="w-3 h-3" />
            {locale === "en" ? "Best seller" : "Más vendido"}
          </div>
```

- [ ] **Step 4: Flecha de hover (línea 135-139)**

```tsx
          <div className="w-12 h-12 rounded-full bg-white grid place-items-center shadow-lg">
            <ArrowUpRight className="w-5 h-5 text-turquoise-deep" />
          </div>
```
→
```tsx
          <div className="w-12 h-12 rounded-full bg-flame grid place-items-center shadow-lg">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
```

- [ ] **Step 5: Peso del precio (línea 184)**

```tsx
                <span className="text-3xl text-white font-bold leading-none">
                  US${finalPrice.toFixed(0)}
                </span>
```
→
```tsx
                <span className="text-3xl text-white font-extrabold leading-none">
                  US${finalPrice.toFixed(0)}
                </span>
```

- [ ] **Step 6: Anillo de hover (línea 196)**

```tsx
        <div className="absolute inset-0 rounded-3xl ring-2 ring-turquoise/0 group-hover:ring-turquoise/60 transition-all duration-300 pointer-events-none" />
```
→
```tsx
        <div className="absolute inset-0 rounded-3xl ring-2 ring-flame/0 group-hover:ring-flame/60 transition-all duration-300 pointer-events-none" />
```

- [ ] **Step 7: Verificar**

Run: `grep -n "turquoise-deep\|ring-turquoise" src/components/sections/featured-tours.client.tsx`
Expected: sin salida (ningún resultado).

Run: `grep -n "bg-flame\b\|ring-flame\|font-extrabold" src/components/sections/featured-tours.client.tsx`
Expected: 5 líneas (ribbon, badge, flecha, ring — resting y hover en la misma línea cuentan una vez —, precio), todas con `flame`.

- [ ] **Step 8: Build**

Run: `npm run build`
Expected: build termina sin errores.

- [ ] **Step 9: Ver el resultado**

Run: `npm run dev`, abrir:
- `http://localhost:3000/es` (sección de tours destacados del home)
- `http://localhost:3000/es/tours` (listado completo)

Expected: el badge "Más vendido" y el ribbon de descuento (en tours que tengan descuento) se ven naranjas con texto blanco; al pasar el mouse sobre una card, la flecha circular y el anillo del borde son naranjas (antes turquesa); el precio se ve un poco más pesado tipográficamente. El resto de la card (imagen, meta row de duración/dificultad/grupo, rating badge) no cambia. Cerrar el dev server al terminar.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/featured-tours.client.tsx
git commit -m "feat(tours): badges, ribbon, flecha y precio de TourCard a flame (Bold Adventure)"
```

---

### Task 3: Widget de reserva — panel de precio oscuro + formulario siempre visible

**Files:**
- Modify: `src/components/tours/booking-widget.tsx` (todo el bloque `return` del componente, líneas 126-360, y el tipo del estado `step` en línea 55)

**Interfaces:**
- Consumes: tokens `--color-flame`, `--color-flame-deep` (ya existen). Reutiliza el server action `createBooking` y el componente `DatePicker` sin cambios de firma.
- Produces: ninguno consumido por otras tareas — es la última tarea del plan.

Este es un cambio más grande que las Tareas 1 y 2: reestructura el JSX completo del componente. Dos cambios distintos ocurren en la misma tarea porque son inseparables en el código (el header nuevo y la eliminación del paso oculto tocan el mismo árbol de JSX):

**3a — Visual:** el bloque de precio pasa de texto plano sobre fondo blanco a un panel `bg-gradient-to-br from-night to-night-deep` con un glow decorativo y textos en blanco/flame. El box de "Total" pasa de acento turquoise a acento flame.

**3b — Comportamiento:** el estado `step` pierde el valor `"idle"` (queda `"form" | "done"`). El botón "Reservar ahora" que antes solo revelaba los campos desaparece; los campos de nombre/email/teléfono/notas quedan siempre visibles junto con fecha/viajeros/total, dentro de un único `<form onSubmit={enviarReserva}>`. El botón "Cancelar" (que volvía a `"idle"`) se elimina — ya no hay a qué paso "cancelar" volver. El paso `"done"` no cambia: mismo contenido, se sigue mostrando cuando `step === "done"`.

**Detalle importante:** los botones +/- del stepper de viajeros hoy viven fuera de cualquier `<form>`. En el nuevo JSX quedan *dentro* del `<form>` que envuelve todo — sin `type="button"` explícito, un botón dentro de un `<form>` es `type="submit"` por defecto, así que un click en +/- dispararía el envío de la reserva antes de tiempo. Los Steps de abajo ya incluyen `type="button"` en ambos — no quitarlo.

- [ ] **Step 1: Confirmar el estado del archivo antes de editar**

Run: `grep -n 'useState<"idle" | "form" | "done">' src/components/tours/booking-widget.tsx`
Expected:
```
55:  const [step, setStep] = useState<"idle" | "form" | "done">("idle");
```

- [ ] **Step 2: Cambiar el tipo y valor inicial de `step`**

Reemplazar (línea 55):
```tsx
  const [step, setStep] = useState<"idle" | "form" | "done">("idle");
```
por:
```tsx
  const [step, setStep] = useState<"form" | "done">("form");
```

- [ ] **Step 3: Reemplazar todo el bloque `return` del componente**

Reemplazar desde `return (` (línea 126) hasta el `);` de cierre del componente (línea 360) — es decir, todo el JSX retornado por `BookingWidget` — por:

```tsx
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-night/8 rounded-3xl overflow-hidden shadow-card"
    >
      {/* Header: precio sobre panel navy con acento flame */}
      <div className="relative overflow-hidden bg-gradient-to-br from-night to-night-deep p-4 sm:p-6 pb-5">
        <div className="absolute -top-16 -right-10 w-40 h-40 rounded-full bg-flame/30 blur-3xl pointer-events-none" />
        <div className="relative flex items-baseline gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider text-white/60">
            {en ? "From" : "Desde"}
          </span>
          {originalPrice && (
            <span className="text-white/45 line-through text-lg">
              US${originalPrice.toFixed(0)}
            </span>
          )}
          <span className="font-extrabold text-3xl sm:text-4xl text-white">
            US${priceUsd.toFixed(0)}
          </span>
          <span className="text-white/70 text-sm">
            {en ? "/ person" : "/ persona"}
          </span>
          {originalPrice && (
            <span className="rounded-full bg-flame text-white text-[11px] font-bold px-2.5 py-1">
              -{Math.round((1 - priceUsd / originalPrice) * 100)}%
            </span>
          )}
        </div>
        <p className="relative mt-2 flex items-center gap-1.5 text-xs text-white/70">
          <Users className="w-3.5 h-3.5 text-white/60" />
          {en
            ? `Small groups · up to ${maxGroupSize} travellers`
            : `Grupos reducidos · hasta ${maxGroupSize} viajeros`}
        </p>
      </div>

      <div className="p-4 sm:p-6 pt-5">
        {step === "form" && (
          <form onSubmit={enviarReserva} className="space-y-5">
            {/* Selector de salida: el mismo calendario que el resto del sitio.
                Solo habilita fechas con salida publicada y cupo libre. */}
            {availability.length > 0 && (
              <div>
                <DatePicker
                  value={selectedDate ?? ""}
                  onChange={setSelectedDate}
                  locale={locale}
                  allowed={availability
                    .filter((a) => a.total_spots - a.booked_spots > 0)
                    .map((a) => a.date)}
                  label={en ? "Departure date" : "Fecha de salida"}
                />
                {selectedAvailability && (
                  <p className="mt-1.5 text-[11px] text-night/50">
                    {selectedAvailability.total_spots -
                      selectedAvailability.booked_spots}{" "}
                    {en
                      ? "spots left on this date"
                      : "cupos disponibles en esa fecha"}
                  </p>
                )}
              </div>
            )}

            {/* Sin calendario cargado el viajero propone la fecha. */}
            {availability.length === 0 && (
              <DatePicker
                value={fechaLibre}
                onChange={setFechaLibre}
                locale={locale}
                label={en ? "Preferred date" : "Fecha deseada"}
              />
            )}

            <div>
              <label className="text-xs uppercase tracking-wider text-night/50">
                {en ? "Travelers" : "Viajeros"}
              </label>
              <div className="mt-2 flex items-center justify-between bg-stone rounded-xl px-4 py-3">
                <button
                  type="button"
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                  className="w-8 h-8 rounded-full bg-white hover:bg-turquoise hover:text-white text-night grid place-items-center transition shadow-soft"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xl text-night">
                  {travelers}{" "}
                  <span className="text-sm text-night/50">{personWord}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setTravelers((t) => Math.min(availableSpots, t + 1))
                  }
                  disabled={travelers >= availableSpots}
                  className="w-8 h-8 rounded-full bg-white hover:bg-turquoise hover:text-white text-night grid place-items-center transition disabled:opacity-40 shadow-soft"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={en ? "Full name" : "Nombre completo"}
                className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-sm text-night focus:outline-none focus:border-turquoise focus:bg-white transition"
              />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={en ? "Email" : "Email"}
                className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-sm text-night focus:outline-none focus:border-turquoise focus:bg-white transition"
              />
              <input
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder={en ? "Phone (optional)" : "Teléfono (opcional)"}
                className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-sm text-night focus:outline-none focus:border-turquoise focus:bg-white transition"
              />
              <textarea
                rows={2}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder={
                  en
                    ? "Allergies, diet, requests (optional)"
                    : "Alergias, dieta, pedidos (opcional)"
                }
                className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-sm text-night focus:outline-none focus:border-turquoise focus:bg-white transition resize-none"
              />
            </div>

            {/* Total: precio por persona x viajeros. Se muestra aparte del precio
                unitario para que no haya sorpresas al llegar al checkout. */}
            <div className="flex items-baseline justify-between rounded-xl bg-flame/5 border border-flame/15 px-4 py-3">
              <span className="text-sm text-night/70">
                {en ? "Total" : "Total"}{" "}
                <span className="text-night/45">
                  ({travelers} × US${priceUsd.toFixed(0)})
                </span>
              </span>
              <span className="font-bold text-2xl text-flame-deep">
                US${total.toFixed(0)}
              </span>
            </div>

            {errorReserva && (
              <p className="flex items-start gap-2 text-sm text-rose-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {errorReserva}
              </p>
            )}

            <p className="text-[11px] text-night/45 leading-relaxed">
              {en
                ? "No payment now — we confirm availability by email first."
                : "No se cobra nada ahora: primero confirmamos disponibilidad por email."}
            </p>

            <button
              type="submit"
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-flame-deep hover:brightness-90 text-white font-semibold py-4 transition disabled:opacity-60"
            >
              {enviando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {en ? "Book now" : "Reservar ahora"}
            </button>
          </form>
        )}

        {/* Confirmación con el código de la reserva. */}
        {step === "done" && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="flex items-center gap-2 font-semibold text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
              {en ? "Request received" : "Solicitud recibida"}
            </p>
            <p className="mt-2 text-sm text-emerald-900/80 leading-relaxed">
              {en
                ? "We'll confirm availability by email shortly. Your reference:"
                : "Te confirmamos la disponibilidad por email en breve. Tu referencia:"}
            </p>
            <p className="mt-2 font-bold text-lg text-emerald-900 tracking-wider">
              {codigo}
            </p>
          </div>
        )}

        {/* Secundaria: consultar por WhatsApp sin comprometerse. */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#25D366] text-[#1ebe5b] hover:bg-[#25D366] hover:text-white font-semibold py-3.5 transition"
        >
          <MessageCircle className="w-5 h-5" />
          {en ? "Ask on WhatsApp" : "Consultar por WhatsApp"}
        </a>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-night/60">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-turquoise" />
            {en ? "Fast reply" : "Respuesta rápida"}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-turquoise" />
            {en ? "No commitment" : "Sin compromiso"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

No se toca nada por encima del `return` salvo el Step 2 (tipo de `step`) — `enviarReserva`, `waMessage`, `waUrl`, `total`, `fechaViaje`, `selectedAvailability`, `availableSpots`, `personWord` quedan intactos.

- [ ] **Step 4: Verificar que no queda ningún rastro del paso "idle" ni del botón "Cancelar"**

Run: `grep -n '"idle"\|Cancelar\|Cancel"' src/components/tours/booking-widget.tsx`
Expected: sin salida (ningún resultado).

- [ ] **Step 5: Verificar los cambios de color del header y total**

Run: `grep -n "from-night to-night-deep\|bg-flame/5\|text-flame-deep\|bg-flame text-white" src/components/tours/booking-widget.tsx`
Expected: coincidencias para el panel del header, el box de total, y el badge de descuento — todas presentes.

- [ ] **Step 6: Verificar que los botones del stepper tienen `type="button"`**

Run: `grep -n "setTravelers" src/components/tours/booking-widget.tsx`
Expected: 2 líneas (una por botón +/-). Abrir el archivo y confirmar visualmente que ambos `<button>` que los contienen tienen `type="button"` — un botón sin ese atributo dentro de un `<form>` dispara submit al hacer click, lo que rompería el stepper.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: build termina sin errores (incluye el chequeo de TypeScript sobre el tipo `"form" | "done"` de `step`).

- [ ] **Step 8: Verificación manual en el navegador**

Run: `npm run dev`, abrir `http://localhost:3000/es/tours/<un-slug-de-tour-con-disponibilidad>`.

Expected, todo esto **sin hacer ningún click previo** (visible desde el primer render):
- Panel de precio con fondo navy oscuro, precio en blanco grande, badge de descuento naranja si el tour tiene descuento.
- Selector de fecha, stepper de viajeros, y los 4 campos (nombre, email, teléfono, notas) todos visibles.
- Box de "Total" con acento naranja.
- Un solo botón "Reservar ahora" al final (sin botón "Cancelar").

Probar además:
- Click en + / − del stepper: cambia el número de viajeros, **no** dispara ningún envío ni error.
- Enviar el formulario vacío: el navegador bloquea el envío por los campos `required` (nombre, email) — no se llama a `enviarReserva` todavía.
- Completar nombre y email válidos y enviar: si hay una fecha con cupo, el flujo llega al paso de confirmación (`step === "done"`) con el código de reserva, igual que antes de este cambio.

Cerrar el dev server al terminar.

- [ ] **Step 9: Commit**

```bash
git add src/components/tours/booking-widget.tsx
git commit -m "feat(booking): widget de reserva a panel navy/flame, formulario siempre visible (Bold Adventure)"
```

---

### Task 4: Verificación final integral

**Files:** ninguno (solo lectura/verificación).

- [ ] **Step 1: Grep de rastros del lenguaje anterior en los 3 archivos tocados**

Run:
```bash
grep -n "turquoise-deep" src/components/sections/hero.tsx src/components/sections/featured-tours.client.tsx
grep -n '"idle"' src/components/tours/booking-widget.tsx
```
Expected: ambos comandos sin salida.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build termina sin errores.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sin errores nuevos introducidos por este cambio — los únicos archivos tocados son `hero.tsx`, `featured-tours.client.tsx` y `booking-widget.tsx`; cualquier error reportado en otros archivos es preexistente (ya documentado en el plan de paleta anterior) y no bloquea esta verificación.

- [ ] **Step 4: Checklist visual final con el dev server**

Run: `npm run dev`, recorrer:
- `/es` — CTA "Reservar tour" del hero en naranja; sección de tours destacados con badges/ribbon/flecha en naranja.
- `/es/tours` — listado completo, mismo tratamiento de cards.
- `/es/tours/<slug>` — widget de reserva con panel navy y todos los campos visibles de entrada.

Expected: en ningún punto queda un badge o ribbon turquesa en las cards, ni un CTA de reserva blanco/turquesa — todo el naranja está donde este plan lo puso. El widget de reserva no tiene ningún paso oculto: todo el formulario está a la vista desde el primer render. Cerrar el dev server al terminar.

- [ ] **Step 5: Commit final (si el Step 4 no requirió cambios) o commits correctivos**

Si el checklist visual no encontró nada que corregir, no hay nada que commitear en este task. Si se encontró algo, corregirlo, volver a correr Steps 2-3, y commitear con:

```bash
git add -A
git commit -m "fix(bold): ajuste final tras verificacion visual del rediseno Bold Adventure"
```
