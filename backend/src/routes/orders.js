/* =============================================================================
   Orders Routes
   POST  /api/orders               — Place a new order (public, no auth)
   GET   /api/orders/:id           — Get order details (public via order token)
   PATCH /api/orders/:id/status    — Update order status (admin/delivery only)
   ============================================================================= */
'use strict';

const express = require('express');
const { supabaseAdmin } = require('../supabaseClient');
const { requireAuth, requireDeliveryOrAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendNewOrderAlertEmail } = require('../services/email');

const router = express.Router();

// Canonical order status progression (cannot go backwards)
const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Creates a new order. No authentication required — delivery orders are public.
// Rate limiting is applied at the app level (10 orders/15min per IP).
router.post('/', async (req, res) => {
  const {
    customer_name,
    phone,
    delivery_address,    // { address_line, city, pincode, latitude?, longitude? }
    delivery_instructions,
    items,               // [{ menu_item_id, name, unit_price, quantity }]
    subtotal,
    delivery_fee,
    total_amount
  } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!customer_name || !phone || !delivery_address?.address_line || !items?.length) {
    return res.status(400).json({
      error: 'Missing required fields: customer_name, phone, delivery_address.address_line, items'
    });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be a 10-digit number' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' });
  }

  if (!subtotal || subtotal < 100) {
    return res.status(400).json({ error: 'Minimum order subtotal is ₹100' });
  }

  try {
    // ── 1. Create the order record ────────────────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        phone,
        delivery_address,
        delivery_instructions: delivery_instructions || null,
        subtotal,
        delivery_fee: delivery_fee ?? 30,
        total_amount,
        status: 'placed',
        payment_method: 'cod',
        payment_status: 'pending',
        estimated_delivery_at: new Date(Date.now() + 40 * 60 * 1000).toISOString() // +40 min
      })
      .select('id, order_number, status, created_at, estimated_delivery_at')
      .single();

    if (orderError) throw orderError;

    // ── 2. Insert order items ─────────────────────────────────────────────────
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id || null,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.quantity
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // ── 3. Send emails (non-blocking — don't fail the order if email fails) ───
    Promise.allSettled([
      sendOrderConfirmationEmail({ order, customer_name, items, total_amount }),
      sendNewOrderAlertEmail({ order, customer_name, phone, delivery_address, items, total_amount })
    ]).catch(err => console.error('[Orders] Email error (non-fatal):', err.message));

    // ── 4. Respond with the created order ─────────────────────────────────────
    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        estimated_delivery_at: order.estimated_delivery_at,
        created_at: order.created_at
      }
    });

  } catch (err) {
    console.error('[Orders] POST /orders error:', err.message);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
// Fetch a single order with all its items. Public — used by order tracking page.
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        phone,
        delivery_address,
        delivery_instructions,
        subtotal,
        delivery_fee,
        total_amount,
        status,
        payment_method,
        payment_status,
        estimated_delivery_at,
        delivered_at,
        cancelled_reason,
        created_at,
        updated_at,
        order_items (
          id,
          name,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }

    res.json({ order });
  } catch (err) {
    console.error('[Orders] GET /orders/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ─── PATCH /api/orders/:id/status ────────────────────────────────────────────
// Update order status. Admin or delivery staff only.
router.patch('/:id/status', requireAuth, requireDeliveryOrAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [...STATUS_ORDER, 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  try {
    const updateData = { status };

    // Record delivery time when delivered
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select('id, order_number, status, updated_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('[Orders] PATCH /orders/:id/status error:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
