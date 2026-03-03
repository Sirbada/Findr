-- Findr Database Schema - Missing Tables
-- Execute this in Supabase Dashboard > SQL Editor

-- 1. Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Booking details
  check_in DATE NOT NULL,
  check_out DATE,
  monthly_rent NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  service_fee NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  -- Messages
  tenant_message TEXT,
  landlord_response TEXT,
  
  -- Contract
  contract_signed_tenant TIMESTAMP,
  contract_signed_landlord TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Payment details
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'XAF',
  type TEXT CHECK (type IN ('deposit', 'rent', 'refund', 'commission')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired')),
  
  -- Provider details
  payment_method TEXT CHECK (payment_method IN ('momo', 'orange_money', 'paypal', 'bank')),
  payment_reference TEXT,
  provider_transaction_id TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Review content
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  response TEXT,
  response_at TIMESTAMP,
  
  -- Moderation
  is_verified BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Review votes table (for helpful/not helpful)
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT CHECK (vote IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_landlord ON bookings(landlord_id);

CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(payment_reference);

CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

-- Enable Row Level Security (RLS) 
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY; 
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see their own data)
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Users can create bookings" ON bookings  
  FOR INSERT WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (tenant_id = auth.uid() OR landlord_id = auth.uid());

CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can vote on reviews" ON review_votes
  FOR ALL USING (user_id = auth.uid());