# IPL Dhaba — UI/UX Design Specification
> Reverse-engineered from `resto-order-125.preview.emergentagent.com`  
> Target stack: Next.js 14 + Tailwind CSS
> **v1.1 changes:** Auth added to `/admin`; order status enum aligned with DB; `Table No.` field removed from cart (v2); delivery staff screen added; search component added to checklist; `ready` status removed (not in DB enum); email note added to order success screen.

---

## 1. Brand Identity

| Token | Value |
|---|---|
| **App name** | IPL Dhaba |
| **Full name** | Indian Prime Line |
| **Tagline** | Tasty & Healthy |
| **Hero line** | Where Flavours Hit Like a Six! 🏏 |
| **Signature dish** | Banaras |
| **Theme** | Cricket + Indian street food/dhaba culture |

---

## 2. Color Palette

Derived from the cricket-meets-dhaba aesthetic (saffron/green/white from the Indian flag, cricket pitch earth tones):

```css
:root {
  /* Primary */
  --color-saffron:     #FF6B00;   /* Primary CTA, badges, accent */
  --color-green:       #1A6B3A;   /* Open status, success, secondary CTA */
  --color-cream:       #FFF8F0;   /* Page background */

  /* Neutrals */
  --color-ink:         #1C1C1C;   /* Headings, body text */
  --color-muted:       #6B6B6B;   /* Subtitles, labels */
  --color-border:      #E8E0D5;   /* Card borders, dividers */
  --color-surface:     #FFFFFF;   /* Card backgrounds */

  /* Status — aligned with order_status DB enum */
  --color-placed:          #6B7280;   /* Placed (neutral grey) */
  --color-confirmed:       #3B82F6;   /* Confirmed (blue) */
  --color-preparing:       #F59E0B;   /* Preparing (amber) */
  --color-out-for-delivery:#8B5CF6;   /* Out for delivery (purple) */
  --color-delivered:       #10B981;   /* Delivered (green) */
  --color-cancelled:       #EF4444;   /* Cancelled (red) */

  /* Overlay */
  --color-hero-overlay: rgba(0, 0, 0, 0.45); /* Over hero image */
}
```

---

## 3. Typography

```css
/* Display: for restaurant name, section headings */
@import url('https://fonts.googleapis.com/css2?family=Yatra+One&display=swap');

/* Body: UI copy, descriptions, prices */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Yatra One', cursive;   /* Cricket/Devanagari-influenced serif feel */
  --font-body:    'Inter', sans-serif;

  /* Scale */
  --text-hero:    clamp(2rem, 5vw, 3.5rem);   /* "IPL Dhaba" hero title */
  --text-h2:      1.5rem;                      /* Section headings */
  --text-h3:      1.125rem;                    /* Card titles */
  --text-body:    0.9375rem;                   /* Normal copy */
  --text-sm:      0.8125rem;                   /* Labels, badges */
  --text-xs:      0.75rem;                     /* Meta, timestamps */
}
```

---

## 4. Page Structure — Customer App

### 4.1 Full Page Layout

```
┌─────────────────────────────────────────────┐
│  HERO SECTION  (full-width image + overlay) │
│  ┌──────────────────────────────────────┐   │
│  │  [Logo]           [Admin link]       │   │
│  │                                      │   │
│  │  ● Open Now                          │   │
│  │  IPL Dhaba               (display)   │   │
│  │  Indian Prime Line — Tasty & Healthy │   │
│  │  Where Flavours Hit Like a Six! 🏏   │   │
│  └──────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  SEARCH BAR  (below hero, above categories) │
│  🔍 Search dishes...                        │
├─────────────────────────────────────────────┤
│  CATEGORY FILTER BAR  (sticky, horizontal)  │
│  [All] [Starters] [Mains] [Breads] [Drinks] │
├─────────────────────────────────────────────┤
│  MENU GRID  (2-col mobile / 3-col desktop)  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Item Card│  │ Item Card│  │ Item Card│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ...                                        │
├─────────────────────────────────────────────┤
│  CART FAB / BOTTOM SHEET  (slide-in)        │
│  🛒  3 items · ₹360                         │
└─────────────────────────────────────────────┘
```

---

### 4.2 Hero Section

**Component:** `<HeroSection />`

- **Background:** Full-width restaurant/food photograph  
  → Source: `image_1782051923727-Bb9wwFeL.png` (replace with your own)
- **Overlay:** `rgba(0,0,0,0.45)` gradient over the image
- **Height:** `min-h-[40vh]` on mobile, `min-h-[55vh]` on desktop
- **Logo:** Positioned top-left, white/transparent background  
  → Source: `image_1782056017531-D-Wv4KKk.png`
