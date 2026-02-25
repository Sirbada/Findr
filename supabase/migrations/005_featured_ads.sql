-- Featured Ads and Monetization System Migration
-- Created: 2026-02-08
-- Purpose: Add paid listing promotion with Mobile Money payment integration

-- Featured listings table
CREATE TABLE featured_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium', 'spotlight')),
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  amount_fcfa INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('momo_mtn', 'momo_orange', 'card', 'free_trial')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired', 'refunded')),
  payment_reference TEXT, -- Mobile Money transaction ID
  boost_metrics JSONB DEFAULT '{}', -- Analytics data
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure no overlapping active featured periods for same listing
CREATE UNIQUE INDEX idx_featured_no_overlap 
ON featured_listings (listing_id) 
WHERE payment_status = 'paid' AND ends_at > now();

-- Index for efficient homepage queries
CREATE INDEX idx_featured_active_spotlight 
ON featured_listings (plan, ends_at DESC) 
WHERE payment_status = 'paid' AND ends_at > now();

-- View for currently active featured listings
CREATE VIEW active_featured_listings AS
SELECT 
  fl.*,
  l.title,
  l.price,
  l.category,
  l.images
FROM featured_listings fl
JOIN listings l ON fl.listing_id = l.id
WHERE 
  fl.payment_status = 'paid' 
  AND fl.ends_at > now()
  AND l.status = 'active';

-- Pricing plans reference table
CREATE TABLE featured_plans (
  plan_id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price_fcfa INTEGER NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert pricing plans
INSERT INTO featured_plans (plan_id, name_fr, name_en, duration_days, price_fcfa, features) VALUES
('basic', 'En vedette', 'Featured', 7, 2000, '{"badge": true, "priority_boost": 1}'),
('premium', 'Premium', 'Premium', 14, 5000, '{"badge": true, "priority_boost": 2, "category_top": true}'),
('spotlight', 'Spotlight', 'Spotlight', 30, 10000, '{"badge": true, "priority_boost": 3, "category_top": true, "homepage_featured": true}');

-- Payment transactions log
CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  featured_listing_id UUID REFERENCES featured_listings(id),
  provider TEXT NOT NULL, -- 'mtn_momo', 'orange_money'
  external_reference TEXT, -- Provider transaction ID
  amount_fcfa INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  provider_response JSONB,
  webhook_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active featured listings
CREATE POLICY "Public featured read" ON featured_listings 
FOR SELECT USING (payment_status = 'paid' AND ends_at > now());

-- Anyone can read pricing plans
CREATE POLICY "Public plans read" ON featured_plans 
FOR SELECT USING (is_active = true);

-- Listing owners can create featured ads for their listings
CREATE POLICY "Owners create featured" ON featured_listings 
FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM listings WHERE id = listing_id)
);

-- Owners can view their own featured listings (any status)
CREATE POLICY "Owners view own featured" ON featured_listings 
FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM listings WHERE id = listing_id)
);

-- Payment transactions - owners only
CREATE POLICY "Owners view own transactions" ON payment_transactions 
FOR SELECT USING (
  auth.uid() = (
    SELECT l.user_id 
    FROM listings l 
    JOIN featured_listings fl ON l.id = fl.listing_id 
    WHERE fl.id = featured_listing_id
  )
);

-- Function to automatically expire featured listings
CREATE OR REPLACE FUNCTION expire_featured_listings()
RETURNS void AS $$
BEGIN
  UPDATE featured_listings 
  SET payment_status = 'expired',
      updated_at = now()
  WHERE payment_status = 'paid' 
    AND ends_at <= now();
END;
$$ LANGUAGE plpgsql;

-- Function to get featured listings for homepage (Spotlight priority)
CREATE OR REPLACE FUNCTION get_homepage_featured(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
  listing_id UUID,
  plan TEXT,
  title TEXT,
  price INTEGER,
  category TEXT,
  images JSONB,
  ends_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    afl.listing_id,
    afl.plan,
    afl.title,
    afl.price,
    afl.category,
    afl.images,
    afl.ends_at
  FROM active_featured_listings afl
  WHERE afl.plan = 'spotlight'
  ORDER BY afl.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE featured_listings IS 'Paid promotion periods for marketplace listings';
COMMENT ON TABLE featured_plans IS 'Available pricing plans for featured ads';
COMMENT ON TABLE payment_transactions IS 'Payment processing history and status';
COMMENT ON VIEW active_featured_listings IS 'Currently active featured listings with details';

-- Note: Cron job for expiry should be set up separately:
-- SELECT cron.schedule('expire-featured', '0 * * * *', 'SELECT expire_featured_listings();');