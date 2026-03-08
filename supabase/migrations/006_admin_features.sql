-- Admin Features Migration
-- Erweitert bestehende Tabellen um Admin-Features

-- Erweitere listings Tabelle
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;

-- Erweitere profiles Tabelle  
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS listing_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_role VARCHAR DEFAULT NULL CHECK (admin_role IN (NULL, 'admin', 'moderator', 'support'));

-- Reports Tabelle für Meldungen
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
    reason VARCHAR NOT NULL CHECK (reason IN ('spam', 'fraud', 'inappropriate', 'fake', 'duplicate', 'other')),
    description TEXT,
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    handled_by UUID REFERENCES profiles(id),
    handled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log für Admin-Aktionen
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES profiles(id) NOT NULL,
    action VARCHAR NOT NULL, -- 'approve_listing', 'block_user', 'feature_listing', etc.
    target_type VARCHAR NOT NULL CHECK (target_type IN ('listing', 'user', 'report', 'category', 'system')),
    target_id UUID, -- ID des betroffenen Objekts
    details JSONB, -- Zusätzliche Details der Aktion
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured Listings für Premium Placements
CREATE TABLE IF NOT EXISTS featured_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    plan_type VARCHAR NOT NULL CHECK (plan_type IN ('basic', 'premium', 'top')),
    price_paid DECIMAL(10,2),
    currency VARCHAR DEFAULT 'XAF',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    payment_id VARCHAR, -- Stripe/Payment Provider ID
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews System
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reviewer_id, reviewee_id, listing_id)
);

-- Categories für Admin Management
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    name_fr VARCHAR, -- Französische Übersetzung
    slug VARCHAR UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions für Revenue Tracking
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    listing_id UUID REFERENCES listings(id),
    type VARCHAR NOT NULL CHECK (type IN ('featured_ad', 'premium_subscription', 'commission', 'verification')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR DEFAULT 'XAF',
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_provider VARCHAR CHECK (payment_provider IN ('stripe', 'orange_money', 'mtn_momo', 'manual')),
    provider_transaction_id VARCHAR,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings für Platform Configuration
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blacklisted Words für Auto-Moderation
CREATE TABLE IF NOT EXISTS blacklisted_words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word VARCHAR NOT NULL UNIQUE,
    severity VARCHAR DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    action VARCHAR DEFAULT 'flag' CHECK (action IN ('flag', 'auto_reject', 'shadow_ban')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_blocked ON profiles(is_blocked);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_admin ON activity_log(admin_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, created_at);

-- RLS (Row Level Security) Policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Admins können alles lesen
CREATE POLICY "Admins can read all reports" ON reports FOR SELECT TO authenticated USING (
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins can read activity_log" ON activity_log FOR SELECT TO authenticated USING (
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Users können eigene Reviews lesen/schreiben
CREATE POLICY "Users can read relevant reviews" ON reviews FOR SELECT TO authenticated USING (
    reviewer_id = auth.uid() OR reviewee_id = auth.uid() OR 
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (
    reviewer_id = auth.uid()
);

-- Users können eigene Transaktionen sehen
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Trigger für automatische Updates
CREATE OR REPLACE FUNCTION update_listing_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles SET listing_count = listing_count + 1 WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles SET listing_count = listing_count - 1 WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_listing_count
    AFTER INSERT OR DELETE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_listing_count();

-- Trigger für Last Active Update
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles SET last_active_at = NOW() WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active
    AFTER INSERT ON listings
    FOR EACH ROW EXECUTE FUNCTION update_last_active();

-- Default Categories einfügen
INSERT INTO categories (name, name_fr, slug, sort_order) VALUES
('Immobilier', 'Immobilier', 'immobilier', 1),
('Véhicules', 'Véhicules', 'vehicules', 2),
('Emploi', 'Emploi', 'emploi', 3),
('Services', 'Services', 'services', 4),
('Électronique', 'Électronique', 'electronique', 5),
('Mode', 'Mode', 'mode', 6),
('Animaux', 'Animaux', 'animaux', 7),
('Loisirs', 'Loisirs', 'loisirs', 8)
ON CONFLICT (slug) DO NOTHING;

-- Default Platform Settings
INSERT INTO platform_settings (key, value, description) VALUES
('featured_pricing', '{"basic": 500, "premium": 1000, "top": 2000}', 'Preise für Featured Listings in XAF'),
('max_photos_per_listing', '10', 'Maximale Anzahl Fotos pro Anzeige'),
('auto_approval_threshold', '80', 'Trust Score für automatische Genehmigung'),
('commission_rate', '{"default": 0.02, "premium": 0.015}', 'Kommission in Prozent'),
('listing_duration_days', '30', 'Standard-Laufzeit einer Anzeige'),
('max_listings_per_user', '{"free": 5, "premium": 50}', 'Max Anzeigen pro User-Typ')
ON CONFLICT (key) DO NOTHING;

-- Default Blacklisted Words
INSERT INTO blacklisted_words (word, severity, action) VALUES
('arnaque', 'high', 'auto_reject'),
('fake', 'medium', 'flag'),
('scam', 'high', 'auto_reject'),
('spam', 'medium', 'flag')
ON CONFLICT (word) DO NOTHING;