- **Admin link:** Top-right corner, small text link (`text-white/70 text-sm`) — links to `/admin/login`

**Content block** (bottom-left aligned over overlay):
```
● Open Now                    ← green dot + text, pill badge
IPL Dhaba                     ← var(--font-display), var(--text-hero), white
Indian Prime Line — Tasty & Healthy  ← Inter 500, white/80
Where Flavours Hit Like a Six! 🏏    ← Inter 400 italic, white/70, text-sm
```

**Open Now badge:**
```css
.open-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(26, 107, 58, 0.85);
  color: #fff;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
}
.open-badge::before {
  content: '';
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s infinite;
}
```

---

### 4.3 Search Bar

**Component:** `<SearchBar />`

Placed between the Hero and the Category Filter Bar. Calls `GET /menu/search?q=` on the NestJS backend (debounced 300ms).

```css
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 10px 18px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: var(--text-body);
  color: var(--color-ink);
  background: transparent;
}
.search-bar input::placeholder { color: var(--color-muted); }
```

---

### 4.4 Category Filter Bar

**Component:** `<CategoryBar />`

- Sticky below search bar on scroll (`sticky top-0 z-20`)
- Horizontal scroll on mobile, centered on desktop
- Background: `var(--color-surface)` with bottom border `var(--color-border)`
- Shadow: `shadow-sm`

**Pill button states:**
```css
/* Default */
.cat-pill {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-muted);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s;
}
/* Active */
.cat-pill.active {
  background: var(--color-saffron);
  border-color: var(--color-saffron);
  color: #fff;
}
/* Hover */
.cat-pill:hover {
  border-color: var(--color-saffron);
  color: var(--color-saffron);
}
```

---

### 4.5 Menu Item Card

**Component:** `<MenuCard item={item} onAdd={fn} />`

```
┌─────────────────────────────┐
│  [Food Image]               │  ← aspect-square or 4:3, object-cover
│  Veg/Non-veg/Egg badge (TL) │
├─────────────────────────────┤
│  Item Name          ← h3   │
│  Short description  ← muted │
│  ₹ 120              ← price │
│              [+ Add] ←CTA  │
└─────────────────────────────┘
```

**Card CSS:**
```css
.menu-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.menu-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  transform: translateY(-2px);
}
```

**Veg/Non-veg/Egg badge (FSSAI standard):**
```
Veg:     green square border + green dot
Non-veg: brown square border + brown dot
Egg:     yellow square border + yellow dot
```
The badge reflects `food_type: 'veg' | 'non_veg' | 'egg'` from the DB (not a boolean `isVeg`).

**Add button:**
```css
.add-btn {
  background: var(--color-saffron);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;
}
.add-btn:hover { background: #e05a00; }
```

**When item is already in cart** — replace Add button with qty stepper:
```
[−]  2  [+]
```
```css
.qty-stepper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-saffron);
  border-radius: 8px;
  padding: 4px 8px;
  color: #fff;
  font-weight: 700;
}
.qty-stepper button {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  width: 28px; height: 28px;
}
```

---

### 4.6 Cart Drawer / Bottom Sheet

**Component:** `<CartDrawer />`

**Trigger:** Floating cart FAB bottom-right (mobile) or sidebar (desktop)

**Floating cart FAB:**
```css
.cart-fab {
  position: fixed;
  bottom: 24px; right: 24px;
  background: var(--color-saffron);
  color: #fff;
  border-radius: 999px;
  padding: 14px 24px;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(255,107,0,0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 50;
  /* Shows: 🛒  3 items · ₹360 */
}
```

**Drawer layout (slides up from bottom on mobile):**
```
┌──────────────────────────────────┐
│  Your Order              [✕]    │
│  ─────────────────────────────  │
│  [Item Image] Name              │
│               ₹120  [−] 2 [+]  │
│  ─────────────────────────────  │
│  [Item Image] Name              │
│               ₹80   [−] 1 [+]  │
│  ─────────────────────────────  │
│                                  │
│  Subtotal:           ₹ 320      │
│  Delivery fee:       ₹  30      │
│  Total:              ₹ 350      │
│  ─────────────────────────────  │
│                                  │
│  Your Name  ________________   │
│  Phone      ________________   │
│  Address    ________________   │  ← delivery address (not table number)
│  Instructions ________________  │
│                                  │
│  [ Place Order — ₹350 ]        │  ← full-width saffron button
└──────────────────────────────────┘
```

