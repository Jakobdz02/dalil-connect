-- Add date_of_birth and age_verified to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS age_verified boolean NOT NULL DEFAULT false;

-- Add subcategory to guide_profiles
ALTER TABLE public.guide_profiles
  ADD COLUMN IF NOT EXISTS subcategory text;

-- Update handle_new_user to capture date_of_birth from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
begin
  insert into public.profiles (id, name, email, role, language_preference, date_of_birth)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'role',''), 'seeker'),
    coalesce(nullif(new.raw_user_meta_data->>'language_preference',''), 'en'),
    nullif(new.raw_user_meta_data->>'date_of_birth','')::date
  );
  return new;
end;
$function$;

-- RLS: guide profile creation requires age >= 18
CREATE POLICY "Guides: must be 18+"
  ON public.guide_profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.date_of_birth IS NOT NULL
        AND date_part('year', age(p.date_of_birth)) >= 18
    )
  );