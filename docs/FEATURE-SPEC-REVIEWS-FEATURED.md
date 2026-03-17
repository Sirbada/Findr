# Findr Marketplace - Feature Spezifikation
## Reviews & Ratings System + Featured Ads

**Version:** 1.0  
**Datum:** 08.02.2026  
**Stack:** Next.js 15 + Supabase + TypeScript + Tailwind CSS

---

## 🎯 Feature 1: Reviews & Ratings System

### Überblick
Ein vollständiges Bewertungssystem für Marketplace-Listings mit 5-Sterne-Rating, Textkommentaren und automatischer Durchschnittsbewertung.

### SQL Migration: `/supabase/migrations/004_reviews.sql`

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_votes INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent duplicate reviews from same user for same listing
CREATE UNIQUE INDEX reviews_unique_user_listing 
ON reviews (listing_id, reviewer_id) 
WHERE reviewer_id IS NOT NULL;

-- Index for efficient listing queries
CREATE INDEX idx_reviews_listing_visible 
ON reviews (listing_id) 
WHERE is_hidden = false;

-- Average rating view for listings
CREATE VIEW listing_ratings AS
SELECT 
  listing_id,
  ROUND(AVG(rating)::numeric, 1) as avg_rating,
  COUNT(*) as review_count,
  COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_count
FROM reviews 
WHERE is_hidden = false
GROUP BY listing_id;

-- Review helpfulness tracking
CREATE TABLE review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, voter_id)
);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read visible reviews
CREATE POLICY "Public reviews read" ON reviews 
FOR SELECT USING (is_hidden = false);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated create reviews" ON reviews 
FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  auth.uid() IS NOT NULL
);

-- Users can edit their own reviews
CREATE POLICY "Users edit own reviews" ON reviews 
FOR UPDATE USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- Review votes policies
CREATE POLICY "Public review votes read" ON review_votes 
FOR SELECT USING (true);

CREATE POLICY "Authenticated vote on reviews" ON review_votes 
FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users manage own votes" ON review_votes 
FOR UPDATE USING (auth.uid() = voter_id)
WITH CHECK (auth.uid() = voter_id);

-- Function to update helpful votes count
CREATE OR REPLACE FUNCTION update_review_helpful_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE reviews 
    SET helpful_votes = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = NEW.review_id AND is_helpful = true
    )
    WHERE id = NEW.review_id;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET helpful_votes = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = OLD.review_id AND is_helpful = true
    )
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for helpful votes
CREATE TRIGGER trigger_update_helpful_votes
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_votes();
```

### React Components Spezifikation

#### 1. `ReviewStars.tsx`
```typescript
interface ReviewStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}
```
- Zeigt 1-5 goldene Sterne (filled/outline)
- Interactive Mode für Review-Eingabe
- Hover-Effekte bei interaktiv
- Responsive Größen (16px, 20px, 24px)

#### 2. `ReviewForm.tsx`
```typescript
interface ReviewFormProps {
  listingId: string;
  onSubmitSuccess?: () => void;
}
```
- Rating-Auswahl mit ReviewStars
- Textfeld für Kommentar (optional)
- Validierung: 1-5 Sterne erforderlich
- Loading States und Error Handling
- Mobile-optimierte Touch-Interaktion

#### 3. `ReviewList.tsx`
```typescript
interface ReviewListProps {
  listingId: string;
  limit?: number;
  showAll?: boolean;
}
```
- Paginierte Liste aller Reviews
- Sortierung: Neueste, Hilfreichste
- "Hilfreich" Voting-Buttons
- Report-Funktion für inappropriate content
- Mobile-erste responsives Design

#### 4. `RatingsSummary.tsx`
- Durchschnittsbewertung prominente Anzeige
- Verteilung der Bewertungen (5★: 23, 4★: 12, etc.)
- Gesamtzahl der Reviews
- Link zu vollständiger Review-Liste

### API Endpoints

```typescript
// GET /api/reviews/[listingId] - Fetch reviews for listing
// POST /api/reviews - Create new review
// PATCH /api/reviews/[reviewId] - Update review
// POST /api/reviews/[reviewId]/vote - Vote helpful/not helpful
// POST /api/reviews/[reviewId]/report - Report inappropriate review
```

### Integration in Listing Detail Page
- RatingsSummary unter Listing-Titel
- ReviewForm in "Bewertung abgeben" Sektion
- ReviewList in eigenem Tab/Accordion

---

## 💰 Feature 2: Featured Ads (Monetarisierung)

### Überblick
Kostenpflichtiges Boosting von Listings mit 3 Pricing-Stufen. Mobile Money Integration für den kamerunischen Markt.

### SQL Migration: `/supabase/migrations/005_featured_ads.sql`

```sql
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
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active featured listings
CREATE POLICY "Public featured read" ON featured_listings 
FOR SELECT USING (payment_status = 'paid' AND ends_at > now());

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
  SET payment_status = 'expired'
  WHERE payment_status = 'paid' 
    AND ends_at <= now();
END;
$$ LANGUAGE plpgsql;

