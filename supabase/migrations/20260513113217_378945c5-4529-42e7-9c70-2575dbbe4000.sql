
-- 1. Extend guide_profiles with onboarding/KYC fields
ALTER TABLE public.guide_profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS wilaya TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS work_history TEXT,
  ADD COLUMN IF NOT EXISTS expertise TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_links TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS working_hours JSONB,
  ADD COLUMN IF NOT EXISTS available_days TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS session_type TEXT,
  ADD COLUMN IF NOT EXISTS price_per_hour NUMERIC,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Validation trigger for verification_status (instead of CHECK)
CREATE OR REPLACE FUNCTION public.validate_verification_status()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.verification_status NOT IN ('draft','submitted','under_review','verified','rejected') THEN
    RAISE EXCEPTION 'Invalid verification_status: %', NEW.verification_status;
  END IF;
  IF NEW.session_type IS NOT NULL AND NEW.session_type NOT IN ('online','in_person','both') THEN
    RAISE EXCEPTION 'Invalid session_type: %', NEW.session_type;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_guide_verification ON public.guide_profiles;
CREATE TRIGGER validate_guide_verification
  BEFORE INSERT OR UPDATE ON public.guide_profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_verification_status();

-- Tighten public read: only verified AND approved
DROP POLICY IF EXISTS "Guides: anyone can view approved" ON public.guide_profiles;
CREATE POLICY "Guides: public can view verified" ON public.guide_profiles
  FOR SELECT USING (is_approved = true AND verification_status = 'verified');

-- 2. guide_languages
CREATE TABLE IF NOT EXISTS public.guide_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guide_id, language)
);

CREATE OR REPLACE FUNCTION public.validate_proficiency()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.proficiency NOT IN ('basic','intermediate','fluent','native') THEN
    RAISE EXCEPTION 'Invalid proficiency: %', NEW.proficiency;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_guide_lang ON public.guide_languages;
CREATE TRIGGER validate_guide_lang BEFORE INSERT OR UPDATE ON public.guide_languages
  FOR EACH ROW EXECUTE FUNCTION public.validate_proficiency();

ALTER TABLE public.guide_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guide_languages: owner all"
  ON public.guide_languages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.guide_profiles g WHERE g.id = guide_id AND g.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.guide_profiles g WHERE g.id = guide_id AND g.user_id = auth.uid()));

CREATE POLICY "guide_languages: admin all"
  ON public.guide_languages FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "guide_languages: public view verified"
  ON public.guide_languages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.guide_profiles g
    WHERE g.id = guide_id AND g.is_approved = true AND g.verification_status = 'verified'
  ));

-- 3. guide_documents (private)
CREATE TABLE IF NOT EXISTS public.guide_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_doc_type()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.doc_type NOT IN ('id_front','id_back','passport','selfie','diploma','training_cert','language_cert','work_proof','other') THEN
    RAISE EXCEPTION 'Invalid doc_type: %', NEW.doc_type;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_guide_doc ON public.guide_documents;
CREATE TRIGGER validate_guide_doc BEFORE INSERT OR UPDATE ON public.guide_documents
  FOR EACH ROW EXECUTE FUNCTION public.validate_doc_type();

ALTER TABLE public.guide_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guide_documents: owner all"
  ON public.guide_documents FOR ALL
  USING (EXISTS (SELECT 1 FROM public.guide_profiles g WHERE g.id = guide_id AND g.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.guide_profiles g WHERE g.id = guide_id AND g.user_id = auth.uid()));

CREATE POLICY "guide_documents: admin all"
  ON public.guide_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Private storage bucket for KYC docs
INSERT INTO storage.buckets (id, name, public)
VALUES ('guide-documents','guide-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: owner can upload/read their own folder; admin can read all
CREATE POLICY "guide-docs: owner upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'guide-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "guide-docs: owner read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'guide-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "guide-docs: owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'guide-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "guide-docs: owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'guide-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "guide-docs: admin read all"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'guide-documents' AND has_role(auth.uid(), 'admin'));
