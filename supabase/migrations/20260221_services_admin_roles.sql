-- Findr migration: services (pro jobs) + roles/admin scaffolding
-- Run this in Supabase SQL Editor after base schema

BEGIN;

-- 1) Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('user', 'pro', 'admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Only super_admin can manage roles
CREATE POLICY "Super admin manage roles" ON public.user_roles
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- 2) Services vertical (professionals)
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  neighborhoods TEXT[] DEFAULT '{}',
  service_area_radius_km INTEGER DEFAULT 0,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  images TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  pricing_type TEXT NOT NULL DEFAULT 'quote' CHECK (pricing_type IN ('quote')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  is_verified BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Requests for quotes (users asking pros)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.service_listings(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'accepted', 'declined', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quotes from pros
CREATE TABLE IF NOT EXISTS public.service_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  pro_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service bookings (created when user accepts a quote)
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES public.service_quotes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pro_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  total_price INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XAF',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_listings_city ON public.service_listings(city);
CREATE INDEX IF NOT EXISTS idx_service_listings_status ON public.service_listings(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_user ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_service ON public.service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_quotes_request ON public.service_quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_user ON public.service_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_pro ON public.service_bookings(pro_id);

-- Seed categories (optional)
INSERT INTO public.service_categories (name, slug, icon)
VALUES
  ('Plombier', 'plombier', 'wrench'),
  ('Électricien', 'electricien', 'zap'),
  ('Climatisation', 'clim', 'snowflake'),
  ('Ménage', 'menage', 'sparkles'),
  ('Peinture', 'peinture', 'brush'),
  ('Sécurité', 'securite', 'shield')
ON CONFLICT (slug) DO NOTHING;

-- RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Public can read service categories and active listings
CREATE POLICY "Public read service categories" ON public.service_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read active service listings" ON public.service_listings
  FOR SELECT USING (status = 'active');

-- Pros manage their own service listings
CREATE POLICY "Pros manage own service listings" ON public.service_listings
  FOR ALL USING (auth.uid() = pro_id) WITH CHECK (auth.uid() = pro_id);

-- Requests: users can create/read own; pros can read requests for their services
CREATE POLICY "Users create requests" ON public.service_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own requests" ON public.service_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Pros read requests for own services" ON public.service_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_listings s
      WHERE s.id = service_requests.service_id AND s.pro_id = auth.uid()
    )
  );

CREATE POLICY "Users update own requests" ON public.service_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Quotes: pros create; user and pro can read; user can accept/reject
CREATE POLICY "Pros create quotes" ON public.service_quotes
  FOR INSERT WITH CHECK (auth.uid() = pro_id);

CREATE POLICY "User or pro read quotes" ON public.service_quotes
  FOR SELECT USING (
    auth.uid() = pro_id OR
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = service_quotes.request_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "User update quote status" ON public.service_quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.service_requests r
      WHERE r.id = service_quotes.request_id AND r.user_id = auth.uid()
    )
  );

-- Bookings: user and pro can read; user can create when accepting
CREATE POLICY "User create booking" ON public.service_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User or pro read bookings" ON public.service_bookings
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = pro_id);

CREATE POLICY "User or pro update bookings" ON public.service_bookings
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = pro_id);

COMMIT;