-- Cron job to run expiry function (requires pg_cron extension)
-- SELECT cron.schedule('expire-featured', '0 * * * *', 'SELECT expire_featured_listings();');
```

### Pricing Tabelle (FCFA)

| Plan | Dauer | Preis | Features |
|------|-------|-------|----------|
| **Basic** | 7 Tage | 2,000 FCFA (~€3) | ⭐ Badge "En vedette" |
| **Premium** | 14 Tage | 5,000 FCFA (~€7.60) | ⭐ Badge + Top der Kategorie |
| **Spotlight** | 30 Tage | 10,000 FCFA (~€15) | ⭐ Badge + Kategorie-Top + Homepage |

### React Components Spezifikation

#### 1. `FeaturedBadge.tsx`
```typescript
interface FeaturedBadgeProps {
  plan: 'basic' | 'premium' | 'spotlight';
  size?: 'sm' | 'md';
}
```
- Gold border um Listing-Karte
- "⭐ En vedette" Badge (Corner ribbon)
- Plan-spezifische Styling (Premium: purple, Spotlight: rainbow gradient)

#### 2. `BoostAdModal.tsx`
```typescript
interface BoostAdModalProps {
  listingId: string;
  onClose: () => void;
}
```
- 3-Stufen Pricing-Cards
- Mobile Money Provider Auswahl
- Telefonnummer-Eingabe
- Payment-Flow mit Status-Tracking

#### 3. `PaymentStatus.tsx`
- Real-time Status Updates über WebSocket
- Success/Error/Pending States
- MTN/Orange Money spezifische Instruktionen
- Retry-Mechanismus bei Failures

### Mobile Money Integration

#### MTN Mobile Money API Flow:
1. **Request Payment:** POST zu MTN API mit Telefonnummer + Betrag
2. **User Prompt:** Nutzer erhält USSD-Push auf Handy (*126#)
3. **Callback Webhook:** MTN sendet Status-Update an unsere API
4. **Activation:** Bei successful payment → Featured Listing aktivieren

#### Orange Money API Flow:
1. **Token Request:** OAuth Token von Orange API
2. **Payment Request:** POST mit Telefonnummer + Betrag
3. **Status Polling:** Regelmäßige Status-Checks
4. **Activation:** Bei erfolgreicher Zahlung aktivieren

### API Endpoints

```typescript
// POST /api/featured/create - Create featured listing
// POST /api/payments/momo/initiate - Initiate Mobile Money payment
// POST /api/payments/webhook/mtn - MTN payment webhook
// POST /api/payments/webhook/orange - Orange Money webhook
// GET /api/featured/plans - Get pricing plans
// GET /api/featured/my-listings - User's featured listings
```

### UI/UX Spezifikation

#### Listing Cards Enhancement:
- **Basic:** Gold border (2px) + "⭐ En vedette" badge (top-right)
- **Premium:** Purple gradient border + "👑 Premium" badge
- **Spotlight:** Rainbow gradient border + "✨ Spotlight" badge

#### Homepage Integration:
- **Spotlight Section:** Top 3-6 Spotlight Listings (carousel)
- **Category Pages:** Featured listings erste 2 Reihen
- **Search Results:** Featured listings vor organic results

#### Mobile-First Design:
- Touch-optimierte Payment-Buttons (min 44px height)
- Plan-Selektion als horizontale Cards (swipeable)
- Vereinfachte Mobile Money-Flow (weniger Schritte)

---

## 🚀 Implementation Roadmap

### Phase 1: Reviews System (Woche 1-2)
1. **Tag 1-2:** Database Migration + RLS Setup
2. **Tag 3-4:** ReviewStars + ReviewForm Komponenten
3. **Tag 5-6:** ReviewList + RatingsSummary Komponenten  
4. **Tag 7-8:** API Routes + Integration in Listing Detail
5. **Tag 9-10:** Testing + Mobile Optimierungen

### Phase 2: Featured Ads (Woche 3-4)
1. **Tag 1-2:** Database Migration + Featured Listings Logic
2. **Tag 3-4:** FeaturedBadge + Listing Display Updates
3. **Tag 5-6:** BoostAdModal + Pricing Interface
4. **Tag 7-8:** Mobile Money Integration (MTN focus first)
5. **Tag 9-10:** Payment Webhooks + Status Tracking

### Phase 3: Polish & Launch (Woche 5)
1. **Tag 1-2:** Orange Money Integration
2. **Tag 3-4:** Analytics Dashboard für Featured Ads
3. **Tag 5:** Performance Testing + Bug Fixes

---

## 📊 Success Metrics

### Reviews System:
- **Adoption Rate:** 15% der aktiven Listings erhalten Reviews in 30 Tagen
- **Trust Signal:** Listings mit Reviews haben 25% höhere Click-Through-Rate
- **Quality Control:** <2% reported/hidden Reviews

### Featured Ads:
- **Revenue Target:** 50,000 FCFA (~€76) monatlich in Monat 1
- **Adoption:** 5% der aktiven Listings nutzen Featured Ads
- **Conversion:** Featured Listings haben 3x höhere Contact-Rate

---

## 🔒 Security & Moderation

### Reviews:
- Rate-Limiting: Max 1 Review pro Listing pro User
- Auto-Hide bei 3+ Reports
- Admin Dashboard für Review-Moderation
- Spam-Detection via Text-Pattern-Matching

### Payments:
- Payment-Webhooks mit HMAC-Signature-Validation
- Transaction-Logging für Audit-Trail
- Auto-Refund bei Technical Failures
- Fraud-Detection für ungewöhnliche Payment-Patterns

---

*Ende der Spezifikation*