-- =====================================================
-- Promueve un usuario a admin.
-- Reemplaza el email por el tuyo (el que usaste al
-- registrarte en Supabase Auth) y ejecuta este SQL.
-- =====================================================

update public.profiles
set is_admin = true
where id = (
  select id from auth.users where email = 'TU_EMAIL_AQUI@example.com'
);

-- Verifica:
select p.id, u.email, p.is_admin
from public.profiles p
join auth.users u on u.id = p.id
where p.is_admin = true;
