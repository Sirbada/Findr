# Findr Sprint Plan — Market-Ready in 7 Tage

## Status Quo (10.02.2026 — UPDATED)
- 76+ Source Files, Next.js 16 + Supabase + Tailwind 4 + PWA Manifest ✅
- Live auf VPS: http://72.60.34.105:3002
- Auth ✅, Listings ✅, Dashboard (8 pages) ✅, Booking System ✅, Payment Callbacks ✅, Reviews ✅, PWA ✅, i18n (FR/EN) ✅
- DB: 17 Demo Listings mit Bildern ✅, 4 Demo Users ✅
- Missing: Payment live (needs MoMo/Orange registration), SMS Verify, Performance, Domain

## Sprint 1: Core Fixes (Tag 1-3) — Bada Lead ✅ DONE
- [x] Payment Callback API Routes (MoMo + Orange) ✅
- [x] Payment Status Check API ✅
- [x] SEO: sitemap.ts + robots.txt ✅
- [x] Demo Data: 17 Listings with Unsplash images ✅
- [x] Legal Pages: Mentions Légales + CGU ✅
- [x] Footer Links updated ✅
- [x] Supabase Service Role Key configured ✅
- [x] Search & Filter — EXISTS in all category pages ✅
- [x] Dashboard discovered: 8 pages (main, new, edit, bookings, analytics, notifications, messages, pro) ✅
- [x] Auth system with useAuth context ✅
- [x] Image Upload system with Supabase Storage ✅
- [x] Multi-category support (housing, cars, terrain, jobs, services) ✅

## Sprint 2: Database + Final Polish (Tag 3-5) 
- [x] SEO: Sitemap, robots.txt, JSON-LD ✅
- [x] **DB Schema Created** — SQL script with 4 tables + RLS policies + indexes ✅
- [ ] SMS Verification (Twilio)
- [ ] Performance: Lazy Loading States
- [ ] Error Handling for missing tables  
- [ ] End-to-End Booking Test with real data

## Sprint 3: Launch (Tag 5-7) — DevOps Agent
- [ ] Domain: findr.cm (oder voltfind.com)
- [ ] SSL + Nginx Config
- [ ] CDN für Bilder (Supabase Storage oder Cloudflare)
- [ ] Analytics (Plausible oder Umami — self-hosted)
- [ ] Legal: Mentions Légales, CGU, Datenschutz
- [ ] Social Media Assets (OG Image, App Icon final)
- [ ] Launch Checklist & Go-Live

## Agent Allocation
| Agent | Tasks | Model |
|-------|-------|-------|
| Bada (main) | Sprint 1 Core, Architecture Decisions | Opus |
| DevOps | VPS Deploy, SSL, Domain, Nginx, Analytics | Sonnet |
| Researcher | MoMo/Orange API Docs, SEO Best Practices, Legal Templates CM | Sonnet |

## Ziel
Market-ready PWA für Kamerun — Proof of Work für Ministerium
