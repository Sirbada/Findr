-- =============================================
-- FINDR - Phase 1: Alerts & Verification System
-- Migration 004: Create tables for alerts and agent verification
-- =============================================

-- ============================================
-- ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Search criteria
  category TEXT NOT NULL CHECK (category IN ('housing', 'cars', 'jobs')),
  city TEXT NOT NULL,
  min_price BIGINT DEFAULT 0,
  max_price BIGINT DEFAULT 999999999,
  rooms_min INTEGER DEFAULT 0,
  property_type TEXT, -- 'studio', 'apartment', 'villa', etc.
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT VERIFICATIONS TABLE  
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Business info
  business_name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  documents_url TEXT, -- Link to uploaded ID/license documents
  
  -- Verification status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  admin_notes TEXT, -- Notes from admin reviewer
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LISTING CONTACTS TABLE (Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.listing_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  
  -- Contact info (anonymous analytics)
  contact_method TEXT NOT NULL CHECK (contact_method IN ('whatsapp', 'phone', 'email')),
  contacted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Optional: Store hashed IP for rate limiting analytics (GDPR-compliant)
  ip_hash TEXT
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_alerts_user ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.alerts(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_alerts_category ON public.alerts(category);
CREATE INDEX IF NOT EXISTS idx_alerts_city ON public.alerts(city);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON public.alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verifications_user ON public.agent_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON public.agent_verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created ON public.agent_verifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_listing ON public.listing_contacts(listing_id);
CREATE INDEX IF NOT EXISTS idx_contacts_method ON public.listing_contacts(contact_method);
CREATE INDEX IF NOT EXISTS idx_contacts_date ON public.listing_contacts(contacted_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_contacts ENABLE ROW LEVEL SECURITY;

-- Alerts: Users can manage their own alerts
CREATE POLICY "Users manage own alerts" ON public.alerts
  FOR ALL USING (auth.uid() = user_id);

-- Agent verifications: Users can manage their own verification
CREATE POLICY "Users manage own verification" ON public.agent_verifications
  FOR ALL USING (auth.uid() = user_id);

-- Admin can see all verifications (requires admin role check in app)
CREATE POLICY "Admins see all verifications" ON public.agent_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Listing contacts: Anonymous insert for analytics, listing owners can view their stats
CREATE POLICY "Anonymous contact logging" ON public.listing_contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Listing owners see contact stats" ON public.listing_contacts
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_alerts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_alerts();

CREATE TRIGGER agent_verifications_updated_at
  BEFORE UPDATE ON public.agent_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_alerts();

-- Function to check if new listings match user alerts
CREATE OR REPLACE FUNCTION public.check_listing_alerts()
RETURNS TRIGGER AS $$
DECLARE
  alert_record RECORD;
  match_count INTEGER := 0;
BEGIN
  -- Only check when new listings are inserted with active status
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    
    -- Find matching alerts
    FOR alert_record IN 
      SELECT * FROM public.alerts 
      WHERE is_active = TRUE 
        AND category = NEW.category
        AND LOWER(city) = LOWER(NEW.city)
        AND (min_price = 0 OR NEW.price >= min_price)
        AND (max_price = 999999999 OR NEW.price <= max_price)
        AND (rooms_min = 0 OR NEW.rooms >= rooms_min OR NEW.rooms IS NULL)
        AND (property_type IS NULL OR NEW.housing_type = property_type)
    LOOP
      match_count := match_count + 1;
      
      -- TODO: Here you would trigger notifications
      -- For now, we'll just log to a notifications table (to be created)
      -- INSERT INTO notifications (user_id, type, listing_id, created_at)
      -- VALUES (alert_record.user_id, 'listing_match', NEW.id, NOW());
      
    END LOOP;
    
    -- Log the alert check (optional debug info)
    IF match_count > 0 THEN
      RAISE NOTICE 'New listing % matched % alerts', NEW.id, match_count;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check alerts on new listings
DROP TRIGGER IF EXISTS trigger_check_listing_alerts ON public.listings;
CREATE TRIGGER trigger_check_listing_alerts
  AFTER INSERT OR UPDATE OF status ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.check_listing_alerts();

-- ============================================
-- ADD ADMIN ROLE TO PROFILES (if not exists)
-- ============================================
DO $$ 
BEGIN
  -- Add role column to profiles table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
  END IF;
END $$;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample alert
INSERT INTO public.alerts (user_id, category, city, min_price, max_price, rooms_min, property_type) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- First user in system
  'housing', 
  'douala', 
  100000, 
  250000, 
  2, 
  'apartment'
) ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 
  'Phase 1 migration complete! ✅' as status,
  'Tables created: alerts, agent_verifications, listing_contacts' as tables,
  'Triggers: alert matching on new listings' as automation,
  'RLS: Enabled with appropriate policies' as security;