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

---

## Key Features
- Properties + Vehicles + Services (separate verticals)
- Bookings with availability lock (anti double‑booking)
- Quote requests for service providers
- Trust Score (admin‑managed)
- USSD‑first checkout flow
- Offline quick‑save
- Admin + Super Admin roles

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
- 201: booking created
- 409: conflicts with locked dates

### Payment Webhooks
Orange Money  
`POST /api/payments/om-callback`

MTN MoMo  
`POST /api/payments/momo-callback`

Both validate HMAC signature using:
- `OM_WEBHOOK_SECRET`
- `MOMO_WEBHOOK_SECRET`

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

## Important Pages
- `/` — Home
- `/housing` + `/housing/[id]`
- `/cars` + `/cars/[id]`
- `/services` + `/services/[id]`
- `/dashboard`
- `/admin`
- `/onboarding`

---

## CI (GitHub Actions)
CI runs on pushes and PRs to `master`:
- `npm ci`
- `npm run lint`
- `npm run build`

Workflow: `.github/workflows/webpack.yml`
