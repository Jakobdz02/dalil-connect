
-- Create dedicated admin user with fixed credentials
DO $$
DECLARE
  admin_email text := 'dalil.admin@dalil.app';
  admin_password text := 'dz2026guide&@357';
  admin_uid uuid;
  existing_uid uuid;
BEGIN
  SELECT id INTO existing_uid FROM auth.users WHERE email = admin_email;

  IF existing_uid IS NULL THEN
    admin_uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token,
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_uid, 'authenticated', 'authenticated', admin_email,
      crypt(admin_password, gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Dalil Admin","role":"admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_uid,
      jsonb_build_object('sub', admin_uid::text, 'email', admin_email),
      'email', admin_uid::text, now(), now(), now());
  ELSE
    admin_uid := existing_uid;
    UPDATE auth.users
    SET encrypted_password = crypt(admin_password, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = admin_uid;
  END IF;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (admin_uid, 'Dalil Admin', admin_email, 'admin')
  ON CONFLICT (id) DO UPDATE
    SET role = 'admin', name = 'Dalil Admin';
END $$;
