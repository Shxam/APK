# PRD — IPL Dhaba: Restaurant Ordering App
**Version:** 1.1 | **Status:** Draft | **Platform:** Web + Mobile
**Changes from v1.0:** Backend stack clarified (NestJS + Prisma); auth posture unified; order status enum aligned; table-ordering deferred consistently; delivery staff mobile route added; search component scoped.

---

## 1. Executive Summary

A full-stack, production-grade restaurant ordering platform for **IPL Dhaba – Indian Prime Line** ("Tasty & Healthy") that lets customers browse the menu with photos, place orders, and track delivery in real time — all from a single web app and a companion mobile app. The restaurant owner gets an admin dashboard to manage the menu, incoming orders, and delivery status. Everything runs on a 100% free-tier infrastructure stack.

---

## 2. Problem Statement

Most small restaurants either rely on expensive third-party platforms (Swiggy/Zomato cut: 18–30%) or have no digital ordering at all. This app gives the restaurant full ownership of its ordering channel — zero commission, zero subscription fee, direct customer relationship.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target (Month 3) |
|---|---|---|
| Drive direct orders | Orders placed via app / week | 50+ |
| Reduce phone order load | % orders that are digital | > 60% |
| Customer retention | Repeat order rate | > 40% |
| Delivery accuracy | Orders delivered on time | > 90% |
| Uptime | App availability | 99.5% |

---

## 4. User Personas

### 4.1 Customer (Primary)
- Age 18–45, smartphone-first
- Wants to browse the menu visually, order quickly, and know when food arrives
- Orders for takeaway or home delivery (v1); dine-in / table ordering is v2

### 4.2 Restaurant Admin (Owner / Manager)
- Manages menu items, categories, pricing, and availability toggles
- Views and fulfills incoming orders
- Updates delivery status

### 4.3 Delivery Staff
- Receives delivery assignments via the mobile app
- Updates live location or manually marks order status (Picked Up → On the Way → Delivered)

---

## 5. Feature Scope (v1)

### 5.1 Customer — Menu Browsing
- [ ] Landing page with restaurant hero banner, logo, and tagline ("Where Flavours Hit Like a Six! 🏏")
- [ ] Horizontally scrollable category chips (Starters, Mains, Biryani, Desserts, Drinks, etc.)
- [ ] Menu item cards: photo, name, short description, price, veg/non-veg/egg badge (FSSAI standard)
- [ ] Item detail modal/page: full photo, full description, variants (size, extras), add-to-cart
- [ ] Search bar: fuzzy search across item name and description (maps to `GET /api/menu/search?q=`)
- [ ] Filter: Veg only, Non-veg only, Egg, Price range
- [ ] "Featured" / "Chef's Special" section on home (Banaras as signature dish)

### 5.2 Customer — Cart & Checkout
- [ ] Persistent floating cart button (mobile) / sidebar (web) with item count and total
- [ ] Cart drawer / bottom sheet: item list, quantity ±, remove, order summary
- [ ] Checkout form: customer name, phone, delivery address (map pin or manual entry), delivery instructions
- [ ] Payment method: Cash on Delivery (v1); online payment hook ready (v2)
- [ ] Order confirmation screen with estimated delivery time, order ID, and "check your email" notice
- [ ] Email confirmation sent to customer on order placement

> **Note:** Table number / dine-in ordering is explicitly out of scope for v1. The checkout flow captures delivery address only.

### 5.3 Customer — Order Tracking
- [ ] Live order status timeline: Placed → Confirmed → Preparing → Out for Delivery → Delivered
- [ ] Estimated time countdown
- [ ] Map view showing delivery agent's live location when status is `out_for_delivery` (Option B, v1.5 — manual status-only for v1)
- [ ] "Call restaurant" button
- [ ] Order history page with re-order button

### 5.4 Admin Panel (Web Only)
- [ ] Secure email/password login protected by JWT role check (role = `admin` in profiles table via custom JWT claim)
- [ ] Dashboard: today's orders count, revenue, pending orders ring chart
- [ ] Order queue: real-time incoming orders via Supabase Realtime (WebSocket); 4-second polling fallback if Realtime is unavailable
- [ ] Order detail: items, customer info, delivery address on map
- [ ] Status update per order through each fulfillment stage: `placed → confirmed → preparing → out_for_delivery → delivered`
- [ ] Menu management: add / edit / delete items, toggle availability, reorder categories
- [ ] Photo upload for menu items (drag-and-drop, compressed to WebP < 200KB before upload)
- [ ] Analytics: weekly revenue, popular items, peak hours chart

