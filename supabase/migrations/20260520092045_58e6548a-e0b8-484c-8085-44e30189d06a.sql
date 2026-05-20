CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  );
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, text) FROM anon;

DROP POLICY IF EXISTS "Bookings: admin can view all" ON public.bookings;
CREATE POLICY "Bookings: admin can view all"
ON public.bookings
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "guide_documents: admin all" ON public.guide_documents;
CREATE POLICY "guide_documents: admin all"
ON public.guide_documents
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "guide_languages: admin all" ON public.guide_languages;
CREATE POLICY "guide_languages: admin all"
ON public.guide_languages
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Guides: admin can update all" ON public.guide_profiles;
CREATE POLICY "Guides: admin can update all"
ON public.guide_profiles
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Guides: admin can view all" ON public.guide_profiles;
CREATE POLICY "Guides: admin can view all"
ON public.guide_profiles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Profiles: admins can update all" ON public.profiles;
CREATE POLICY "Profiles: admins can update all"
ON public.profiles
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Profiles: admins can view all" ON public.profiles;
CREATE POLICY "Profiles: admins can view all"
ON public.profiles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "guide-docs: admin read all" ON storage.objects;
CREATE POLICY "guide-docs: admin read all"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'guide-documents' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, text);