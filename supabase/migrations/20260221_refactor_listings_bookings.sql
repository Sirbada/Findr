-- Findr migration: refactor listings into properties/vehicles and add bookings/availability
-- Run this in Supabase SQL Editor

BEGIN;

-- Required for exclusion constraints on date ranges
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1) Rename legacy listings table to preserve existing data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'listings'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'listings_legacy'
  ) THEN
    EXECUTE 'ALTER TABLE public.listings RENAME TO listings_legacy';
  END IF;
END $$;

-- 2) Create properties table (hotels/apartments)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,

  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'studio', 'villa', 'hotel_room', 'guest_house', 'compound')),
  price_per_night INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  bedrooms INTEGER,
  bathrooms INTEGER,
  surface_m2 INTEGER,
  max_guests INTEGER,
  furnished BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  check_in_time TEXT,
  check_out_time TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Create vehicles table (cars)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,

  brand TEXT,
  model TEXT,
  year INTEGER,
  price_per_day INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  fuel_type TEXT,
  transmission TEXT,
  seats INTEGER,
  mileage_km INTEGER,
  extras TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  property_id UUID REFERENCES public.properties(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (start_date < end_date),
  CHECK (
    (property_id IS NOT NULL AND vehicle_id IS NULL)
    OR (property_id IS NULL AND vehicle_id IS NOT NULL)
  )
);

-- 5) Availability table (calendar blocks)
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_blocked BOOLEAN NOT NULL DEFAULT true,
  reason TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (start_date < end_date),
  CHECK (
    (property_id IS NOT NULL AND vehicle_id IS NULL)
    OR (property_id IS NULL AND vehicle_id IS NOT NULL)
  )
);

-- Prevent overlapping availability ranges per property/vehicle
ALTER TABLE public.availability
  ADD CONSTRAINT availability_no_overlap_property
  EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
  WHERE (property_id IS NOT NULL);

ALTER TABLE public.availability
  ADD CONSTRAINT availability_no_overlap_vehicle
  EXCLUDE USING gist (
    vehicle_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
  WHERE (vehicle_id IS NOT NULL);

-- 6) Indexes
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_created ON public.properties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vehicles_city ON public.vehicles(city);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON public.vehicles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_created ON public.vehicles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_availability_property ON public.availability(property_id);
CREATE INDEX IF NOT EXISTS idx_availability_vehicle ON public.availability(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_availability_dates ON public.availability(start_date, end_date);

-- 7) RLS policies
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Public can read active properties/vehicles
CREATE POLICY "Public read active properties" ON public.properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public read active vehicles" ON public.vehicles
  FOR SELECT USING (status = 'active');

-- Owners can manage their own properties/vehicles
CREATE POLICY "Owners manage properties" ON public.properties
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners manage vehicles" ON public.vehicles
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Bookings: users can see and manage their own
CREATE POLICY "Users read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Availability: only listing owners can create/update/delete
CREATE POLICY "Owners read availability" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Owners manage availability for properties" ON public.availability
  FOR ALL USING (
    property_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = availability.property_id AND p.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    property_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = availability.property_id AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners manage availability for vehicles" ON public.availability
  FOR ALL USING (
    vehicle_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = availability.vehicle_id AND v.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    vehicle_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.vehicles v
      WHERE v.id = availability.vehicle_id AND v.owner_id = auth.uid()
    )
  );

-- 8) Optional: migrate legacy listings data into new tables
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'listings_legacy'
  ) THEN
    INSERT INTO public.properties (
      owner_id, title, description, city, neighborhood, images, status, is_featured, is_verified, views,
      property_type, price_per_night, currency, bedrooms, bathrooms, surface_m2, max_guests, furnished, amenities
    )
    SELECT
      user_id, title, description, city, neighborhood, images, status, is_featured, is_verified, views,
      COALESCE(housing_type, 'apartment'), COALESCE(price, 0), 'XAF', rooms, bathrooms, surface_m2, NULL, furnished, amenities
    FROM public.listings_legacy
    WHERE category = 'housing';

    INSERT INTO public.vehicles (
      owner_id, title, description, city, neighborhood, images, status, is_featured, is_verified, views,
      brand, model, year, price_per_day, currency, fuel_type, transmission, seats
    )
    SELECT
      user_id, title, description, city, neighborhood, images, status, is_featured, is_verified, views,
      car_brand, car_model, car_year, COALESCE(price_per_day, 0), 'XAF', fuel_type, transmission, seats
    FROM public.listings_legacy
    WHERE category = 'cars';
  END IF;
END $$;

COMMIT;
