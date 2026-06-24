/* =============================================================================
   Auth Middleware
   Validates the Supabase JWT from the Authorization header.
   Extracts the user's role from the JWT claims (injected by
   custom_access_token_hook in Supabase).
   ============================================================================= */
'use strict';

const { supabasePublic } = require('../supabaseClient');

/**
 * requireAuth — Validates JWT and attaches req.user
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error } = await supabasePublic.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    req.userRole = user.app_metadata?.role ?? user.user_metadata?.role ?? 'customer';
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * requireAdmin — Must be used AFTER requireAuth
 * Checks that the user's role is 'admin'
 */
function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * requireDeliveryOrAdmin — Must be used AFTER requireAuth
 * Checks that the user's role is 'admin' or 'delivery'
 */
function requireDeliveryOrAdmin(req, res, next) {
  if (req.userRole !== 'admin' && req.userRole !== 'delivery') {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, requireDeliveryOrAdmin };