> **Note:** `Table No.` is removed from v1. This app is delivery/takeaway only in v1. Dine-in table ordering is v2.

---

### 4.7 Order Confirmation

After placing order, show a success screen / modal:

```
┌──────────────────────────────────┐
│          ✅                      │
│    Order Placed!                 │
│  Order #1042                    │
│                                  │
│  Estimated delivery: 30 min     │
│                                  │
│  📧 Check your email for        │
│     your order receipt          │
│                                  │
│  [ Track Order ] [ New Order ]  │
└──────────────────────────────────┘
```

---

## 5. Page Structure — Admin Dashboard

**Route:** `/admin` (requires authenticated session with `role = 'admin'`)  
**Login route:** `/admin/login` — email/password form using Supabase Auth

### 5.1 Layout

```
┌───────────────────────────────────────────────────────┐
│  ← IPL Dhaba                 Admin Dashboard          │
│                              Realtime  ●  / 4s poll   │
├───────────┬───────────┬───────────┬───────────────────┤
│  Today's  │  Today's  │  Pending  │  Delivered Today  │
│  Orders   │  Revenue  │           │                   │
│    0      │   ₹0      │    0      │       0           │
│  (blue)   │  (green)  │ (orange)  │    (teal)         │
└───────────┴───────────┴───────────┴───────────────────┘

┌───────────────────────────────────────────────────────┐
│  [active] [all] [completed] [cancelled]  ← tab bar    │
├───────────────────────────────────────────────────────┤
│  ORDER CARD                                           │
│  #1042  ·  12:34 PM    [Placed ▼]                    │
│  Jane Doe  ·  📞 9876543210                          │
│  123 MG Road, Tirupati                               │
│  ─────────────────────────────────────────────────── │
│  • Banaras Special × 2          ₹240                 │
│  • Masala Chai × 3              ₹90                  │
│  ─────────────────────────────────────────────────── │
│                    Subtotal:  ₹330  + ₹30 delivery   │
│                         Total:  ₹360                 │
└───────────────────────────────────────────────────────┘
```

---

### 5.2 Stat Cards

```css
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-card .label {
  font-size: var(--text-sm);
  color: var(--color-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-card .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-ink);
}
/* Color-coded left border accent per card */
.stat-card.orders  { border-left: 4px solid #3B82F6; }
.stat-card.revenue { border-left: 4px solid var(--color-green); }
.stat-card.pending { border-left: 4px solid var(--color-preparing); }
.stat-card.done    { border-left: 4px solid #06B6D4; }
```

---

### 5.3 Order Card

```css
.order-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
}
.order-card .order-id {
  font-weight: 700;
  color: var(--color-saffron);
}
.order-card .order-meta {
  font-size: var(--text-sm);
  color: var(--color-muted);
}
```

