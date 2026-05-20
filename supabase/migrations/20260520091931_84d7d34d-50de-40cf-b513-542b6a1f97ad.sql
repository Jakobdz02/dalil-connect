DROP POLICY IF EXISTS "Guide photos: public read" ON storage.objects;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon;