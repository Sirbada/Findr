# 🚀 Findr — Killer Features Plan for Cameroon Market

> Competitive analysis vs. Airbnb, Leboncoin, SeLoger, AutoScout24, TaskRabbit  
> Adapted for Cameroon: Mobile Money, WhatsApp-first, offline-capable, trust-critical

---

## 📊 What Already Exists in the Codebase

### ✅ Already Built
| Feature | Location | Status |
|---------|----------|--------|
| Phone OTP auth (+237) | `src/lib/auth/phone-auth.ts` | Mock — needs Supabase Phone Auth |
| Orange Money payment | `src/lib/payments/orange-money.ts` | Mock — needs merchant account |
| MTN MoMo payment | `src/lib/payments/mtn-momo.ts` | Mock — needs merchant account |
| PayPal (diaspora) | `src/lib/payments/paypal.ts` | Mock — needs credentials |
| Trust Score system | `supabase/migrations/20260221_gamechanger_features.sql` | DB ready, no UI |
| Service Broadcasts | `supabase/migrations/20260221_gamechanger_features.sql` | DB ready, partial UI |
| Saved Items | `supabase/migrations/20260221_gamechanger_features.sql` | DB ready, localStorage only |
| WhatsApp sharing | `src/components/ui/WhatsAppButton.tsx` | Done |
| Social sharing | `src/components/ui/SocialShare.tsx` | Done |
| PWA + offline | `public/sw.js` | Done |
| Data-saver mode | `src/lib/data-saver/context.tsx` | Done |
| Admin panel | `src/app/admin/` | Done |
| Pro dashboard | `src/app/dashboard/pro/` | Done |
| Booking API | `src/app/api/bookings/route.ts` | Done with availability lock |
| View count RPC | `supabase/migrations/20260303_increment_views_function.sql` | Done |
| Push notifications | `src/lib/notifications/push.ts` | Ready |
| Analytics tracker | `src/lib/analytics/tracker.ts` | Ready |

### ❌ Missing — Needs to Be Built
- Saved Search Alerts (SMS/WhatsApp notification)
- "Make an Offer" / Price Negotiation
- In-app Chat with WhatsApp fallback
- Map View with price pins
- Landmark-based location input
- Two-way Reviews (buyer + seller)
- ID Verification flow
- Boost Listings (paid promotion)
- Diaspora Mode (EUR/USD pricing)
- Escrow Payments
- Price trend charts
- Neighborhood guides

---

## 🗺️ Architecture Overview

```
Findr
├── Frontend (Next.js App Router)
│   ├── /housing, /cars, /terrain, /emplois, /services
│   ├── /dashboard (user), /dashboard/pro (agent), /admin
│   ├── /chat (new), /map (new), /alerts (new)
│   └── Components: Header, Hero, Cards, Chat, Map, Reviews
│
├── Backend (Supabase)
│   ├── Auth: Phone OTP → Supabase Phone Auth
│   ├── DB: PostgreSQL with RLS
│   ├── Storage: Images
│   ├── Realtime: Chat messages, notifications
│   └── Edge Functions: SMS alerts, payment webhooks
│
└── External Services
    ├── SMS: Africa's Talking / Twilio
    ├── Maps: Mapbox (free tier) or Leaflet + OpenStreetMap
    ├── Payments: MTN MoMo API, Orange Money API, PayPal
    └── WhatsApp: wa.me links (no API needed)
```

---

## 🏃 Sprint Plan

---

### SPRINT 1 — Saved Search Alerts + Make an Offer
**Impact: HIGH | Effort: MEDIUM | Leboncoin's #1 feature**

#### 1A. Saved Search Alerts

