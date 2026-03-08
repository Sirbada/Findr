# Findr 🇨🇲 — Premium Marketplace for Cameroon

> **The go-to platform to find everything in Cameroon.**  
> Housing · Vehicles · Land · Jobs · Services  
> Built for Mobile Money, WhatsApp-first, offline-capable, trust-critical markets.

[![CI](https://github.com/Sirbada/Findr/actions/workflows/webpack.yml/badge.svg)](https://github.com/Sirbada/Findr/actions)

---

## 🌟 What Makes Findr Different

| Feature | How it works |
|---------|-------------|
| 📱 **Mobile Money first** | MTN MoMo + Orange Money as primary payment (not credit cards) |
| 💬 **WhatsApp-native** | Every listing has a one-tap WhatsApp contact + share button |
| 🔔 **Saved Search Alerts** | Get SMS/WhatsApp when a matching listing is posted |
| 💸 **Make an Offer** | Price negotiation built in — culturally essential in Cameroon |
| 🗺️ **Landmark Location** | "near Total Bonanjo" instead of street addresses |
| 🌍 **Diaspora Mode** | EUR/USD pricing, PayPal payment, "Send to family" share |
| 🔒 **Escrow Payments** | Secure hold/release with 2% Findr fee |
| 🪪 **ID Verification** | Upload national ID → admin approves → "Vérifié" badge |
| ⚡ **Offline-first PWA** | Full browsing without internet, background sync |
| ☀️ **Nature+Sun Design v2** | Apple/Tesla/Airbnb-inspired light-only UI — green `#16a34a` + gold palette |

---

## 🚀 Stack

- **Next.js 16** (App Router, RSC + client components)
- **Supabase** (Auth, PostgreSQL, Realtime, Storage, RLS)
- **Tailwind CSS** + custom design system
- **Leaflet.js** + OpenStreetMap (map view)
- **Zod** (validation)
- **Vitest** + **Playwright** (testing)

---

## 📦 Features

### Core Verticals
- 🏠 **Housing** — Apartments, villas, studios, hotels, guesthouses
- 🚗 **Vehicles** — Car rental & sales with brand/fuel/transmission filters
- 🌿 **Terrain** — Land listings with title deed status
- 💼 **Emplois** — Job listings (CDI, CDD, freelance, stages)
- ⚡ **Services** — Verified local professionals with broadcast requests

### Search & Discovery
- Full-text search across title, description, city, neighborhood
- Advanced filters: bedrooms, bathrooms, price range, transmission, seats
- Sort: Newest · Price ↑ · Price ↓ · Most popular
- **Map view** with price pins (Leaflet + OpenStreetMap)
- **Saved Search Alerts** — SMS/WhatsApp notifications for new matches
- URL-based filter persistence (shareable links)
- Active filter chips with "Clear all"

### Trust & Safety
- **ID Verification** — Upload national ID → admin review → Vérifié badge
- **Trust Score** — Admin-managed score displayed on listings
- **Two-Way Reviews** — Buyer reviews seller AND seller reviews buyer
- **Scam prevention** — Rate-limited APIs, HMAC-signed webhooks

### Communication
- **In-App Chat** — Supabase Realtime conversations
- **WhatsApp Fallback** — `wa.me/237{phone}` one-tap contact
- **Make an Offer** — Price negotiation with counter-offer support
- **Broadcast Requests** — Post a need, receive quotes from pros

### Payments & Monetization
- **Orange Money** (mock → ready for Web Pay API)
- **MTN Mobile Money** (mock → ready for MoMo API)
- **PayPal** (diaspora payments, mock → ready for REST API v2)
- **Escrow Payments** — Secure hold/release/dispute flow (2% fee)
- **Boost Listings** — 500/1,000/3,000 XAF for 3/7/30 days
- Commission calculator

### User Experience
- 📱 **PWA** — Install prompt, service worker, offline support
- 🌍 **Diaspora Mode** — EUR/USD/XAF pricing + "Envoyer à la famille"
- 📍 **Landmark Location** — Cameroon-specific location input
- 🎨 **Nature+Sun Design v2** — Light-only, `#16a34a` green + gold + sky + coral, Apple-smooth motion
- 🌐 **FR/EN** translations
- 📊 **Data-Saver Mode** — Compressed images, reduced bandwidth
- 🔔 **Push Notifications** (ready)
- 📈 **Analytics Tracker** (ready)

### Admin
- Admin panel with user management, listing moderation
- ID verification review queue
- Trust Score management
- Analytics dashboard

---

## 🗂️ Pages

| Route | Description |
|-------|-------------|
| `/` | Home (HeroEnhanced + Stats + Categories + HowItWorks + Testimonials) |
| `/housing` | Property listings with advanced search + map view |
| `/housing/[id]` | Property detail + booking + make offer + escrow |
| `/cars` | Vehicle listings with advanced search + map view |
| `/cars/[id]` | Vehicle detail + booking + make offer |
| `/terrain` | Land listings |
| `/emplois` | Job listings |
| `/services` | Service professionals + broadcast |
| `/services/[id]` | Service detail |
| `/chat` | Chat conversations list |
| `/chat/[id]` | Individual conversation with Realtime |
| `/profile/[id]` | Public user profile with reviews |
| `/verify` | ID verification upload flow |
| `/escrow/[id]` | Escrow status + hold/release/dispute |
| `/boost/success` | Listing boost confirmation |
| `/alerts` | Saved search alerts management |
| `/dashboard` | User dashboard (auth required) |
| `/dashboard/pro` | Pro/agent portal |
| `/dashboard/analytics` | Analytics (pro) |
| `/dashboard/notifications` | Notification settings |
| `/dashboard/messages` | Messages |
| `/dashboard/new` | Create listing with landmark input |
| `/admin` | Admin panel + verification queue |
| `/admin/dashboard` | Admin analytics |
| `/admin/users` | User management |
| `/login` | Phone OTP login (+237) |
| `/signup` | Registration |
| `/onboarding` | Onboarding flow |
| `/pro` | Pro plan page |
| `/faq` | FAQ |
| `/cgu` | Terms of service |
| `/mentions-legales` | Legal notices |

---

## 🗄️ Database Migrations

Run in Supabase SQL Editor **in this order**:

```
supabase/migrations/20260221_refactor_listings_bookings.sql
supabase/migrations/20260221_services_admin_roles.sql
supabase/migrations/20260221_gamechanger_features.sql
supabase/migrations/003_seed_listings.sql
supabase/migrations/004_reviews.sql
supabase/migrations/005_featured_ads.sql
supabase/migrations/006_admin_features.sql
supabase/migrations/007_notifications_analytics.sql
supabase/migrations/20260303_increment_views_function.sql
supabase/migrations/20260303_saved_searches.sql
supabase/migrations/20260303_offers.sql
supabase/migrations/20260303_listing_boosts.sql
supabase/migrations/20260303_chat.sql
supabase/migrations/20260303_reviews.sql
supabase/migrations/20260303_verification.sql
supabase/migrations/20260303_escrow.sql
```

---

## ⚙️ Local Setup

### 1) Install
```bash
npm install
```

### 2) Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhooks
OM_WEBHOOK_SECRET=your-secret
MOMO_WEBHOOK_SECRET=your-secret

# Optional: push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-key
```

### 3) Run
```bash
npm run dev
```
Open: `http://localhost:3000`

---

## 🏗️ Production Build
```bash
npm run build
npm run start
```

---

## 🧪 Tests
```bash
# Unit tests (Vitest)
npm run test

# E2E (Playwright — requires running dev server)
npx playwright test
```

---

## 🌐 API Routes

### Booking
`POST /api/bookings` — Create booking with availability lock (rate-limited 8 req/min)

### Offers
`POST /api/offers` — Make an offer on a listing  
`PATCH /api/offers` — Accept / reject / counter an offer

### Alerts
`GET /api/alerts` — List saved searches  
`POST /api/alerts` — Create saved search alert  
`DELETE /api/alerts` — Remove alert

### Chat
`GET /api/conversations` — List conversations  
`POST /api/conversations` — Start conversation  
`GET /api/conversations/[id]/messages` — Get messages  
`POST /api/conversations/[id]/messages` — Send message

### Boost
`POST /api/boost` — Create listing boost  
`POST /api/payments/boost/momo` — Pay boost via MTN MoMo  
`POST /api/payments/boost/orange` — Pay boost via Orange Money  
`POST /api/payments/boost/paypal` — Pay boost via PayPal

### Reviews
`POST /api/reviews` — Submit review

### Verification
`POST /api/verify` — Submit ID verification request  
`PATCH /api/verify/[id]` — Admin approve/reject

### Escrow
`POST /api/escrow` — Create escrow hold  
`PATCH /api/escrow/[id]` — Release / refund / dispute

### Payment Webhooks
`POST /api/payments/om-callback` — Orange Money (HMAC-verified)  
`POST /api/payments/momo-callback` — MTN MoMo (HMAC-verified)

### Admin
`GET /api/admin/check` — Verify admin role

---

## 🎨 Design System v2 — March 2026

Complete frontend overhaul fixing a broken UI (invisible text, faded elements, missing hover effects) and migrating to a new design system.

### Root Cause
**Tailwind CSS v4** ignores `tailwind.config.ts` by default — requires an explicit `@config` directive in `globals.css`. Without it, all custom colors, animations, and utilities were silently missing.

### 7 Infrastructure Bugs Fixed

| Bug | Fix |
|-----|-----|
| Tailwind v4 config not loaded | Added `@config "../../tailwind.config.ts"` to `globals.css` |
| Geist font variables undefined | Removed broken `@theme inline` font overrides |
| `.hover-lift` class missing | Added CSS utility with `translateY(-4px)` on hover |
| Animation flash on page load | Changed fill-mode `forwards` → `both` |
| Dynamic class interpolation broken | Replaced `group-hover:${color}` with static classes |
| Hero text hardcoded in French | Wired `t.heroEnhanced.*` translation keys |
| Dark mode applied unwanted styles | Removed `@media (prefers-color-scheme: dark)` block |

### Color Palette Migration

| Token | Old (emerald) | New (green) |
|-------|--------------|-------------|
| Primary | `#059669` | `#16a34a` |
| Primary Light | `#10b981` | `#22c55e` |
| Primary Deep | `#047857` | `#15803d` |
| Soft Background | `#ecfdf5` | `#dcfce7` |
| Text Primary | `#1a1a1a` | `#111827` |
| Text Secondary | `#4b5563` | `#6b7280` |
| Surface | `#fafaf9` | `#f9fafb` |

### Design Philosophy
Apple precision + Tesla boldness + Airbnb warmth. Light-only, no dark mode. Inter font family. Rounded corners (12-24px). Subtle shadows with green-tinted CTA glow.

### Files Modified (15)

| Category | Files |
|----------|-------|
| Config | `globals.css`, `tailwind.config.ts` |
| UI Components | `Button.tsx`, `Card.tsx`, `GlassHeader.tsx` |
| Layout | `Header.tsx`, `Footer.tsx` |
| Home Sections | `HeroEnhanced.tsx`, `CategoriesEnhanced.tsx`, `StatsCounter.tsx`, `HowItWorks.tsx`, `Testimonials.tsx`, `TrustedBy.tsx` |
| App | `layout.tsx`, `InstallPrompt.tsx` |

---

## 🗺️ Roadmap to Live

### ✅ Done (code complete)
- [x] All 5 verticals (housing, cars, terrain, emplois, services)
- [x] Advanced search + filters + map view + URL persistence
- [x] Booking API with availability lock
- [x] Saved Search Alerts
- [x] Make an Offer / price negotiation
- [x] In-App Chat with WhatsApp fallback
- [x] Landmark-based location input
- [x] Two-Way Reviews + public profiles
- [x] ID Verification flow (upload + admin review)
- [x] Boost Listings (500–3,000 XAF)
- [x] Diaspora Mode (EUR/USD/XAF + "Envoyer à la famille")
- [x] Escrow Payments (hold → release → dispute)
- [x] PWA (offline, install prompt, push notifications)
- [x] Admin panel + analytics
- [x] Pro/agent portal
- [x] Design System v2 — Tailwind v4 fix, color migration, animation fixes (15 files)

### 🔧 To Configure Before Launch
- [ ] Run all 16 SQL migrations in Supabase dashboard
- [ ] Enable Supabase Phone Auth → configure Africa's Talking or Twilio for SMS
- [ ] Obtain MTN MoMo merchant account → replace mock in `src/lib/payments/mtn-momo.ts`
- [ ] Obtain Orange Money merchant account → replace mock in `src/lib/payments/orange-money.ts`
- [ ] Configure PayPal REST API credentials
- [ ] Set `OM_WEBHOOK_SECRET` and `MOMO_WEBHOOK_SECRET` in Vercel environment variables
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain (e.g. `https://findr.cm`)
- [ ] Set up Supabase Storage bucket for ID verification documents (private)
- [ ] Configure Africa's Talking for SMS alert delivery

### 🚀 Deploy
```bash
# Connect GitHub → Vercel → Set env vars → Deploy
vercel --prod
```
or push to `master` — CI auto-deploys via GitHub Actions.

---

## 👥 Roles

| Role | Permissions |
|------|------------|
| `user` | Post listings, make offers, chat, reviews |
| `pro` | All user + boosted visibility, pro dashboard, analytics |
| `admin` | Moderate listings, verify IDs, manage trust scores |
| `super_admin` | All admin + assign roles |

---

## 🤝 Contributing

PRs welcome. Please follow the existing code patterns:
- Use `(supabase as any).auth` for Supabase auth calls (SSR compatibility)
- All new pages: wrap `useSearchParams()` in `<Suspense>`
- Exclude test files from main TypeScript check (see `tsconfig.json`)

---

*Last updated: March 2026 · Made with ❤️ for Cameroon*
