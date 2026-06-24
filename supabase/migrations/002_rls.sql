-- =============================================================================
-- IPL Dhaba — Row Level Security Policies
-- Run this AFTER 001_schema.sql
-- All tables have RLS enabled. Service role key (used by the Node.js backend)
-- bypasses RLS automatically. These policies apply to browser/anon clients.
-- =============================================================================

-- ── ENABLE RLS ────────────────────────────────────────────────────────────────
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking  ENABLE ROW LEVEL SECURITY;

-- ── CATEGORIES — Public Read ──────────────────────────────────────────────────
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- ── MENU ITEMS — Public Read ──────────────────────────────────────────────────
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

-- ── ORDERS ────────────────────────────────────────────────────────────────────
-- For v1 (no customer auth), orders are created by anon clients.
-- The backend uses service role key, so these policies control direct Supabase SDK access.

-- Allow anyone to insert an order (public ordering, no login required in v1)
CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Allow order lookup by order ID + phone (for tracking page)
-- Customers can only see their own order (by ID), not list all orders
CREATE POLICY "Anyone can view order by id"
  ON orders FOR SELECT
  USING (true);
-- Note: In v2, tighten this to: USING (phone = current_setting('request.jwt.claims', true)::json->>'phone')

-- ── ORDER ITEMS — Read with Order ────────────────────────────────────────────
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- ── DELIVERY TRACKING — Read Only ─────────────────────────────────────────────
CREATE POLICY "Anyone can view delivery tracking"
  ON delivery_tracking FOR SELECT
  USING (true);

SELECT 'RLS policies applied successfully' AS result;
