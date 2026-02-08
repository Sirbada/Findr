-- ============================================
-- Findr Marketplace - Initial Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  city text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', new.phone, '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. LISTINGS TABLE
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category text not null check (category in ('cars', 'housing', 'services', 'jobs')),
  price numeric default 0,
  currency text default 'XAF',
  city text,
  neighborhood text,
  images text[] default '{}',
  whatsapp_number text,
  is_active boolean default true,
  is_featured boolean default false,
  is_verified boolean default false,
  views integer default 0,
  -- Housing fields
  housing_type text,
  rental_period text,
  rooms integer,
  bathrooms integer,
  surface_m2 integer,
  furnished boolean default false,
  amenities text[] default '{}',
  -- Car fields
  car_brand text,
  car_model text,
  car_year integer,
  fuel_type text,
  transmission text,
  seats integer,
  price_per_day numeric,
  -- Job fields
  job_type text,
  company_name text,
  salary_min numeric,
  salary_max numeric,
  -- Meta
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.listings enable row level security;

create policy "Anyone can view active listings"
  on public.listings for select using (is_active = true or auth.uid() = user_id);

create policy "Authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on public.listings for update using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- Index for common queries
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_city on public.listings(city);
create index if not exists idx_listings_active on public.listings(is_active);
create index if not exists idx_listings_user on public.listings(user_id);

-- 3. FAVORITES TABLE
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  listing_id uuid references public.listings on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete using (auth.uid() = user_id);

-- 4. STORAGE BUCKET for listing images
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Anyone can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- DONE! 
-- Next: Go to Auth > Settings > Enable "Confirm email"
-- ============================================
