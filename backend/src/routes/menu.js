/* =============================================================================
   Menu Routes
   GET  /api/menu          — Returns all active categories + items
   GET  /api/menu/search   — Fuzzy search by name or description
   ============================================================================= */
'use strict';

const express = require('express');
const { supabaseAdmin } = require('../supabaseClient');

const router = express.Router();

// ─── GET /api/menu ─────────────────────────────────────────────────────────
// Returns all active categories + their items, grouped for the frontend
router.get('/', async (req, res) => {
  try {
    // Fetch all active categories (sorted)
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name, description, emoji, sort_order')
      .eq('is_active', true)
      .order('sort_order');

    if (catError) throw catError;

    // Fetch all available menu items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('menu_items')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        food_type,
        is_available,
        is_featured,
        sort_order,
        category_id,
        categories ( id, name, emoji )
      `)
      .eq('is_available', true)
      .order('sort_order');

    if (itemsError) throw itemsError;

    res.json({ categories, items });
  } catch (err) {
    console.error('[Menu] GET /menu error:', err.message);
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

// ─── GET /api/menu/featured ────────────────────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('id, name, description, price, image_url, food_type, category_id, categories(name)')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('sort_order')
      .limit(6);

    if (error) throw error;
    res.json({ items: data });
  } catch (err) {
    console.error('[Menu] GET /menu/featured error:', err.message);
    res.status(500).json({ error: 'Failed to load featured items' });
  }
});

// ─── GET /api/menu/search?q=<query> ────────────────────────────────────────
// Case-insensitive search across name + description using Postgres ilike
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q || q.length < 2) {
    return res.json({ items: [] });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('id, name, description, price, image_url, food_type, category_id, categories(name, emoji)')
      .eq('is_available', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order('sort_order')
      .limit(20);

    if (error) throw error;
    res.json({ items: data });
  } catch (err) {
    console.error('[Menu] GET /menu/search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
