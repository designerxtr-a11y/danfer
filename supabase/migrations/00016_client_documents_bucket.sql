-- Migration 16: private storage bucket for client documents (e.g. passport
-- photos attached to a one-off quote page, used to book train tickets and
-- hotel reservations). Public visitors upload via a service-role server
-- action, so no anon RLS policies are needed — only the bucket must exist,
-- and it must stay private (no public read policy, ever).

insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;