**DB Migration needed:**
```sql
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'housing', 'cars', 'terrain', 'emplois', 'services'
  filters JSONB NOT NULL, -- { city, type, minPrice, maxPrice, minBedrooms, ... }
  label TEXT, -- user-defined name e.g. "2BR Bonanjo under 150K"
  notify_sms BOOLEAN DEFAULT true,
  notify_whatsapp BOOLEAN DEFAULT true,
  notify_push BOOLEAN DEFAULT true,
  phone TEXT, -- for SMS/WhatsApp
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Files to create:**
- `src/app/alerts/page.tsx` — Manage saved searches UI
- `src/components/ui/SaveSearchModal.tsx` — Modal to save current filters as alert
- `src/app/api/alerts/route.ts` — CRUD for saved searches
- `supabase/migrations/008_saved_searches.sql`

**Files to modify:**
- `src/app/housing/page.tsx` — Add "Save this search" button
- `src/app/cars/page.tsx` — Add "Save this search" button

**How it works:**
1. User sets filters on housing/cars page
2. Clicks "🔔 Save this search"
3. Modal asks: label + phone number + notification preference
4. Saved to DB
5. Supabase Edge Function runs daily: checks new listings vs. saved searches → sends SMS via Africa's Talking

#### 1B. Make an Offer

**DB Migration needed:**
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL, -- references properties, vehicles, or listings
  listing_type TEXT NOT NULL CHECK (listing_type IN ('property', 'vehicle', 'listing')),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'XAF',
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'expired')),
  counter_amount BIGINT, -- seller's counter-offer
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Files to create:**
- `src/components/ui/MakeOfferModal.tsx` — Offer form with amount + message
- `src/components/ui/OfferCard.tsx` — Display offer status
- `src/app/api/offers/route.ts` — Create/respond to offers

**Files to modify:**
- `src/app/housing/[id]/page.tsx` — Add "Make an Offer" button
- `src/app/cars/[id]/page.tsx` — Add "Make an Offer" button
- `src/app/dashboard/page.tsx` — Show received/sent offers tab

---

### SPRINT 2 — In-App Chat + WhatsApp Fallback
**Impact: HIGH | Effort: HIGH | Critical for trust**

**DB Migration needed:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID,
  listing_type TEXT,
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (listing_id, listing_type, buyer_id, seller_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'offer', 'system')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Files to create:**
- `src/app/chat/page.tsx` — Chat list (all conversations)
- `src/app/chat/[id]/page.tsx` — Individual conversation
- `src/components/ui/ChatBubble.tsx` — Message bubble component
- `src/components/ui/ContactSellerButton.tsx` — "Message" + "WhatsApp" buttons
- `src/app/api/messages/route.ts` — Send message API

**Files to modify:**
- `src/app/housing/[id]/page.tsx` — Replace phone button with "Message Seller" + "WhatsApp"
- `src/app/cars/[id]/page.tsx` — Same
- `src/components/layout/Header.tsx` — Add chat icon with unread count badge

**WhatsApp fallback pattern:**
```tsx
// If seller has WhatsApp number:
<a href={`https://wa.me/237${phone}?text=Bonjour, je suis intéressé par: ${title}`}>
  WhatsApp
</a>
// Always available, no API needed
```

**Supabase Realtime:**
```ts
supabase.channel('messages').on('postgres_changes', {
  event: 'INSERT', schema: 'public', table: 'messages',
  filter: `conversation_id=eq.${conversationId}`
}, handleNewMessage).subscribe()
```

---

### SPRINT 3 — Map View + Landmark Location
**Impact: HIGH | Effort: MEDIUM**

**Technology choice:** Leaflet.js + OpenStreetMap (free, no API key needed)
- Package: `leaflet`, `react-leaflet`
- Alternative: Mapbox (better UX, free tier 50K loads/month)

**Files to create:**
- `src/components/ui/MapView.tsx` — Interactive map with listing pins
- `src/components/ui/LandmarkInput.tsx` — Location input with landmark description
- `src/app/housing/map/page.tsx` — Full map view for housing
- `src/app/cars/map/page.tsx` — Full map view for cars

**Files to modify:**
- `src/app/housing/page.tsx` — Add "Map" view toggle (Grid | List | Map)
- `src/app/cars/page.tsx` — Same
- `src/app/dashboard/new/page.tsx` — Replace address field with landmark input + map pin

**Landmark Location pattern (Cameroon-specific):**
```tsx
// Instead of: "Rue 1234, Bonanjo"
// Use: "200m from Total Bonanjo, near Carrefour Warda"
// + map pin dropped by user
<LandmarkInput
  placeholder="Ex: 200m du Total Bonanjo, près du marché Sandaga"
  onLocationSelect={(lat, lng, landmark) => ...}
/>
```

**DB changes needed:**
- Add `latitude FLOAT`, `longitude FLOAT`, `landmark TEXT` to `properties` and `vehicles` tables

---

### SPRINT 4 — Reviews + ID Verification
**Impact: HIGH | Effort: HIGH | Trust is everything**

#### 4A. Two-Way Reviews

**DB Migration:**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewee_id UUID REFERENCES auth.users(id),
  listing_id UUID,
  listing_type TEXT,
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  type TEXT CHECK (type IN ('buyer_to_seller', 'seller_to_buyer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (reviewer_id, booking_id, type)
);
```

**Files to create:**
- `src/components/ui/ReviewCard.tsx` — Star rating display
- `src/components/ui/WriteReviewModal.tsx` — Review form
- `src/app/profile/[id]/page.tsx` — Public profile with reviews

**Files to modify:**
- `src/app/dashboard/page.tsx` — "Leave a review" prompt after completed booking
- `src/app/housing/[id]/page.tsx` — Show seller reviews

#### 4B. ID Verification

**Files to create:**
- `src/app/verify/page.tsx` — Upload ID document flow
- `src/app/api/verify/route.ts` — Submit verification request
- `supabase/migrations/009_verification.sql`

**DB Migration:**
```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  document_type TEXT CHECK (document_type IN ('national_id', 'passport', 'driver_license')),
  document_url TEXT, -- Supabase Storage URL
  selfie_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Flow:**
1. User uploads front + back of national ID
2. Takes selfie
3. Admin reviews in `/admin/verifications`
4. Approved → `profiles.is_verified = true` → green badge on all listings

---

### SPRINT 5 — Boost Listings + Monetization
**Impact: HIGH | Effort: LOW | Revenue generator**

**DB Migration:**
```sql
CREATE TABLE listing_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  listing_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  duration_days INTEGER NOT NULL DEFAULT 7,
  amount_xaf INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mtn_momo', 'orange_money')),
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Pricing (XAF):**
| Duration | Price | Visibility |
|----------|-------|------------|
| 3 days | 500 XAF | Top of category |
| 7 days | 1,000 XAF | Top + highlighted |
| 30 days | 3,000 XAF | Top + badge + featured |

