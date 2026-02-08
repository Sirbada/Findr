-- Extended Findr Database Schema
-- Run this in Supabase SQL Editor after the base schema

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  bio TEXT,
  location TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  is_pro BOOLEAN DEFAULT false,
  verification_level TEXT DEFAULT 'none' CHECK (verification_level IN ('none', 'phone', 'id', 'business')),
  
  -- Stats (updated by triggers)
  listings_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  
  -- Preferences
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  currency TEXT DEFAULT 'XAF' CHECK (currency IN ('XAF', 'EUR', 'USD')),
  notifications_email BOOLEAN DEFAULT true,
  notifications_sms BOOLEAN DEFAULT true,
  
  -- Dates
  joined_date DATE DEFAULT CURRENT_DATE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table for rental bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Booking details
  check_in DATE NOT NULL,
  check_out DATE,
  monthly_rent INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  service_fee INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  -- Messages
  tenant_message TEXT,
  landlord_response TEXT,
  
  -- Contract
  contract_signed_tenant TIMESTAMPTZ,
  contract_signed_landlord TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table for commission tracking
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  booking_id UUID REFERENCES bookings(id),
  seller_id UUID REFERENCES auth.users(id),
  buyer_id UUID REFERENCES auth.users(id),
  
  transaction_type TEXT CHECK (transaction_type IN ('rental', 'sale', 'premium_listing')),
  category TEXT CHECK (category IN ('housing', 'cars', 'jobs')),
  
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'XAF' CHECK (currency IN ('XAF', 'EUR', 'USD')),
  
  commission_seller INTEGER DEFAULT 0,
  commission_buyer INTEGER DEFAULT 0,
  commission_rate_seller DECIMAL(5,2) DEFAULT 0,
  commission_rate_buyer DECIMAL(5,2) DEFAULT 0,
  platform_revenue INTEGER GENERATED ALWAYS AS (
    COALESCE(commission_seller, 0) + COALESCE(commission_buyer, 0)
  ) STORED,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('orange_money', 'mtn_momo', 'wave', 'paypal', 'card', 'cash')),
  payment_reference TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Reviews table for user and listing reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Detailed ratings
  rating_communication INTEGER CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_accuracy INTEGER CHECK (rating_accuracy >= 1 AND rating_accuracy <= 5),
  rating_cleanliness INTEGER CHECK (rating_cleanliness >= 1 AND rating_cleanliness <= 5),
  rating_location INTEGER CHECK (rating_location >= 1 AND rating_location <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  
  -- Metadata
  is_verified BOOLEAN DEFAULT true,
  helpful_votes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(reviewer_id, reviewed_user_id, listing_id)
);

-- Review votes table for helpful votes
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(review_id, user_id)
);

-- Commission settings table for configurable rates
CREATE TABLE IF NOT EXISTS commission_settings (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('housing', 'cars', 'jobs')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('rental', 'sale')),
  seller_rate DECIMAL(5,2) NOT NULL,
  buyer_rate DECIMAL(5,2) NOT NULL,
  min_amount INTEGER,
  max_amount INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(category, transaction_type)
);

-- User verifications table for ID verification tracking
CREATE TABLE IF NOT EXISTS user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_type TEXT CHECK (verification_type IN ('id_card', 'passport', 'phone', 'email', 'address', 'business')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  document_url TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table for saved listings
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, listing_id)
);

-- Messages table for user communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved searches for alerts
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('instant', 'daily', 'weekly', 'none')),
  last_alert TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Public read access, users can update their own
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR ALL USING (auth.uid() = user_id);

-- Bookings: Users can see their own bookings (as tenant or landlord)
CREATE POLICY "Users see own bookings" ON bookings 
  FOR SELECT USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);
CREATE POLICY "Users create bookings as tenant" ON bookings 
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Users update own bookings" ON bookings 
  FOR UPDATE USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- Transactions: Users can see their own transactions
CREATE POLICY "Users see own transactions" ON transactions 
  FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Reviews: Public read, authenticated users can create/update their reviews
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users create own reviews" ON reviews 
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users update own reviews" ON reviews 
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Review votes: Users can vote on reviews
CREATE POLICY "Users can vote on reviews" ON review_votes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users see review votes" ON review_votes FOR SELECT USING (true);

-- Favorites: Users manage their own favorites
CREATE POLICY "Users manage own favorites" ON favorites 
  FOR ALL USING (auth.uid() = user_id);

-- Messages: Users see their sent/received messages
CREATE POLICY "Users see own messages" ON messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Saved searches: Users manage their own searches
CREATE POLICY "Users manage own searches" ON saved_searches 
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(is_verified, verification_level);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);

CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON bookings(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_landlord ON bookings(landlord_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);

CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON favorites(listing_id);

CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, created_at DESC);

-- Insert default commission settings
INSERT INTO commission_settings (category, transaction_type, seller_rate, buyer_rate) VALUES
  ('housing', 'rental', 5.00, 5.00),
  ('housing', 'sale', 2.00, 0.00),
  ('cars', 'rental', 10.00, 5.00),
  ('cars', 'sale', 3.00, 0.00),
  ('jobs', 'sale', 1.00, 0.00)
ON CONFLICT (category, transaction_type) DO NOTHING;

