-- =============================================
-- FINDR - Meublée Category + Listing Upgrades
-- =============================================

-- Add meublée-specific columns to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  is_meublee BOOLEAN DEFAULT FALSE;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  meublee_type TEXT CHECK (meublee_type IN ('studio', 'f1', 'f2', 'f3', 'f4', 'villa', 'duplex'));

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  min_stay_days INTEGER DEFAULT 30;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  deposit_months INTEGER DEFAULT 2;  -- Kaution = X Monatsmieten

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  available_from DATE;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  available_to DATE;  -- NULL = unbefristet

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  whatsapp_number TEXT;  -- Direct contact

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  accepts_diaspora BOOLEAN DEFAULT TRUE;  -- Accepts remote booking from abroad

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  has_caretaker BOOLEAN DEFAULT FALSE;  -- Local person managing the property

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  caretaker_phone TEXT;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  utilities_included BOOLEAN DEFAULT FALSE;  -- Eau, électricité inclus

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS
  monthly_charges BIGINT DEFAULT 0;  -- Charges mensuelles (eau, élec, gardien)

-- Index for meublée filter
CREATE INDEX IF NOT EXISTS idx_listings_meublee ON public.listings(is_meublee) WHERE is_meublee = TRUE;
CREATE INDEX IF NOT EXISTS idx_listings_diaspora ON public.listings(accepts_diaspora) WHERE accepts_diaspora = TRUE;

-- Demo: Update existing furnished listings to meublée
UPDATE public.listings 
SET is_meublee = TRUE, 
    meublee_type = CASE 
      WHEN rooms = 1 THEN 'studio'
      WHEN rooms = 2 THEN 'f2'
      WHEN rooms = 3 THEN 'f3'
      WHEN rooms >= 4 THEN 'villa'
      ELSE 'studio'
    END,
    deposit_months = 2,
    accepts_diaspora = TRUE,
    min_stay_days = 30
WHERE furnished = TRUE AND category = 'housing';

SELECT 'Meublée upgrade complete!' as status;
