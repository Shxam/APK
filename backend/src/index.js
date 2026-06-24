/* =============================================================================
   IPL Dhaba — Express API Server
   Port:       3001 (configurable via PORT env var)
   Base path:  /api
   ============================================================================= */
'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const menuRoutes   = require('./routes/menu');
const orderRoutes  = require('./routes/orders');
const adminRoutes  = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGIN || 'http://localhost:8080')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Stricter limit on order placement to prevent flooding
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 orders per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many orders placed. Please wait before trying again.' }
});

app.use('/api', generalLimiter);
app.use('/api/orders', (req, res, next) => {
  if (req.method === 'POST') return orderLimiter(req, res, next);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin',  adminRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IPL Dhaba API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 Catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🍛  IPL Dhaba API Server');
  console.log(`  ✅  Running at: http://localhost:${PORT}`);
  console.log(`  📋  Health:     http://localhost:${PORT}/health`);
  console.log(`  🍽️  Menu:       http://localhost:${PORT}/api/menu`);
  console.log('');
  
  if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('YOUR_PROJECT')) {
    console.warn('  ⚠️  WARNING: Supabase credentials not configured.');
    console.warn('  ⚠️  Copy backend/.env.example to backend/.env and add your credentials.');
    console.warn('');
  }
});

module.exports = app; // For testing
