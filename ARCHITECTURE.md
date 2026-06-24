# ARCHITECTURE.md — IPL Dhaba Restaurant Ordering App
**Version:** 1.1 | Stack: 100% Free-Tier Production
**Changes from v1.0:** Backend clarified as NestJS + Prisma (not Next.js API Routes); auth middleware fixed (custom JWT claim, not bare session.user.role); order_status enum aligned with DESIGN and PRD; delivery mobile route group added; realtime vs polling posture unified.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                │
│  ┌───────────────────┐        ┌────────────────────────────┐   │
│  │   Next.js Web     │        │   Expo React Native App    │   │
│  │  (Customer +      │        │  (Customer + Delivery)     │   │
│  │   Admin Panel)    │        │                            │   │
│  └────────┬──────────┘        └──────────────┬─────────────┘   │
└───────────┼──────────────────────────────────┼─────────────────┘
            │ HTTPS / WSS (Supabase Realtime)  │
┌───────────┼──────────────────────────────────┼─────────────────┐
│           │          BACKEND LAYER            │                 │
│  ┌────────▼──────────────────────────────────▼─────────────┐   │
│  │          NestJS REST API (TypeScript + Prisma)           │   │
│  │   /orders  /menu  /auth  /tracking  /admin/*            │   │
│  └────────────────────────────┬─────────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                         SUPABASE                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  PostgreSQL  │  │  Auth (JWT)  │  │  Storage (Images)  │    │
│  │   (Prisma)   │  │  + RLS       │  │  Supabase CDN      │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │          Realtime (WebSocket channels)                  │     │
│  │  channel: order-{orderId}   channel: admin-orders       │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
       ┌──────▼─────┐  ┌───────▼──────┐  ┌───────▼──────┐
       │   Resend   │  │    Sentry    │  │   Vercel     │
       │  (Email)   │  │  (Errors)   │  │  (Hosting)   │
       └────────────┘  └─────────────┘  └──────────────┘
```

---

## 2. Tech Stack (100% Free-Tier)

| Layer | Technology | Free Tier |
|---|---|---|
| **Web Frontend** | Next.js 14 (App Router) + TypeScript | Open source |
| **Mobile** | React Native + Expo SDK 51 | Open source |
| **Styling (Web)** | Tailwind CSS + shadcn/ui | Open source |
| **Styling (Mobile)** | NativeWind v4 | Open source |
| **State Management** | Zustand | Open source |
| **Forms + Validation** | React Hook Form + Zod | Open source |
| **Backend** | NestJS + TypeScript | Open source |
| **ORM** | Prisma (Supabase PostgreSQL) | Open source |
| **Database** | Supabase PostgreSQL | 500MB, 50K MAU |
| **Auth** | Supabase Auth (email OTP / Google OAuth) | Included |
| **File Storage** | Supabase Storage | 1GB |
| **Real-time** | Supabase Realtime (WebSocket); 4s polling fallback | 200 concurrent |
| **Maps** | Leaflet + OpenStreetMap (Web) / react-native-maps (Mobile) | Free forever |
| **Email** | Resend | 3,000 / month |
| **Error Tracking** | Sentry | 5K events / month |
| **Web Hosting** | Vercel (frontend) | 100GB bandwidth |
| **Backend Hosting** | Railway or Render (NestJS) | Free tier |
| **Mobile Builds** | Expo EAS | 30 builds / month |
| **Analytics** | Vercel Analytics | Free on hobby plan |

**Payment (when ready):** Razorpay or Cashfree — no integration cost; per-transaction fee only (~2%).

---

## 3. Monorepo Structure

```
restaurant-app/
├── apps/
│   ├── web/                    # Next.js 14 App (frontend only)
│   │   ├── app/
│   │   │   ├── (customer)/     # Customer-facing routes
│   │   │   │   ├── page.tsx                # Home / Menu
│   │   │   │   ├── cart/page.tsx
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx            # Order history
│   │   │   │   │   └── [id]/page.tsx       # Order tracking
│   │   │   │   └── profile/page.tsx
│   │   │   ├── (admin)/        # Admin routes (protected)
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── menu/page.tsx
│   │   │   │   └── analytics/page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── menu/           # MenuCard, CategoryChips, ItemModal, SearchBar
│   │   │   ├── cart/           # CartFAB, CartItem, CartDrawer
│   │   │   ├── orders/         # StatusTimeline, TrackingMap
│   │   │   └── admin/          # OrderCard, MenuEditor, Analytics
│   │   ├── hooks/              # useCart, useOrders, useMenu
│   │   ├── lib/
│   │   │   ├── supabase/       # supabase browser client (auth + realtime only)
│   │   │   ├── api/            # NestJS API client (axios/fetch wrappers)
│   │   │   └── utils.ts
│   │   └── public/
│   │       ├── logo.svg
│   │       └── hero.webp
│   │
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── orders/
│   │   │   ├── menu/
│   │   │   ├── auth/
│   │   │   ├── tracking/
│   │   │   └── admin/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── .env                # never committed; gitignored
│   │
│   └── mobile/                 # Expo React Native App
│       ├── app/
│       │   ├── (tabs)/
│       │   │   ├── index.tsx           # Home / Menu
│       │   │   ├── orders.tsx          # Order history
│       │   │   └── profile.tsx
│       │   ├── (delivery)/             # Delivery staff screens
│       │   │   └── index.tsx           # Assigned orders + status update
│       │   ├── item/[id].tsx           # Item detail
│       │   ├── cart.tsx
│       │   ├── checkout.tsx
│       │   └── tracking/[id].tsx
│       ├── components/
│       ├── hooks/
│       └── assets/
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   └── index.ts            # Order, MenuItem, User, etc.
│   ├── utils/                  # Shared utility functions
│   │   └── formatPrice.ts
│   └── config/                 # Shared constants
│       └── orderStatus.ts
│
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Initial menu seed data
│
├── turbo.json                  # Turborepo config
└── package.json
```

---

## 4. Database Schema

### 4.1 Entity Relationship

```
profiles ──────────< orders >──────────── order_items >──── menu_items
                                                                  │
                      delivery_tracking                      categories
                            │
                          orders
```

### 4.2 SQL Schema

```sql
-- ── PROFILES ─────────────────────────────────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  name        TEXT,
  phone       TEXT,
  email       TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'delivery')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── RESTAURANT SETTINGS ──────────────────────────────────────────
CREATE TABLE restaurant_settings (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  logo_url               TEXT,
  hero_url               TEXT,
  tagline                TEXT,
  address                TEXT,
  phone                  TEXT,
  email                  TEXT,
  opening_hours          JSONB,  -- { "mon": "10:00-22:00", ... }
  delivery_radius_km     NUMERIC DEFAULT 5,
  min_order_amount       NUMERIC DEFAULT 100,
  delivery_fee           NUMERIC DEFAULT 30,
  estimated_delivery_min INTEGER DEFAULT 30,
  is_open                BOOLEAN DEFAULT true,
  created_at             TIMESTAMPTZ DEFAULT now()
);

-- ── CATEGORIES ───────────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  emoji       TEXT,          -- Display emoji e.g. 🍛
  image_url   TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── MENU ITEMS ───────────────────────────────────────────────────
CREATE TABLE menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES categories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL,
  image_url    TEXT,
  food_type    TEXT DEFAULT 'veg' CHECK (food_type IN ('veg', 'non_veg', 'egg')),
  is_available BOOLEAN DEFAULT true,
  is_featured  BOOLEAN DEFAULT false,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ── MENU ITEM VARIANTS ───────────────────────────────────────────
CREATE TABLE menu_item_variants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id   UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,    -- "Regular", "Large", "Extra"
  price_modifier NUMERIC(10,2) DEFAULT 0,   -- added to base price
  sort_order     INTEGER DEFAULT 0
);

-- ── ADDRESSES ────────────────────────────────────────────────────
CREATE TABLE addresses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label        TEXT,              -- "Home", "Office"
  address_line TEXT NOT NULL,
  city         TEXT,
  pincode      TEXT,
  latitude     NUMERIC(10,7),
  longitude    NUMERIC(10,7),
  is_default   BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── ORDERS ───────────────────────────────────────────────────────
-- Canonical status progression: placed → confirmed → preparing → out_for_delivery → delivered
-- cancelled is a terminal state reachable from any non-delivered status
CREATE TYPE order_status AS ENUM (
  'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
);

CREATE TYPE payment_method AS ENUM ('cod', 'online');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          SERIAL UNIQUE,   -- Human readable: #1001, #1002
  customer_id           UUID REFERENCES profiles(id),
  status                order_status DEFAULT 'placed',
  subtotal              NUMERIC(10,2) NOT NULL,
  delivery_fee          NUMERIC(10,2) DEFAULT 30,
  total_amount          NUMERIC(10,2) NOT NULL,
  delivery_address      JSONB NOT NULL,  -- snapshot of address at order time
  delivery_instructions TEXT,
  payment_method        payment_method DEFAULT 'cod',
  payment_status        payment_status DEFAULT 'pending',
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  cancelled_reason      TEXT,
  assigned_delivery_id  UUID REFERENCES profiles(id),
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ── ORDER ITEMS ──────────────────────────────────────────────────
CREATE TABLE order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id   UUID REFERENCES menu_items(id),
  variant_id     UUID REFERENCES menu_item_variants(id),
  name           TEXT NOT NULL,    -- snapshot of item name
  variant_name   TEXT,
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  unit_price     NUMERIC(10,2) NOT NULL,
  subtotal       NUMERIC(10,2) NOT NULL
);

-- ── DELIVERY TRACKING ────────────────────────────────────────────
CREATE TABLE delivery_tracking (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  latitude   NUMERIC(10,7),
  longitude  NUMERIC(10,7),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── INDEXES ──────────────────────────────────────────────────────
CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_created_at  ON orders(created_at DESC);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured) WHERE is_featured = true;

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── CUSTOM JWT CLAIM (role injection) ─────────────────────────────
-- This function runs on every token refresh and injects the user's role
-- into the JWT so it is readable server-side. Without this, reading
-- session.user.role in middleware returns undefined.
CREATE OR REPLACE FUNCTION auth.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;
  claims := event->'claims';
  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{role}', to_jsonb(user_role));
  END IF;
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

GRANT EXECUTE ON FUNCTION auth.custom_access_token_hook TO supabase_auth_admin;
-- Enable in Supabase Dashboard → Authentication → Hooks → Custom Access Token
```

### 4.3 Row-Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- MENU ITEMS (public read)
CREATE POLICY "Anyone can view active menu items"
  ON menu_items FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage menu items"
  ON menu_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ORDERS
CREATE POLICY "Customers view own orders"
  ON orders FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers insert own orders"
  ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins view all orders"
  ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'delivery')));

CREATE POLICY "Admins update orders"
  ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- DELIVERY TRACKING (public read for order owner)
CREATE POLICY "Customer can view own order tracking"
  ON delivery_tracking FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE id = delivery_tracking.order_id
    AND customer_id = auth.uid()
  ));

CREATE POLICY "Delivery staff can update tracking"
  ON delivery_tracking FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'delivery')));
```

---

## 5. API Design

All REST endpoints are served by the **NestJS backend** (not Next.js API routes). The Next.js frontend calls the NestJS API over HTTPS. Auth tokens are passed as `Authorization: Bearer <jwt>` headers.

### 5.1 REST Endpoints (NestJS)

```
GET    /menu                     # All categories + items (public)
GET    /menu/:categoryId         # Items in category
GET    /menu/featured            # Featured items (is_featured = true)
GET    /menu/search?q=           # Fuzzy search across name + description

POST   /orders                   # Create order (auth required)
GET    /orders                   # Customer's order history (auth)
GET    /orders/:id               # Single order detail
PATCH  /orders/:id/status        # Update status (admin only)

GET    /tracking/:orderId        # Get delivery location
PATCH  /tracking/:orderId        # Update location (delivery staff)

GET    /admin/orders             # All orders with filters (admin)
GET    /admin/analytics          # Revenue, popular items (admin)

POST   /admin/menu/items         # Add menu item (admin)
PATCH  /admin/menu/items/:id     # Edit item (admin)
DELETE /admin/menu/items/:id     # Delete item (admin)
POST   /admin/menu/upload        # Upload food photo → Supabase Storage (admin)
```

### 5.2 Supabase Realtime Channels

Realtime is used **directly from the frontend** (bypassing NestJS) for low-latency push. NestJS handles all writes; Supabase Realtime notifies clients of changes.

```typescript
// Customer subscribes to their order
supabase
  .channel(`order-${orderId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, handleOrderUpdate)
  .subscribe()

// Admin subscribes to all new orders
supabase
  .channel('admin-orders')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orders'
  }, handleNewOrder)
  .subscribe()

// Customer subscribes to delivery tracking
supabase
  .channel(`tracking-${orderId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'delivery_tracking',
    filter: `order_id=eq.${orderId}`
  }, handleLocationUpdate)
  .subscribe()
```

**Fallback:** If the Realtime channel does not connect within 3 seconds, the admin dashboard falls back to polling `GET /admin/orders` every 4 seconds (shown via pulsing dot indicator in the UI).

---

## 6. Authentication Flow

```
Customer:
  1. Enter phone / email
  2. Supabase sends OTP (email) — free
  3. Verify OTP → session JWT issued
  4. Profile auto-created via DB trigger on auth.users insert
  5. JWT includes role = 'customer' via custom_access_token_hook

Admin:
  1. Admin email/password login (Supabase Auth)
  2. JWT decoded; role = 'admin' is read from JWT claims (injected by custom hook)
  3. Admin routes protected via Next.js middleware AND NestJS guards

Google OAuth (optional free upgrade):
  1. "Continue with Google" button
  2. Supabase handles OAuth redirect
  3. Profile created/linked on first sign-in; role defaults to 'customer'
```

### Auth Middleware (Next.js frontend)

```typescript
// middleware.ts
// IMPORTANT: role is read from JWT claims, not session.user.role directly.
// Requires custom_access_token_hook to be active in Supabase.
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })
  const { data: { session } } = await supabase.auth.getSession()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const role = session?.user?.user_metadata?.role
      ?? (session as any)?.access_token_claims?.role  // from custom hook
    if (!session || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
```

### NestJS Auth Guard

```typescript
// auth.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!requiredRoles) return true
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return false
    // Role is in JWT claims injected by custom_access_token_hook
    const role = user.app_metadata?.role ?? user.user_metadata?.role
    return requiredRoles.includes(role)
  }
}
```

---

## 7. State Management Architecture

```
Cart State (Zustand + localStorage persist)
├── items: CartItem[]
├── addItem(item, variant, qty)
├── removeItem(itemId)
├── updateQty(itemId, qty)
├── clearCart()
├── total: number (computed)
└── itemCount: number (computed)

Order State (Zustand)
├── currentOrder: Order | null
├── orderHistory: Order[]
├── setCurrentOrder(order)
└── fetchOrders()

Menu State (Zustand + SWR/React Query)
├── categories: Category[]
├── items: Record<categoryId, MenuItem[]>
├── featuredItems: MenuItem[]
├── activeCategory: string
└── searchQuery: string
```

---

## 8. Image Storage Strategy

```
Supabase Storage Buckets:

menu-images/          ← public bucket (read by anyone)
  items/
    {item-id}.webp
  categories/
    {category-id}.webp

restaurant/           ← public bucket
  logo.svg
  hero.webp
```

### Upload Flow (Admin)
```
1. Admin selects image file
2. Browser compresses to WebP < 200KB (browser-image-compression)
3. POST to /admin/menu/upload (NestJS endpoint)
4. Server validates file type, size
5. Upload to Supabase Storage via service role key
6. Returns public CDN URL
7. URL stored in menu_items.image_url via Prisma
```

---

## 9. Delivery Tracking Flow

```
Option A — Manual Status Updates (v1, recommended)
  Delivery staff → Mobile app (delivery) tab → Tap status button
  → PATCH /tracking/:orderId { status: 'out_for_delivery' }
  Customer sees: timeline status only, no live map

Option B — Live GPS Tracking (v1.5)
  Delivery staff shares location via browser GPS or Expo Location
  Every 15 seconds: PATCH /tracking/:orderId with lat/lng
  Customer sees: Leaflet map with live delivery marker
  
  Battery optimization: track only when order is out_for_delivery
  Auto-stop: tracking stops 5 min after delivered
```

---

## 10. Email Notification Flow (Resend)

```
Order Placed → Resend API
  To: customer email
  Template: Order confirmation with items, total, ETA
  UI note: Confirmation screen shows "Check your email for your order receipt"

Order Confirmed → Resend API
  To: customer email
  Template: "Your order is confirmed! Preparing now..."

Order Out for Delivery → Resend API
  To: customer email
  Template: "Your order is on the way! Track it here: [link]"

New Order → Resend API
  To: restaurant owner email
  Template: "New order #1042 — ₹480 — [View in Dashboard]"
```

---

## 11. Deployment Architecture

### Web Frontend (Vercel — Free Tier)
```
GitHub push → Vercel build → Edge deployment
                              ├── CDN: static assets
                              └── Edge: middleware (auth checks)

Environment variables (Vercel dashboard):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_API_URL          ← NestJS backend URL
  SENTRY_DSN
```

### Backend (Railway or Render — Free Tier)
```
GitHub push → Railway/Render build → NestJS server

Environment variables:
  DATABASE_URL                 ← Supabase PostgreSQL connection string (for Prisma)
  SUPABASE_SERVICE_ROLE_KEY    ← server only, never expose to client
  RESEND_API_KEY
  SENTRY_DSN
  JWT_SECRET
```

### Mobile (Expo EAS — Free Tier)
```
eas build --platform all --profile preview
  → iOS .ipa (TestFlight)
  → Android .apk (direct install)

Production release:
  → iOS: App Store ($99/yr Apple Developer — only cost)
  → Android: Play Store ($25 one-time — only cost)

Skip store entirely: Share Expo Go QR code for testing
```

### Supabase (Free Tier)
```
Project: ipldhaba
Region: ap-south-1 (Mumbai — lowest latency from India)

Monitor (Supabase Dashboard):
  - DB size: target < 400MB (buffer before 500MB limit)
  - Storage: target < 800MB
  - API requests: unlimited on free tier
  - Realtime connections: 200 concurrent (plenty for small restaurant)
```

---

## 12. Performance Optimizations

```
Web:
├── next/image for all menu photos (auto WebP, lazy load, blur placeholder)
├── Static generation for menu page (ISR: revalidate every 60s)
├── Dynamic imports for admin dashboard (code splitting)
├── NestJS query optimization: Prisma select specific fields, not full objects
└── Bundle analyzer: @next/bundle-analyzer

Mobile:
├── FlatList with getItemLayout for fixed-height menu cards (no scroll jank)
├── expo-image for WebP with memory cache
├── Skeleton loaders with react-native-skeleton
└── Virtualized category sections
```

---

## 13. Free Tier Limits — Alert Thresholds

| Service | Limit | Alert At |
|---|---|---|
| Supabase DB | 500 MB | 400 MB |
| Supabase Storage | 1 GB | 800 MB |
| Supabase MAU | 50,000 | 40,000 |
| Resend Emails | 3,000/month | 2,500/month |
| Sentry Events | 5,000/month | 4,000/month |
| Vercel Bandwidth | 100 GB | 80 GB |

Set up Supabase usage alerts in the project dashboard. Build a simple admin widget showing current usage vs. limits.

---

## 14. Security Checklist

- [ ] All tables have RLS enabled with explicit policies
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only in NestJS backend env; never in client-side code
- [ ] `custom_access_token_hook` enabled in Supabase Auth Hooks; role verified before any admin operation
- [ ] Admin role checked via NestJS `RolesGuard` on every admin endpoint (not just middleware)
- [ ] File upload: validate MIME type + max size (5MB) server-side in NestJS
- [ ] SQL injection: impossible via Prisma (parameterized queries)
- [ ] XSS: Next.js auto-escapes JSX; validate all rich text inputs
- [ ] CSRF: cookies with SameSite=Strict; stateless JWT preferred over session cookies
- [ ] Rate limiting: Upstash Redis (free tier) or NestJS `@nestjs/throttler` on checkout endpoint
- [ ] Environment variables: never commit `.env` / `.env.local` to git (add to `.gitignore`)
- [ ] HTTPS everywhere: enforced by Vercel (frontend) and Railway/Render (backend) automatically