-- =============================================
-- FINDR - Complete Database Setup + Demo Data
-- Run this ONCE in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TYPES
-- ============================================
DO $$ BEGIN
  CREATE TYPE listing_category AS ENUM ('housing', 'cars', 'jobs');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold', 'expired');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE housing_type AS ENUM ('apartment', 'house', 'studio', 'land', 'commercial', 'room');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE rental_period AS ENUM ('day', 'week', 'month', 'year', 'sale');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category listing_category NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  currency TEXT DEFAULT 'XAF',
  
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  
  images TEXT[] DEFAULT '{}',
  
  status listing_status DEFAULT 'active',
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  
  housing_type housing_type,
  rental_period rental_period,
  rooms INTEGER,
  bathrooms INTEGER,
  surface_m2 INTEGER,
  furnished BOOLEAN DEFAULT FALSE,
  amenities TEXT[] DEFAULT '{}',
  
  car_brand TEXT,
  car_model TEXT,
  car_year INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  seats INTEGER,
  price_per_day BIGINT,
  
  job_type TEXT,
  company_name TEXT,
  salary_min BIGINT,
  salary_max BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);

-- ============================================
-- DEMO USER
-- ============================================
INSERT INTO public.profiles (id, email, phone, full_name, is_verified)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@findr.cm',
  '+237 6 99 00 00 00',
  'Findr Demo',
  true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO LISTINGS - HOUSING (6)
-- ============================================
INSERT INTO public.listings (user_id, category, title, description, price, city, neighborhood, rooms, bathrooms, surface_m2, housing_type, rental_period, furnished, is_featured, is_verified, images, amenities) VALUES

-- 1. Appartement Bonanjo
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Appartement moderne à Bonanjo',
  'Magnifique appartement de 3 pièces entièrement rénové. Cuisine équipée, salon spacieux, 2 chambres avec placards intégrés. Parking sécurisé inclus. Proche des commerces et transports.',
  250000,
  'Douala',
  'Bonanjo',
  3,
  2,
  85,
  'apartment',
  'month',
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  ARRAY['Parking', 'Sécurité 24h', 'Eau chaude', 'Climatisation']
),

-- 2. Studio Bastos
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Studio meublé à Bastos',
  'Charmant studio tout équipé dans le quartier résidentiel de Bastos. Idéal pour expatrié ou jeune professionnel. Internet haut débit inclus.',
  150000,
  'Yaoundé',
  'Bastos',
  1,
  1,
  35,
  'studio',
  'month',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800'],
  ARRAY['WiFi', 'Meublé', 'Climatisation']
),

-- 3. Villa Akwa
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Villa avec jardin à Akwa',
  'Superbe villa de standing avec grand jardin arboré. 5 chambres, 3 salles de bain, salon double, cuisine moderne. Dépendance pour gardien. Quartier calme et sécurisé.',
  500000,
  'Douala',
  'Akwa',
  5,
  3,
  200,
  'house',
  'month',
  false,
  true,
  false,
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
  ARRAY['Jardin', 'Parking', 'Gardien', 'Groupe électrogène']
),

-- 4. Chambre Makepe
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Chambre à louer à Makepe',
  'Chambre propre et spacieuse dans une colocation. Accès cuisine et salon partagés. Ambiance conviviale. Proche université et commerces.',
  50000,
  'Douala',
  'Makepe',
  1,
  1,
  15,
  'room',
  'month',
  false,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
  ARRAY['Cuisine partagée', 'WiFi']
),

-- 5. Terrain Kribi
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Terrain 500m² à Kribi',
  'Terrain viabilisé à 800m de la plage. Titre foncier disponible. Idéal pour construction villa ou investissement touristique.',
  15000000,
  'Kribi',
  'Centre',
  0,
  0,
  500,
  'land',
  'sale',
  false,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'],
  ARRAY['Titre foncier', 'Eau', 'Électricité proche']
),

-- 6. Appartement Bonapriso
(
  '00000000-0000-0000-0000-000000000001',
  'housing',
  'Bel appartement à Bonapriso',
  '2 pièces lumineux avec balcon. Vue dégagée, quartier prisé. Gardiennage, parking. Proche ambassades et restaurants.',
  180000,
  'Douala',
  'Bonapriso',
  2,
  1,
  60,
  'apartment',
  'month',
  true,
  false,
  true,
  ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b25d9?w=800'],
  ARRAY['Balcon', 'Parking', 'Gardien', 'Climatisation']
);

-- ============================================
-- DEMO LISTINGS - CARS (2)
-- ============================================
INSERT INTO public.listings (user_id, category, title, description, price, city, neighborhood, car_brand, car_model, car_year, fuel_type, transmission, seats, price_per_day, is_featured, is_verified, images) VALUES

-- 7. Toyota RAV4
(
  '00000000-0000-0000-0000-000000000001',
  'cars',
  'Toyota RAV4 - Location journalière',
  'SUV confortable et fiable. Climatisation, Bluetooth, GPS. Parfait pour vos déplacements en ville ou voyages. Kilométrage illimité. Assurance incluse.',
  0,
  'Douala',
  'Akwa',
  'Toyota',
  'RAV4',
  2022,
  'petrol',
  'automatic',
  5,
  35000,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=800', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800']
),

-- 8. Mercedes Classe E
(
  '00000000-0000-0000-0000-000000000001',
  'cars',
  'Mercedes Classe E avec chauffeur',
  'Berline de luxe pour vos événements, mariages, voyages d''affaires. Chauffeur professionnel inclus. Confort premium garanti.',
  0,
  'Yaoundé',
  'Centre-ville',
  'Mercedes',
  'Classe E',
  2021,
  'diesel',
  'automatic',
  5,
  75000,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']
);

-- ============================================
-- DEMO LISTINGS - JOBS (2)
-- ============================================
INSERT INTO public.listings (user_id, category, title, description, price, city, job_type, company_name, salary_min, salary_max, is_featured, images) VALUES

-- 9. Développeur
(
  '00000000-0000-0000-0000-000000000001',
  'jobs',
  'Développeur Full Stack - Startup Tech',
  'Rejoignez notre équipe dynamique! Nous cherchons un développeur passionné (React, Node.js, PostgreSQL). Télétravail partiel possible. Formation continue.',
  0,
  'Douala',
  'fulltime',
  'TechCam Solutions',
  400000,
  700000,
  true,
  ARRAY['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800']
),

-- 10. Commercial
(
  '00000000-0000-0000-0000-000000000001',
  'jobs',
  'Commercial terrain - Secteur immobilier',
  'Agence immobilière recherche commercial(e) motivé(e). Expérience vente souhaitée. Commissions attractives + salaire de base. Véhicule fourni.',
  0,
  'Yaoundé',
  'fulltime',
  'Immo Plus Cameroun',
  150000,
  500000,
  false,
  ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800']
);

-- ============================================
-- Done! 🎉
-- ============================================
SELECT 'Setup complete! ' || COUNT(*) || ' listings created.' as status FROM public.listings;
