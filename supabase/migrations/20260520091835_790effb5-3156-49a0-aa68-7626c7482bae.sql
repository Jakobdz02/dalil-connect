CREATE POLICY "Profiles: users can create their own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);