**Status badge + dropdown — aligned with `order_status` DB enum:**
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
}
/* Statuses: placed | confirmed | preparing | out_for_delivery | delivered | cancelled */
.status-badge.placed           { background: #F3F4F6; color: #374151; }
.status-badge.confirmed        { background: #DBEAFE; color: #1E40AF; }
.status-badge.preparing        { background: #FEF3C7; color: #92400E; }
.status-badge.out_for_delivery { background: #EDE9FE; color: #5B21B6; }
.status-badge.delivered        { background: #DCFCE7; color: #14532D; }
.status-badge.cancelled        { background: #FEE2E2; color: #991B1B; }
```

> **Removed:** `.status-badge.ready` — `ready` is not a valid status in the `order_status` DB enum. The progression is `preparing → out_for_delivery`.

---

### 5.4 Tab Bar (Order Filters)

```css
.tab-bar {
  display: flex;
  gap: 4px;
  background: var(--color-cream);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 16px;
}
.tab {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-muted);
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s;
}
.tab.active {
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
```

---

## 6. Realtime / Polling Indicator

Admin dashboard uses Supabase Realtime (WebSocket) as the primary push mechanism. If the WebSocket connection fails, it falls back to 4-second polling. The indicator reflects the current mode.

```
Realtime  ●        ← when WebSocket is connected (green)
Polling 4s  ●      ← when falling back to polling (amber)
```

```css
.refresh-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}
.refresh-dot.realtime { background: var(--color-green); }
.refresh-dot.polling  { background: var(--color-preparing); }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.8); }
}
```

---

## 7. Spacing & Radius System

```css
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;

  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 999px;
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Menu Grid | Cart |
|---|---|---|---|
| Mobile | < 640px | 1 column | Bottom sheet |
| Tablet | 640–1024px | 2 columns | Bottom sheet |
| Desktop | > 1024px | 3 columns | Right sidebar |

```css
/* Tailwind equivalents */
/* grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */
```

---

## 9. Navigation & Routing

| Route | Page | Auth |
|---|---|---|
| `/` | Customer menu + ordering | Public |
| `/orders/:id` | Order tracking | Customer (auth) |
| `/admin/login` | Admin login | Public |
| `/admin` | Admin order dashboard | `role = admin` |
| `/admin/menu` | Menu management | `role = admin` |
| `/admin/analytics` | Analytics | `role = admin` |

Back navigation on admin: `← IPL Dhaba` text link back to `/`

---

## 10. Interaction Patterns

| Action | Feedback |
|---|---|
| Add item to cart | Card button morphs to qty stepper; FAB count increments |
| Remove last item | Qty stepper morphs back to "+ Add" button |
| Place order | Loading spinner on button → success screen with order ID and email notice |
| Admin status change | Dropdown updates + badge color changes immediately |
| Realtime connected | Green dot pulses; orders update silently |
| Polling fallback | Amber dot pulses; orders update every 4s |

---

## 11. Assets & Images

| Asset | Usage | Source in original |
|---|---|---|
| Hero background | Full-width header image | `image_1782051923727-Bb9wwFeL.png` |
| Logo | Top-left of hero | `image_1782056017531-D-Wv4KKk.png` |
| Item images | Menu card thumbnails | Per-item from Supabase Storage CDN |

**Image base URL (replace with your own):**  
`https://restaurant-menu-builder--226003167.replit.app/assets/`

> Replace with your Supabase Storage public CDN URL once items are uploaded via the admin panel.

---

## 12. Component Checklist

### Customer App
- [ ] `<HeroSection />` — background image, overlay, logo, open badge, tagline
- [ ] `<SearchBar />` — debounced fuzzy search, calls `/menu/search?q=`
- [ ] `<CategoryBar />` — sticky, scrollable pills, active filter state
- [ ] `<MenuGrid />` — responsive grid, category-filtered
- [ ] `<MenuCard />` — image, food_type badge (veg/non_veg/egg), name, description, price, add/qty button
- [ ] `<CartFAB />` — fixed button showing count + total
- [ ] `<CartDrawer />` — slide-up sheet, item list, name/phone/address form, place order CTA
- [ ] `<OrderSuccess />` — confirmation screen with order ID, ETA, email notice

### Admin Dashboard
- [ ] `<AdminLogin />` — email/password form, redirects to `/admin` on success
- [ ] `<AdminHeader />` — back link, title, realtime/polling indicator
- [ ] `<StatCard />` — 4 cards: orders, revenue, pending, delivered
- [ ] `<OrderTabs />` — active / all / completed / cancelled
- [ ] `<OrderCard />` — order meta, delivery address, item list, total, status badge+dropdown

### Delivery Staff (Mobile)
- [ ] `<DeliveryOrderList />` — list of assigned orders
- [ ] `<DeliveryStatusButton />` — one-tap status update: Picked Up / On the Way / Delivered

---

## 13. Data Model (API Contract)

### MenuItem
```ts
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;               // base price in INR
  category: string;
  categoryId: string;
  imageUrl: string;
  foodType: 'veg' | 'non_veg' | 'egg';   // replaces isVeg boolean
  isAvailable: boolean;
  isFeatured: boolean;
  variants: MenuItemVariant[];
  sortOrder: number;
}

interface MenuItemVariant {
  id: string;
  name: string;            // "Regular", "Large"
  priceModifier: number;   // added to base price
}
```

### Order
```ts
// Status enum aligned with DB order_status type
type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: {
    addressLine: string;
    city: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryInstructions?: string;
  items: {
    menuItemId: string;
    variantId?: string;
    name: string;
    variantName?: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'online';
  estimatedDeliveryAt?: string;   // ISO timestamp
  createdAt: string;
}
```

---

## 14. Tech Stack (IPL Dhaba)

```
Frontend:   Next.js 14 (App Router)
Styling:    Tailwind CSS + CSS variables above
State:      Zustand (cart + order state)
Backend:    NestJS + Prisma (existing repo: Shxam/ipldhaba)
Realtime:   Supabase Realtime (WebSocket); 4s polling fallback
Fonts:      Google Fonts (Yatra One + Inter)
Icons:      Lucide React
Auth:       Supabase Auth (email OTP + custom JWT role hook)
```

---

*Generated from live site analysis of `resto-order-125.preview.emergentagent.com`*  
*Last updated: June 2026 (v1.1 — gap analysis pass)*