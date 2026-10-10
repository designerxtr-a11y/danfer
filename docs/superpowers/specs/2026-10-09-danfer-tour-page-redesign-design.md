# Rediseño de la página de tour (danfertourscusco.com) — Fase 1: diseño

Fecha: 2026-10-09
Referencia: https://abexpeditions.com/es/machu-picchu-2-dias/
Archivo principal: `src/app/[locale]/(public)/tours/[slug]/page.tsx`

## Objetivo

La página de cada tour debe verse casi igual que la de AB Expeditions (galería en mosaico, datos rápidos, pestañas, columna derecha con prueba social), con los colores de Danfer (dorado/night, no rojo). La Fase 1 cubre solo el diseño y aplica a los 14 tours. El contenido por tour (información útil, fotos, mapa, más FAQs) es la Fase 2.

## Estructura (de arriba hacia abajo)

1. **Breadcrumbs** (sin cambios).
2. **Cabecera visual**, que depende de cuántas imágenes tenga el tour (`cover_image` + `gallery`, sin duplicados):
   - **5 o más:** mosaico de 1 foto grande a la izquierda y 4 chicas en una grilla de 2×2. Al hacer clic en cualquier foto se abre el visor de galería existente. En móvil se muestra un carrusel deslizable con un contador ("1/7").
   - **Menos de 5:** se mantiene el hero actual, con foto grande y título encima.
3. **Bloque de título** sobre fondo claro (solo en modo mosaico; en modo hero el título va en la foto, como hoy):
   - H1 con el título del tour.
   - Línea de prueba social: logo de Tripadvisor, ●●●●● 5.0 · 1,591 opiniones (datos de `src/lib/social-proof.ts`, sin enlace). Etiquetas "Guías locales certificados" y "Operador local".
   - Párrafo corto con `short_desc` (o `subtitle` si no hay `short_desc`).
4. **Tarjeta de datos rápidos** con 4 celdas e ícono: Duración (`duration_label`), Tipo de tour (nombre de la categoría), Dificultad (`difficulty` traducida), Grupo ("Hasta N personas", `max_group_size`). Se muestra en ambos modos.
5. **Barra de pestañas** oscura (`bg-night`), sticky bajo el header, con ícono y texto en cada pestaña. La activa va en dorado.
   - Pestañas, en orden: Resumen (descripción + destacados), Itinerario, Incluye (incluye/no incluye), Preguntas frecuentes, Información útil, Qué llevar.
   - Una pestaña sin contenido no se renderiza.
   - **Todas las secciones se renderizan en el HTML.** Las inactivas se ocultan con el atributo `hidden`, para que Google indexe todo el texto.
   - Al cambiar de pestaña se hace scroll suave al inicio del panel si la barra quedó fuera de vista.
   - Sincronización con la URL: `#itinerario`, `#incluye`, etc. abren esa pestaña al cargar la página. `#resena` sigue funcionando.
   - En móvil la barra se desliza horizontalmente.
6. **Siempre visibles bajo las pestañas:** punto de encuentro, reseñas reales del tour y formulario de reseña (sin cambios).
7. **Columna derecha** (sticky en desktop; en móvil va después del contenido, como hoy):
   - `BookingWidget` (sin cambios).
   - **Reseña destacada:** la reseña publicada más reciente del tour. Si el tour no tiene ninguna, la más reciente de `FACEBOOK_REVIEWS`, marcada "Facebook". Sin estrellas inventadas: las reseñas de la web muestran su rating; las de Facebook, la etiqueta "Nos recomienda en Facebook".
   - **Tarjeta "¿Necesitas ayuda local?":** título "Habla con un experto en Cusco", una línea de texto y un botón de WhatsApp (número de `settings.whatsapp`).
8. **"La ruta":** sección con la imagen del mapa (`route_map_url`), solo si existe.
9. **Tours relacionados** en carrusel horizontal con flechas (reemplaza la grilla actual de `RelatedTours`).
10. **Licencias y asociaciones:** fila de logos que solo se renderiza si la lista de `src/lib/certifications.ts` no está vacía. Arranca vacía hasta que el usuario confirme qué licencias tiene.
11. **Barra fija móvil "Reservar"** (sin cambios).

## Datos

- Nuevas columnas en `tours` (migración `00017`):
  - `important_info jsonb` → `LocalizedList` (`string[] | {es,en}`), igual que `what_to_bring`. Default `'[]'`.
  - `route_map_url text` nullable.
- Tipos: `Tour` en `src/types/database.ts` suma `important_info: LocalizedList` y `route_map_url: string | null`.
- Admin (`src/app/admin/tours/_tour-form.tsx` + `actions.ts`): editor ES/EN para `important_info` (mismo componente que `what_to_bring`) y campo URL o subida de imagen para `route_map_url` (mismo patrón que `cover_image`).
- Orden de despliegue: primero código compatible (columnas opcionales, con fallback a vacío), luego la migración.

## Componentes

- `tour-header-gallery.tsx` (nuevo): decide entre mosaico y hero y renderiza el que corresponda.
- `tour-quick-facts.tsx` (nuevo).
- `tour-tabs.tsx` (nuevo, client): barra y paneles. Recibe un array `{id, label, icon, content: ReactNode}` ya filtrado.
- `tour-sidebar-extras.tsx` (nuevo): reseña destacada y tarjeta de experto.
- `tour-route-map.tsx` (nuevo).
- `related-tours.tsx`: pasa a carrusel.
- `certifications-strip.tsx` (nuevo) + `src/lib/certifications.ts`.
- `page.tsx` queda como orquestador: obtiene los datos y arma las pestañas.

## Fuera de alcance

- Contenido nuevo por tour (Fase 2).
- Cambios al schema JSON-LD (Product, Breadcrumb, FAQ): se mantienen iguales.
- Las reseñas de Facebook cargadas en la migración `00012` (tema aparte, pendiente de decisión del usuario).

## Verificación

- `tsc --noEmit` y `eslint` sin errores.
- Capturas en desktop (1400px) y móvil (390px) de un tour con 5 o más imágenes y de otro con menos.
- El JSON-LD de la página no cambia (comparar antes y después).
- Los hashes `#itinerario` y `#resena` abren la pestaña o el formulario correcto.
- Todas las secciones están presentes en el HTML del servidor (`curl` + grep).
