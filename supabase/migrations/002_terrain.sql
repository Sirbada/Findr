-- Migration 002: Add terrain category, terrain fields, and GPS coordinates

-- 1. Update category constraint to include 'terrain'
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_category_check;
ALTER TABLE listings ADD CONSTRAINT listings_category_check 
  CHECK (category IN ('housing', 'cars', 'terrain', 'jobs', 'services'));

-- 2. Add terrain-specific fields
ALTER TABLE listings ADD COLUMN IF NOT EXISTS terrain_type TEXT CHECK (terrain_type IN ('constructible', 'agricole', 'commercial'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS zoning TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title_deed BOOLEAN DEFAULT false;

-- 3. Add GPS coordinates
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
