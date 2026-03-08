# 🏠 Findr Booking System — Spec

## Overview
Diaspora-Kameruner können möblierte Apartments (Appartements Meublés) remote vermieten.
Mieter in Kamerun buchen und bezahlen alles in der App.

## User Flows

### Flow 1: Vermieter (Diaspora) erstellt Listing
```
1. Login (SMS OTP +49/+33/+237)
2. "Nouveau Logement" → Kategorie: "Meublé"
3. Fotos, Beschreibung, Preis, Amenities
4. Verfügbarkeit setzen (Kalender)
5. Kaution festlegen (Standard: 2 Monatsmieten)
6. Payout-Methode: EUR Banküberweisung / MoMo / Orange Money
7. Veröffentlichen → Review → Live
```

### Flow 2: Mieter bucht Apartment
```
1. Suche: "Meublé Douala Bonapriso"
2. Listing ansehen → Fotos, Preis, Bewertungen
3. "Réserver" → Nachricht an Vermieter
4. Vermieter bestätigt → Booking "confirmed"
5. Mieter zahlt: Kaution + 1. Miete + Service Fee (5%)
   → Kaution geht in ESCROW (nicht an Vermieter!)
   → Miete wird ausgezahlt
6. Digitaler Mietvertrag → beide unterschreiben
7. Check-in Datum → Status "active"
```

### Flow 3: Monatliche Miete
```
1. 3 Tage vor Fälligkeit: Push Notification
2. Mieter zahlt per Orange Money / MTN MoMo
3. Geld wird an Vermieter ausgezahlt
   → XAF (lokal) oder EUR (Diaspora, Rate: 655.957)
4. Quittung automatisch generiert
5. Bei Nichtzahlung: Erinnerung → Warnung → Vermieter benachrichtigt
```

### Flow 4: Auszug & Kaution
```
1. Mieter kündigt / Mietzeit endet
2. Vermieter (oder Caretaker) prüft Wohnung
3. Alles okay → Kaution wird freigegeben (aus Escrow)
4. Schäden → Abzug von Kaution, Rest zurück
5. Beide können Review schreiben
```

## Revenue Model
| Source | Fee | Paid by |
|--------|-----|---------|
| Booking Service Fee | 5% erste Miete | Mieter |
| Monthly Processing | 1.5% | Mieter |
| EUR Payout | 1.99€ flat | Vermieter |
| Boost Listing | 2,000-5,000 XAF/Woche | Vermieter |
| Pro Abo (Multi-Apartments) | 10,000 XAF/Monat | Vermieter |

## Database Tables
- `landlord_profiles` — Vermieter mit Diaspora-Info + Payout
- `bookings` — Buchungen mit Status-Machine
- `rental_payments` — Monatliche Mietzahlungen
- `availability` — Verfügbarkeitskalender
- `reviews` — Zwei-Wege-Bewertungen
- `listings` + neue Spalten: is_meublee, deposit_months, accepts_diaspora, etc.

## VoltPay Integration (Phase 2)
- Escrow für Kaution → VoltPay Escrow Service
- MoMo/Orange Pay-in → VoltPay Payment Gateway
- EUR Payout → VoltPay Remittance (XAF→EUR @ 655.957)
- Shared KYC → Ein Account für Findr + VoltPay

## Pages to Build
- `/meublee` — Meublée Listing-Übersicht
- `/meublee/[id]` — Detail + Booking Button
- `/meublee/[id]/book` — Booking Flow (Dates, Message, Pay)
- `/dashboard/bookings` — Meine Buchungen (Mieter)
- `/dashboard/landlord` — Vermieter Dashboard
- `/dashboard/landlord/payouts` — Auszahlungen (EUR/XAF)
- `/dashboard/landlord/calendar` — Verfügbarkeitskalender

---
*Created: 2026-02-07 | Bada Inc.*