### 5.5 Delivery Staff (Lightweight Mobile Screen)
- [ ] View assigned orders (dedicated tab in mobile app under `(delivery)/` route group)
- [ ] Mark: Picked Up / On the Way / Delivered (maps to `out_for_delivery` status)
- [ ] Share live location (browser GPS or Expo Location) — v1.5; manual status-only for v1

---

## 6. User Stories (Key)

```
As a customer,
I want to browse the menu by category with photos,
So that I can quickly find something I want to order.

As a customer,
I want to track my delivery in real time,
So that I know exactly when to expect my food.

As an admin,
I want to receive a real-time notification when a new order comes in,
So that I can confirm it without refreshing the page.

As an admin,
I want to toggle a menu item's availability instantly,
So that I can handle sold-out situations without editing the whole menu.

As a delivery staff member,
I want to update my order status with one tap,
So that the customer and admin stay informed without calls.
```

---

## 7. Non-Functional Requirements

### 7.1 Performance
- First Contentful Paint (web): < 1.5s on 4G
- Largest Contentful Paint: < 2.5s
- Menu images: WebP format, served from Supabase CDN, lazy-loaded
- Bundle size: < 200KB JS (gzipped) for initial page

### 7.2 Reliability
- Real-time order updates must not drop silently — implement reconnection logic
- Supabase free tier limits monitored; alert admin when approaching 500MB DB or 1GB storage
- Graceful degradation: if Supabase Realtime is unavailable, fall back to 4-second polling

### 7.3 Security
- Row-Level Security (RLS) on all Supabase tables — customers can only read their own orders
- Admin routes protected by `role = 'admin'` claim; claim injected via Supabase custom JWT hook (DB function on `auth.users`), not read from bare `session.user` object
- All API routes validate auth token server-side (NestJS guards + Supabase service role key)
- No secrets in client-side code (Next.js env vars properly namespaced; NestJS `.env` gitignored)
- Input sanitization on all user-submitted text
- Rate limiting on checkout endpoint (prevent order flooding)

### 7.4 Accessibility
- WCAG 2.1 AA compliance
- All interactive elements keyboard-navigable
- Minimum contrast ratio 4.5:1 for body text
- Screen reader labels on icon buttons
- Reduced motion support

### 7.5 SEO (Web)
- Next.js metadata API: restaurant name ("IPL Dhaba"), description, OG image
- Structured data (JSON-LD): LocalBusiness + Menu schema
- Sitemap.xml auto-generated

---

## 8. Out of Scope for v1

- Multi-branch support
- Loyalty points / rewards program
- **Table-side / dine-in ordering** (QR code; `Table No.` field in cart is v2)
- Push notifications (mobile) — v2
- Online payment gateway — v2
- Review and rating system — v2
- Coupon / discount engine — v2
- Multiple language support
- Live GPS map tracking for delivery — v1.5 (manual status updates in v1)

---

## 9. Dependencies & Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Supabase free tier limits hit | Medium | Monitor usage; Supabase Pro ($25/mo) if needed |
| Map API costs if Google Maps used | High | Use OpenStreetMap + Leaflet (free forever) |
| Expo EAS build quota (30/month) | Low | Build locally with `expo export` when quota tight |
| Poor image performance | Medium | Compress all uploads to WebP < 200KB before Supabase Storage |
| Admin notification missed | Medium | Supabase Realtime primary; 4s polling as fallback |
| Custom JWT claim not set | High | Supabase hook must populate `role` on `auth.users` insert; test before launch |

---

## 10. Launch Checklist

- [ ] Domain configured on Vercel (use free `.vercel.app` subdomain to start)
- [ ] Supabase project set up with all tables, RLS policies, and custom JWT role hook
- [ ] NestJS backend deployed (Railway / Render free tier)
- [ ] All menu items entered with photos (including Banaras signature dish)
- [ ] Restaurant logo and hero banner uploaded to Supabase Storage
- [ ] Admin account created and role claim verified in JWT
- [ ] End-to-end order flow tested: place → confirm → track → deliver
- [ ] Delivery staff mobile screen tested (assigned order → status update)
- [ ] Mobile app tested on iOS and Android via Expo Go
- [ ] Email confirmation working (Resend)
- [ ] Error monitoring (Sentry) active
- [ ] Restaurant phone number visible on all order screens
- [ ] Supabase usage alerts configured (DB, Storage, MAU thresholds)