
CREATE TABLE public.guide_consents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id uuid NOT NULL UNIQUE REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_legal_name text NOT NULL,
  date_of_birth date NOT NULL,
  nationality text NOT NULL,
  country_of_residence text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  preferred_language text NOT NULL,
  accepted_accurate_info boolean NOT NULL DEFAULT false,
  accepted_terms boolean NOT NULL DEFAULT false,
  accepted_privacy boolean NOT NULL DEFAULT false,
  kyc_consent boolean NOT NULL DEFAULT false,
  understood_approval boolean NOT NULL DEFAULT false,
  terms_version text NOT NULL,
  privacy_version text NOT NULL,
  consent_ip text,
  app_version text,
  consented_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.guide_consents TO authenticated;
GRANT ALL ON public.guide_consents TO service_role;

ALTER TABLE public.guide_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides manage own consent - select"
ON public.guide_consents FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Guides manage own consent - insert"
ON public.guide_consents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guides manage own consent - update"
ON public.guide_consents FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all consents"
ON public.guide_consents FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TRIGGER trg_guide_consents_updated_at
BEFORE UPDATE ON public.guide_consents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_guide_consents_guide_id ON public.guide_consents(guide_id);
