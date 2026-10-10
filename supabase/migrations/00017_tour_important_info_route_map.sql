-- Migración 17: campos para el rediseño de la página de tour.
-- important_info → pestaña "Información útil" (LocalizedList: string[] | {es,en}).
-- route_map_url  → imagen del mapa de la ruta (sección "La ruta").
-- La página ya los lee como opcionales; el admin los edita una vez aplicada.

alter table public.tours
  add column if not exists important_info jsonb not null default '[]'::jsonb,
  add column if not exists route_map_url text;
