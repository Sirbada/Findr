# 🦁 BADA INC. — Pitch Deck

## Slide 1: Cover
**BADA INC.**
*The Super-App Ecosystem for Cameroon*

Three apps. One account. 27 million people.

---

## Slide 2: Problem

### Cameroon is Africa's 10th largest economy — but digitally underserved.

| Problem | Current "Solution" |
|---------|-------------------|
| **No reliable ride-hailing** | Informal moto-taxis, no tracking, no safety |
| **No mobile banking** | 70% unbanked, Western Union fees of 8-12% |
| **No trusted marketplace** | Facebook groups, scams, no verification |
| **Diaspora disconnect** | Can't manage property/money from abroad |

**12 million Cameroonians use smartphones. Zero local super-app exists.**

---

## Slide 3: Solution

### Three apps. One ecosystem. Total market capture.

```
┌─────────────────────────────────────────┐
│              BADA INC.                  │
│         One Account · One KYC           │
├──────────┬──────────┬───────────────────┤
│ 🚗       │ 💰       │ 🏠                │
│ VoltGo*  │ VoltPay* │ VoltFind*         │
│ Mobility │ Fintech  │ Marketplace       │
│          │          │                   │
│ Rides    │ Wallet   │ Housing           │
│ Moto-Taxi│ P2P      │ Cars              │
│ Airport  │ Remit    │ Jobs & Services   │
│ Scheduled│ Tontine  │ Meublée Booking   │
│ Business │ MoMo/OM  │ Diaspora Portal   │
└──────────┴──────────┴───────────────────┘
         * Working names — final branding TBD
```

**User buys on VoltFind → pays with VoltPay → rides with VoltGo.**

---

## Slide 4: Why Now?

| Trend | Data |
|-------|------|
| 📱 Mobile penetration | 60% and growing fast |
| 💸 Mobile Money boom | Orange Money + MTN MoMo = 15M+ users in Cameroon |
| 🌍 Diaspora remittances | €500M+/year from Europe/US to Cameroon |
| 🏗️ Urbanization | Douala & Yaoundé = 6M+ combined, growing 4%/year |
| 🚫 No local competitor | Bolt barely present, no local fintech, no Airbnb |

**The window is open. First mover wins.**

---

## Slide 5: Market Size

### TAM → SAM → SOM

| | Size | Basis |
|---|------|-------|
| **TAM** | €2.5B | Cameroon digital economy (rides + payments + classifieds) |
| **SAM** | €400M | Urban mobile users in Douala + Yaoundé (6M people) |
| **SOM** (Year 3) | €20M | 5% market share across 3 verticals |

### Revenue Streams
| Source | Model |
|--------|-------|
| VoltGo | 20% commission per ride |
| VoltPay | 1.5% transaction fee + €1.99 remittance |
| VoltFind | 5% booking fee + boost listings + Pro subscriptions |

---

## Slide 6: Product — VoltGo (Mobility)

**Status: MVP LIVE ✅**

- Moto-taxis + cars
- Real-time GPS tracking
- Orange Money / MTN MoMo / Cash
- Scheduled rides + Airport Mode
- Driver safety scoring
- Push notifications

**Stack:** React Native (Expo) · Express · PostgreSQL · Socket.IO

**Deployed:** VPS live, 12 API routes, Flutterwave payments integrated

---

## Slide 7: Product — VoltPay (Fintech)

**Status: DEPLOYED ✅ (Backend)**

- Double-entry ledger engine (bank-grade)
- P2P transfers (instant, zero fee)
- Remittance: EUR → XAF @ 655.957 (CFA peg)
- Tontine digitale (traditional savings circles)
- Micro-credit P2P (trust-score based)
- Merchant QR payments
- Bill payments (ENEO, CDE, Camtel)
- Salary bulk disbursement

**Security:** mTLS · HMAC-SHA256 · Device attestation · SERIALIZABLE transactions

**Stack:** Go 1.22 · Chi · PostgreSQL 16 · Flutter (frontend planned)

---

## Slide 8: Product — VoltFind (Marketplace)

**Status: IN DEVELOPMENT 🔧**

- Housing, Cars, Jobs, Services
- SMS/OTP Login (+237)
- Orange Money / MTN MoMo / PayPal payments
- Meublée Booking System (Diaspora → Cameroon)
- Escrow deposits via VoltPay
- Agent/Pro Dashboard
- PWA (works offline)
- Social sharing (Facebook, WhatsApp)

**Stack:** Next.js 16 · Supabase · Tailwind · PWA

---

## Slide 9: The Flywheel

```
        VoltFind (Discovery)
       "I found an apartment"
              │
              ▼
        VoltPay (Payment)
     "I paid rent + deposit"
              │
              ▼
        VoltGo (Mobility)
     "I need a ride to move in"
              │
              ▼
     User stays in ecosystem
     More data → better service
     More users → more supply
              │
              ▼
        🔄 REPEAT
```

**Each app feeds the others. Users never need to leave.**

---

## Slide 10: Competitive Landscape