-- Function to update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    listings_count = (
      SELECT COUNT(*) FROM listings 
      WHERE user_id = user_uuid AND status = 'active'
    ),
    reviews_count = (
      SELECT COUNT(*) FROM reviews 
      WHERE reviewed_user_id = user_uuid
    ),
    rating = (
      SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
      FROM reviews 
      WHERE reviewed_user_id = user_uuid
    ),
    updated_at = NOW()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile stats when listings change
CREATE OR REPLACE FUNCTION trigger_update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_profile_stats(NEW.user_id);
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.user_id != NEW.user_id) THEN
    PERFORM update_profile_stats(OLD.user_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_listings_profile_stats
  AFTER INSERT OR UPDATE OR DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION trigger_update_profile_stats();

CREATE TRIGGER trigger_reviews_profile_stats
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_update_profile_stats();

-- Views for analytics

-- Revenue summary view
CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
  DATE_TRUNC('month', completed_at) as month,
  category,
  transaction_type,
  COUNT(*) as transaction_count,
  SUM(amount) as total_volume,
  SUM(platform_revenue) as total_revenue,
  AVG(platform_revenue) as avg_revenue_per_transaction
FROM transactions 
WHERE status = 'completed' AND completed_at IS NOT NULL
GROUP BY DATE_TRUNC('month', completed_at), category, transaction_type
ORDER BY month DESC;

-- Popular listings view
CREATE OR REPLACE VIEW popular_listings AS
SELECT 
  l.*,
  p.full_name as owner_name,
  p.is_verified as owner_verified,
  p.rating as owner_rating,
  COALESCE(r.avg_rating, 0) as listing_rating,
  COALESCE(r.review_count, 0) as review_count,
  COALESCE(f.favorite_count, 0) as favorite_count
FROM listings l
LEFT JOIN profiles p ON l.user_id = p.user_id
LEFT JOIN (
  SELECT 
    listing_id,
    ROUND(AVG(rating)::numeric, 1) as avg_rating,
    COUNT(*) as review_count
  FROM reviews
  WHERE listing_id IS NOT NULL
  GROUP BY listing_id
) r ON l.id = r.listing_id
LEFT JOIN (
  SELECT 
    listing_id,
    COUNT(*) as favorite_count
  FROM favorites
  GROUP BY listing_id
) f ON l.id = f.listing_id
WHERE l.status = 'active'
ORDER BY l.views DESC, f.favorite_count DESC NULLS LAST;

-- Create some demo data
-- This would typically be done through the application, not SQL
-- But including here for testing purposes

-- Demo profiles (linked to demo users in listings)
INSERT INTO profiles (user_id, full_name, avatar_url, bio, location, is_verified, is_pro, verification_level, phone, language) VALUES
  ('demo-user-1', 'Jean-Paul Mbarga', '/avatars/demo1.jpg', 'Agent immobilier spécialisé dans les biens de prestige à Douala. 15 ans d''expérience.', 'Douala, Cameroun', true, true, 'business', '+237699123456', 'fr'),
  ('demo-user-2', 'Marie Nkomo', '/avatars/demo2.jpg', 'Propriétaire de plusieurs appartements meublés. Accueil chaleureux garanti!', 'Yaoundé, Cameroun', true, false, 'id', '+237677987654', 'fr'),
  ('demo-user-3', 'Dr. Samuel Fomba', '/avatars/demo3.jpg', 'Médecin vivant en France, je gère mes propriétés au Cameroun via Findr.', 'Paris, France → Bafoussam, Cameroun', true, false, 'id', '+33612345678', 'fr')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  is_verified = EXCLUDED.is_verified,
  is_pro = EXCLUDED.is_pro,
  verification_level = EXCLUDED.verification_level,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Demo reviews
INSERT INTO reviews (id, reviewer_id, reviewed_user_id, listing_id, rating, title, comment, rating_communication, rating_accuracy, rating_cleanliness, rating_location, rating_value, created_at) VALUES
  ('demo-review-1', 'demo-user-2', 'demo-user-1', (SELECT id FROM listings WHERE title LIKE 'Appartement meublé 2 pièces%' LIMIT 1), 5, 'Excellent service et logement parfait!', 'Jean-Paul est un agent très professionnel. L''appartement était exactement comme décrit, très propre et bien situé. Je recommande vivement!', 5, 5, 5, 5, 4, '2024-01-15 10:00:00+00'),
  ('demo-review-2', 'demo-user-3', 'demo-user-2', (SELECT id FROM listings WHERE title LIKE 'Studio moderne%' LIMIT 1), 5, 'Hôte exceptionnelle', 'Marie est une hôte formidable! Très accueillante et toujours disponible. Son appartement est magnifique et parfaitement équipé.', 5, 5, 5, 4, 5, '2024-01-20 14:30:00+00'),
  ('demo-review-3', 'demo-user-1', 'demo-user-3', (SELECT id FROM listings WHERE title LIKE 'Villa 4 chambres%' LIMIT 1), 4, 'Bon propriétaire, communication fluide', 'Dr. Fomba gère très bien ses biens à distance. Communication claire et rapide. Petit bémol sur l''équipement qui pourrait être plus moderne.', 5, 4, 4, 4, 4, '2024-02-01 09:15:00+00')
ON CONFLICT (id) DO NOTHING;

-- Update profile stats for demo users
SELECT update_profile_stats('demo-user-1');
SELECT update_profile_stats('demo-user-2');
SELECT update_profile_stats('demo-user-3');