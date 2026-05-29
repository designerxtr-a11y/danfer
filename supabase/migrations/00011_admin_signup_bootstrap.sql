-- =============================================================
-- Migración 00011 — Registro en el panel + bootstrap del primer admin
-- =============================================================
-- El formulario del panel (/admin/login) ahora permite REGISTRARSE, no solo
-- iniciar sesión. Para que el dueño pueda entrar de inmediato tras registrarse,
-- el PRIMER usuario que se registra se marca como admin automáticamente.
--
-- Seguridad: en cuanto exista al menos un admin, los registros siguientes
-- quedan como NO admin (is_admin = false). A esos se les da acceso desde
-- /admin/users o con la migración 00004. Así nadie más se auto-promueve.
--
-- Reemplaza la función handle_new_user de 00001 (el trigger on_auth_user_created
-- sigue igual y la llama).
-- =============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_exists boolean;
begin
  select exists (select 1 from public.profiles where is_admin = true)
  into admin_exists;

  insert into public.profiles (id, full_name, avatar_url, is_admin)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    not admin_exists  -- primer usuario => admin; el resto => false
  );
  return new;
end;
$$;

-- Verificación
select p.id, u.email, p.is_admin
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at;
