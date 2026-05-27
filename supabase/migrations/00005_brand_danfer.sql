-- Rebranding: CuscoTours → Danfer Tours Cusco
-- Pegar en SQL Editor de Supabase y Run.

update public.settings set value = '"Danfer Tours Cusco"'::jsonb
  where key = 'site_name';

update public.settings set value = '"hola@danfertourscusco.com"'::jsonb
  where key = 'contact_email';

update public.settings set value =
  '{"instagram":"@danfertourscusco","facebook":"danfertourscusco","tiktok":"@danfertourscusco"}'::jsonb
  where key = 'social';

-- Verifica
select key, value from public.settings;
