/* =============================================================================
   Admin Routes
   GET  /api/admin/orders      — All orders with filters (admin only)
   GET  /api/admin/analytics   — Revenue stats (admin only)
   ============================================================================= */
'use strict';

const express = require('express');
const { supabaseAdmin } = require('../supabaseClient');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(requireAuth, requireAdmin);

// ─── GET /api/admin/orders ────────────────────────────────────────────────────
// Query params: ?status=active|all|completed|cancelled&limit=50&offset=0
router.get('/orders', async (req, res) => {
  const { status = 'all', limit = 50, offset = 0 } = req.query;

  try {
    let query = supabaseAdmin
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
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Apply status filter
    if (status === 'active') {
      query = query.not('status', 'in', '("delivered","cancelled")');
    } else if (status === 'completed') {
      query = query.eq('status', 'delivered');
    } else if (status === 'cancelled') {
      query = query.eq('status', 'cancelled');
    }
    // 'all' — no filter

    const { data: orders, error, count } = await query;

    if (error) throw error;

    res.json({ orders, total: count });
  } catch (err) {
    console.error('[Admin] GET /admin/orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─── GET /api/admin/analytics ─────────────────────────────────────────────────
// Today's stats: order count, revenue, pending count, delivered count
router.get('/analytics', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // All orders today
    const { data: todayOrders, error } = await supabaseAdmin
      .from('orders')
      .select('id, status, total_amount, created_at')
      .gte('created_at', todayStart.toISOString());

    if (error) throw error;

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const pendingOrders = todayOrders.filter(
      o => !['delivered', 'cancelled'].includes(o.status)
    ).length;
    const deliveredToday = todayOrders.filter(o => o.status === 'delivered').length;

    // Weekly revenue (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const { data: weekOrders } = await supabaseAdmin
      .from('orders')
      .select('total_amount, status, created_at')
      .gte('created_at', weekStart.toISOString())
      .not('status', 'eq', 'cancelled');

    // Group by day
    const weeklyRevenue = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      weeklyRevenue[key] = 0;
    }
    (weekOrders || []).forEach(o => {
      const key = o.created_at.split('T')[0];
      if (weeklyRevenue[key] !== undefined) {
        weeklyRevenue[key] += parseFloat(o.total_amount || 0);
      }
    });

    res.json({
      today: { totalOrders, totalRevenue, pendingOrders, deliveredToday },
      weeklyRevenue: Object.entries(weeklyRevenue).map(([date, revenue]) => ({ date, revenue }))
    });
  } catch (err) {
    console.error('[Admin] GET /admin/analytics error:', err.message);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

module.exports = router;
