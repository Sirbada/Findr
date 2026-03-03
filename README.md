# Findr — Premium Booking Platform (Cameroon)

Findr is a premium booking marketplace for Cameroon that blends:
- Short‑term stays (Airbnb‑style)
- Hotels (Booking.com‑style)
- Premium car rental (Sixt‑style)
- Local services (quote‑based professionals)

Built with Next.js, Tailwind, and Supabase.  
Optimized for mobile‑first usage, unstable networks, and USSD‑first payments.

---

## Stack
- Next.js 16 (App Router)
- Supabase (Auth, DB, RLS)
- Tailwind CSS
- Zod for validation
- Vitest + Playwright (tests)

---

## Key Features

### Search & Filtering
- **Full-text search** across title, description, city, neighborhood (Housing) and title, brand, model, city (Cars)
- **Advanced filter panel** (collapsible) with:
  - Housing: bedroom count, bathroom count, min/max price, property type, neighborhood
  - Cars: brand, fuel type, transmission (auto/manual), seat count, min/max price
- **Sort options**: Newest first · Price low→high · Price high→low · Most popular
- **URL-based filter persistence** — filters survive page refresh and can be shared as links
- **Active filter chips** with individual remove buttons and "Clear all"

### Bookings
- Availability lock (anti double‑booking) via `availability` table
- Rate-limited booking API (8 req/min per IP)
- HMAC-verified payment webhooks (Orange Money + MTN MoMo)

### Auth & Dashboard
- Phone OTP login (+237 Cameroon numbers: Orange, MTN, Nexttel)
- Real Supabase auth on dashboard — fetches user profile, listings, bookings
- Protected routes redirect unauthenticated users to `/login`
- Working logout

### Payments
- Orange Money (mock → ready for Web Pay API)
- MTN Mobile Money (mock → ready for MoMo API)
- PayPal (mock → ready for REST API v2)
- Commission calculator

### PWA
- Service worker with cache-first / network-first strategies
- Offline support
- Install prompt (iOS + Android)
- Full icon set (72px → 512px)
- OG images for all verticals

### Other
- Trust Score (admin-managed)
- Pro dashboard with stats, listings, bookings
- Admin panel with user management
- Analytics tracker
- Push notifications (ready)
- Data-saver mode
- FR/EN translations
- View count tracking via `increment_views` RPC

---

## Local Setup

### 1) Install
```bash
npm install
```

### 2) Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mobile Money Webhook Secrets
OM_WEBHOOK_SECRET=
MOMO_WEBHOOK_SECRET=
```

### 3) Database Migrations (Supabase)
Run in Supabase SQL Editor in order:
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
```

### 4) Run
```bash
npm run dev
```
Open: `http://localhost:3000`

---

## Production Build
```bash
npm run build
npm run start
```

---

## Tests
```bash
# Unit tests
npm run test

# E2E (requires running dev server)
npx playwright test
```

---

## API Routes

### Booking API
`POST /api/bookings`
```json
{
  "property_id": "uuid",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD"
}
```
or
```json
{
  "vehicle_id": "uuid",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD"
}
```

Response:
- `201` — booking created, returns `{ booking_id, total_price }`
- `409` — conflicts with locked dates, returns `{ conflicts: [...] }`
- `401` — not authenticated
- `429` — rate limit exceeded (8 req/min)

### Payment Webhooks
Orange Money  
`POST /api/payments/om-callback`

MTN MoMo  
`POST /api/payments/momo-callback`

Both validate HMAC-SHA256 signature using:
- `OM_WEBHOOK_SECRET`
- `MOMO_WEBHOOK_SECRET`

### Admin
`GET /api/admin/check` — verify admin role  
`GET /api/payments/status` — payment status lookup  
`GET /api/schema` — DB schema introspection (admin only)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/housing` | Property listings with advanced search |
| `/housing/[id]` | Property detail + booking |
| `/cars` | Vehicle listings with advanced search |
| `/cars/[id]` | Vehicle detail + booking |
| `/services` | Service professionals |
| `/services/[id]` | Service detail |
| `/dashboard` | User dashboard (auth required) |
| `/dashboard/pro` | Pro/agent portal |
| `/dashboard/analytics` | Analytics (pro) |
| `/dashboard/notifications` | Notification settings |
| `/dashboard/messages` | Messages |
| `/dashboard/new` | Create listing |
| `/admin` | Admin panel |
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/login` | Phone OTP login |
| `/signup` | Registration |
| `/onboarding` | Onboarding flow |
| `/pro` | Pro plan page |
| `/faq` | FAQ |
| `/cgu` | Terms of service |
| `/mentions-legales` | Legal notices |

---

## Roles
Roles are stored in `user_roles`:
- `user`
- `pro`
- `admin`
- `super_admin`

Only `super_admin` can assign roles.

---

## Trust Score
Stored in `trust_scores`. Admin can adjust it in `/admin`.

---

## CI (GitHub Actions)
CI runs on pushes and PRs to `master`:
- `npm ci`
- `npm run lint`
- `npm run build`

Workflow: `.github/workflows/webpack.yml`

---

## Deployment Checklist

Before going live:
- [ ] Run all SQL migrations in Supabase dashboard
- [ ] Enable Supabase Phone Auth + configure SMS provider (Twilio / Africa's Talking)
- [ ] Obtain Orange Money merchant account → replace mock in `src/lib/payments/orange-money.ts`
- [ ] Obtain MTN MoMo merchant account → replace mock in `src/lib/payments/mtn-momo.ts`
- [ ] Set `OM_WEBHOOK_SECRET` and `MOMO_WEBHOOK_SECRET` in Vercel environment variables
- [ ] Configure PayPal REST API credentials
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Verify OG images are accessible at `/og-image.jpg`, `/og-housing.jpg`, etc.

---

*Last updated: March 2026*