**Files to create:**
- `src/components/ui/BoostModal.tsx` — Boost purchase flow with Mobile Money
- `src/app/api/boost/route.ts` — Create boost + trigger payment

**Files to modify:**
- `src/app/dashboard/page.tsx` — "Boost" button on each listing
- `src/lib/supabase/queries.ts` — Order boosted listings first

---

### SPRINT 6 — Diaspora Mode + Escrow Payments
**Impact: MEDIUM | Effort: HIGH | Unique differentiator**

#### 6A. Diaspora Mode

**Files to create:**
- `src/lib/diaspora/context.tsx` — DiasporaProvider (currency, language, payment)
- `src/components/ui/DiasporaToggle.tsx` — Switch between local/diaspora mode

**Features:**
- Prices shown in EUR/USD alongside XAF
- PayPal as primary payment
- "Send this listing to family" — generates shareable link with pre-filled WhatsApp message
- Diaspora-specific listings: "Diaspora-friendly landlord" badge

#### 6B. Escrow Payments

**Flow:**
1. Buyer pays via Mobile Money → funds held by Findr
2. Seller confirms handover
3. Buyer confirms receipt
4. Funds released to seller (minus 2% Findr fee)
5. Dispute: admin mediates

**DB Migration:**
```sql
CREATE TABLE escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  buyer_id UUID REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'XAF',
  findr_fee BIGINT,
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded', 'disputed')),
  held_at TIMESTAMPTZ DEFAULT now(),
  released_at TIMESTAMPTZ,
  dispute_reason TEXT
);
```

---

## 📁 New Files Summary

```
src/
├── app/
│   ├── alerts/page.tsx              # Saved search alerts management
│   ├── chat/page.tsx                # Chat list
│   ├── chat/[id]/page.tsx           # Individual chat
│   ├── verify/page.tsx              # ID verification flow
│   ├── profile/[id]/page.tsx        # Public user profile + reviews
│   ├── housing/map/page.tsx         # Map view for housing
│   ├── cars/map/page.tsx            # Map view for cars
│   └── api/
│       ├── alerts/route.ts          # Saved search CRUD
│       ├── offers/route.ts          # Make an offer
│       ├── messages/route.ts        # Chat messages
│       ├── boost/route.ts           # Listing boost
│       └── verify/route.ts          # ID verification
│
├── components/ui/
│   ├── SaveSearchModal.tsx          # Save current filters as alert
│   ├── MakeOfferModal.tsx           # Price negotiation
│   ├── OfferCard.tsx                # Offer status display
│   ├── ChatBubble.tsx               # Message bubble
│   ├── ContactSellerButton.tsx      # Message + WhatsApp buttons
│   ├── MapView.tsx                  # Leaflet map with pins
│   ├── LandmarkInput.tsx            # Cameroon-style location input
│   ├── ReviewCard.tsx               # Star rating display
│   ├── WriteReviewModal.tsx         # Review form
│   ├── BoostModal.tsx               # Boost purchase
│   └── DiasporaToggle.tsx           # Local/diaspora mode switch
│
└── lib/
    └── diaspora/context.tsx         # Diaspora mode provider

supabase/migrations/
├── 008_saved_searches.sql
├── 009_verification.sql
├── 010_reviews.sql
├── 011_offers.sql
├── 012_chat.sql
├── 013_boosts.sql
├── 014_escrow.sql
└── 015_map_columns.sql              # Add lat/lng/landmark to tables
```

---

## 🎯 Implementation Priority

```
WEEK 1-2 (Do Now — Quick Wins):
  ✅ Saved Search Alerts (SMS/WhatsApp)
  ✅ "Make an Offer" button + modal
  ✅ Boost Listings (revenue!)

WEEK 3-4 (Core Trust):
  ⬜ In-app Chat + WhatsApp fallback
  ⬜ Two-way Reviews
  ⬜ ID Verification

WEEK 5-6 (Discovery):
  ⬜ Map View (Leaflet + OpenStreetMap)
  ⬜ Landmark Location Input

WEEK 7-8 (Unique Differentiators):
  ⬜ Diaspora Mode
  ⬜ Escrow Payments
```

---

## 🔧 External Services to Set Up

| Service | Purpose | Cost | Priority |
|---------|---------|------|----------|
| Africa's Talking | SMS alerts | ~1 XAF/SMS | HIGH |
| Supabase Phone Auth | OTP login | Free tier | HIGH |
| MTN MoMo API | Payments | % per transaction | HIGH |
| Orange Money API | Payments | % per transaction | HIGH |
| Leaflet.js | Maps | Free | MEDIUM |
| Mapbox | Better maps | Free 50K/month | MEDIUM |
| PayPal REST API | Diaspora payments | 2.9% + fixed | MEDIUM |

---

*Last updated: March 2026*
