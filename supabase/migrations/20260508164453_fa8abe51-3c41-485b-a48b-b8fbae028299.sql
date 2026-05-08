
-- ROLE ENUM (kept as text per spec, but enforced via check)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'seeker' check (role in ('seeker','guide','admin')),
  language_preference text default 'en',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guide_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  full_name text not null,
  city text not null,
  languages text[] not null,
  category text not null,
  description text,
  price_per_day numeric,
  availability text,
  photo_url text,
  is_approved boolean not null default false,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  guide_id uuid not null references public.guide_profiles(id) on delete cascade,
  date date not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_guide_profiles_updated before update on public.guide_profiles
  for each row execute function public.set_updated_at();
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

-- Security definer helper to check role without recursion
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = _user_id and role = _role);
$$;

-- Auto-create profile on auth user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, language_preference)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'role',''), 'seeker'),
    coalesce(nullif(new.raw_user_meta_data->>'language_preference',''), 'en')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.guide_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;

-- profiles policies
create policy "Profiles: users can view their own"
  on public.profiles for select using (auth.uid() = id);
create policy "Profiles: admins can view all"
  on public.profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "Profiles: users can update their own"
  on public.profiles for update using (auth.uid() = id);
create policy "Profiles: admins can update all"
  on public.profiles for update using (public.has_role(auth.uid(), 'admin'));

-- guide_profiles policies
create policy "Guides: anyone can view approved"
  on public.guide_profiles for select using (is_approved = true);
create policy "Guides: owner can view own"
  on public.guide_profiles for select using (auth.uid() = user_id);
create policy "Guides: admin can view all"
  on public.guide_profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "Guides: owner can insert own"
  on public.guide_profiles for insert with check (auth.uid() = user_id);
create policy "Guides: owner can update own"
  on public.guide_profiles for update using (auth.uid() = user_id);
create policy "Guides: admin can update all"
  on public.guide_profiles for update using (public.has_role(auth.uid(), 'admin'));

-- bookings policies
create policy "Bookings: seeker can view own"
  on public.bookings for select using (auth.uid() = seeker_id);
create policy "Bookings: guide can view own"
  on public.bookings for select using (
    exists(select 1 from public.guide_profiles g where g.id = guide_id and g.user_id = auth.uid())
  );
create policy "Bookings: admin can view all"
  on public.bookings for select using (public.has_role(auth.uid(), 'admin'));
create policy "Bookings: seeker can create"
  on public.bookings for insert with check (auth.uid() = seeker_id);
create policy "Bookings: seeker can update own"
  on public.bookings for update using (auth.uid() = seeker_id);
create policy "Bookings: guide can update own"
  on public.bookings for update using (
    exists(select 1 from public.guide_profiles g where g.id = guide_id and g.user_id = auth.uid())
  );

-- messages policies
create policy "Messages: participants can view"
  on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Messages: sender can insert"
  on public.messages for insert with check (auth.uid() = sender_id);
