-- Findr Schema: listings table
-- Run this in Supabase SQL Editor

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('housing', 'cars', 'jobs')),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  city TEXT NOT NULL,
  neighborhood TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  
  -- Housing fields
  housing_type TEXT,
  rental_period TEXT,
  rooms INTEGER,
  bathrooms INTEGER,
  surface_m2 INTEGER,
  furnished BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  
  -- Cars fields
  car_brand TEXT,
  car_model TEXT,
  car_year INTEGER,
  price_per_day INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  seats INTEGER,
  
  -- Jobs fields
  job_type TEXT,
  company_name TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  
  -- Metadata
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public can read active listings
CREATE POLICY "Public read active listings" ON listings
  FOR SELECT USING (status = 'active');

-- Authenticated users can insert their own listings
CREATE POLICY "Users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);

-- Optional: Add some test data
INSERT INTO listings (category, title, price, city, neighborhood, status, housing_type, rooms, bathrooms, surface_m2, furnished, amenities)
VALUES 
  ('housing', 'Appartement meublé 2 pièces - Bonanjo', 150000, 'Douala', 'Bonanjo', 'active', 'apartment', 2, 1, 45, true, ARRAY['wifi', 'parking', 'security']),
  ('housing', 'Studio moderne - Bastos', 80000, 'Yaoundé', 'Bastos', 'active', 'studio', 1, 1, 25, true, ARRAY['wifi', 'ac']),
  ('housing', 'Villa 4 chambres avec piscine', 500000, 'Douala', 'Bonapriso', 'active', 'villa', 4, 3, 200, true, ARRAY['pool', 'garden', 'security', 'parking']);

INSERT INTO listings (category, title, price, city, neighborhood, status, car_brand, car_model, car_year, price_per_day, fuel_type, transmission, seats)
VALUES
  ('cars', 'Toyota Corolla 2022 - Location journalière', 0, 'Douala', 'Akwa', 'active', 'Toyota', 'Corolla', 2022, 25000, 'essence', 'automatic', 5),
  ('cars', 'Mercedes Classe C - Occasion', 15000000, 'Yaoundé', 'Centre', 'active', 'Mercedes', 'Classe C', 2020, NULL, 'diesel', 'automatic', 5);
