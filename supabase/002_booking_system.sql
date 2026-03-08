-- =============================================
-- FINDR - Booking System for Meublée Rentals
-- Diaspora → Cameroon Rental Flow
-- =============================================

-- ============================================
-- TYPES
-- ============================================
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending',      -- Mieter hat angefragt
    'confirmed',    -- Vermieter hat bestätigt
    'deposit_paid', -- Kaution bezahlt (Escrow)
    'active',       -- Check-in erfolgt, Mietvertrag läuft
    'completed',    -- Mietzeit abgelaufen, ausgecheckt
    'cancelled',    -- Storniert
    'disputed'      -- Streitfall
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending',
    'escrow',       -- Geld gehalten (Kaution)
    'released',     -- An Vermieter ausgezahlt
    'refunded',     -- An Mieter zurück
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_currency AS ENUM ('XAF', 'EUR', 'USD');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- LANDLORD PROFILES (Vermieter/Diaspora)
-- ============================================
CREATE TABLE IF NOT EXISTS public.landlord_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Diaspora info
  country_of_residence TEXT,          -- 'DE', 'FR', 'US', 'CM'
  is_diaspora BOOLEAN DEFAULT FALSE,
  
  -- Payout preferences
  payout_currency payout_currency DEFAULT 'XAF',
  payout_method TEXT,                 -- 'bank_transfer', 'momo', 'orange_money'
  payout_details JSONB,              -- Bank IBAN, MoMo number etc.
  
  -- Verification
  id_verified BOOLEAN DEFAULT FALSE,
  business_registered BOOLEAN DEFAULT FALSE,
  
  -- Stats
  total_listings INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  landlord_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Dates
  check_in DATE NOT NULL,
  check_out DATE,                    -- NULL = open-ended (monthly)
  duration_months INTEGER DEFAULT 1,
  
  -- Financial
  monthly_rent BIGINT NOT NULL,       -- in XAF
  deposit_amount BIGINT NOT NULL,     -- Kaution (usually 2x rent)
  service_fee BIGINT DEFAULT 0,       -- Findr commission (5%)
  total_amount BIGINT NOT NULL,       -- First payment: rent + deposit + fee
  currency TEXT DEFAULT 'XAF',
  
  -- Status
  status booking_status DEFAULT 'pending',
  
  -- Payment tracking
  deposit_status payment_status DEFAULT 'pending',
  deposit_paid_at TIMESTAMPTZ,
  deposit_released_at TIMESTAMPTZ,
  
  -- Contract
  contract_url TEXT,                  -- PDF contract link
  contract_signed_tenant BOOLEAN DEFAULT FALSE,
  contract_signed_landlord BOOLEAN DEFAULT FALSE,
  
  -- Notes
  tenant_message TEXT,               -- "Bonjour, je suis intéressé..."
  landlord_response TEXT,
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MONTHLY PAYMENTS (Recurring rent)
-- ============================================
CREATE TABLE IF NOT EXISTS public.rental_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  period_start DATE NOT NULL,         -- e.g. 2026-03-01
  period_end DATE NOT NULL,           -- e.g. 2026-03-31
  amount BIGINT NOT NULL,             -- Monthly rent in XAF
  
  status payment_status DEFAULT 'pending',
  payment_method TEXT,                -- 'orange_money', 'mtn_momo', 'voltpay'
  payment_reference TEXT,             -- Transaction ID
  
  paid_at TIMESTAMPTZ,
  payout_to_landlord_at TIMESTAMPTZ,  -- When landlord received the money
  payout_currency payout_currency DEFAULT 'XAF',
  payout_amount BIGINT,              -- Amount in landlord's currency
  payout_rate NUMERIC(10,4),         -- FX rate if EUR (655.957)
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewee_id UUID REFERENCES public.profiles(id),
  
  role TEXT NOT NULL CHECK (role IN ('tenant', 'landlord')),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(booking_id, role)  -- One review per role per booking
);

-- ============================================
-- AVAILABILITY CALENDAR
-- ============================================
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,  -- FALSE = blocked
  price_override BIGINT,              -- Special price for this period
  min_stay_days INTEGER DEFAULT 30,   -- Minimum stay
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (date_to >= date_from)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON public.bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_landlord ON public.bookings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON public.bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.rental_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.rental_payments(status);
CREATE INDEX IF NOT EXISTS idx_availability_listing ON public.availability(listing_id);
CREATE INDEX IF NOT EXISTS idx_availability_dates ON public.availability(date_from, date_to);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_landlord_user ON public.landlord_profiles(user_id);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_profiles ENABLE ROW LEVEL SECURITY;

-- Bookings: Tenant and landlord can see their own
CREATE POLICY "Users see own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Tenants can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Landlords can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = landlord_id OR auth.uid() = tenant_id);

-- Payments: Booking participants can view
CREATE POLICY "Booking participants see payments" ON public.rental_payments
  FOR SELECT USING (
    booking_id IN (SELECT id FROM public.bookings WHERE tenant_id = auth.uid() OR landlord_id = auth.uid())
  );

-- Reviews: Public read, authenticated write
CREATE POLICY "Public read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Booking participants write reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Availability: Public read, owner write
CREATE POLICY "Public read availability" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Owners manage availability" ON public.availability
  FOR ALL USING (
    listing_id IN (SELECT id FROM public.listings WHERE user_id = auth.uid())
  );

-- Landlord profiles: Own profile only
CREATE POLICY "Users see own landlord profile" ON public.landlord_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate service fee (5%)
CREATE OR REPLACE FUNCTION calculate_service_fee(rent BIGINT)
RETURNS BIGINT AS $$
BEGIN
  RETURN CEIL(rent * 0.05);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Done! 🎉
-- ============================================
SELECT 'Booking system ready! Tables: bookings, rental_payments, reviews, availability, landlord_profiles' as status;