| | VoltGo | Bolt | Yango |
|---|--------|------|-------|
| Moto-taxis | ✅ | ❌ | ❌ |
| Orange Money | ✅ | ❌ | ❌ |
| Scheduled rides | ✅ | ✅ | ❌ |
| Airport mode | ✅ | ❌ | ❌ |
| Local team | ✅ | ❌ | ❌ |

| | VoltPay | Wave | Orange Money |
|---|---------|------|-------------|
| Tontine | ✅ | ❌ | ❌ |
| Remittance EUR→XAF | ✅ | ❌ | ❌ |
| Merchant QR | ✅ | ✅ | ✅ |
| Micro-credit | ✅ | ❌ | ❌ |
| Diaspora portal | ✅ | ❌ | ❌ |

| | VoltFind | Facebook Groups | Jumia |
|---|----------|----------------|-------|
| Meublée booking | ✅ | ❌ | ❌ |
| Escrow deposits | ✅ | ❌ | ❌ |
| Verified agents | ✅ | ❌ | ❌ |
| Diaspora rental | ✅ | ❌ | ❌ |
| Offline/PWA | ✅ | ❌ | ❌ |

**No competitor covers all three verticals. That's our moat.**

---

## Slide 11: Business Model

### Year 1 Projections (conservative)

| Revenue Stream | Monthly Users | ARPU | Monthly Revenue |
|----------------|--------------|------|-----------------|
| VoltGo rides | 5,000 | €3 | €15,000 |
| VoltPay transactions | 3,000 | €1.50 | €4,500 |
| VoltFind bookings | 500 | €10 | €5,000 |
| VoltFind boosts | 200 | €5 | €1,000 |
| **Total Month 12** | | | **€25,500** |
| **Annual Run Rate** | | | **€306,000** |

### Year 3 Target
| Metric | Value |
|--------|-------|
| Combined MAU | 100,000 |
| Monthly Revenue | €200,000 |
| Annual Revenue | €2.4M |
| Gross Margin | 65% |

---

## Slide 12: Go-to-Market

### Phase 1: Douala (Month 1-6)
- Launch VoltGo + VoltPay
- 50 drivers onboarded
- University partnerships (student riders)
- Agent network for meublée listings

### Phase 2: Yaoundé (Month 6-12)
- VoltFind marketplace launch
- Diaspora marketing (DE, FR, US communities)
- Facebook/WhatsApp viral campaigns

### Phase 3: Expansion (Year 2)
- Bafoussam, Bamenda, Kribi
- B2B: Corporate ride accounts
- API for third-party developers

### Growth Channels
- **WhatsApp viral:** Share listings, ride receipts
- **Diaspora networks:** Facebook groups (500k+ members)
- **University campuses:** Student ambassador program
- **Agent partnerships:** Real estate agents get Pro tools free

---

## Slide 13: Traction

| Milestone | Status |
|-----------|--------|
| VoltGo MVP | ✅ Live on server |
| VoltPay Backend (47 tests) | ✅ Deployed with mTLS |
| VoltFind PWA | ✅ In development |
| Booking System DB | ✅ Complete |
| 6,700+ lines of Go (VoltPay) | ✅ |
| 15 API endpoints (VoltPay) | ✅ |
| Full deployment pipeline | ✅ Docker + Nginx + TLS |
| GitHub repos | ✅ 3 active repos |

**All built by a 2-person team in < 2 months.**

---

## Slide 14: Team

### Manolo — CEO & Product
- Serial entrepreneur, Cameroon + Germany
- Deep understanding of both markets
- Product vision & business development

### Bada — CTO (AI-Augmented)
- AI-powered development partner
- Full-stack: Go, TypeScript, React Native, Flutter
- 24/7 development capability
- Infrastructure, security, and deployment

### To Hire (with funding)
- 🇨🇲 **Country Manager Cameroon** — operations, driver onboarding
- 🇨🇲 **2x Mobile Developers** — Flutter/React Native
- 🇩🇪 **Growth/Marketing** — Diaspora community building

---

## Slide 15: The Ask

### Seed Round: €300,000

| Use of Funds | Amount | Purpose |
|-------------|--------|---------|
| Product Development | €100,000 | Flutter apps, API completion, testing |
| Operations Cameroon | €80,000 | Office, driver onboarding, agent network |
| Marketing & Growth | €60,000 | Launch campaigns, university partnerships |
| Legal & Compliance | €30,000 | Fintech license, company registration |
| Infrastructure | €15,000 | Servers, APIs, security audits |
| Reserve | €15,000 | Buffer |

### What investors get
- Equity stake (negotiable, targeting 10-15%)
- Access to 27M market with zero local competition
- Super-app model proven in SEA (Grab: $40B, GoJek: $28B)
- Revenue from Month 1 (ride commissions)

---

## Slide 16: Vision

### 2026: Launch in Cameroon
### 2027: Market leader in 5 cities
### 2028: Expand to Gabon, Congo, Côte d'Ivoire
### 2029: 1M users across Central & West Africa

> **"From Cameroon to the continent.
> One app ecosystem. One Bada Inc."** 🦁

---

## Contact

**Manolo** — CEO, Bada Inc.
📧 contact@badainc.com
📱 +49 176 XXXXXXXX
🌐 badainc.com

---
*Confidential — February 2026*
