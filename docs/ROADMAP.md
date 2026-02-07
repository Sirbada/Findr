# 🗺️ Findr Feature Roadmap

## Phase 1 — Quick Wins (1-2 Wochen)
| # | Feature | Aufwand | Impact |
|---|---------|---------|--------|
| 4 | **WhatsApp Business Integration** | 1 Tag | 🔥🔥🔥 |
| 9 | **Alerts / Benachrichtigungen** | 2 Tage | 🔥🔥 |
| 6 | **Verifizierte Makler-Badges** | 2 Tage | 🔥🔥 |

## Phase 2 — Core Features (2-4 Wochen)
| # | Feature | Aufwand | Impact |
|---|---------|---------|--------|
| 1 | **Jobs & Services Board** | 1 Woche | 🔥🔥🔥 |
| 2 | **Geo-basierte Suche + Karte** | 1 Woche | 🔥🔥🔥 |
| 7 | **Diaspora-Portal** | 1 Woche | 🔥🔥🔥 |
| 5 | **Boost/Promote Listings** | 3 Tage | 💰💰💰 |

## Phase 3 — Scale (1-2 Monate)
| # | Feature | Aufwand | Impact |
|---|---------|---------|--------|
| 3 | **Preisvergleich & Preisverlauf** | 2 Wochen | 🔥🔥 |
| 10 | **Multi-City Launch** | 2 Wochen | 🔥🔥🔥 |

## Bereits in Arbeit
| Feature | Status |
|---------|--------|
| Booking System (Meublée) | ✅ DB + Spec fertig |
| SMS/OTP Login | ✅ Fertig |
| Orange Money / MTN MoMo | ✅ Fertig (Mock) |
| PayPal (Diaspora) | ✅ Fertig (Mock) |
| Pro Dashboard | ✅ Fertig |
| PWA + Service Worker | ✅ Fertig |
| Social Sharing | ✅ Fertig |

---

## Feature Details

### 1. Jobs & Services Board
- Neue Kategorie "Services" neben Housing/Cars/Jobs
- Handwerker, Haushaltshilfen, Nachhilfe, Électricien, Plombier
- "Ich suche..." / "Ich biete..." Format
- WhatsApp-Direktkontakt
- **Pages:** `/services`, `/services/[id]`, `/dashboard/new` (erweitern)

### 2. Geo-basierte Suche + Karte
- Leaflet/Mapbox Integration (Leaflet = kostenlos)
- "In meiner Nähe" mit GPS
- Quartier-Filter: Akwa, Bonapriso, Bastos, Makepe, etc.
- Kartenansicht mit Preisbubbles (wie Airbnb)
- Offline-Karten für schlechte Verbindung
- **Pages:** Karten-Toggle auf `/housing`, `/cars`, `/services`

### 3. Preisvergleich & Preisverlauf
- Durchschnittspreise pro Quartier sammeln
- "Marktpreis für 2-Zimmer in Bonapriso: 120.000-180.000 XAF"
- Preisentwicklung über Zeit (Chart)
- Hilft Käufern UND macht Makler ehrlicher
- **DB:** `price_history` Tabelle, Cron für Aggregation

### 4. WhatsApp Business Integration
- "Contacter via WhatsApp" Button auf jedem Listing
- Pre-filled Message: "Bonjour, je suis intéressé par [Listing Title]..."
- `https://wa.me/237XXXXXXXXX?text=...`
- WhatsAppButton.tsx existiert schon → erweitern
- **Aufwand:** Minimal, WhatsApp-Nummer zu Listing hinzufügen

### 5. Boost/Promote Listings
- "Mettre en avant" Button auf eigenem Listing
- Pakete: 
  - Basic: 2.000 XAF/Woche (Top in Kategorie)
  - Premium: 5.000 XAF/Woche (Homepage Featured)
  - Ultra: 10.000 XAF/Woche (Featured + Badge + Push an Suchende)
- Bezahlung: Orange Money / MTN MoMo
- **DB:** `listing_boosts` Tabelle (listing_id, tier, start, end, paid)
- **Erste Revenue-Quelle!**

### 6. Verifizierte Makler-Badges
- Pro Dashboard existiert schon ✅
- Verifikations-Flow: ID Upload → Review → Badge
- Badge-Typen:
  - 🟢 Vérifié (ID geprüft)
  - 🟡 Pro (Business registriert)
  - 🔵 Super Pro (>20 Listings, >4.5★)
- Trust-Faktor für Mieter/Käufer
- **DB:** Felder in `profiles` erweitern

### 7. Diaspora-Portal
- Dedizierte Landing Page `/diaspora`
- "Gérez vos biens depuis l'étranger"
- Features:
  - Remote Listing erstellen
  - Caretaker zuweisen (lokaler Verwalter)
  - EUR Mieteinnahmen empfangen
  - Steuer-Dokumente (Quittungen für DE/FR Steuererklärung)
- Verknüpfung mit Booking-System + VoltPay
- **Pages:** `/diaspora`, `/dashboard/landlord`

### 9. Alerts / Benachrichtigungen
- "Alertes" Feature:
  - "Benachrichtige mich bei neuer 2-Zimmer in Bonapriso unter 150k"
  - Gespeicherte Suche → Push wenn neues Listing passt
- Push Notifications (Service Worker schon da ✅)
- Email-Alerts (optional)
- **DB:** `saved_searches` Tabelle (user_id, filters, frequency)
- **Backend:** Cron/Edge Function prüft neue Listings gegen Alerts

### 10. Multi-City Launch
- Stadt-spezifische Landing Pages für SEO
  - `/douala` — "Trouvez un logement à Douala"
  - `/yaounde` — "Trouvez un logement à Yaoundé"
  - `/bafoussam`, `/bamenda`, `/kribi`
- Stadt-Daten: Quartiers, Durchschnittspreise, Beliebteste Listings
- Google SEO: Structured Data (JSON-LD) für Listings
- **Progression:** Douala → Yaoundé → Bafoussam → Bamenda → Kribi → Limbe

---
*Created: 2026-02-07 | Bada Inc.*
